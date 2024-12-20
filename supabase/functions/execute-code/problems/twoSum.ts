import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}

    try {
      // Parse the test cases array from the given string
      const testCases = JSON.parse(\`${testCasesStr}\`);

      const results = [];

      for (const testCase of testCases) {
        try {
          // Split the input string by newline, for example:
          // input might look like:
          // "[2,7,11,15]"
          // "9"
          //
          // So we split by \\n and parse accordingly
          const lines = testCase.input.trim().split('\\n');
          
          // The first line is the array of numbers
          const nums = JSON.parse(lines[0]);
          // The second line is the target
          const target = parseInt(lines[1], 10);

          // Run the user's solution
          const output = twoSum(nums, target);

          // Compare with expected output
          // The expected might be a JSON array string, so parse it:
          const expected = JSON.parse(testCase.expected);

          const passed = JSON.stringify(output) === JSON.stringify(expected);

          // Store result for this test case
          results.push({
            input: testCase.input,
            expected: expected,
            output: output,
            passed: passed
          });
        } catch (error) {
          // In case of any error during parsing or execution
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            output: null,
            passed: false,
            error: error.toString()
          });
        }
      }

      // Log all results as JSON
      console.log(JSON.stringify(results));
    } catch (error) {
      console.error('Error parsing testCasesStr:', error);
      console.log('null');
    }
  `
};

