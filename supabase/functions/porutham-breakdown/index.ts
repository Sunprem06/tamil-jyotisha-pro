import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// 27 Tamil nakshatra names
const NAK_TAMIL = [
  "அஸ்வினி","பரணி","கார்த்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்",
  "மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை",
  "மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி",
];
const RASI_TAMIL = ["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];
const GANA = ["தேவ", "மனுஷ்ய", "ராக்ஷஸ"];
const YONI = ["குதிரை","யானை","ஆடு","பாம்பு","நாய்","பூனை","எலி","மான்","குரங்கு","எருமை","புலி","மாடு","சிங்கம்"];
const VASYA_MAP: Record<number, number[]> = {0:[4],1:[1,11],2:[5],3:[10],4:[0,3],5:[2],6:[6],7:[3],8:[8],9:[9],10:[1],11:[11]};

function getNakFromDob(dob: Date): number {
  const jd = Math.floor(365.25 * (dob.getFullYear() + 4716)) +
             Math.floor(30.6001 * (dob.getMonth() + 2)) + dob.getDate() - 1524.5;
  const days = jd - 2451545.0;
  const T = days / 36525;
  const ay = 23.856 + 0.0138 * T;
  const ml = ((218.316 + 13.176396 * days + 6.289 * Math.sin((134.963 + 13.064993 * days) * Math.PI / 180)) - ay) % 360;
  return Math.floor((ml < 0 ? ml + 360 : ml) / (360 / 27));
}

function fullPorutham(dob1: string, dob2: string) {
  const nak1 = getNakFromDob(new Date(dob1));
  const nak2 = getNakFromDob(new Date(dob2));
  const rasi1 = nak1 % 12;
  const rasi2 = nak2 % 12;

  const items = [
    { name: "Dina", tamilName: "தின பொருத்தம்", matched: ((nak2 - nak1 + 27) % 27) % 9 !== 2,
      explain_ta: "ஆயுள், ஆரோக்கியம் — நட்சத்திர இடைவெளி அடிப்படை." },
    { name: "Gana", tamilName: "கண பொருத்தம்", matched: GANA[nak1 % 3] === GANA[nak2 % 3] || GANA[nak1 % 3] === "தேவ",
      explain_ta: "மனப்பான்மை, குணம் ஒத்திசைவு." },
    { name: "Mahendra", tamilName: "மகேந்திர பொருத்தம்", matched: [4,7,10,13,16,19,22,25].includes((nak2 - nak1 + 27) % 27),
      explain_ta: "சந்ததி, செழிப்பு." },
    { name: "Sthree Dheerga", tamilName: "ஸ்திரீ தீர்க்கம்", matched: (nak2 - nak1 + 27) % 27 >= 13,
      explain_ta: "மணமகளுக்கு நீண்ட ஆயுள் & நலம்." },
    { name: "Yoni", tamilName: "யோனி பொருத்தம்", matched: YONI[nak1 % 13] === YONI[nak2 % 13],
      explain_ta: "பருவ ஒத்திசைவு." },
    { name: "Rasi", tamilName: "ராசி பொருத்தம்", matched: [2,3,4,6].includes((rasi2 - rasi1 + 12) % 12),
      explain_ta: "ராசிகளுக்கு இடையேயான தொடர்பு." },
    { name: "Rasi Athipathi", tamilName: "ராசி அதிபதி", matched: Math.abs(rasi1 - rasi2) <= 2,
      explain_ta: "ராசி அதிபதிகள் இடையே நட்பு." },
    { name: "Vasya", tamilName: "வச்ய பொருத்தம்", matched: VASYA_MAP[rasi1]?.includes(rasi2) || false,
      explain_ta: "ஒருவரை ஒருவர் ஆதரிக்கும் தன்மை." },
    { name: "Rajju", tamilName: "ரஜ்ஜு பொருத்தம்", matched: (nak1 % 5) !== (nak2 % 5),
      explain_ta: "மணவாழ்க்கையின் நீடிப்பு." },
    { name: "Vedha", tamilName: "வேதை பொருத்தம்", matched: Math.abs(nak1 - nak2) !== 6 && Math.abs(nak1 - nak2) !== 16,
      explain_ta: "நட்சத்திர இடையே தடை இல்லாமை." },
  ].map((p) => ({ ...p, score: p.matched ? 1 : 0, maxScore: 1 }));

  const score = items.reduce((s, p) => s + p.score, 0);

  return {
    summary: {
      person1: { nakshatra_index: nak1, nakshatra_ta: NAK_TAMIL[nak1], rasi_ta: RASI_TAMIL[rasi1] },
      person2: { nakshatra_index: nak2, nakshatra_ta: NAK_TAMIL[nak2], rasi_ta: RASI_TAMIL[rasi2] },
    },
    score, max: 10, breakdown: items,
    verdict_ta:
      score >= 8 ? "சிறந்த பொருத்தம்" :
      score >= 6 ? "ஏற்கத்தக்க பொருத்தம்" :
      score >= 4 ? "மிதமான பொருத்தம் — ஆலோசகர் கருத்து பெறவும்" :
                   "குறைந்த பொருத்தம்",
    disclaimer_ta: "இது Lahiri Ayanamsa கணக்கீட்டின் அடிப்படையில். இறுதி முடிவுக்கு அனுபவமிக்க ஜோதிடரை அணுகவும்.",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    // Accept either two user_ids OR two raw DOBs
    let dob1: string | null = null;
    let dob2: string | null = null;

    if (body?.dob1 && body?.dob2) {
      dob1 = String(body.dob1);
      dob2 = String(body.dob2);
    } else {
      const userId1 = body?.userId1 ?? user.id;
      const userId2 = body?.userId2;
      if (!userId2) {
        return new Response(JSON.stringify({ error: "userId2 (or dob1+dob2) required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: rows, error } = await supabase
        .from("matrimony_profiles")
        .select("user_id,date_of_birth,visibility")
        .in("user_id", [userId1, userId2]);
      if (error) throw error;
      const p1 = rows?.find((r) => r.user_id === userId1);
      const p2 = rows?.find((r) => r.user_id === userId2);
      if (!p1 || !p2) {
        return new Response(JSON.stringify({ error: "Profile(s) not found" }), {
          status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Allow if requester is one of the two parties OR target profile is public
      if (userId1 !== user.id && userId2 !== user.id && p2.visibility !== "public") {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      dob1 = p1.date_of_birth;
      dob2 = p2.date_of_birth;
    }

    const result = fullPorutham(dob1!, dob2!);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});