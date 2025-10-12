import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const kenyanLocations = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi', 
  'Kitale', 'Garissa', 'Kakamega', 'Machakos', 'Meru', 'Nyeri', 'Kericho',
  'Embu', 'Migori', 'Homa Bay', 'Bungoma', 'Voi', 'Webuye'
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop, city } = await req.json();
    
    if (!crop) {
      return new Response(JSON.stringify({ error: 'Crop parameter is required' }), {
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

    console.log(`Fetching market prices for crop: ${crop}${city ? ` in ${city}` : ''}`);

    // Filter locations based on city parameter or use all
    const targetLocations = city 
      ? kenyanLocations.filter(loc => loc.toLowerCase() === city.toLowerCase())
      : kenyanLocations.slice(0, 12);

    const locationContext = city 
      ? `Focus specifically on ${city} and nearby markets.`
      : `across major Kenyan markets including: ${targetLocations.join(', ')}.`;

    const systemPrompt = `You are a Kenyan agricultural market intelligence expert with deep knowledge of local farming markets, pricing trends, and crop trading across Kenya. Provide accurate, realistic market data for farmers.`;

    const userPrompt = `Provide current market prices for ${crop} ${locationContext}

Consider:
- Regional price variations based on proximity to markets
- Seasonal factors affecting supply and demand
- Transportation costs affecting rural vs urban prices
- Current market trends in Kenya
- Quality grades commonly used in Kenyan markets
${city ? `- Specific market conditions and price dynamics in ${city}` : ''}

Provide data for at least ${city ? '3-5 markets in the area' : '8-12 different locations'}.`;

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
            name: 'provide_market_prices',
            description: 'Provide market price data for agricultural crops across Kenyan markets',
            parameters: {
              type: 'object',
              properties: {
                prices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      location: { type: 'string', description: 'Kenyan city or town name' },
                      market: { type: 'string', description: 'Market name (e.g., Wakulima Market, Gikomba Market)' },
                      price: { type: 'number', description: 'Price in Kenyan Shillings' },
                      unit: { type: 'string', description: 'Unit of measurement (kg, bag, etc.)' },
                      trend: { type: 'string', enum: ['up', 'down', 'stable'], description: 'Price trend' },
                      change: { type: 'string', description: 'Percentage change (e.g., +5%, -3%)' },
                      quality: { type: 'string', enum: ['Grade A', 'Grade B', 'Mixed'], description: 'Produce quality grade' },
                      availability: { type: 'string', enum: ['High', 'Medium', 'Low'], description: 'Current availability' }
                    },
                    required: ['location', 'market', 'price', 'unit', 'trend', 'change', 'quality', 'availability']
                  }
                }
              },
              required: ['prices']
            }
          }
        }],
        tool_choice: { type: 'function', function: { name: 'provide_market_prices' } }
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
      
      return new Response(JSON.stringify({ error: 'Failed to fetch market data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Lovable AI response:', JSON.stringify(data, null, 2));

    let marketData = [];

    if (data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments) {
      try {
        const toolResult = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
        marketData = toolResult.prices || [];
        console.log('Parsed market data from tool call:', marketData);
      } catch (parseError) {
        console.error('Error parsing tool call response:', parseError);
      }
    }

    // Fallback if no data
    if (!marketData || marketData.length === 0) {
      console.log('No market data returned, using fallback');
      marketData = [
        {
          location: "Nairobi",
          market: "Wakulima Market",
          price: 45,
          unit: "kg",
          trend: "stable",
          change: "0%",
          quality: "Grade A",
          availability: "High"
        },
        {
          location: "Mombasa",
          market: "Kongowea Market",
          price: 50,
          unit: "kg",
          trend: "up",
          change: "+10%",
          quality: "Grade B",
          availability: "Medium"
        }
      ];
    }

    console.log('Final market data:', marketData);

    return new Response(JSON.stringify({ 
      crop,
      prices: marketData,
      lastUpdated: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-market-prices function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});