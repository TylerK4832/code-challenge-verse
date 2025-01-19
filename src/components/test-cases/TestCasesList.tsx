import { ScrollArea } from '@/components/ui/scroll-area';

interface TestCase {
  id: string;
  code: string;
}

interface TestCasesListProps {
  testCases: TestCase[];
}

export const TestCasesList = ({ testCases }: TestCasesListProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 pb-8">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="space-y-2 border border-border rounded-lg p-4">
            <h3 className="font-medium text-sm text-muted-foreground">Test Case {index + 1}</h3>
            <pre className="bg-secondary/50 p-3 rounded-md whitespace-pre-wrap break-words text-sm font-mono">
              <code>{testCase.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};