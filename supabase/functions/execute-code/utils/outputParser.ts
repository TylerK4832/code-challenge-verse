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
          // Parse as JSON
          testResults = JSON.parse(match[1]);
        } catch (err) {
          // Fallback: Parse Java-style format
          try {
            const javaFormat = match[1]
              .replace(/\[|\]/g, '')
              .split(',')
              .map(result => result.trim())
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
          // First attempt to parse as JSON
          logs = JSON.parse(match[1]);
        } catch (err) {
          // Handle concatenated format manually
          try {
            const javaFormat = match[1]
              .replace(/\[|\]/g, '') // Remove square brackets
              .split('},') // Split log objects
              .map((log, index) => {
                const cleanedLog = log.endsWith('}') ? log : log + '}';
                return JSON.parse(cleanedLog);
              });

            logs = javaFormat.map((log: any) => {
              return {
                testIndex: log.testIndex,
                message: log.message.replace(/\\n/g, '\n').trim() // Handle escaped newlines
              };
            });
          } catch (err) {
            console.error('Error parsing concatenated logs:', err);
            console.log('Raw JSON string:', match[1]);
          }
        }
      }
    }
  }

  return { testResults, logs };
}
