import { ProblemWrapper } from '../types.ts';

export const medianSortedArraysWrapper: ProblemWrapper = {
  wrapCode: (code: string, stdin: string) => `
    const input = \`${stdin}\`;
    const lines = input.trim().split('\\n');
    const nums1 = JSON.parse(lines[0]);
    const nums2 = JSON.parse(lines[1]);
    
    ${code}
    
    const result = findMedianSortedArrays(nums1, nums2);
    console.log(JSON.stringify(result));
  `,
};