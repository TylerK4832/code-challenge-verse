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

    // Format test cases for the wrapper
    const formattedTestCases = test_cases.map(testCase => ({
      input: testCase.input,
      expected: testCase.expected_output
    }));

    // Wrap the user's code with our test execution logic
    const wrappedCode = problemWrapper.wrapCode(
      source_code,
      JSON.stringify(formattedTestCases)
    );

    console.log('Submitting wrapped code to Judge0');

    // Submit to Judge0
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
      console.log('Submission status:', result);

      if (result.status?.id >= 3) {
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Process results
    if (result.stdout) {
      try {
        // Split output into individual test case results
        const outputs = result.stdout.trim().split('\n');
        
        // Match results with test cases
        const testResults = test_cases.map((testCase, index) => {
          const output = outputs[index];
          let passed = false;
          
          try {
            // For Two Sum problem, we need to compare arrays
            const expectedOutput = JSON.parse(testCase.expected_output);
            const actualOutput = output === 'null' ? null : JSON.parse(output);
            
            if (actualOutput === null) {
              passed = false;
            } else {
              // Sort both arrays before comparing to allow for different orderings
              passed = JSON.stringify(expectedOutput.sort()) === JSON.stringify(actualOutput.sort());
            }
          } catch (error) {
            console.error('Error comparing outputs:', error);
            passed = false;
          }

          return {
            passed,
            input: testCase.input,
            expected_output: testCase.expected_output,
            actual_output: output
          };
        });

        // Set overall status based on all test results
        const allPassed = testResults.every(result => result.passed);
        result.status = {
          id: allPassed ? 3 : 4,
          description: allPassed ? 'Accepted' : 'Wrong Answer'
        };
        result.test_results = testResults;
      } catch (error) {
        console.error('Error processing test results:', error);
        result.status = { id: 0, description: 'Error' };
        result.stderr = 'Error processing test results: ' + error.message;
      }
    }

    return new Response(
      JSON.stringify(result),
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