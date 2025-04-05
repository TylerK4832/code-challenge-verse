
import React from 'react';

const LongestSubstringContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <p>
        Given a string s, find the length of the longest substring without repeating characters.
      </p>

      <h3>Example 1:</h3>
      <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
        <code>
{`Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`}
        </code>
      </pre>

      <h3>Constraints:</h3>
      <ul>
        <li>0 ≤ s.length ≤ 5 * 10<sup>4</sup></li>
        <li>s consists of English letters, digits, symbols and spaces.</li>
      </ul>
    </div>
  );
};

export default LongestSubstringContent;
