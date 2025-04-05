
import React from 'react';

const MedianSortedArraysContent: React.FC = () => {
  return (
    <div className="prose prose-invert max-w-none">
      <p>
        Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.
      </p>
      
      <p>
        The overall run time complexity should be <code>O(log (m+n))</code>.
      </p>

      <h3>Example 1:</h3>
      <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
        <code>
{`Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.`}
        </code>
      </pre>

      <h3>Example 2:</h3>
      <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
        <code>
{`Input: nums1 = [1,2], nums2 = [3,4]
Output: 2.50000
Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.`}
        </code>
      </pre>

      <h3>Constraints:</h3>
      <ul>
        <li><code>nums1.length == m</code></li>
        <li><code>nums2.length == n</code></li>
        <li><code>0 <= m <= 1000</code></li>
        <li><code>0 <= n <= 1000</code></li>
        <li><code>1 <= m + n <= 2000</code></li>
        <li><code>-10<sup>6</sup> <= nums1[i], nums2[i] <= 10<sup>6</sup></code></li>
      </ul>
    </div>
  );
};

export default MedianSortedArraysContent;
