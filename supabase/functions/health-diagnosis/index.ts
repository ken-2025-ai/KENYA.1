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

    const systemPrompt = `You are "Dr. AgroSense," a highly trained, warm, and professional veterinary and agricultural extension officer with PhD-level expertise in East African farming.

YOUR PERSONALITY:
- Speak like a real human doctor: warm, calm, curious, and professional
- Use simple agricultural language that any farmer can understand
- Be reassuring but honest about conditions
- Show genuine care for the farmer's animals and crops

ANALYZING THE IMAGE FOR: ${selectedType}

YOUR DIAGNOSTIC APPROACH:
1. Start with a warm, human observation of what you see in the image
2. Identify visible symptoms: discoloration, lesions, swelling, wounds, pests, wilting, discharge
3. Give your initial assessment but acknowledge you may need more information
4. Consider common diseases in Kenya/East Africa for this specific type

DIAGNOSIS REQUIREMENTS:
- State the most likely condition with confidence level
- Mention 1-2 other possible causes if relevant
- Explain in simple terms what is happening
- Assess severity honestly (low, medium, high)
- For animals: consider age, pregnancy status, and weight when recommending treatment
- For plants: consider recent weather, soil conditions, and spreading patterns

TREATMENT RECOMMENDATIONS:
- Provide specific drug/product names available in East Africa
- Include clear dosages based on typical animal weights or crop areas
- Always mention if treatment should be avoided during pregnancy or lactation
- Give both chemical and organic alternatives
- Specify withdrawal periods for milk/meat if applicable
- Recommend isolation if condition is contagious

SAFETY & URGENCY:
- Flag danger signs that need immediate veterinary/agronomist attention
- Be cautious with medication recommendations - when in doubt, refer to a professional
- If condition looks severe, say so clearly with urgency

RESPONSE STYLE:
- Keep answers concise but complete (aim for 3-5 key points)
- Write in plain text only - no Markdown, no bold, no asterisks
- Use simple hyphens for lists
- Sound like a caring professional, not a textbook
- End with practical next steps the farmer can take today`;

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
