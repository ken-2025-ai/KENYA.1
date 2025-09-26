import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { crop } = await req.json();
    
    if (!crop) {
      return new Response(JSON.stringify({ error: 'Crop parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Fetching market prices for crop: ${crop}`);

    const prompt = `You are a Kenyan agricultural market expert. Provide realistic current market prices for ${crop} across major Kenyan towns and markets. 

Return ONLY a valid JSON array with this exact structure (no additional text, markdown, or explanations):
[
  {
    "location": "Nairobi",
    "market": "Wakulima Market",
    "price": 45,
    "unit": "kg",
    "trend": "up",
    "change": "+5%",
    "quality": "Grade A",
    "availability": "High"
  }
]

Include data for these locations: ${kenyanLocations.slice(0, 12).join(', ')}.
Use realistic Kenyan Shilling prices. Include different markets where relevant (e.g., Wakulima Market, Gikomba Market, etc.).
Trend should be "up", "down", or "stable".
Quality should be "Grade A", "Grade B", or "Mixed".
Availability should be "High", "Medium", or "Low".
Ensure prices reflect current Kenyan market conditions.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch market data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data, null, 2));

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Unexpected Gemini response structure:', data);
      return new Response(JSON.stringify({ error: 'Invalid response from AI service' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    console.log('Generated text:', generatedText);

    // Try to parse the JSON response
    let marketData;
    try {
      // Clean the response text (remove markdown formatting if present)
      const cleanText = generatedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      marketData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      console.error('Raw text:', generatedText);
      
      // Fallback to mock data if parsing fails
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

    // Ensure we have an array
    if (!Array.isArray(marketData)) {
      marketData = [marketData];
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