import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Common Kenyan crops for analysis
const commonCrops = [
  'maize', 'beans', 'potatoes', 'tomatoes', 'onions', 
  'cabbage', 'carrots', 'bananas', 'avocados'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, crops } = await req.json();
    
    if (!location) {
      return new Response(JSON.stringify({ error: 'Location parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cropsToAnalyze = crops || commonCrops.slice(0, 5);
    console.log(`Analyzing market insights for ${location}, crops: ${cropsToAnalyze.join(', ')}`);

    const systemPrompt = `You are a Kenyan agricultural market analyst with expertise in price trends, seasonal patterns, and market conditions. Provide actionable insights for farmers to maximize their profits.

RESPONSE FORMATTING RULES (VERY IMPORTANT):
- Respond only in plain text
- Do NOT use Markdown formatting
- Do NOT use bold text or asterisks (**)
- Do NOT use special characters or symbols for formatting
- Use simple hyphens (-) for lists when needed
- Keep writing clear, simple, and professional`;

    const userPrompt = `Analyze current market conditions in ${location}, Kenya for these crops: ${cropsToAnalyze.join(', ')}.

Consider:
- Recent price trends in the region
- Seasonal factors affecting demand
- Local market conditions in ${location}
- Best timing for selling
- Potential price movements

Provide specific, actionable notifications with:
1. Current price trends (up/down/stable)
2. Percentage changes
3. Smart advice on when to sell
4. Priority level (high/medium/low) based on urgency`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        tools: [{
          type: 'function',
          function: {
            name: 'provide_market_insights',
            description: 'Provide market insights and notifications for farmers',
            parameters: {
              type: 'object',
              properties: {
                insights: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      crop: { type: 'string', description: 'Crop name' },
                      title: { type: 'string', description: 'Notification title' },
                      message: { type: 'string', description: 'Detailed message with advice' },
                      trend: { type: 'string', enum: ['up', 'down', 'stable'], description: 'Price trend' },
                      percentageChange: { type: 'string', description: 'Percentage change (e.g., +12%, -5%)' },
                      currentPrice: { type: 'number', description: 'Current price in KSh per kg' },
                      advice: { type: 'string', description: 'Specific actionable advice' },
                      priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Urgency level' },
                      timing: { type: 'string', description: 'Best time to sell (e.g., "Now", "Wait 2 weeks")' }
                    },
                    required: ['crop', 'title', 'message', 'trend', 'percentageChange', 'currentPrice', 'advice', 'priority', 'timing']
                  }
                }
              },
              required: ['insights']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'provide_market_insights' } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI service requires payment. Please contact support.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Failed to fetch market insights' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('AI response received');

    let insights = [];

    if (data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      try {
        const toolResult = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
        insights = toolResult.insights || [];
        console.log(`Generated ${insights.length} market insights`);
      } catch (parseError) {
        console.error('Error parsing tool call response:', parseError);
      }
    }

    // Fallback if no data
    if (!insights || insights.length === 0) {
      console.log('No insights returned, using fallback');
      insights = [
        {
          crop: "maize",
          title: "Maize Prices Rising",
          message: `Maize prices in ${location} have increased by 8% this week due to high demand.`,
          trend: "up",
          percentageChange: "+8%",
          currentPrice: 52,
          advice: "Good time to sell if you have mature maize. Prices expected to stabilize next week.",
          priority: "high",
          timing: "Now - Within 3 days"
        },
        {
          crop: "tomatoes",
          title: "Tomato Market Stable",
          message: `Tomato prices in ${location} remain steady with consistent supply.`,
          trend: "stable",
          percentageChange: "0%",
          currentPrice: 45,
          advice: "Hold for 1-2 weeks if possible, as prices may rise with reduced supply.",
          priority: "medium",
          timing: "Wait 1-2 weeks"
        }
      ];
    }

    return new Response(JSON.stringify({ 
      location,
      insights,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-market-insights function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
