import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from './types.ts';
import { getProblemWrapper } from './problemRegistry.ts';

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_code, language_id, problem_id, test_cases } = await req.json();
    const problemWrapper = getProblemWrapper(problem_id);

    console.log('Processing test cases:', test_cases);

    // Format test cases for the wrapper:
    // Convert `expected_output` to `expected` for the wrapper to consume.
    const formattedTestCases = test_cases.map((testCase: any) => ({
      input: testCase.input,
      expected: testCase.expected_output
    }));

    // Wrap the user's code with the test execution logic
    const wrappedCode = problemWrapper.wrapCode(
      source_code,
      JSON.stringify(formattedTestCases)
    );

    console.log('Submitting wrapped code to Judge0');

    const createResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': Deno.env.get('JUDGE0_API_KEY') || '',
      },
      body: JSON.stringify({
        source_code: wrappedCode,
        language_id,
        stdin: '',
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Judge0 submission failed: ${await createResponse.text()}`);
    }

    const { token } = await createResponse.json();
    console.log('Submission created with token:', token);

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const getResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/${token}?fields=status_id,stdout,stderr,compile_output,message,status`,
        {
          headers: {
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            'X-RapidAPI-Key': Deno.env.get('JUDGE0_API_KEY') || '',
          },
        }
      );

      if (!getResponse.ok) {
        throw new Error(`Failed to get submission result: ${await getResponse.text()}`);
      }

      result = await getResponse.json();
      console.log('Raw submission result:', result);

      // Check if execution is complete
      if (result.status?.id >= 3) {
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Process results
    if (result.stderr || result.compile_output) {
      return new Response(
        JSON.stringify({
          status: { id: 4, description: 'Error' },
          stderr: result.stderr || result.compile_output,
          test_results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (result.stdout) {
      try {
        // Parse the test results from stdout
        const testResults = JSON.parse(result.stdout);

        // Calculate overall status based on test results
        const allPassed = Array.isArray(testResults) && testResults.every((r: any) => r.passed);

        return new Response(
          JSON.stringify({
            status: {
              id: allPassed ? 3 : 4,
              description: allPassed ? 'Accepted' : 'Wrong Answer'
            },
            test_results: testResults.map((r: any, index: number) => ({
              passed: r.passed,
              input: test_cases[index]?.input,
              expected_output: test_cases[index]?.expected_output,
              actual_output: JSON.stringify(r.output)
            }))
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      } catch (error) {
        console.error('Error processing test results:', error);
        return new Response(
          JSON.stringify({
            status: { id: 4, description: 'Error' },
            stderr: `Error processing test results: ${error.message}`,
            test_results: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    return new Response(
      JSON.stringify({
        status: { id: 4, description: 'Error' },
        stderr: 'No output received from code execution',
        test_results: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to execute code',
        message: error.message,
        status: { id: 0, description: 'Error' },
        stderr: error.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    );
  }
});
