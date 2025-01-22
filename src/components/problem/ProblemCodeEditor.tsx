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

  console.log('Current problem and language:', { problemId, language: selectedLanguage.name });

  // Fetch user's saved solution
  const { data: savedSolution, isLoading: isLoadingSolution } = useQuery({
    queryKey: ['userSolution', problemId, selectedLanguage.name],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_solutions')
        .select('code')
        .eq('problem_id', problemId)
        .eq('language', selectedLanguage.name === 'C++' ? 'cpp' : selectedLanguage.name.toLowerCase())
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      console.log('Saved solution result:', { data, error });
      return data;
    }
  });

  // Fetch placeholder code
  const { data: placeholderCode, isLoading: isLoadingPlaceholder } = useQuery({
    queryKey: ['placeholderCode', problemId, selectedLanguage.name],
    queryFn: async () => {
      console.log('Fetching placeholder code for:', {
        problemId,
        language: selectedLanguage.name
      });

      const { data, error } = await supabase
        .from('placeholder_code')
        .select('code')
        .eq('problem_id', problemId)
        .eq('language', selectedLanguage.name)
        .single();

      console.log('Placeholder code query result:', { data, error });

      if (error) {
        console.error('Error fetching placeholder code:', error);
        return null;
      }

      return data;
    },
    retry: false
  });

  // Save solution mutation
  const saveSolution = useMutation({
    mutationFn: async (newCode: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const dbLanguage = selectedLanguage.name === 'C++' ? 'cpp' : selectedLanguage.name.toLowerCase();

      const { data, error } = await supabase
        .from('user_solutions')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          language: dbLanguage,
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

  // Load code when language changes or when data is fetched
  useEffect(() => {
    console.log('Effect triggered with:', {
      isLoadingSolution,
      isLoadingPlaceholder,
      hasSavedSolution: !!savedSolution,
      hasPlaceholderCode: !!placeholderCode
    });

    if (isLoadingSolution || isLoadingPlaceholder) return;

    // If there's a saved solution, use it
    if (savedSolution) {
      console.log('Using saved solution:', savedSolution.code);
      onChange(savedSolution.code);
      return;
    }

    // Otherwise, use placeholder code if available
    if (placeholderCode) {
      console.log('Using placeholder code:', placeholderCode.code);
      onChange(placeholderCode.code);
    } else {
      console.log('No placeholder code available');
    }
  }, [savedSolution, placeholderCode, isLoadingSolution, isLoadingPlaceholder, onChange]);

  // Auto-save when code changes
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
      console.log('Language changed to:', language.name);
      setSelectedLanguage(language);
      resetExecution();
      setActiveTab('testcases');
      // Invalidate both queries when language changes
      queryClient.invalidateQueries({ queryKey: ['userSolution', problemId, language.name] });
      queryClient.invalidateQueries({ queryKey: ['placeholderCode', problemId, language.name] });
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
              language={selectedLanguage.name}
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