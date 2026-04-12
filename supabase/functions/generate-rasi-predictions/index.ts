import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RASI_LIST = [
  { id: "mesham", name: "Aries", tamil: "மேஷம்", ruling: "Mars", element: "Fire" },
  { id: "rishabam", name: "Taurus", tamil: "ரிஷபம்", ruling: "Venus", element: "Earth" },
  { id: "mithunam", name: "Gemini", tamil: "மிதுனம்", ruling: "Mercury", element: "Air" },
  { id: "kadagam", name: "Cancer", tamil: "கடகம்", ruling: "Moon", element: "Water" },
  { id: "simmam", name: "Leo", tamil: "சிம்மம்", ruling: "Sun", element: "Fire" },
  { id: "kanni", name: "Virgo", tamil: "கன்னி", ruling: "Mercury", element: "Earth" },
  { id: "thulam", name: "Libra", tamil: "துலாம்", ruling: "Venus", element: "Air" },
  { id: "viruchigam", name: "Scorpio", tamil: "விருச்சிகம்", ruling: "Mars", element: "Water" },
  { id: "dhanusu", name: "Sagittarius", tamil: "தனுசு", ruling: "Jupiter", element: "Fire" },
  { id: "magaram", name: "Capricorn", tamil: "மகரம்", ruling: "Saturn", element: "Earth" },
  { id: "kumbam", name: "Aquarius", tamil: "கும்பம்", ruling: "Saturn", element: "Air" },
  { id: "meenam", name: "Pisces", tamil: "மீனம்", ruling: "Jupiter", element: "Water" },
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prediction_type = "daily" } = await req.json().catch(() => ({}));

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split("T")[0];
    const tamilDays = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];
    const dayName = tamilDays[new Date().getDay()];

    // Generate ALL 12 rasi predictions in a single AI call
    const prompt = `You are an expert Tamil astrologer. Generate ${prediction_type} horoscope predictions for ALL 12 rasis for ${today} (${dayName}).

Return ONLY valid JSON array with exactly 12 objects, one per rasi in this order:
மேஷம் (Aries), ரிஷபம் (Taurus), மிதுனம் (Gemini), கடகம் (Cancer), சிம்மம் (Leo), கன்னி (Virgo), துலாம் (Libra), விருச்சிகம் (Scorpio), தனுசு (Sagittarius), மகரம் (Capricorn), கும்பம் (Aquarius), மீனம் (Pisces)

Each object must have:
{
  "prediction": "3-4 lines of specific Tamil prediction covering career, relationships, health",
  "career": "1 line career prediction in Tamil",
  "health": "1 line health prediction in Tamil",
  "love": "1 line love/relationship prediction in Tamil",
  "finance": "1 line finance prediction in Tamil",
  "lucky_number": "a number 1-99",
  "lucky_color": "color name in Tamil"
}

CRITICAL: Each rasi MUST have a completely DIFFERENT prediction. Use pure, simple Tamil. Be specific with dates, numbers, and practical advice. No generic content.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`AI error: ${errText}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let predictions: any[];
    try {
      predictions = JSON.parse(content);
    } catch {
      throw new Error("Failed to parse AI response");
    }

    if (!Array.isArray(predictions) || predictions.length < 12) {
      throw new Error(`Expected 12 predictions, got ${predictions?.length || 0}`);
    }

    // Deactivate old predictions
    await supabase
      .from("rasi_predictions")
      .update({ is_active: false })
      .eq("prediction_type", prediction_type)
      .eq("is_active", true);

    // Insert all 12 predictions
    const inserts = RASI_LIST.map((rasi, i) => ({
      rasi_id: rasi.id,
      rasi_name: rasi.tamil,
      prediction_type,
      prediction: predictions[i]?.prediction || "",
      career: predictions[i]?.career || null,
      health: predictions[i]?.health || null,
      love: predictions[i]?.love || null,
      finance: predictions[i]?.finance || null,
      lucky_number: predictions[i]?.lucky_number || null,
      lucky_color: predictions[i]?.lucky_color || null,
      generated_date: today,
      is_active: true,
    }));

    const { error } = await supabase.from("rasi_predictions").insert(inserts);
    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, generated: 12, type: prediction_type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
