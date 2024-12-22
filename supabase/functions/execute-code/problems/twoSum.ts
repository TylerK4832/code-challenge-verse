import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code, testCasesStr, userFunctionName = 'twoSum') => `
  (function() {
    // Store original console.log
    const originalLog = console.log;
    
    // We'll keep a single global array of all logs,
    // but with metadata (testIndex) so we know which test they came from.
    let logs = [];
    // We'll keep track of which test is currently running
    let currentTestIndex = -1;
    
    // Override console.log to capture logs with their test index
    console.log = function(...args) {
      const stringified = args.map(item => 
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      );
      logs.push({
        testIndex: currentTestIndex,
        message: stringified.join(' ')
      });
    };

    // Inject user code
    ${code}

    (async function runTests() {
      const testCases = ${testCasesStr};
      let results = [];

      for (let i = 0; i < testCases.length; i++) {
        // Before running each test, set currentTestIndex
        currentTestIndex = i;
        
        const { input, expected } = testCases[i];
        try {
          // Split the input string on newlines:
          const lines = input.split('\\n');

          // Parse each line as JSON to get the correct argument type.
          // e.g. ["[2,7,11,15]", "9", "5"] => [[2,7,11,15], 9, 5]
          const args = lines.map(line => JSON.parse(line));

          // Call user function with the arguments
          const actual = ${userFunctionName}(...args);

          // Parse expected if it's a JSON string (e.g. "[0,1]" => [0,1])
          let parsedExpected = expected;
          if (typeof parsedExpected === 'string') {
            parsedExpected = JSON.parse(parsedExpected);
          }

          // Compare results
          const passed = JSON.stringify(actual) === JSON.stringify(parsedExpected);

          results.push({
            input,
            expected: parsedExpected,
            actual,
            passed
          });
        } catch (error) {
          results.push({
            input,
            expected,
            error: error && error.message ? error.message : String(error)
          });
        }
      }

      // All tests done, reset currentTestIndex
      currentTestIndex = -1;

      // Restore original console.log so we can print final lines normally
      console.log = originalLog;

      // Print final test results
      console.log("WRAPPER_RESULTS", JSON.stringify(results));

      // Print logs with info about which test produced them
      console.log("WRAPPER_LOGS", JSON.stringify(logs));
    })();
  })();
  `
};