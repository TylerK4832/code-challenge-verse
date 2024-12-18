import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    <div className="flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      {/* Mobile layout: Tabs */}
      <div className="block sm:hidden">
        <Tabs defaultValue="description">
          <div className="p-4 border-b border-border">
            <TabsList className="bg-secondary">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="p-4">
            {problemDescription}
          </TabsContent>
          
          <TabsContent value="editor" className="p-4 space-y-4">
            <div className="border-b border-border pb-4 flex justify-between items-center">
              <div className="flex gap-4">
                <Button variant="secondary">JavaScript</Button>
              </div>
              <Button onClick={handleRunCode} className="bg-[#00b8a3] hover:bg-[#00a092]">
                Run Code
              </Button>
            </div>

            <div className="h-[50vh] border border-border rounded-md overflow-hidden">
              <CodeEditor code={code} onChange={setCode} />
            </div>

            <div className="border-t border-border">
              <TestCases />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop layout: Side-by-side */}
      <div className="hidden sm:flex h-[calc(100vh-8rem)]">
        <div className="flex-shrink-0 w-full sm:w-[40%] lg:w-[35%] py-6 pr-6 border-r border-border overflow-y-auto min-w-[280px]">
          {problemDescription}
        </div>

        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <div className="flex gap-4">
              <Button variant="secondary">JavaScript</Button>
            </div>
            <Button onClick={handleRunCode} className="bg-[#00b8a3] hover:bg-[#00a092]">
              Run Code
            </Button>
          </div>
          
          <div className="flex-1">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          <div className="h-[200px] border-t border-border">
            <TestCases />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;