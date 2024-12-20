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
        results.push(JSON.stringify(result));
      } catch (error) {
        results.push(JSON.stringify(null));
      }
    }
    
    console.log(results.join('\\n'));
  `,
};