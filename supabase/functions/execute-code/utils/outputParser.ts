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
    // Create a mapping of problematic characters to their replacements
    const charMap: { [key: string]: string } = {
      'â': '"',  // Right double quotation mark
      'â': '"',  // Left double quotation mark
      'â': "'",  // Right single quotation mark
      'â': "'",  // Left single quotation mark
      'â¦': '...', // Horizontal ellipsis
      'â': '-',  // Em dash
      'â': '-',  // En dash
      'Â': '',   // Non-breaking space marker
      '\u00A0': ' ', // Non-breaking space
      '\u2018': "'", // Left single quotation mark
      '\u2019': "'", // Right single quotation mark
      '\u201C': '"', // Left double quotation mark
      '\u201D': '"', // Right double quotation mark
      '\u2013': '-', // En dash
      '\u2014': '-', // Em dash
      '\u2026': '...', // Horizontal ellipsis
    };

    // Replace each special character with its ASCII equivalent
    let cleanedMessage = message;
    for (const [special, ascii] of Object.entries(charMap)) {
      cleanedMessage = cleanedMessage.replace(new RegExp(special, 'g'), ascii);
    }

    // Remove any remaining non-ASCII characters
    cleanedMessage = cleanedMessage.replace(/[^\x00-\x7F]/g, '');
    
    return cleanedMessage.trim();
  };

  for (const line of lines) {
    if (line.startsWith('WRAPPER_RESULTS ')) {
      try {
        const jsonStr = line.replace('WRAPPER_RESULTS ', '');
        testResults = JSON.parse(jsonStr);
        console.log('Parsed test results:', testResults);
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
        console.log('Parsed logs:', logs);
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