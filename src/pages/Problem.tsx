import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CodeEditor from '@/components/CodeEditor';
import TestCases from '@/components/TestCases';
import { useToast } from '@/components/ui/use-toast';
import ProblemDescription from '@/components/TwoSumDescription';
import AddTwoNumbersDescription from '@/components/AddTwoNumbersDescription';
import LongestSubstringDescription from '@/components/LongestSubstringDescription';
import MedianSortedArraysDescription from '@/components/MedianSortedArraysDescription';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Problem = () => {
  const { id } = useParams();
  const [code, setCode] = useState(() => {
    switch (id) {
      case 'two-sum':
        return `function twoSum(nums, target) {
  // Write your solution here
}`;
      case 'add-two-numbers':
        return `function addTwoNumbers(l1, l2) {
  // Write your solution here
}`;
      case 'longest-substring':
        return `function lengthOfLongestSubstring(s) {
  // Write your solution here
}`;
      case 'median-sorted-arrays':
        return `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
}`;
      default:
        return '// Write your solution here';
    }
  });

  const { toast } = useToast();

  const handleRunCode = () => {
    toast({
      title: "Running test cases...",
      description: "All test cases passed!",
      className: "bg-[#00b8a3] text-white",
    });
  };

  const getProblemDescription = () => {
    switch (id) {
      case 'two-sum':
        return <ProblemDescription />;
      case 'add-two-numbers':
        return <AddTwoNumbersDescription />;
      case 'longest-substring':
        return <LongestSubstringDescription />;
      case 'median-sorted-arrays':
        return <MedianSortedArraysDescription />;
      default:
        return <div>Problem not found</div>;
    }
  };

  const problemDescription = getProblemDescription();

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Description Section */}
      <div className="w-[35%] border-r border-border">
        <ScrollArea className="h-full">
          <div className="p-6">
            {problemDescription}
          </div>
        </ScrollArea>
      </div>

      {/* Editor and Test Cases Section */}
      <div className="flex-1 flex flex-col">
        {/* Editor Controls */}
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex gap-4">
            <Button variant="secondary">JavaScript</Button>
          </div>
          <Button onClick={handleRunCode} className="bg-[#00b8a3] hover:bg-[#00a092]">
            Run Code
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-1">
          <CodeEditor code={code} onChange={setCode} />
        </div>

        {/* Test Cases */}
        <div className="h-[200px] border-t border-border">
          <TestCases />
        </div>
      </div>
    </div>
  );
};

export default Problem;
