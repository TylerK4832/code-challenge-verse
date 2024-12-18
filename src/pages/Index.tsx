import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CodeEditor from '@/components/CodeEditor';
import ProblemDescription from '@/components/ProblemDescription';
import TestCases from '@/components/TestCases';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Write your solution here
}`);
  const { toast } = useToast();

  const handleRunCode = () => {
    toast({
      title: "Running test cases...",
      description: "All test cases passed!",
      className: "bg-[#00b8a3] text-white",
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Problem Description Panel */}
      <div className="w-[45%] p-6 border-r border-border">
        <ProblemDescription />
      </div>

      {/* Code Editor Panel */}
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
  );
};

export default Index;