import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    // Parse test cases
    const testCases = ${testCasesStr};
    const results = [];
    
    // Run each test case
    for (const testCase of testCases) {
      try {
        // Parse input - expecting array and target number
        const [arrayStr, targetStr] = testCase.input.trim().split('\\n');
        const nums = JSON.parse(arrayStr);
        const target = parseInt(targetStr);
        
        // Run the solution
        const result = twoSum(nums, target);
        
        // Format and store the result
        results.push(JSON.stringify(result));
      } catch (error) {
        results.push('Error: ' + error.message);
      }
    }
    
    // Output all results
    console.log(results.join('\\n'));
  `,
};