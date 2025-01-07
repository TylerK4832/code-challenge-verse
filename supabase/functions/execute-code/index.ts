import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { wrapCode } from './languageRegistry.ts'

function validateTestCases(testCases: any[]) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error('No test cases provided');
  }

  testCases.forEach((testCase, index) => {
    if (!testCase.code) {
      throw new Error(`Test case ${index + 1} is missing code`);
    }
  });
}

function parseTestOutput(stdout: string | null): { passed: boolean; error?: string }[] {
  if (!stdout) {
    return [{ passed: false, error: 'No output received from program' }];
  }

  try {
    // Split by newline and filter out empty lines
    const lines = stdout.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
      try {
        const result = JSON.parse(line);
        return {
          passed: result.passed === true,
          error: result.error || undefined
        };
      } catch (e) {
        return {
          passed: false,
          error: `Invalid test result format: ${line}`
        };
      }
    });
  } catch (e) {
    return [{
      passed: false,
      error: 'Failed to parse test results'
    }];
  }
}

const JUDGE0_API_KEY = Deno.env.get('JUDGE0_API_KEY')
const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { source_code, language_id, problem_id, test_cases } = await req.json()

    // Validate inputs
    if (!source_code || !language_id || !problem_id || !test_cases) {
      throw new Error('Missing required fields')
    }

    validateTestCases(test_cases)

    // Wrap the code with test cases
    const wrappedCode = wrapCode(source_code, test_cases, language_id)
    if (!wrappedCode) {
      throw new Error('Failed to wrap code with test cases')
    }

    console.log('Submitting code to Judge0:', {
      language_id,
      problem_id,
      test_cases_count: test_cases.length
    });

    // Convert code to base64
    const base64Code = btoa(wrappedCode)

    // Add compiler options for C++ if needed
    const compilerOptions = language_id === 54 ? {
      compiler_options: "-std=c++17"
    } : {}

    // Submit to Judge0
    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=true`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY || '',
      },
      body: JSON.stringify({
        source_code: base64Code,
        language_id,
        ...compilerOptions
      })
    })

    const result = await response.json()
    console.log('Judge0 response:', result);

    // Decode outputs if they exist and are base64 encoded
    const stdout = result.stdout ? atob(result.stdout) : null
    const stderr = result.stderr ? atob(result.stderr) : null
    const compile_output = result.compile_output ? atob(result.compile_output) : null

    // If there's a compilation error or runtime error, return it
    if (compile_output || stderr) {
      return new Response(
        JSON.stringify({
          status: { id: 0, description: 'Error' },
          stdout,
          stderr,
          compile_output,
          message: null,
          test_results: []
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse test results
    const testResults = parseTestOutput(stdout)
    const allTestsPassed = testResults.every(result => result.passed)

    return new Response(
      JSON.stringify({
        status: {
          id: allTestsPassed ? 3 : 4,
          description: allTestsPassed ? 'Accepted' : 'Wrong Answer'
        },
        stdout,
        stderr,
        compile_output,
        message: null,
        test_results: testResults
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code',
        test_results: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})