import { ScrollArea } from '@/components/ui/scroll-area';

interface TestCase {
  id: string;
  input: string;
  expected_output: string;
}

interface TestCasesListProps {
  testCases: TestCase[];
}

const formatInput = (input: string) => {
  return input.split('\\n').join('\n');
};

export const TestCasesList = ({ testCases }: TestCasesListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="space-y-2">
            <h3 className="font-medium">Test Case {index + 1}:</h3>
            <pre className="bg-secondary p-2 rounded-md whitespace-pre">
              <code>Input: {formatInput(testCase.input)}</code>
            </pre>
            <pre className="bg-secondary p-2 rounded-md whitespace-pre">
              <code>Expected Output: {testCase.expected_output}</code>
            </pre>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};