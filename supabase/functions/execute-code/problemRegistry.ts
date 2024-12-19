import { ProblemWrapper } from './types.ts';
import { twoSumWrapper } from './problems/twoSum.ts';
import { addTwoNumbersWrapper } from './problems/addTwoNumbers.ts';
import { longestSubstringWrapper } from './problems/longestSubstring.ts';
import { medianSortedArraysWrapper } from './problems/medianSortedArrays.ts';

const problemRegistry: Record<string, ProblemWrapper> = {
  'two-sum': twoSumWrapper,
  'add-two-numbers': addTwoNumbersWrapper,
  'longest-substring': longestSubstringWrapper,
  'median-sorted-arrays': medianSortedArraysWrapper,
};

export const getProblemWrapper = (problemId: string): ProblemWrapper => {
  const wrapper = problemRegistry[problemId];
  if (!wrapper) {
    throw new Error(`Unknown problem ID: ${problemId}`);
  }
  return wrapper;
};