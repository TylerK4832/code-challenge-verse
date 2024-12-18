import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from "@/integrations/supabase/client";

const TestCases = () => {
  const { id: problemId } = useParams();
  const [testCases, setTestCases] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestCases = async () => {
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false);

      if (!error && data) {
        // Parse the input and output strings to handle newlines and formatting
        const formattedData = data.map(testCase => ({
          ...testCase,
          input: testCase.input.replace(/\\n/g, '\n'),
          expected_output: testCase.expected_output.replace(/\\n/g, '\n')
        }));
        setTestCases(formattedData);
      }
    };

    fetchTestCases();
  }, [problemId]);

  return (
    <Tabs defaultValue="testcases" className="h-full">
      <div className="p-4 border-b border-border">
        <TabsList className="bg-secondary">
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="result">Result</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="testcases" className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {testCases.map((testCase, index) => (
              <div key={testCase.id} className="space-y-2">
                <h3 className="font-medium">Test Case {index + 1}:</h3>
                <pre className="bg-secondary p-2 rounded-md">
                  <code>Input: {testCase.input}</code>
                </pre>
                <pre className="bg-secondary p-2 rounded-md">
                  <code>Expected Output: {testCase.expected_output}</code>
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="result" className="h-[calc(100%-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="text-[#00b8a3]">
              Run your code to see the results!
            </div>
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default TestCases;