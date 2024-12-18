import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com";
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubmissionRequest {
  source_code: string;
  language_id: number; // 63 for JavaScript
  stdin: string;
  expected_output: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { source_code, language_id, stdin, expected_output } = await req.json() as SubmissionRequest;

    console.log('Creating submission:', { language_id, stdin });

    // Create submission
    const createResponse = await fetch(`${JUDGE0_API_URL}/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key': Deno.env.get('JUDGE0_API_KEY') || '',
      },
      body: JSON.stringify({
        source_code,
        language_id,
        stdin,
        expected_output,
      }),
    });

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

      result = await getResponse.json();
      console.log('Submission status:', result.status?.description);

      if (result.status_id >= 3) { // Status is completed
        break;
      }

      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('Error executing code:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to execute code' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 },
    );
  }
})