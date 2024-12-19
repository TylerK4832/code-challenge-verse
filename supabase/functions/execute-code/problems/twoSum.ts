import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, stdin: string) => `
    const input = \`${stdin}\`;
    const lines = input.trim().split('\\n');
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1]);
    
    ${code}
    
    const result = twoSum(nums, target);
    console.log(JSON.stringify(result));
  `,
};