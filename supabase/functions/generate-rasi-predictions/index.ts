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

    const results = [];

    for (const rasi of RASI_LIST) {
      const prompt = `You are an expert Tamil astrologer. Generate a ${prediction_type} horoscope prediction for ${rasi.tamil} (${rasi.name}) rasi.

Today is ${today}, ${dayName}.
Ruling planet: ${rasi.ruling}, Element: ${rasi.element}.

Generate a UNIQUE, SPECIFIC prediction in Tamil. Return ONLY valid JSON:
{
  "prediction": "3-4 lines of specific Tamil prediction for today including career, relationships, health aspects",
  "career": "1 line career prediction in Tamil",
  "health": "1 line health prediction in Tamil", 
  "love": "1 line love/relationship prediction in Tamil",
  "finance": "1 line finance prediction in Tamil",
  "lucky_number": "a number 1-99",
  "lucky_color": "color name in Tamil"
}

IMPORTANT: Each rasi must get a DIFFERENT, UNIQUE prediction. Be specific, not generic. Use pure Tamil.`;

      const aiResponse = await fetch("https://ai.lovable.dev/api/chat/completions", {
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
        console.error(`AI error for ${rasi.id}:`, await aiResponse.text());
        continue;
      }

      const aiData = await aiResponse.json();
      let content = aiData.choices?.[0]?.message?.content || "";
      
      // Clean markdown wrapping
      content = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      
      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        console.error(`Parse error for ${rasi.id}:`, content);
        continue;
      }

      // Deactivate old predictions of same type/rasi
      await supabase
        .from("rasi_predictions")
        .update({ is_active: false })
        .eq("rasi_id", rasi.id)
        .eq("prediction_type", prediction_type);

      // Insert new prediction
      const { error } = await supabase.from("rasi_predictions").insert({
        rasi_id: rasi.id,
        rasi_name: rasi.tamil,
        prediction_type,
        prediction: parsed.prediction || "",
        career: parsed.career || null,
        health: parsed.health || null,
        love: parsed.love || null,
        finance: parsed.finance || null,
        lucky_number: parsed.lucky_number || null,
        lucky_color: parsed.lucky_color || null,
        generated_date: today,
        is_active: true,
      });

      if (error) console.error(`DB error for ${rasi.id}:`, error);
      else results.push(rasi.id);
    }

    return new Response(
      JSON.stringify({ success: true, generated: results.length, type: prediction_type }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
