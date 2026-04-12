import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const UPDATE_TYPES = ["guidance", "do_this", "avoid_this"] as const;
const CATEGORIES = ["general", "money", "family", "health", "spiritual"] as const;
const PALAN_TYPES = ["weekly_palan", "monthly_palan", "yearly_palan"] as const;

function getPromptForType(updateType: string, category: string): string {
  const categoryLabel: Record<string, string> = {
    general: "பொது ஆன்மீகம்",
    money: "பணம் மற்றும் செல்வம்",
    family: "குடும்பம் மற்றும் உறவுகள்",
    health: "உடல்நலம் மற்றும் ஆரோக்கியம்",
    spiritual: "ஆன்மீக வளர்ச்சி",
  };

  const catTamil = categoryLabel[category] || "பொது ஆன்மீகம்";

  if (updateType === "weekly_palan") {
    return `You are an expert Tamil astrologer and spiritual content writer.

Create an ORIGINAL weekly prediction (வார பலன்) for the theme "${catTamil}".
This should feel like a real weekly horoscope prediction from a Tamil astrology magazine.

Return ONLY valid JSON:
{
  "title": "Short catchy Tamil title for this week's prediction (max 60 chars)",
  "message": "3-5 lines of weekly prediction in Tamil covering what this week holds",
  "action": "Specific spiritual action to do this week (puja, mantra, temple visit etc)",
  "benefit": "Expected positive results from following this guidance"
}

Rules:
- ALL content in Tamil language only
- Reference specific days of the week where relevant
- Include planetary influences naturally
- Tone: authoritative yet compassionate, like a trusted jothidar
- Must be 100% original content`;
  }

  if (updateType === "monthly_palan") {
    return `You are an expert Tamil astrologer and spiritual content writer.

Create an ORIGINAL monthly prediction (மாத பலன்) for the theme "${catTamil}".
This should feel like a real monthly horoscope from a Tamil panchangam.

Return ONLY valid JSON:
{
  "title": "Short catchy Tamil title for this month's prediction (max 60 chars)",
  "message": "4-6 lines of monthly prediction in Tamil with detailed guidance",
  "action": "Specific spiritual actions for this month (vratam, temple visits, mantras)",
  "benefit": "Expected positive transformations this month"
}

Rules:
- ALL content in Tamil language only
- Reference Tamil month names and auspicious dates
- Include references to nakshatras and tithis naturally
- Tone: wise and reassuring, like a family astrologer
- Must be 100% original content`;
  }

  if (updateType === "yearly_palan") {
    return `You are an expert Tamil astrologer and spiritual content writer.

Create an ORIGINAL yearly prediction (வருட பலன்) for the theme "${catTamil}".
This should feel like a comprehensive yearly prediction from a respected Tamil jothidam publication.

Return ONLY valid JSON:
{
  "title": "Short powerful Tamil title for the year ahead (max 60 chars)",
  "message": "5-8 lines of yearly prediction in Tamil covering major life themes",
  "action": "Key spiritual practices to follow throughout the year",
  "benefit": "Major positive outcomes expected this year"
}

Rules:
- ALL content in Tamil language only
- Reference the Tamil year name (e.g., குரோதி, விஷு etc)
- Cover career, health, relationships broadly
- Tone: grand and inspiring, like a Panchanga pravachanam
- Must be 100% original content`;
  }

  const typeInstruction: Record<string, string> = {
    guidance: `general spiritual wisdom and guidance for today related to "${catTamil}"`,
    do_this: `a specific positive action the user SHOULD do today related to "${catTamil}"`,
    avoid_this: `something the user should AVOID today related to "${catTamil}"`,
  };

  return `You are an expert Tamil spiritual content writer creating daily guidance.

Create an ORIGINAL daily spiritual update: ${typeInstruction[updateType] || typeInstruction.guidance}.

Return ONLY valid JSON:
{
  "title": "Short emotional Tamil hook (max 50 chars)",
  "message": "2-4 lines spiritual explanation in Tamil",
  "action": "Specific action the person should do today",
  "benefit": "Expected positive result"
}

Rules:
- ALL content in Tamil language only
- Tone: devotional, positive, simple Tamil
- Content must be 100% original
- Keep it practical and relatable for daily life
- Reference Hindu deities, temples, mantras naturally`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // No body = generate all daily updates
    }

    const mode = body.mode || "daily"; // daily | weekly | monthly | yearly | single

    const results: any[] = [];

    if (mode === "single") {
      // Generate a single update
      const updateType = body.update_type || "guidance";
      const category = body.category || "general";
      const result = await generateOne(apiKey, updateType, category);
      if (result) {
        const { error } = await supabase.from("spiritual_updates").insert({
          ...result,
          update_type: updateType,
          category,
          language: "Tamil",
          is_active: true,
        });
        if (error) console.error("Insert error:", error);
        results.push(result);
      }
    } else {
      // Batch generation
      const typesToGenerate =
        mode === "weekly" ? ["weekly_palan"] :
        mode === "monthly" ? ["monthly_palan"] :
        mode === "yearly" ? ["yearly_palan"] :
        [...UPDATE_TYPES]; // daily

      const categoriesToUse = mode === "daily" 
        ? [CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]] // 1 random category for daily
        : [...CATEGORIES]; // all categories for weekly/monthly/yearly

      for (const updateType of typesToGenerate) {
        for (const category of categoriesToUse) {
          try {
            const result = await generateOne(apiKey, updateType, category);
            if (result) {
              const { error } = await supabase.from("spiritual_updates").insert({
                ...result,
                update_type: updateType,
                category,
                language: "Tamil",
                is_active: true,
              });
              if (error) console.error("Insert error:", error);
              else results.push({ ...result, update_type: updateType, category });
            }
            // Small delay to avoid rate limits
            await new Promise((r) => setTimeout(r, 1500));
          } catch (e) {
            console.error(`Error generating ${updateType}/${category}:`, e);
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, generated: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Generation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function generateOne(
  apiKey: string,
  updateType: string,
  category: string
): Promise<{ title: string; message: string; action: string; benefit: string } | null> {
  const prompt = getPromptForType(updateType, category);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are a renowned Tamil astrologer and spiritual guide. You create original, authentic Tamil spiritual content. Always return valid JSON only, no markdown formatting.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error(`AI API error ${response.status}:`, errText);
    if (response.status === 429) {
      console.log("Rate limited, waiting...");
      await new Promise((r) => setTimeout(r, 5000));
    }
    return null;
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content || "";

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Could not parse AI response:", text.substring(0, 200));
    return null;
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.title || !parsed.message || !parsed.action || !parsed.benefit) {
      console.error("Missing fields in parsed result");
      return null;
    }
    return parsed;
  } catch {
    console.error("JSON parse failed");
    return null;
  }
}
