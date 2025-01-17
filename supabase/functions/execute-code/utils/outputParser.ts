interface Log {
  testIndex: number;
  message: string;
}

interface TestResult {
  passed: boolean;
  error?: string;
}

export function parseExecutionOutput(stdout: string): { 
  testResults: TestResult[] | null; 
  logs: Log[];
} {
  const lines = stdout.split('\n').filter(line => line.trim() !== '');
  let testResults = null;
  let logs: Log[] = [];

  // Regex to match lines: WRAPPER_RESULTS <json>, WRAPPER_LOGS <json>
  const resultsRegex = /^WRAPPER_RESULTS\s+(.*)$/;
  const logsRegex = /^WRAPPER_LOGS\s+(.*)$/;

  for (const line of lines) {
    if (resultsRegex.test(line)) {
      const match = line.match(resultsRegex);
      if (match && match[1]) {
        try {
          testResults = JSON.parse(match[1]);
        } catch (err) {
          console.error('Error parsing test results:', err);
        }
      }
    } else if (logsRegex.test(line)) {
      const match = line.match(logsRegex);
      if (match && match[1]) {
        try {
          // Parse the complete JSON string for logs
          const parsedLogs = JSON.parse(match[1]);
          
          // Ensure each log entry is properly formatted
          logs = parsedLogs.map((log: any) => {
            if (typeof log === 'object' && 'testIndex' in log && 'message' in log) {
              return {
                testIndex: log.testIndex,
                message: log.message
                  .replace(/\\n/g, '\n')  // Replace escaped newlines
                  .replace(/\\"/g, '"')   // Replace escaped quotes
                  .replace(/"\s*\+\s*"/g, '') // Remove string concatenation artifacts
                  .trim()
              };
            }
            // If log entry doesn't match expected format, create a default structure
            return {
              testIndex: 0,
              message: String(log)
            };
          });
        } catch (err) {
          console.error('Error parsing logs:', err);
          // If JSON parsing fails, try to salvage what we can
          try {
            const rawContent = match[1]
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"')
              .replace(/"\s*\+\s*"/g, '')
              .trim();
            
            logs = [{
              testIndex: 0,
              message: rawContent
            }];
          } catch (fallbackErr) {
            console.error('Error in fallback parsing:', fallbackErr);
          }
        }
      }
    }
  }

  return { testResults, logs };
}