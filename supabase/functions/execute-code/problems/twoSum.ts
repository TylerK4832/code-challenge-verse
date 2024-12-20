import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => {
    return `
      ${code}
      
      const testCases = ${testCasesStr};
      
      for (const testCase of testCases) {
        // Parse input string into array and target
        const [numsStr, targetStr] = testCase.input.split('\\n');
        // Remove brackets and split by comma to get numbers array
        const nums = JSON.parse(numsStr);
        const target = parseInt(targetStr);
        
        // Run the solution
        const result = twoSum(nums, target);
        
        // Output the result in the exact same format as expected
        console.log(JSON.stringify(result));
      }
    `;
  },
};