import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface ProblemCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
}

const ProblemCodeEditor = ({ code, onChange }: ProblemCodeEditorProps) => {
  const { toast } = useToast();
  const { id: problemId } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('testcases');

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to submit your solution",
          variant: "destructive",
        });
        return;
      }

      // Fetch test cases
      const { data: testCases, error: testCasesError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false);

      if (testCasesError) throw testCasesError;

      if (!testCases || testCases.length === 0) {
        toast({
          title: "No test cases found",
          description: "Unable to run code without test cases",
          variant: "destructive",
        });
        return;
      }

      // Run each test case
      let allTestsPassed = true;
      for (const testCase of testCases) {
        const response = await supabase.functions.invoke('execute-code', {
          body: {
            source_code: code,
            language_id: 63, // JavaScript
            stdin: testCase.input,
            expected_output: testCase.expected_output,
          },
        });

        if (response.error) throw response.error;

        const result = response.data;
        console.log('Execution result:', result);
        setExecutionResult(result);
        setActiveTab('result');

        if (result.status?.id !== 3) { // 3 = Accepted
          allTestsPassed = false;
          toast({
            title: "Test case failed",
            description: result.compile_output || result.stderr || "Execution failed",
            variant: "destructive",
          });
          break;
        }
      }

      if (allTestsPassed) {
        // Save successful submission
        const { error: submissionError } = await supabase
          .from('submissions')
          .insert({
            problem_id: problemId,
            code,
            language: 'javascript',
            status: 'accepted',
            user_id: user.id
          });

        if (submissionError) throw submissionError;

        toast({
          title: "Success!",
          description: "All test cases passed!",
          className: "bg-[#00b8a3] text-white",
        });
      }
    } catch (error) {
      console.error('Error running code:', error);
      toast({
        title: "Error",
        description: "Failed to run code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 p-4 border-b border-border flex justify-between items-center">
        <div className="flex gap-4">
          <Button variant="secondary">JavaScript</Button>
        </div>
        <Button 
          onClick={handleRunCode} 
          className="bg-[#00b8a3] hover:bg-[#00a092]"
          disabled={isRunning}
        >
          {isRunning ? "Running..." : "Run Code"}
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor code={code} onChange={onChange} />
      </div>
      <div className="h-[300px] border-t border-border">
        <TestCases 
          executionResult={executionResult} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
};

export default ProblemCodeEditor;