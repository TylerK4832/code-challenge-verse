import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { getLanguageWrapper } from './languageRegistry.ts';
import { parseExecutionOutput } from './utils/outputParser.ts';

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_code, language_id, problem_id, test_cases } = await req.json();
    
    if (!source_code || !language_id || !problem_id || !test_cases) {
      throw new Error('Missing required parameters');
    }

    // Get the appropriate language wrapper
    const languageConfig = getLanguageWrapper(language_id);
    if (!languageConfig) {
      throw new Error(`Unsupported language ID: ${language_id}`);
    }

    console.log(`Using ${languageConfig.name} wrapper for language ID ${language_id}`);

    // Format test cases
    const testCodeList = test_cases.map((testCase: any) => testCase.code);

    // Wrap the user's code with the language-specific test execution logic
    const wrappedCode = languageConfig.wrapper.wrapCode(source_code, testCodeList);

    console.log('Submitting wrapped code to Judge0:\n', wrappedCode);

    // Convert code to base64
    const base64Code = btoa(wrappedCode);

    // Add compiler options for C++ if needed
    const compilerOptions = language_id === 54 ? {
      compiler_options: "-std=c++17 -fexec-charset=UTF-8"
    } : {};

    const createResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': Deno.env.get('JUDGE0_API_KEY') || '',
      },
      body: JSON.stringify({
        source_code: base64Code,
        base64_encoded: true,
        language_id,
        stdin: '',
        env_variables: ["LANG=en_US.UTF-8", "LC_ALL=en_US.UTF-8"],
        ...compilerOptions
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
        `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false&fields=status_id,stdout,stderr,compile_output,message,status`,
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

    // Decode base64 outputs if they exist and are not null
    // if (result.stdout) {
    //   try {
    //     result.stdout = atob(result.stdout);
    //     console.log('Decoded stdout:', result.stdout);
    //   } catch (error) {
    //     console.error('Error decoding stdout:', error);
    //   }
    // }
    // if (result.stderr) {
    //   try {
    //     result.stderr = atob(result.stderr);
    //   } catch (error) {
    //     console.error('Error decoding stderr:', error);
    //   }
    // }
    // if (result.compile_output) {
    //   try {
    //     result.compile_output = atob(result.compile_output);
    //   } catch (error) {
    //     console.error('Error decoding compile_output:', error);
    //   }
    // }

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

    // Parse the execution output
    const { testResults, logs } = parseExecutionOutput(result.stdout);

    // If we didn't find valid test results, return an error
    if (!testResults) {
      return new Response(
        JSON.stringify({
          status: { id: 4, description: 'Error' },
          stderr: 'No valid test results found in output',
          stdout: result.stdout,
          compile_output: null,
          message: null,
          test_results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Associate logs with test results
    const finalTestResults = testResults.map((result: any, index: number) => {
      const testLogs = logs
        .filter(log => log.testIndex === index)
        .map(log => log.message);

      return {
        ...result,
        code: test_cases[index]?.code,
        stdout: testLogs.length > 0 ? testLogs.join('\n') : undefined
      };
    });

    // Determine if all test cases passed
    const allPassed = finalTestResults.every((r: any) => r.passed === true);

    // Return the final response
    return new Response(
      JSON.stringify({
        status: {
          id: allPassed ? 3 : 4,
          description: allPassed ? 'Accepted' : 'Wrong Answer'
        },
        stdout: null,
        stderr: null,
        compile_output: null,
        message: null,
        test_results: finalTestResults
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