import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { LanguageSelector, LANGUAGES } from "./LanguageSelector";
import { RunButton } from "./RunButton";
import { useCodeExecution } from "./useCodeExecution";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const { isRunning, executionResult, activeTab, setActiveTab, executeCode, resetExecution } = useCodeExecution();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's saved solution with the current language
  const { data: savedSolution, isLoading: isLoadingSolution } = useQuery({
    queryKey: ['userSolution', problemId, selectedLanguage.name],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_solutions')
        .select('code')
        .eq('problem_id', problemId)
        .eq('language', selectedLanguage.name)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    }
  });

  // Fetch placeholder code separately - this will run when language changes
  const { data: placeholderCode, isLoading: isLoadingPlaceholder } = useQuery({
    queryKey: ['placeholderCode', problemId, selectedLanguage.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('placeholder_code')
        .select('code')
        .eq('problem_id', problemId)
        .eq('language', selectedLanguage.name)
        .single();

      if (error) {
        console.error('Error fetching placeholder code:', error);
        return null;
      }
      return data;
    },
    enabled: !!problemId && !!selectedLanguage
  });

  // Save solution mutation
  const saveSolution = useMutation({
    mutationFn: async (newCode: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_solutions')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          language: selectedLanguage.name,
          code: newCode,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,problem_id,language'
        });

      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error('Error saving solution:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your solution",
      });
    }
  });

  // Update code when saved solution or placeholder code changes
  useEffect(() => {
    if (isLoadingSolution || isLoadingPlaceholder) return;

    // If user has a saved solution, use that
    if (savedSolution) {
      onChange(savedSolution.code);
      return;
    }

    // Otherwise, use placeholder code if available
    if (placeholderCode) {
      onChange(placeholderCode.code);
      return;
    }

    // Fallback to a very basic default
    onChange(`// Default code for problem ${problemId} in ${selectedLanguage.displayName}\n// Please start coding your solution here`);
  }, [
    problemId, 
    selectedLanguage, 
    onChange, 
    savedSolution, 
    isLoadingSolution,
    placeholderCode,
    isLoadingPlaceholder
  ]);

  // Auto-save when code changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (code && code.trim() !== '') {
        saveSolution.mutate(code);
      }
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [code]);

  const handleLanguageChange = (languageId: string) => {
    const language = LANGUAGES.find(lang => lang.id === parseInt(languageId));
    if (language) {
      setSelectedLanguage(language);
      resetExecution();
      setActiveTab('testcases');
    }
  };

  const handleRunCode = () => {
    executeCode(code, selectedLanguage);
  };

  if (isLoadingSolution || isLoadingPlaceholder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 border-b border-border flex justify-between items-center">
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onLanguageChange={handleLanguageChange}
        />
        <RunButton 
          onClick={handleRunCode}
          isRunning={isRunning}
        />
      </div>
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <CodeEditor 
              code={code} 
              onChange={onChange} 
              language={selectedLanguage.displayName}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <TestCases 
              executionResult={executionResult} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isLoading={isRunning}
              selectedLanguage={selectedLanguage.name}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemCodeEditor;
