import { ProblemWrapper } from '../types.ts';

export const longestSubstringWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const s = testCase.input.trim();
        const result = lengthOfLongestSubstring(s);
        const expected = JSON.parse(testCase.expected);
        
        results.push({
          passed: result === expected,
          output: result
        });
      } catch (error) {
        results.push({
          passed: false,
          output: null,
          error: error.message
        });
      }
    }
    
    console.log(JSON.stringify(results));
  `,
};