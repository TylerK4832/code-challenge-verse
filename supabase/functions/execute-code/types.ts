export interface SubmissionRequest {
  source_code: string;
  language_id: number;
  stdin: string;
  expected_output: string;
  problem_id: string;
}

export interface ProblemWrapper {
  wrapCode: (code: string, stdin: string) => string;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};