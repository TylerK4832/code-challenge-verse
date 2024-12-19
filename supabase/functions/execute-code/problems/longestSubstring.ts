import { ProblemWrapper } from '../types.ts';

export const longestSubstringWrapper: ProblemWrapper = {
  wrapCode: (code: string, stdin: string) => `
    const input = \`${stdin}\`;
    const s = input.trim();
    
    ${code}
    
    const result = lengthOfLongestSubstring(s);
    console.log(JSON.stringify(result));
  `,
};