import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from "@/integrations/supabase/client";

interface ExecutionResult {
  status?: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
}

interface TestCasesProps {
  executionResult?: ExecutionResult | null;
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const TestCases = ({ executionResult, activeTab, onTabChange }: TestCasesProps) => {
  const { id: problemId } = useParams();
  const [testCases, setTestCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false);

      if (!error && data) {
        const formattedData = data.map(testCase => ({
          ...testCase,
          input: testCase.input.replace(/\\n/g, '\n'),
          expected_output: testCase.expected_output.replace(/\\n/g, '\n')
        }));
        setTestCases(formattedData);
      }
    };

    fetchTestCases();
  }, [problemId]);

  const getStatusColor = (status?: { id: number }) => {
    if (!status) return 'text-gray-500';
    switch (status.id) {
      case 3: return 'text-[#00b8a3]'; // Accepted
      case 4: return 'text-red-500'; // Wrong Answer
      default: return 'text-gray-500';
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <div className="p-4 border-b border-border">
        <TabsList className="bg-secondary">
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="result">Result</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="testcases" className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {testCases.map((testCase, index) => (
              <div key={testCase.id} className="space-y-2">
                <h3 className="font-medium">Test Case {index + 1}:</h3>
                <pre className="bg-secondary p-2 rounded-md">
                  <code>Input: {testCase.input}</code>
                </pre>
                <pre className="bg-secondary p-2 rounded-md">
                  <code>Expected Output: {testCase.expected_output}</code>
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="result" className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {executionResult ? (
              <>
                <div className={getStatusColor(executionResult.status)}>
                  Status: {executionResult.status?.description || 'Processing'}
                </div>
                {executionResult.stdout && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Output:</h3>
                    <pre className="bg-secondary p-2 rounded-md">
                      <code>{executionResult.stdout}</code>
                    </pre>
                  </div>
                )}
                {executionResult.stderr && (
                  <div className="space-y-2">
                    <h3 className="font-medium text-red-500">Error Output:</h3>
                    <pre className="bg-secondary p-2 rounded-md text-red-500">
                      <code>{executionResult.stderr}</code>
                    </pre>
                  </div>
                )}
                {executionResult.compile_output && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Compilation Output:</h3>
                    <pre className="bg-secondary p-2 rounded-md">
                      <code>{executionResult.compile_output}</code>
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-[#00b8a3]">
                Run your code to see the results!
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default TestCases;