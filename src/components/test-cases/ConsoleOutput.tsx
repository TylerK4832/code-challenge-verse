import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from "lucide-react";

interface ExecutionResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
}

interface ConsoleOutputProps {
  executionResult: ExecutionResult | null;
  isLoading: boolean;
}

export const ConsoleOutput = ({ executionResult, isLoading }: ConsoleOutputProps) => {
  const hasConsoleOutput = executionResult && (
    executionResult.stdout || 
    executionResult.stderr || 
    executionResult.compile_output || 
    executionResult.message
  );

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : hasConsoleOutput ? (
          <>
            {executionResult.stdout && (
              <div className="space-y-2">
                <h3 className="font-medium">Console Output:</h3>
                <pre className="bg-secondary p-2 rounded-md whitespace-pre-wrap break-words">
                  <code>{executionResult.stdout}</code>
                </pre>
              </div>
            )}
            {executionResult.stderr && (
              <div className="space-y-2">
                <h3 className="font-medium text-red-500">Error Output:</h3>
                <pre className="bg-secondary p-2 rounded-md text-red-500 whitespace-pre-wrap break-words">
                  <code>{executionResult.stderr}</code>
                </pre>
              </div>
            )}
            {executionResult.compile_output && (
              <div className="space-y-2">
                <h3 className="font-medium">Compilation Output:</h3>
                <pre className="bg-secondary p-2 rounded-md whitespace-pre-wrap break-words">
                  <code>{executionResult.compile_output}</code>
                </pre>
              </div>
            )}
            {executionResult.message && (
              <div className="space-y-2">
                <h3 className="font-medium">Additional Information:</h3>
                <pre className="bg-secondary p-2 rounded-md whitespace-pre-wrap break-words">
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
  );
};