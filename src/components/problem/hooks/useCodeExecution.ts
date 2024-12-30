import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { executeCode } from "@/services/codeExecution";
import { useToast } from "@/components/ui/use-toast";

export const useCodeExecution = (problemId: string | undefined) => {
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const { toast } = useToast();

  const runCode = async (code: string, language: string) => {
    if (!code || !language || !problemId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing required parameters",
      });
      return;
    }

    setIsRunning(true);
    setExecutionResult(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Authentication required",
        });
        return;
      }

      const result = await executeCode(code, language === 'javascript' ? 63 : 71, problemId);
      console.log('Execution result:', result);
      setExecutionResult(result);

      if (result.status?.id === 3) {
        const { error: submissionError } = await supabase
          .from('submissions')
          .insert({
            problem_id: problemId,
            code,
            language: language.toLowerCase(),
            status: 'accepted',
            user_id: user.id
          });

        if (submissionError) throw submissionError;
      }
    } catch (error) {
      console.error('Error running code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    executionResult,
    runCode
  };
};