import { Badge } from '@/components/ui/badge';

const LongestSubstringDescription = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">3. Longest Substring Without Repeating Characters</h1>
        <Badge className="bg-[#ffc01e] text-black">Medium</Badge>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>
          Given a string s, find the length of the longest substring without repeating characters.
        </p>

        <h3>Example 1:</h3>
        <pre className="bg-secondary p-4 rounded-md">
          <code>
{`Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`}
          </code>
        </pre>

        <h3>Constraints:</h3>
        <ul>
          <li>0 ≤ s.length ≤ 5 * 104</li>
          <li>s consists of English letters, digits, symbols and spaces.</li>
        </ul>
      </div>
    </div>
  );
};

export default LongestSubstringDescription;