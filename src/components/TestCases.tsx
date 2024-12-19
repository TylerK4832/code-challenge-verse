import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from "lucide-react";
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
  expected_output?: string;
  actual_output?: string;
  test_results?: Array<{
    passed: boolean;
    input: string;
    expected_output: string;
    actual_output: string;
  }>;
}

interface TestCasesProps {
  executionResult?: ExecutionResult | null;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  isLoading?: boolean;
}

const TestCases = ({ executionResult, activeTab, onTabChange, isLoading }: TestCasesProps) => {
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
      case 3: return 'text-[#00b8a3]';
      case 4: return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const hasConsoleOutput = executionResult && (
    executionResult.stderr || 
    executionResult.compile_output || 
    executionResult.message
  );

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <div className="p-4 border-b border-border">
        <TabsList className="bg-secondary">
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="result">Result</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
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
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : executionResult ? (
              <>
                <div className={getStatusColor(executionResult.status)}>
                  Status: {executionResult.status?.description || 'Processing'}
                </div>
                {executionResult.test_results?.map((result, index) => (
                  <div key={index} className="space-y-2 border-b border-border pb-4 last:border-0">
                    <h3 className={`font-medium ${result.passed ? 'text-[#00b8a3]' : 'text-red-500'}`}>
                      Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                    </h3>
                    <div className="space-y-2">
                      <pre className="bg-secondary p-2 rounded-md">
                        <code>Input: {result.input}</code>
                      </pre>
                      <pre className="bg-secondary p-2 rounded-md">
                        <code>Expected Output: {result.expected_output}</code>
                      </pre>
                      {!result.passed && (
                        <pre className="bg-secondary p-2 rounded-md">
                          <code>Your Output: {result.actual_output}</code>
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-[#00b8a3]">
                Run your code to see the results!
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="console" className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : hasConsoleOutput ? (
              <>
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
                {executionResult.message && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Additional Information:</h3>
                    <pre className="bg-secondary p-2 rounded-md">
                      <code>{executionResult.message}</code>
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">
                No console output available.
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default TestCases;