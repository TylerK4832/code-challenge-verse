import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code, testCasesStr, userFunctionName = 'twoSum') => `
    (function() {
      // Store original console.log
      const originalLog = console.log;
      
      // Initialize logs and tracking variables
      let logs = [];
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
  
      // Initialize results array
      let results = [];
  
      // Attempt to inject and execute user code
      try {
        // Use eval to dynamically execute the user-provided code
        eval(\`${code}\`);
      } catch (error) {
        // If there's an error during code injection, record it for all test cases

        results.push({
          input,
          expected,
          error: error && error.message ? error.message : String(error)
        });
  
        // Restore the original console.log
        console.log = originalLog;
  
        // Output the results and logs
        console.log("WRAPPER_RESULTS", JSON.stringify(results));
        console.log("WRAPPER_LOGS", JSON.stringify(logs));
  
        // Exit early since user code failed to execute
        return;
      }
  
      // If user code is injected successfully, proceed to run tests
      (async function runTests() {
        const testCases = ${testCasesStr};
  
        for (let i = 0; i < testCases.length; i++) {
          currentTestIndex = i;
          
          const { input, expected } = testCases[i];
          try {
            // Split the input string on newlines and parse each line as JSON
            const lines = input.split('\\n');
            const args = lines.map(line => JSON.parse(line));
  
            // Call the user-defined function with the parsed arguments
            const actual = ${userFunctionName}(...args);
  
            // Parse expected value if it's a JSON string
            let parsedExpected = expected;
            if (typeof parsedExpected === 'string') {
              parsedExpected = JSON.parse(parsedExpected);
            }
  
            // Compare actual result with expected result
            const passed = JSON.stringify(actual) === JSON.stringify(parsedExpected);
  
            // Record the result of the test case
            results.push({
              input,
              expected: parsedExpected,
              actual,
              passed
            });
          } catch (error) {
            // If there's an error during test execution, record the error
            results.push({
              input,
              expected,
              error: error && error.message ? error.message : String(error)
            });
          }
        }
  
        // Reset the current test index
        currentTestIndex = -1;
  
        // Restore the original console.log
        console.log = originalLog;
  
        // Output the final test results and logs
        console.log("WRAPPER_RESULTS", JSON.stringify(results));
        console.log("WRAPPER_LOGS", JSON.stringify(logs));
      })();
    })();
  `
};
