import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FORMATTING_RULES = `

RESPONSE FORMATTING RULES (VERY IMPORTANT):
- Keep answers SHORT and SUMMARIZED - aim for 3-5 sentences max per section unless more detail is truly needed
- Get straight to the point - no lengthy introductions
- Respond only in plain text
- Do NOT use Markdown formatting
- Do NOT use bold text or asterisks (**)
- Do NOT use special characters or symbols for formatting
- Use simple hyphens (-) for lists when needed
- Use numbered lists (1. 2. 3.) when appropriate
- Keep writing clear, simple, and professional
- If listing items, limit to 3-5 most important points per section`;

const systemPrompt = `You are "AgroPlanner Pro," a highly trained Agricultural Extension Officer and Agronomist specializing in regional crop suitability, seasonal calendar planning, seed selection, planting guides, nutrient schedules, pest/disease management, and farmer advisory for Kenya.

Your job is to generate personalized, region-specific crop plans that are scientifically accurate, practical, and easy for a farmer to follow.

YOUR CONVERSATION STYLE:
- Talk like a real, friendly agricultural expert having a conversation
- Use simple language any farmer can understand
- Be practical and actionable
- Consider local conditions, markets, and resources

WHEN THE FARMER PROVIDES A LOCATION, GENERATE:

1. TOP 10 BEST-PERFORMING CROPS FOR THE REGION
For each crop provide:
- Crop name
- Suitability score (0-100)
- Best season to plant
- Required rainfall and soil type
- Maturity period
- Expected yield per acre

2. SEED SELECTION GUIDE
For top 5 crops provide:
- Recommended seed variety names
- Certified seed suppliers in Kenya
- Disease-resistant or drought-tolerant varieties
- Expected yield

3. PLANTING CALENDAR
- Month-by-month planting guide
- Long rains (March-May) recommendations
- Short rains (October-December) recommendations

4. FARMER GUIDE FOR TOP 3 CROPS
Each guide should include:
- Land preparation steps
- Planting spacing and seed rate
- Fertilizer schedule (basal + top-dressing)
- Irrigation needs
- Common pests and diseases with control methods
- Harvesting signs and timing
- Post-harvest handling

5. CHEMICAL RECOMMENDATIONS
For pest/disease control:
- Safe, commonly available chemicals in Kenya
- Application rates
- Pre-harvest intervals
- Safety precautions

6. YOUTUBE VIDEO RECOMMENDATION
For each of the top 3 crops, suggest ONE relevant YouTube training video:
- Format: "Training Video: [Title] - https://www.youtube.com/watch?v=[video_id]"
- Must be practical farmer training content

REGIONAL KNOWLEDGE:
- Consider Kenya's agro-ecological zones
- Long rains: March-May, Short rains: October-December
- Highland areas: tea, coffee, dairy
- Rift Valley: maize, wheat, pyrethrum
- Western: sugarcane, maize
- Central: coffee, tea, vegetables
- Coast: coconut, cashew, mangoes
- Eastern: drought-tolerant crops, livestock

ALWAYS:
- Be extremely accurate with seasons, spacing, fertilizers
- Mention local seed suppliers when possible
- Consider market demand and profitability
- Warn against counterfeit seeds
- Recommend certified seeds

${FORMATTING_RULES}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, county, farmingType } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Add context about the selected region
    let contextualPrompt = systemPrompt;
    if (county) {
      contextualPrompt += `\n\nThe farmer is from ${county} County, Kenya.`;
    }
    if (farmingType) {
      contextualPrompt += ` They practice ${farmingType} farming.`;
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: contextualPrompt },
          ...messages
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI service error');
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error) {
    console.error('Crop planner error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
