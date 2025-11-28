import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, type, selectedType } = await req.json();
    
    if (!image || !type || !selectedType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: image, type, selectedType' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an expert AI Agronomist specializing in East African and global crop & livestock health diagnosis.

Your task is to analyze images of plants or animals and provide accurate, detailed health diagnoses.

ANALYSIS GUIDELINES:
1. Carefully examine all visual symptoms in the image
2. Consider the specific crop/animal type: ${selectedType}
3. Look for disease indicators: discoloration, spots, lesions, deformities, parasites
4. Assess severity based on extent and pattern of symptoms
5. Provide evidence-based recommendations specific to Kenyan/East African context

DIAGNOSIS REQUIREMENTS:
- Be specific and accurate with disease identification
- Explain symptoms clearly for farmers to understand
- Provide both chemical and organic treatment options
- Include preventive measures to avoid recurrence
- Recommend safe, available products in East Africa
- Always specify dosages when applicable
- Flag severity level appropriately

SAFETY RULES:
- Never recommend banned pesticides or harmful chemicals
- If uncertain, provide possible diagnoses and ask for more information
- Always suggest consulting a veterinarian/agronomist for serious cases

RESPONSE FORMATTING RULES (VERY IMPORTANT):
- Keep answers SHORT and SUMMARIZED - be concise and direct
- Respond only in plain text
- Do NOT use Markdown formatting
- Do NOT use bold text or asterisks (**)
- Do NOT use special characters or symbols for formatting
- Use simple hyphens (-) for lists when needed
- Keep writing clear, simple, and professional
- Limit lists to 3-5 most important points`;

    const userPrompt = type === 'plant' 
      ? `Analyze this ${selectedType} plant image for diseases or health issues. Identify any visible problems, explain the cause, and provide comprehensive treatment recommendations including both chemical and organic options suitable for Kenyan farmers.`
      : `Analyze this ${selectedType} animal image for health issues or diseases. Look for visible symptoms, identify the condition, and provide detailed treatment recommendations including medication, dosages, and when to seek veterinary care.`;

    // Call Lovable AI with vision model
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: image } }
            ]
          }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'provide_diagnosis',
            description: 'Provide a structured health diagnosis for a plant or animal',
            parameters: {
              type: 'object',
              properties: {
                disease: {
                  type: 'string',
                  description: 'Name of the identified disease or condition'
                },
                accuracy: {
                  type: 'number',
                  description: 'Confidence level of diagnosis (0-100)',
                  minimum: 0,
                  maximum: 100
                },
                symptoms: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of observed symptoms'
                },
                cause: {
                  type: 'string',
                  description: 'Root cause or pathogen responsible'
                },
                treatment: {
                  type: 'string',
                  description: 'Primary treatment recommendation (chemical/medical)'
                },
                dosage: {
                  type: 'string',
                  description: 'Dosage information if applicable (especially for animals)'
                },
                organicAlternative: {
                  type: 'string',
                  description: 'Organic or natural treatment alternative'
                },
                prevention: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Prevention tips to avoid recurrence'
                },
                recommendedProducts: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific products available in East African markets'
                },
                severityLevel: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Severity of the condition'
                }
              },
              required: ['disease', 'accuracy', 'symptoms', 'cause', 'treatment', 'prevention', 'recommendedProducts', 'severityLevel'],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'provide_diagnosis' } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('AI Response:', JSON.stringify(data, null, 2));

    // Extract diagnosis from tool call
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error('No diagnosis data returned from AI');
    }

    const diagnosis = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ diagnosis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Health diagnosis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Please try again or contact support if the issue persists.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
