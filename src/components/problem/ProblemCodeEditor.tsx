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
import { useMutation, useQuery } from "@tanstack/react-query";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const { isRunning, executionResult, activeTab, setActiveTab, executeCode, resetExecution } = useCodeExecution();
  const { toast } = useToast();

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

      return data;
    }
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

  // Load placeholder code when language changes
  useEffect(() => {
    const fetchPlaceholderCode = async () => {
      if (isLoadingSolution) return;

      // If there's a saved solution, use it
      if (savedSolution) {
        onChange(savedSolution.code);
        return;
      }

      // Otherwise, fetch placeholder code
      const dbLanguage = selectedLanguage.name === 'C++' ? 'C++' : selectedLanguage.name;
      console.log('Fetching placeholder code for:', {
        problemId,
        language: dbLanguage
      });
      
      const { data, error } = await supabase
        .from('placeholder_code')
        .select('code')
        .eq('problem_id', problemId)
        .eq('language', dbLanguage)
        .single();

      console.log('Placeholder code result:', { data, error });

      if (error) {
        console.error('Error fetching placeholder code:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load placeholder code",
        });
        return;
      }

      if (data) {
        onChange(data.code);
      }
    };

    fetchPlaceholderCode();
  }, [problemId, selectedLanguage, onChange, toast, savedSolution, isLoadingSolution]);

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
      setSelectedLanguage(language);
      resetExecution();
      setActiveTab('testcases');
    }
  };

  const handleRunCode = () => {
    executeCode(code, selectedLanguage);
  };

  if (isLoadingSolution) {
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