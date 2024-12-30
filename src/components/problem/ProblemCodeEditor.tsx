import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const LANGUAGES = [
  { id: 63, name: 'JavaScript', defaultCode: 'function solution() {\n  // Write your solution here\n}' },
  { id: 71, name: 'Python', defaultCode: 'def solution():\n    # Write your solution here\n    pass' }
];

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
      // Set default code for the selected language
      switch (problemId) {
        case 'two-sum':
          onChange(language.id === 63 
            ? `function twoSum(nums, target) {\n  // Write your solution here\n}`
            : `def twoSum(nums, target):\n    # Write your solution here\n    pass`);
          break;
        case 'add-two-numbers':
          onChange(language.id === 63
            ? `function addTwoNumbers(l1, l2) {\n  // Write your solution here\n}`
            : `def addTwoNumbers(l1, l2):\n    # Write your solution here\n    pass`);
          break;
        case 'longest-substring':
          onChange(language.id === 63
            ? `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}`
            : `def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass`);
          break;
        case 'median-sorted-arrays':
          onChange(language.id === 63
            ? `function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n}`
            : `def findMedianSortedArrays(nums1, nums2):\n    # Write your solution here\n    pass`);
          break;
        default:
          onChange(language.defaultCode);
      }
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

      const { data: testCases, error: testCasesError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false);

      if (testCasesError) throw testCasesError;

      if (!testCases || testCases.length === 0) {
        console.error('No test cases found');
        return;
      }

      console.log('Starting code execution with test cases:', testCases);
      
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          source_code: code,
          language_id: selectedLanguage.id,
          problem_id: problemId,
          test_cases: testCases,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        setExecutionResult({
          status: { id: 4, description: 'Error' },
          stderr: error.message,
          stdout: null,
          compile_output: null,
          message: 'Failed to execute code'
        });
        setActiveTab('result');
        return;
      }

      console.log('Execution result:', data);
      setExecutionResult(data);
      setActiveTab('result');

      // Save successful submission if all tests passed
      if (data.status?.id === 3) {
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
    } catch (error) {
      console.error('Error running code:', error);
      setExecutionResult({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code'
      });
      setActiveTab('result');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 border-b border-border flex justify-between items-center">
        <Select
          value={selectedLanguage.id.toString()}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((language) => (
              <SelectItem key={language.id} value={language.id.toString()}>
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleRunCode} 
          className="bg-[#00b8a3] hover:bg-[#00a092]"
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            "Run Code"
          )}
        </Button>
      </div>
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