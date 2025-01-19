import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from "@/integrations/supabase/client";
import { TestCasesList } from './test-cases/TestCasesList';
import { ResultsList } from './test-cases/ResultsList';
import { SuccessDialog } from './test-cases/SuccessDialog';

interface ExecutionResult {
  status?: {
    id: number;
    description: string;
  };
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  test_results?: Array<{
    passed: boolean;
    error?: string;
    code: string;
  }>;
}

interface TestCasesProps {
  executionResult?: ExecutionResult | null;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  isLoading?: boolean;
  selectedLanguage: string;
}

const TestCases = ({ executionResult, activeTab, onTabChange, isLoading, selectedLanguage }: TestCasesProps) => {
  const { id: problemId } = useParams();
  const [testCases, setTestCases] = useState<any[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchTestCases = async () => {
      // Convert language name to match database format
      const dbLanguage = selectedLanguage === 'C++' ? 'cpp' : selectedLanguage.toLowerCase();
      
      const { data, error } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false)
        .eq('language', dbLanguage);

      if (!error && data) {
        setTestCases(data);
      }
    };

    fetchTestCases();
  }, [problemId, selectedLanguage]);

  useEffect(() => {
    if (executionResult?.status?.id === 3) {
      setShowSuccessDialog(true);
    }
  }, [executionResult]);

  return (
    <>
      <SuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog} 
      />

      <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
        <div className="px-3 py-2 border-b border-border">
          <TabsList className="h-8">
            <TabsTrigger value="testcases" className="text-sm">Test Cases</TabsTrigger>
            <TabsTrigger value="result" className="text-sm">Result</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="testcases" className="h-[calc(100%-3rem)]">
          <TestCasesList testCases={testCases} />
        </TabsContent>

        <TabsContent value="result" className="h-[calc(100%-3rem)]">
          <ResultsList 
            executionResult={executionResult} 
            isLoading={isLoading || false} 
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default TestCases;