interface Log {
  testIndex: number;
  message: string;
}

interface TestResult {
  input: string;
  expected: any;
  actual: any;
  passed: boolean;
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
          console.error('Error parsing WRAPPER_RESULTS JSON:', err);
        }
      }
    } else if (logsRegex.test(line)) {
      const match = line.match(logsRegex);
      if (match && match[1]) {
        try {
          logs = JSON.parse(match[1]);
        } catch (err) {
          console.error('Error parsing WRAPPER_LOGS JSON:', err);
        }
      }
    }
  }

  return { testResults, logs };
}