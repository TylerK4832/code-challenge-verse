import { Badge } from '@/components/ui/badge';

const AddTwoNumbersDescription = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">2. Add Two Numbers</h1>
        <Badge className="bg-[#ffc01e] text-black">Medium</Badge>
      </div>

      <div className="prose prose-invert max-w-none">
        <p>
          You are given two non-empty linked lists representing two non-negative integers. 
          The digits are stored in reverse order, and each of their nodes contains a single digit. 
          Add the two numbers and return the sum as a linked list.
        </p>
        
        <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

        <h3>Example 1:</h3>
        <pre className="bg-secondary p-4 rounded-md whitespace-pre-wrap break-words overflow-auto">
          <code>
{`Input: l1 = [2,4,3], l2 = [5,6,4]
Output: [7,0,8]
Explanation: 342 + 465 = 807.`}
          </code>
        </pre>

        <h3>Constraints:</h3>
        <ul>
          <li>The number of nodes in each linked list is in the range [1, 100].</li>
          <li>0 ≤ Node.val ≤ 9</li>
          <li>It is guaranteed that the list represents a number that does not have leading zeros.</li>
        </ul>
      </div>
    </div>
  );
};

export default AddTwoNumbersDescription;