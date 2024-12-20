import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}

    try {
      // Split the input string by newlines
      const lines = testCasesStr.trim().split('\\n');
      
      // First line should be a JSON array of nums
      const nums = JSON.parse(lines[0]);
      // Second line should be a target integer
      const target = parseInt(lines[1], 10);

      // Run the user's twoSum solution
      const result = twoSum(nums, target);

      // Print the result as a JSON string
      console.log(JSON.stringify(result));
    } catch (error) {
      // If there's any error, print null
      console.error('Error:', error);
      console.log('null');
    }
  `,
};
