import { supabase } from "@/integrations/supabase/client";
import { ExecutionResult } from "@/types/editor";

export const executeCode = async (
  code: string,
  languageId: number,
  problemId: string
): Promise<ExecutionResult> => {
  try {
    const { data: testCases, error: testCasesError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('problem_id', problemId)
      .eq('is_hidden', false)
      .eq('language', languageId === 63 ? 'javascript' : 'python');

    if (testCasesError) throw testCasesError;

    if (!testCases || testCases.length === 0) {
      throw new Error('No test cases found');
    }

    console.log('Starting code execution with test cases:', testCases);
    
    const { data, error } = await supabase.functions.invoke('execute-code', {
      body: {
        source_code: code,
        language_id: languageId,
        problem_id: problemId,
        test_cases: testCases,
      },
    });

    if (error) {
      console.error('Edge function error:', error);
      return {
        status: { id: 4, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code'
      };
    }

    return data;
  } catch (error: any) {
    console.error('Error running code:', error);
    return {
      status: { id: 0, description: 'Error' },
      stderr: error.message,
      stdout: null,
      compile_output: null,
      message: 'Failed to execute code'
    };
  }
};