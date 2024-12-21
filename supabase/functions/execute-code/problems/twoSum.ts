export const twoSumWrapper = {
  wrapCode: (code, testCasesStr) => `
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
      // Also print them normally for Judge0
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
          // Change this call if user's function differs
          const actual = twoSum(...input);
          const parsedExpected = JSON.parse(expected);
          const passed = JSON.stringify(actual) === JSON.stringify(parsedExpected);
          results.push({ input, expected, actual, passed });
        } catch (error) {
          results.push({
            input,
            expected,
            error: error && error.message ? error.message : String(error)
          });
        }
      }

      originalLog("WRAPPER_RESULTS", JSON.stringify(results));
      originalLog("WRAPPER_LOGS", JSON.stringify(logs));
    })();
  })();
  `
};
