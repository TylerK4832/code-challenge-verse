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
          // First try parsing as JSON
          testResults = JSON.parse(match[1]);
        } catch (err) {
          // If JSON parsing fails, try parsing Java format
          try {
            const javaFormat = match[1]
              .replace(/\[|\]/g, '') // Remove square brackets
              .split(',') // Split by comma
              .map(result => result.trim()) // Remove whitespace
              .map(result => {
                const passedMatch = result.match(/passed=(true|false)/);
                return {
                  passed: passedMatch ? passedMatch[1] === 'true' : false
                };
              });
            testResults = javaFormat;
          } catch (err) {
            console.error('Error parsing Java format:', err);
          }
        }
      }
    } else if (logsRegex.test(line)) {
      const match = line.match(logsRegex);
      if (match && match[1]) {
        try {
          // First try parsing as JSON
          logs = JSON.parse(match[1]);
        } catch (err) {
          // If JSON parsing fails, try parsing Java format
          try {
            const javaFormat = match[1]
              .replace(/\[|\]/g, '') // Remove square brackets
              .split(',') // Split by comma
              .map(log => log.trim()) // Remove whitespace
              .map((log, index) => ({
                testIndex: index,
                message: log
              }));
            logs = javaFormat;
          } catch (err) {
            console.error('Error parsing Java format:', err);
          }
        }
      }
    }
  }

  return { testResults, logs };
}