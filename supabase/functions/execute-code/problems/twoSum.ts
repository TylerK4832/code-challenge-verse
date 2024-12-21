import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
  (function() {
    // Store original console.log
    const originalLog = console.log;
    // Array to capture all logs
    let logs: string[] = [];

    // Override console.log to capture logs
    console.log = function(...args: any[]) {
      // Convert any objects to string for consistent logging
      const stringified = args.map((item) => 
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      );
      logs.push(stringified.join(' '));
      // Also print them normally so you can see them in Judge0 output
      originalLog.apply(console, args);
    };

    // Inject user code
    ${code}

    // Test runner
    (async function runTests() {
      const testCases = ${testCasesStr};

      let results = [];
      for (let i = 0; i < testCases.length; i++) {
        const { input, expected } = testCases[i];
        try {
          // Adjust this call if your user's function signature differs
          const actual = twoSum(...input);
          const passed = JSON.stringify(actual) === JSON.stringify(expected);
          results.push({ input, expected, actual, passed });
        } catch (error) {
          // If the user's code fails, capture the error message
          results.push({
            input,
            expected,
            error: error.message || String(error)
          });
        }
      }

      // Print results in a structured way.
      // "WRAPPER_RESULTS" prefix can be used to locate the JSON in logs.
      console.log("WRAPPER_RESULTS", JSON.stringify(results));
      // Likewise for logs
      console.log("WRAPPER_LOGS", JSON.stringify(logs));
    })();
  })();
  `
};