import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => {
    return `
      ${code}
      
      const testCases = ${testCasesStr};
      
      for (const testCase of testCases) {
        const input = testCase.input;
        const [numsStr, targetStr] = input.split('\n');
        const nums = JSON.parse(numsStr);
        const target = parseInt(targetStr);
        
        const result = twoSum(nums, target);
        console.log(JSON.stringify(result));
      }
    `;
  },
};