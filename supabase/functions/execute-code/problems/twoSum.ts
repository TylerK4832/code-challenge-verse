import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code, testCasesStr, userFunctionName = 'twoSum') => `
  (function() {
    // Store the original console.log
    const originalLog = console.log;
    
    // Array to capture all logs with associated test indices
    let logs = [];
    
    // Variable to keep track of the current test index
    let currentTestIndex = -1;
    
    // Override console.log to capture logs along with the test index
    console.log = function(...args) {
      const stringified = args.map(item => 
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      );
      logs.push({
        testIndex: currentTestIndex,
        message: stringified.join(' ')
      });
    };
    
    // Declare results array in the outer scope
    let results = [];
    
    try {
      // Inject user code
      ${code}
      
      // Execute the tests
      (async function runTests() {
        const testCases = ${testCasesStr};
        
        for (let i = 0; i < testCases.length; i++) {
          // Set the current test index before running each test
          currentTestIndex = i;
          
          const { input, expected } = testCases[i];
          
          try {
            // Step 1: Replace any escaped "\\n" with actual newlines
            const replacedInput = input.replace(/\\\\n/g, '\\n');
            
            // Step 2: Split the input string on newlines to get individual arguments
            const lines = replacedInput.split('\\n');
            
            // Step 3: Parse each line as JSON to get the correct argument types
            const args = lines.map(line => JSON.parse(line));
            
            // Step 4: Call the user's function with the parsed arguments
            const actual = ${userFunctionName}(...args);
            
            // Step 5: Parse the expected output if it's a JSON string
            let parsedExpected = expected;
            if (typeof parsedExpected === 'string') {
              parsedExpected = JSON.parse(parsedExpected);
            }
            
            // Step 6: Compare the actual result with the expected result
            const passed = JSON.stringify(actual) === JSON.stringify(parsedExpected);
            
            // Step 7: Record the result
            results.push({
              input,
              expected: parsedExpected,
              actual,
              passed
            });
          } catch (error) {
            // If an error occurs during the test case execution, capture it
            results.push({
              input,
              expected,
              actual: null,
              passed: false,
              error: error && error.message ? error.message : String(error)
            });
          }
        }
        
        // Reset the current test index after all tests
        currentTestIndex = -1;
        
        // Restore the original console.log
        console.log = originalLog;
        
        // Output the test results
        console.log("WRAPPER_RESULTS", JSON.stringify(results));
        
        // Output the captured logs with associated test indices
        console.log("WRAPPER_LOGS", JSON.stringify(logs));
      })();
    } catch (e) {
      // If an error occurs during code injection (e.g., syntax error), handle it here
      
      // Retrieve the test cases to associate the error with each test
      const testCases = ${testCasesStr};
      
      // Populate results with the injection error for all test cases
      results = testCases.map(test => ({
        input: test.input,
        expected: typeof test.expected === 'string' ? JSON.parse(test.expected) : test.expected,
        actual: null,
        passed: false,
        error: e.message || String(e)
      }));
      
      // Restore the original console.log
      console.log = originalLog;
      
      // Output the error results
      console.log("WRAPPER_RESULTS", JSON.stringify(results));
      
      // Output any logs captured before the error occurred
      console.log("WRAPPER_LOGS", JSON.stringify(logs));
    }
  })();
  `
};
