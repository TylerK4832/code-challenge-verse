import { ProblemWrapper } from '../types.ts';

export const addTwoNumbersWrapper: ProblemWrapper = {
  wrapCode: (code: string, stdin: string) => `
    const input = \`${stdin}\`;
    const lines = input.trim().split('\\n');
    const l1 = JSON.parse(lines[0]);
    const l2 = JSON.parse(lines[1]);
    
    class ListNode {
      val: number;
      next: ListNode | null;
      constructor(val?: number, next?: ListNode | null) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
      }
    }

    function arrayToList(arr: number[]): ListNode | null {
      if (!arr.length) return null;
      const head = new ListNode(arr[0]);
      let current = head;
      for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
      }
      return head;
    }

    function listToArray(head: ListNode | null): number[] {
      const result = [];
      let current = head;
      while (current) {
        result.push(current.val);
        current = current.next;
      }
      return result;
    }

    ${code}
    
    const result = addTwoNumbers(arrayToList(l1), arrayToList(l2));
    console.log(JSON.stringify(listToArray(result)));
  `,
};