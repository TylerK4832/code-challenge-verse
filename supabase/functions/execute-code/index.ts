import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'
import { getLanguageWrapper, isResponseEncoded } from './languageRegistry.ts';
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

    const languageConfig = getLanguageWrapper(language_id);
    if (!languageConfig) {
      throw new Error(`Unsupported language ID: ${language_id}`);
    }

    console.log(`Using ${languageConfig.name} wrapper for language ID ${language_id}`);

    const testCodeList = test_cases.map((testCase: any) => testCase.code);
    const wrappedCode = languageConfig.wrapper.wrapCode(source_code, testCodeList);

    console.log('Submitting wrapped code to Judge0:\n', wrappedCode);

    // Enhanced compiler options for C++
    const compilerOptions = language_id === 54 ? {
      compiler_options: "-std=c++17 -fexec-charset=UTF-8 -finput-charset=UTF-8"
    } : {};

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
    const isBase64Encoded = languageConfig.base64;

    while (attempts < maxAttempts) {
      const getResponse = await fetch(
        `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=${isBase64Encoded}&fields=status_id,stdout,stderr,compile_output,message,status`,
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

      if (result.status?.id >= 3) break;

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Decode base64 outputs if necessary
    if (isBase64Encoded) {
      if (result.stdout) result.stdout = atob(result.stdout);
      if (result.stderr) result.stderr = atob(result.stderr);
      if (result.compile_output) result.compile_output = atob(result.compile_output);
      console.log('Decoded submission result:', result);
    }

    // Handle errors
    if (result.stderr || result.compile_output) {
      // Convert error messages to ASCII
      const errorMessage = (result.stderr || result.compile_output || '')
        .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
        .replace(/\u00E2|\u0080|\u009C|\u009D/g, '"') // Replace UTF-8 quote marks
        .replace(/\u00C3|\u00A2/g, ''); // Remove other problematic characters

      return new Response(
        JSON.stringify({
          status: { id: 4, description: 'Error' },
          stderr: errorMessage,
          stdout: null,
          compile_output: null,
          message: null,
          test_results: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse execution output
    const { testResults, logs } = parseExecutionOutput(result.stdout);

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
    const finalTestResults = testResults.map((result: any, index: number) => ({
      ...result,
      code: test_cases[index]?.code,
      stdout: logs
        .filter(log => log.testIndex === index)
        .map(log => log.message)
        .join('\n')
    }));

    const allPassed = finalTestResults.every((r: any) => r.passed === true);

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