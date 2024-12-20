import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Parse input string to get array and target
        const [numsStr, targetStr] = testCase.input.split('\\n');
        const nums = JSON.parse(numsStr);
        const target = parseInt(targetStr);
        
        // Run the solution and get result
        const result = twoSum(nums, target);
        
        // Convert result to string for comparison
        results.push(JSON.stringify(result));
      } catch (error) {
        results.push(JSON.stringify(null));
      }
    }
    
    console.log(results.join('\\n'));
  `,
};