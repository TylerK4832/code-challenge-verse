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
        const nums = numsStr.replace(/[\\[\\]]/g, '').split(',').map(Number);
        const target = parseInt(targetStr);
        
        // Run the solution
        const result = twoSum(nums, target);
        results.push(JSON.stringify(result));
      } catch (error) {
        results.push(JSON.stringify(null));
      }
    }
    
    console.log(results.join('\\n'));
  `,
};