import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TestCases = () => {
  return (
    <Tabs defaultValue="testcases" className="h-full">
      <div className="p-4 border-b border-border">
        <TabsList className="bg-secondary">
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="result">Result</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="testcases" className="p-4 space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Test Case 1:</h3>
          <pre className="bg-secondary p-2 rounded-md">
            <code>nums = [2,7,11,15], target = 9</code>
          </pre>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Test Case 2:</h3>
          <pre className="bg-secondary p-2 rounded-md">
            <code>nums = [3,2,4], target = 6</code>
          </pre>
        </div>
      </TabsContent>

      <TabsContent value="result" className="p-4">
        <div className="text-[#00b8a3]">
          ✓ All test cases passed!
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default TestCases;