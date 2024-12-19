import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import TestCases from "@/components/TestCases";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
    setExecutionResult(null); // Reset previous results
    
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

      console.log('Starting code execution with test cases:', testCases);

      // Run each test case
      let allTestsPassed = true;
      for (const testCase of testCases) {
        console.log('Running test case:', testCase);
        
        const response = await supabase.functions.invoke('execute-code', {
          body: {
            source_code: code,
            language_id: 63, // JavaScript
            stdin: testCase.input,
            expected_output: testCase.expected_output,
            problem_id: problemId,
          },
        });

        if (response.error) {
          console.error('Edge function error:', response.error);
          throw response.error;
        }

        const result = response.data;
        console.log('Raw execution result:', result);
        
        // Enrich the result with test case information
        const enrichedResult = {
          ...result,
          expected_output: testCase.expected_output,
          actual_output: result.stdout,
          stderr: result.stderr,
          compile_output: result.compile_output,
          message: result.message,
          status: result.status
        };
        
        console.log('Enriched result:', enrichedResult);
        setExecutionResult(enrichedResult);
        setActiveTab('result');

        if (result.status?.id !== 3) { // 3 = Accepted
          allTestsPassed = false;
          console.log('Test case failed:', {
            status: result.status,
            expected: testCase.expected_output,
            actual: result.stdout
          });
          
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
      setExecutionResult({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code'
      });
      setActiveTab('console');
      
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
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <CodeEditor code={code} onChange={onChange} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <TestCases 
              executionResult={executionResult} 
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProblemCodeEditor;