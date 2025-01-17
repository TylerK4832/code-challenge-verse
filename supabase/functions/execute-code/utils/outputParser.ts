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
  if (!stdout) {
    return { testResults: null, logs: [] };
  }

  let testResults: TestResult[] | null = null;
  let logs: Log[] = [];

  try {
    // Split the output into lines and process each section
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('WRAPPER_RESULTS')) {
        const resultsJson = line.replace('WRAPPER_RESULTS ', '');
        testResults = JSON.parse(resultsJson);
      } else if (line.startsWith('WRAPPER_LOGS')) {
        // Extract the logs JSON string
        const logsSection = line.substring(line.indexOf('['), line.lastIndexOf(']') + 1);
        
        try {
          // Parse the logs JSON
          const parsedLogs = JSON.parse(logsSection);
          logs = parsedLogs.map((log: any) => ({
            testIndex: log.testIndex,
            message: log.message
              .replace(/\\n/g, '\n') // Replace escaped newlines with actual newlines
              .replace(/^["']|["']$/g, '') // Remove leading/trailing quotes
              .replace(/"\s*\+\s*"/g, '') // Remove string concatenation artifacts
          }));
        } catch (error) {
          console.error('Error parsing logs:', error);
          logs = [];
        }
      }
    }

    return { testResults, logs };
  } catch (error) {
    console.error('Error parsing execution output:', error);
    return { testResults: null, logs: [] };
  }
}