import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Parse input string to get array and target
        const [nums, target] = testCase.input.split('\\n').map((line, index) => {
          if (index === 0) {
            // Parse array, removing any brackets and splitting by comma
            return line.replace(/[\\[\\]]/g, '').split(',').map(Number);
          }
          return Number(line);
        });
        
        // Run the solution
        const result = twoSum(nums, target);
        results.push(JSON.stringify(result));
      } catch (error) {
        console.error('Error processing test case:', error);
        results.push(JSON.stringify(null));
      }
    }
    
    console.log(results.join('\\n'));
  `,
};