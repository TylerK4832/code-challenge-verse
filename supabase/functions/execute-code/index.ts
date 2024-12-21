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

    // If there's any error output, return it
    if (result.stderr || result.compile_output) {
      return new Response(
        JSON.stringify({
          status: { id: 4, description: 'Error' },
          stderr: result.stderr || result.compile_output,
          stdout: null,
          compile_output: null,
          message: null,
          test_results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Now handle the stdout
    if (result.stdout) {
      // The wrapper script should output at least two lines:
      // 1) "WRAPPER_RESULTS <JSON>"
      // 2) "WRAPPER_LOGS <JSON>" (optional for your usage, but included in our wrapper)
      const lines = result.stdout.split('\n').filter((line) => line.trim() !== '');

      // We'll store parsed results/logs here
      let wrapperResults = null;
      let wrapperLogs = null;

      // Regex to match lines: WRAPPER_RESULTS <json>, WRAPPER_LOGS <json>
      const resultsRegex = /^WRAPPER_RESULTS\s+(.*)$/;
      const logsRegex = /^WRAPPER_LOGS\s+(.*)$/;

      for (const line of lines) {
        if (resultsRegex.test(line)) {
          const match = line.match(resultsRegex);
          if (match && match[1]) {
            try {
              wrapperResults = JSON.parse(match[1]);
            } catch (err) {
              console.error('Error parsing WRAPPER_RESULTS JSON:', err);
            }
          }
        } else if (logsRegex.test(line)) {
          const match = line.match(logsRegex);
          if (match && match[1]) {
            try {
              wrapperLogs = JSON.parse(match[1]);
            } catch (err) {
              console.error('Error parsing WRAPPER_LOGS JSON:', err);
            }
          }
        }
      }

      // If we didn't find WRAPPER_RESULTS or it wasn't valid JSON, that's an error
      if (!wrapperResults) {
        return new Response(
          JSON.stringify({
            status: { id: 4, description: 'Error' },
            stderr: 'No valid WRAPPER_RESULTS found in stdout',
            stdout: result.stdout,
            compile_output: null,
            message: null,
            test_results: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If valid, let's interpret them as an array of test outcomes
      // e.g. [ { input, expected, actual, passed }, ... ]
      if (!Array.isArray(wrapperResults)) {
        return new Response(
          JSON.stringify({
            status: { id: 4, description: 'Error' },
            stderr: 'WRAPPER_RESULTS is not an array',
            stdout: result.stdout,
            compile_output: null,
            message: null,
            test_results: []
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Determine if all test cases passed
      const allPassed = wrapperResults.every((r: any) => r.passed === true);

      // Build final test_results array
      // We'll keep an index correlation to your "test_cases" from the request
      const finalTestResults = wrapperResults.map((r: any, index: number) => ({
        passed: r.passed,
        input: test_cases[index]?.input,
        expected_output: test_cases[index]?.expected_output,
        // Some wrappers store the actual in r.actual, or r.output, etc.
        actual_output: JSON.stringify(r.actual ?? r.output),
        error: r.error || null
      }));

      // Return the final response
      return new Response(
        JSON.stringify({
          status: {
            id: allPassed ? 3 : 4,
            description: allPassed ? 'Accepted' : 'Wrong Answer'
          },
          stdout: null, // Or store the original stdout if you prefer
          stderr: null,
          compile_output: null,
          message: null,
          logs: wrapperLogs || [],      // Expose logs if you want
          test_results: finalTestResults
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If we got here, no stdout or stderr means something went wrong
    return new Response(
      JSON.stringify({
        status: { id: 4, description: 'Error' },
        stderr: 'No output received from code execution',
        stdout: null,
        compile_output: null,
        message: null,
        test_results: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({
        status: { id: 0, description: 'Error' },
        stderr: error.message,
        stdout: null,
        compile_output: null,
        message: null,
        test_results: []
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
