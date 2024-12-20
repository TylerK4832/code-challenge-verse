import { ProblemWrapper } from '../types.ts';

export const medianSortedArraysWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const [nums1Str, nums2Str] = testCase.input.split('\\n');
        const nums1 = JSON.parse(nums1Str);
        const nums2 = JSON.parse(nums2Str);
        
        const result = findMedianSortedArrays(nums1, nums2);
        const expected = JSON.parse(testCase.expected);
        
        results.push({
          passed: Math.abs(result - expected) < 1e-5,
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