import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from "lucide-react";

interface TestResult {
  passed: boolean;
  input: string;
  expected_output: string;
  actual_output: string;
  stdout?: string;
}

interface ExecutionResult {
  status?: {
    id: number;
    description: string;
  };
  test_results?: TestResult[];
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
}

interface ResultsListProps {
  executionResult: ExecutionResult | null;
  isLoading: boolean;
}

const formatInput = (input: string) => {
  return input.split('\\n').join('\n');
};

const getStatusColor = (status?: { id: number }) => {
  if (!status) return 'text-gray-500';
  switch (status.id) {
    case 3: return 'text-[#00b8a3]';
    case 4: return 'text-red-500';
    default: return 'text-gray-500';
  }
};

export const ResultsList = ({ executionResult, isLoading }: ResultsListProps) => {
  return (
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

            {/* Error outputs */}
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

            {/* Test results */}
            {executionResult.test_results?.map((result, index) => (
              <div key={index} className="space-y-2 border-b border-border pb-4 last:border-0">
                <h3 className={`font-medium ${result.passed ? 'text-[#00b8a3]' : 'text-red-500'}`}>
                  Test Case {index + 1}: {result.passed ? 'Passed' : 'Failed'}
                </h3>
                <div className="space-y-2">
                  <pre className="bg-secondary p-2 rounded-md whitespace-pre">
                    <code>Input: {formatInput(result.input)}</code>
                  </pre>
                  <pre className="bg-secondary p-2 rounded-md whitespace-pre">
                    <code>Expected Output: {result.expected_output}</code>
                  </pre>
                  {!result.passed && (
                    <pre className="bg-secondary p-2 rounded-md whitespace-pre">
                      <code>Your Output: {result.actual_output}</code>
                    </pre>
                  )}
                  {result.stdout && (
                    <pre className="bg-secondary p-2 rounded-md whitespace-pre">
                      <code>Console Output: {result.stdout}</code>
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
  );
};