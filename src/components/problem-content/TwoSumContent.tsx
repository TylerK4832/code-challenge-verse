
import React from 'react';

const TwoSumContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <p>
        Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
      </p>
      
      <p>
        You may assume that each input would have exactly one solution, and you may not use the same element twice.
      </p>

      <p>You can return the answer in any order.</p>

      <h3>Example 1:</h3>
      <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
        <code>
{`Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
        </code>
      </pre>

      <h3>Constraints:</h3>
      <ul>
        <li>2 ≤ nums.length ≤ 10<sup>4</sup></li>
        <li>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></li>
        <li>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></li>
        <li>Only one valid answer exists.</li>
      </ul>
    </div>
  );
};

export default TwoSumContent;
