import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";

export const useCodeExecution = () => {
  const { id: problemId } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [activeTab, setActiveTab] = useState('testcases');

  const resetExecution = () => {
    setExecutionResult(null);
  };

  const executeCode = async (code: string, language: { id: number, name: string }) => {
    setIsRunning(true);
    setExecutionResult(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('Authentication required');
        return;
      }

      const { data: testCases, error: testCasesError } = await supabase
        .from('test_cases')
        .select('*')
        .eq('problem_id', problemId)
        .eq('is_hidden', false)
        .eq('language', language.name.toLowerCase());

      if (testCasesError) throw testCasesError;

      if (!testCases || testCases.length === 0) {
        console.error('No test cases found');
        return;
      }

      console.log('Starting code execution with test cases:', testCases);
      
      const { data, error } = await supabase.functions.invoke('execute-code', {
        body: {
          source_code: code,
          language_id: language.id,
          problem_id: problemId,
          test_cases: testCases,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        setExecutionResult({
          status: { id: 0, description: 'Error' },
          stderr: error.message,
          stdout: null,
          compile_output: null,
          message: 'Failed to execute code'
        });
        setActiveTab('result');
        return;
      }

      console.log('Execution result:', data);
      setExecutionResult(data);
      setActiveTab('result');

      // Save successful submission if all tests passed
      if (data.status?.id === 3) {
        const { error: submissionError } = await supabase
          .from('submissions')
          .insert({
            problem_id: problemId,
            code,
            language: language.name.toLowerCase(),
            status: 'accepted',
            user_id: user.id
          });

        if (submissionError) throw submissionError;
      }
    } catch (error) {
      console.error('Error running code:', error);
      setExecutionResult({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code'
      });
      setActiveTab('result');
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    executionResult,
    activeTab,
    setActiveTab,
    executeCode,
    resetExecution
  };
};