export interface Language {
  id: number;
  name: string;
  defaultCode: string;
}

export interface ExecutionResult {
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