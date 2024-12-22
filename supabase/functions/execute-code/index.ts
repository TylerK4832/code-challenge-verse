import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { twoSumWrapper } from "./problems/twoSum.ts";

const JUDGE0_API_KEY = Deno.env.get('JUDGE0_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_code, language_id, problem_id, test_cases } = await req.json();
    console.log('Received request:', { problem_id, language_id, test_cases });

    // Get the appropriate wrapper based on the problem ID
    let wrapper;
    switch (problem_id) {
      case 'two-sum':
        wrapper = twoSumWrapper;
        break;
      // Add other problem cases here
      default:
        throw new Error(`Unknown problem ID: ${problem_id}`);
    }

    if (!wrapper) {
      throw new Error('Problem wrapper not found');
    }

    // Wrap the code with the test runner
    const wrappedCode = wrapper.wrapCode(
      source_code,
      JSON.stringify(test_cases)
    );

    console.log('Wrapped code:', wrappedCode);

    // Execute the code
    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY || '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        language_id: language_id,
        source_code: wrappedCode,
        stdin: '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Judge0 API error: ${response.statusText}`);
    }

    const { token } = await response.json();
    
    // Wait for the result
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get the execution result
    const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JUDGE0_API_KEY || '',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
    });

    if (!resultResponse.ok) {
      throw new Error(`Judge0 API error: ${resultResponse.statusText}`);
    }

    const result = await resultResponse.json();
    console.log('Execution result:', result);

    // Parse the test results from stdout
    let testResults = [];
    let logs = [];

    if (result.stdout) {
      const lines = result.stdout.split('\n');
      for (const line of lines) {
        if (line.startsWith('WRAPPER_RESULTS')) {
          testResults = JSON.parse(line.replace('WRAPPER_RESULTS ', ''));
        } else if (line.startsWith('WRAPPER_LOGS')) {
          logs = JSON.parse(line.replace('WRAPPER_LOGS ', ''));
        }
      }
    }

    // Determine overall status
    const status = testResults.every((test: any) => test.passed)
      ? { id: 3, description: 'Accepted' }
      : { id: 4, description: 'Wrong Answer' };

    return new Response(
      JSON.stringify({
        status,
        test_results: testResults,
        stdout: logs.length > 0 ? logs.map((log: any) => `Test ${log.testIndex + 1}: ${log.message}`).join('\n') : null,
        stderr: result.stderr,
        compile_output: result.compile_output,
        message: result.message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: 'Failed to execute code'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});