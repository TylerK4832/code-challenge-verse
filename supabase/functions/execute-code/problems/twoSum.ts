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
        
        console.log('Processing test case:', { nums, target });
        
        // Run the solution and get result
        const result = twoSum(nums, target);
        console.log('Solution returned:', result);
        
        // Ensure result is properly stringified
        results.push(result ? JSON.stringify(result) : 'null');
      } catch (error) {
        console.error('Error processing test case:', error);
        results.push('null');
      }
    }
    
    console.log('All results:', results);
    console.log(results.join('\\n'));
  `,
};