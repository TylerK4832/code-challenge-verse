import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LANGUAGES, getDefaultCode } from "@/config/languages";
import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import EditorToolbar from "./EditorToolbar";
import { executeCode } from "@/services/codeExecution";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('testcases');
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  const handleLanguageChange = (languageId: string) => {
    const language = LANGUAGES.find(l => l.id === parseInt(languageId));
    if (language) {
      setSelectedLanguage(language);
      onChange(getDefaultCode(problemId || '', language.id));
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

      // Save successful submission if all tests passed
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
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemCodeEditor;