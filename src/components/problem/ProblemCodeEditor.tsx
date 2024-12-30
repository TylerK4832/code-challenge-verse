import { useState } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import EditorToolbar from "./EditorToolbar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useCodeExecution } from "./hooks/useCodeExecution";
import { useLanguageSelection } from "./hooks/useLanguageSelection";
import { getDefaultCode } from "@/config/languages";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { id: problemId } = useParams();
  const [activeTab, setActiveTab] = useState('testcases');
  
  const { selectedLanguage, handleLanguageChange } = useLanguageSelection(problemId, onChange);
  const { isRunning, executionResult, runCode } = useCodeExecution(problemId);

  const handleRunCode = () => {
    runCode(code, selectedLanguage.name);
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