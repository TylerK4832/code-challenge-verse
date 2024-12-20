import { ProblemWrapper } from '../types.ts';

export const twoSumWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Parse input string, removing any escaped characters
        const input = testCase.input.replace(/\\n/g, '\n');
        const [numsStr, targetStr] = input.split('\n');
        
        // Extract just the array part before trying to parse
        const arrayMatch = numsStr.match(/\\[.*\\]/);
        if (!arrayMatch) {
          throw new Error('Invalid input format: array not found');
        }
        
        const nums = JSON.parse(arrayMatch[0]);
        const target = parseInt(targetStr);
        
        console.log('Processing test case:', { nums, target });
        
        // Run the solution and get result
        const result = twoSum(nums, target);
        console.log('Solution returned:', result);
        
        // Ensure result is properly stringified
        results.push(result ? JSON.stringify(result) : 'null');
      } catch (error) {
        console.error('Error processing test case:', error);
        console.error('Input was:', testCase.input);
        results.push('null');
      }
    }
    
    console.log('All results:', results);
    console.log(results.join('\\n'));
  `,
};