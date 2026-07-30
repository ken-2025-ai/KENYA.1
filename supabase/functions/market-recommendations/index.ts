import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Candidate {
  id: string;
  title: string;
  category: string;
  price_per_unit: number;
  unit: string;
  location: string;
  quantity_available: number;
  distance_km: number | null;
  days_to_expiry: number | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const candidates: Candidate[] = Array.isArray(body?.candidates) ? body.candidates : [];
    const topCategories: string[] = body?.topCategories ?? [];
    const recentTitles: string[] = body?.recentTitles ?? [];
    const avgPrice: number | null = body?.avgPrice ?? null;
    const buyerLocation: string = body?.buyerLocation ?? "Kenya";
    const radiusKm: number = body?.radiusKm ?? 50;

    if (candidates.length === 0) {
      return new Response(JSON.stringify({ recommendations: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!lovableApiKey) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Trim payload for accuracy and cost: score at most 40 nearby candidates.
    const shortlist = candidates.slice(0, 40);

    const systemPrompt = `You are a produce recommendation engine for a Kenyan farm marketplace.
You rank listings for one buyer using their purchase and browsing history, budget, and travel distance.

Ranking rules, in priority order:
1. Relevance to the buyer's demonstrated interests (categories and product names they engaged with, and close substitutes).
2. Proximity: listings inside the buyer's ${radiusKm} km radius are strongly preferred; a listing beyond it must be clearly better on relevance and price to rank at all.
3. Budget fit: prefer prices near the buyer's average spend; flag genuine bargains.
4. Freshness: prefer listings with more days before expiry, but a soon-expiring bargain may rank if it is a strong match.
5. Never invent listings. Only use the provided ids.

Return STRICT JSON only, no markdown, no code fences, in this exact shape:
{"recommendations":[{"id":"<listing id>","score":<0-100 integer>,"reason":"<max 12 words, plain text, no asterisks>"}]}
Include at most 8 items, sorted by score descending. Only include items scoring 45 or above.`;

    const userPrompt = `Buyer location: ${buyerLocation}
Search radius: ${radiusKm} km
Preferred categories (strongest first): ${topCategories.length ? topCategories.join(", ") : "unknown, infer from listings"}
Recently viewed or contacted products: ${recentTitles.length ? recentTitles.join(", ") : "none yet"}
Typical price paid per unit: ${avgPrice ? `KSh ${avgPrice}` : "unknown"}

Listings to rank (JSON):
${JSON.stringify(shortlist)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`AI gateway error [${response.status}]: ${details}`);
      return new Response(
        JSON.stringify({ error: "Recommendation service failed", status: response.status, details }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "{}";

    let parsed: { recommendations?: { id: string; score: number; reason: string }[] } = {};
    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch (e) {
      console.error("Failed to parse AI response:", content);
    }

    const validIds = new Set(shortlist.map((c) => c.id));
    const recommendations = (parsed.recommendations ?? [])
      .filter((r) => r && validIds.has(r.id))
      .slice(0, 8);

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("market-recommendations error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
