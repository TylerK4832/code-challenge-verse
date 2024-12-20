import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    
    for (const testCase of testCases) {
      const lines = testCase.input.split("\\n");
      const nums = JSON.parse(lines[0]);
      const target = parseInt(lines[1]);
      
      const result = twoSum(nums, target);
      console.log(JSON.stringify(result));
    }
  `,
};