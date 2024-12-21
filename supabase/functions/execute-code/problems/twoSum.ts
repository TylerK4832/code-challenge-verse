import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code, testCasesStr, userFunctionName = 'twoSum') => `
  (function() {
    // Store original console.log
    const originalLog = console.log;
    // Array to capture all logs
    let logs = [];

    // Override console.log to capture logs
    console.log = function(...args) {
      const stringified = args.map(item => 
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      );
      logs.push(stringified.join(' '));
      // You can comment this out if you don't want logs
      // to appear in stdout multiple times
      // originalLog.apply(console, args);
    };

    // Inject user code
    ${code}

    (async function runTests() {
      const testCases = ${testCasesStr};
      let results = [];

      for (let i = 0; i < testCases.length; i++) {
        const { input, expected } = testCases[i];
        try {
          // Split the input string on newlines:
          // For example, "[2,7,11,15]\\n9\\n5" => ["[2,7,11,15]", "9", "5"]
          const lines = input.split('\n');

          // Parse each line as JSON to get the correct argument type
          // e.g. ["[2,7,11,15]", "9", "5"] => [[2,7,11,15], 9, 5]
          const args = lines.map(line => JSON.parse(line));

          // Spread the arguments into the user's function
          // If userFunctionName is "twoSum", it calls twoSum(...args)
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

      // Print final test results
      originalLog("WRAPPER_RESULTS", JSON.stringify(results));

      // Print any logs captured during execution
      originalLog("WRAPPER_LOGS", JSON.stringify(logs));
    })();
  })();
  `
};
