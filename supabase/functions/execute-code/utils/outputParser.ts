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
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('WRAPPER_RESULTS')) {
        // Extract the JSON part after "WRAPPER_RESULTS "
        const resultsJson = line.replace('WRAPPER_RESULTS ', '');
        testResults = JSON.parse(resultsJson);
      } else if (line.startsWith('WRAPPER_LOGS')) {
        try {
          // Extract everything between the first [ and last ]
          const match = line.match(/\[(.*)\]/);
          if (match && match[1]) {
            // Try to parse the content as JSON by adding the brackets back
            const parsedLogs = JSON.parse(`[${match[1]}]`);
            if (Array.isArray(parsedLogs)) {
              logs.push(...parsedLogs.map((log: any) => ({
                testIndex: log.testIndex,
                message: log.message
                  ?.replace(/\\n/g, '\n')
                  ?.replace(/^["']|["']$/g, '')
                  ?.replace(/"\s*\+\s*"/g, '') || ''
              })));
            }
          } else {
            console.error('No valid JSON array found in logs line');
          }
        } catch (error) {
          console.error('Error parsing logs:', error);
          console.error('Raw logs line:', line);
        }
      }
    }

    return { testResults, logs };
  } catch (error) {
    console.error('Error parsing execution output:', error);
    return { testResults: null, logs: [] };
  }
}