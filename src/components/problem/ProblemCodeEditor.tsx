import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES, getDefaultCode } from "@/config/languages";
import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import EditorToolbar from "./EditorToolbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/components/ui/use-toast";
import { executeCode } from "@/services/codeExecution";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('testcases');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isSaving, setIsSaving] = useState(false);

  // Load language-specific code draft when language changes
  useEffect(() => {
    const loadCodeDraft = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: draft, error } = await supabase
          .from('code_drafts')
          .select('code')
          .eq('problem_id', problemId)
          .eq('user_id', user.id)
          .eq('language', selectedLanguage.name.toLowerCase())
          .maybeSingle();

        if (error) throw error;

        if (draft) {
          onChange(draft.code);
        } else {
          onChange(getDefaultCode(problemId || '', selectedLanguage.id));
        }
      } catch (error) {
        console.error('Error loading code draft:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load saved code",
        });
      }
    };

    loadCodeDraft();
  }, [problemId, selectedLanguage, onChange, toast]);

  // Debounced save function
  const saveCodeDraft = useCallback(async (codeToSave: string) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('code_drafts')
        .upsert({
          user_id: user.id,
          problem_id: problemId || '',
          code: codeToSave,
          language: selectedLanguage.name.toLowerCase(),
        }, {
          onConflict: 'user_id,problem_id,language'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving code draft:', error);
      // Only show toast for non-network related errors
      if (error.message && !error.message.includes('Failed to execute \'text\'')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save code draft",
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [problemId, selectedLanguage, toast, isSaving]);

  // Save code draft when code changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCodeDraft(code);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [code, saveCodeDraft]);

  const handleLanguageChange = (languageId: string) => {
    const language = LANGUAGES.find(l => l.id === parseInt(languageId));
    if (language) {
      setSelectedLanguage(language);
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setExecutionResult(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Authentication required');
        return;
      }

      const result = await executeCode(code, selectedLanguage.id, problemId || '');
      console.log('Execution result:', result);
      setExecutionResult(result);
      setActiveTab('result');

      if (result.status?.id === 3) {
        const { error: submissionError } = await supabase
          .from('submissions')
          .insert({
            problem_id: problemId,
            code,
            language: selectedLanguage.name.toLowerCase(),
            status: 'accepted',
            user_id: user.id
          });

        if (submissionError) throw submissionError;
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        onRunCode={handleRunCode}
        isRunning={isRunning}
      />
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <CodeEditor 
              code={code} 
              onChange={onChange}
              language={selectedLanguage.name.toLowerCase()}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <TestCases 
              executionResult={executionResult} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
              isLoading={isRunning}
              selectedLanguage={selectedLanguage.name.toLowerCase()}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemCodeEditor;