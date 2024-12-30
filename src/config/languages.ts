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
        ? `function twoSum(nums, target) {
    // Write your solution here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
        : `def twoSum(nums, target):
    # Write your solution here
    num_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []`;
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