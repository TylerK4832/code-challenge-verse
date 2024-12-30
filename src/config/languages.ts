import { Language } from '@/types/editor';

export const LANGUAGES: Language[] = [
  { 
    id: 63, 
    name: 'JavaScript',
    defaultCode: 'function solution() {\n  // Write your solution here\n}'
  },
  { 
    id: 71, 
    name: 'Python',
    defaultCode: 'def solution():\n    # Write your solution here\n    pass'
  }
];

export const getDefaultCode = (problemId: string, languageId: number): string => {
  switch (problemId) {
    case 'two-sum':
      return languageId === 63 
        ? `function twoSum(nums, target) {\n  // Write your solution here\n}`
        : `def twoSum(nums, target):\n    # Write your solution here\n    pass`;
    case 'add-two-numbers':
      return languageId === 63
        ? `function addTwoNumbers(l1, l2) {\n  // Write your solution here\n}`
        : `def addTwoNumbers(l1, l2):\n    # Write your solution here\n    pass`;
    case 'longest-substring':
      return languageId === 63
        ? `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n}`
        : `def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass`;
    case 'median-sorted-arrays':
      return languageId === 63
        ? `function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n}`
        : `def findMedianSortedArrays(nums1, nums2):\n    # Write your solution here\n    pass`;
    default:
      return LANGUAGES.find(l => l.id === languageId)?.defaultCode || '';
  }
};