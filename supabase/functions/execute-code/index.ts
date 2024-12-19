import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, SubmissionRequest } from './types.ts';
import { getProblemWrapper } from './problemRegistry.ts';

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_code, language_id, stdin, expected_output, problem_id } = await req.json() as SubmissionRequest;

    const problemWrapper = getProblemWrapper(problem_id);
    const wrappedCode = problemWrapper.wrapCode(source_code, stdin);

    console.log('Submitting code to Judge0:', {
      problem_id,
      stdin,
      expected_output,
    });

    // Create submission
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
        stdin: '', // We're now handling input in the wrapped code
        expected_output,
      }),
    });

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Judge0 submission creation failed:', errorText);
      throw new Error(`Failed to create submission: ${errorText}`);
    }

    const { token } = await createResponse.json();
    console.log('Submission created with token:', token);

    // Wait for the result
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
        const errorText = await getResponse.text();
        console.error('Judge0 submission retrieval failed:', errorText);
        throw new Error(`Failed to get submission result: ${errorText}`);
      }

      result = await getResponse.json();
      console.log('Submission status:', result);

      if (result.status?.id >= 3) { // Status is completed
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Compare the output with expected output
    if (result.stdout) {
      const actualOutput = result.stdout.trim();
      const expectedOutput = expected_output.trim();
      
      if (actualOutput === expectedOutput) {
        result.status = { id: 3, description: 'Accepted' };
      } else {
        result.status = { id: 4, description: 'Wrong Answer' };
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