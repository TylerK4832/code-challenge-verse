import { LanguageWrapper } from '../types/languageWrappers.ts';

function formatTestCodeList(testCodeList) {
  return testCodeList.map((code, index) => 
    `
    try {
      currentTestIndex = ${index}
      ${code}
      results.push({
        passed: true
      });
    } catch (error) {
      results.push({
        error: error && error.message ? error.message : String(error)
      });
    }
    `
  ).join('\n');
}

export const javascriptWrapper: LanguageWrapper = {
  wrapCode: (userCode, testCodeList) => `
  const assert = require('assert');

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
    ${userCode}

    (async function runTests() {
      let results = [];

      ${formatTestCodeList(testCodeList)}


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