import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ProblemDescription from '@/components/problem/ProblemDescription';
import ProblemCodeEditor from '@/components/problem/ProblemCodeEditor';

const Problem = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
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

  if (isMobile) {
    return (
      <div className="h-[100dvh] -mt-16 pt-16">
        <Tabs defaultValue="description" className="h-full">
          <div className="border-b border-border">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="description" className="h-[calc(100%-49px)] mt-0">
            <ProblemDescription problemId={id || ''} />
          </TabsContent>

          <TabsContent value="code" className="h-[calc(100%-49px)] mt-0">
            <ProblemCodeEditor code={code} onChange={setCode} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] -mt-16 pt-16 relative">
      <div className="absolute inset-0 pt-16 z-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={35} minSize={30}>
            <ProblemDescription problemId={id || ''} />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={65} minSize={30}>
            <ProblemCodeEditor code={code} onChange={setCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Problem;