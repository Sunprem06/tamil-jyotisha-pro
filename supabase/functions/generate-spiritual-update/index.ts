import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { category = "general", update_type = "guidance" } = await req.json();

    const typePrompt = update_type === "do_this"
      ? "a positive action the user should do today"
      : update_type === "avoid_this"
      ? "something the user should avoid today"
      : "general spiritual guidance";

    const categoryPrompt = category !== "general" ? ` related to ${category}` : "";

    const prompt = `Create an original Tamil spiritual daily guidance${categoryPrompt}. This should be ${typePrompt}.

Return ONLY a JSON object with these exact fields (all in Tamil):
{
  "title": "short emotional hook (max 50 chars)",
  "message": "2-4 lines spiritual explanation",
  "action": "specific action the person should do",
  "benefit": "expected positive result"
}

Rules:
- All content must be in Tamil language
- Tone must be devotional, positive, and simple Tamil
- Content must be original (not copied from any source)
- Keep it practical and relatable for daily life`;

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.lovable.dev/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a Tamil spiritual content writer. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "";
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
