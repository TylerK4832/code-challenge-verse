interface TestResult {
  passed: boolean;
  error?: string;
  code?: string;
}

interface TestLog {
  testIndex: number;
  message: string;
}

export const parseExecutionOutput = (output: string | null): { testResults: TestResult[] | null, logs: TestLog[] } => {
  if (!output) {
    return { testResults: null, logs: [] };
  }

  const lines = output.split('\n');
  let testResults: TestResult[] | null = null;
  const logs: TestLog[] = [];

  // Helper function to clean special characters from error messages
  const cleanErrorMessage = (message: string): string => {
    return message
      .replace(/â/g, '"')    // Replace curved quotes
      .replace(/â/g, '"')    // Replace curved quotes
      .replace(/â/g, "'")    // Replace single quotes
      .replace(/â/g, "'")    // Replace single quotes
      .replace(/â¦/g, "...")  // Replace ellipsis
      .replace(/â/g, "-")    // Replace em dash
      .replace(/â/g, "-")    // Replace en dash
      .replace(/Â/g, "")     // Remove invisible characters
      .replace(/\u00A0/g, " "); // Replace non-breaking space with regular space
  };

  for (const line of lines) {
    if (line.startsWith('WRAPPER_RESULTS ')) {
      try {
        const jsonStr = line.replace('WRAPPER_RESULTS ', '');
        testResults = JSON.parse(jsonStr);
      } catch (error) {
        console.error('Error parsing test results:', error);
      }
    } else if (line.startsWith('WRAPPER_LOGS ')) {
      try {
        const jsonStr = line.replace('WRAPPER_LOGS ', '');
        const parsedLogs = JSON.parse(jsonStr);
        if (Array.isArray(parsedLogs)) {
          logs.push(...parsedLogs);
        }
      } catch (error) {
        console.error('Error parsing logs:', error);
      }
    }
  }

  // Clean error messages in test results
  if (testResults) {
    testResults = testResults.map(result => ({
      ...result,
      error: result.error ? cleanErrorMessage(result.error) : undefined
    }));
  }

  return { testResults, logs };
};