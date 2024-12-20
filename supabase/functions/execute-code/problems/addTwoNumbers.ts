import { ProblemWrapper } from '../types.ts';

export const addTwoNumbersWrapper: ProblemWrapper = {
  wrapCode: (code: string, testCasesStr: string) => `
    ${code}
    
    const testCases = ${testCasesStr};
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const [l1Str, l2Str] = testCase.input.split('\\n');
        const l1 = JSON.parse(l1Str);
        const l2 = JSON.parse(l2Str);
        
        class ListNode {
          val: number;
          next: ListNode | null;
          constructor(val?: number, next?: ListNode | null) {
            this.val = val === undefined ? 0 : val;
            this.next = next === undefined ? null : next;
          }
        }

        function arrayToList(arr) {
          if (!arr.length) return null;
          const head = new ListNode(arr[0]);
          let current = head;
          for (let i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
          }
          return head;
        }

        function listToArray(head) {
          const result = [];
          let current = head;
          while (current) {
            result.push(current.val);
            current = current.next;
          }
          return result;
        }

        const result = addTwoNumbers(arrayToList(l1), arrayToList(l2));
        const output = listToArray(result);
        const expected = JSON.parse(testCase.expected);
        
        results.push({
          passed: JSON.stringify(output) === JSON.stringify(expected),
          output
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