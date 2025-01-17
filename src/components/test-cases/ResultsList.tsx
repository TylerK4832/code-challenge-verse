import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  passed: boolean;
  error?: string;
  code: string;
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

const StatusBadge = ({ status }: { status?: { id: number; description: string } }) => {
  if (!status) return null;

  const isAccepted = status.id === 3;
  
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
      isAccepted ? "bg-[#00b8a3]/10 text-[#00b8a3]" : "bg-red-500/10 text-red-500"
    )}>
      {isAccepted ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
      {status.description}
    </div>
  );
};

export const ResultsList = ({ executionResult, isLoading }: ResultsListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 pb-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : executionResult ? (
          <>
            <div className="flex justify-center pb-2">
              <StatusBadge status={executionResult.status} />
            </div>

            {/* Error outputs */}
            {executionResult.stderr && (
              <div className="border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-sm text-red-500">Error Output</h3>
                <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono text-red-500">
                  <code>{executionResult.stderr}</code>
                </pre>
              </div>
            )}
            
            {executionResult.compile_output && (
              <div className="border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Compilation Output</h3>
                <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono">
                  <code>{executionResult.compile_output}</code>
                </pre>
              </div>
            )}
            
            {executionResult.message && (
              <div className="border border-border rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Additional Information</h3>
                <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono">
                  <code>{executionResult.message}</code>
                </pre>
              </div>
            )}

            {/* Test results */}
            {executionResult.test_results?.map((result, index) => (
              <div key={index} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Test Case {index + 1}
                  </h3>
                  <div className={cn(
                    "flex items-center gap-1.5 text-sm font-medium",
                    result.passed ? "text-[#00b8a3]" : "text-red-500"
                  )}>
                    {result.passed ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                    {result.passed ? "Passed" : "Failed"}
                  </div>
                </div>
                
                <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono whitespace-pre">
                  <code>{result.code}</code>
                </pre>
                
                {!result.passed && result.error && (
                  <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono text-red-500 whitespace-pre">
                    <code>{result.error}</code>
                  </pre>
                )}
                
                {result.stdout && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Console Output</h4>
                    <pre className="bg-secondary/50 p-3 rounded-md text-sm font-mono">
                      <code>{result.stdout}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            Run your code to see the results!
          </div>
        )}
      </div>
    </ScrollArea>
  );
};