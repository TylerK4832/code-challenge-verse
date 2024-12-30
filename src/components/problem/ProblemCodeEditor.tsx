import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { LanguageSelector, LANGUAGES } from "./LanguageSelector";
import { RunButton } from "./RunButton";
import { useCodeExecution } from "./useCodeExecution";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const { isRunning, executionResult, activeTab, setActiveTab, executeCode, resetExecution } = useCodeExecution();

  const handleLanguageChange = (languageId: string) => {
    const language = LANGUAGES.find(lang => lang.id === parseInt(languageId));
    if (language) {
      setSelectedLanguage(language);
      onChange(language.defaultCode(problemId || ''));
      resetExecution();
      setActiveTab('testcases');
    }
  };

  const handleRunCode = () => {
    executeCode(code, selectedLanguage);
  };

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