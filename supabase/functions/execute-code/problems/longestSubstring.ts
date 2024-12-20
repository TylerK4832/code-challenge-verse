import { ProblemWrapper } from '../types.ts';

export const longestSubstringWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Get input string
        const s = testCase.input.trim();
        
        // Run the solution
        const result = lengthOfLongestSubstring(s);
        console.log('Input:', s);
        console.log('Output:', result);
        results.push(result.toString());
      } catch (error) {
        console.error('Error processing test case:', error);
        results.push('null');
      }
    }
    
    console.log('Final results:', results.join('\\n'));
  `,
};