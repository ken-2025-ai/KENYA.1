import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOPIC_PROMPTS = {
  'crop-management': `You are an expert agricultural advisor specializing in crop management for Kenyan farmers. 
Provide practical, actionable advice on:
- Crop selection and rotation strategies
- Planting schedules and techniques
- Soil health and fertilization
- Irrigation and water management
- Growth stages and milestones
- Harvest timing and techniques
- Post-harvest handling
- Record keeping for crops

Always consider Kenyan climate, common crops (maize, beans, vegetables, coffee, tea), and local farming practices. 
Keep answers concise, practical, and farmer-friendly. Use simple language and provide specific examples.`,

  'weather-climate': `You are a weather and climate advisor for Kenyan farmers.
Provide practical guidance on:
- Understanding weather patterns in Kenya
- Seasonal farming calendars
- Climate change adaptation strategies
- Rainfall prediction and management
- Drought preparedness
- Flood mitigation
- Temperature effects on crops
- Weather-based decision making
- Using weather forecasts for farming

Focus on the two main rainy seasons (March-May long rains, October-December short rains) and different Kenyan regions.
Keep answers practical and actionable for smallholder farmers.`,

  'pest-control': `You are an integrated pest management expert for Kenyan agriculture.
Provide practical advice on:
- Common crop pests and diseases in Kenya
- Early detection and identification
- Organic and chemical control methods
- Integrated Pest Management (IPM) strategies
- Beneficial insects and natural predators
- Disease prevention and management
- Safe pesticide use and storage
- Economic thresholds for treatment
- Crop-specific pest challenges

Emphasize sustainable, cost-effective solutions suitable for smallholder farmers. Prioritize organic methods when possible.
Keep advice practical and safety-focused.`
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, topic } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    if (!topic || !TOPIC_PROMPTS[topic as keyof typeof TOPIC_PROMPTS]) {
      throw new Error('Valid topic is required (crop-management, weather-climate, pest-control)');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = TOPIC_PROMPTS[topic as keyof typeof TOPIC_PROMPTS];

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
    console.error('Farming assistant error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});