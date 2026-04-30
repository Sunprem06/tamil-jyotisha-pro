import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ---- Lightweight Porutham (mirrors supabase/functions/matching) ----
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

function calcPorutham(p1: { dob: string }, p2: { dob: string }) {
  const nak1 = getNakFromDob(new Date(p1.dob));
  const nak2 = getNakFromDob(new Date(p2.dob));
  const rasi1 = Math.floor(nak1 * 30 / 30) % 12;
  const rasi2 = Math.floor(nak2 * 30 / 30) % 12;

  const items = [
    { name: "Dina", tamilName: "தின பொருத்தம்", matched: ((nak2 - nak1 + 27) % 27) % 9 !== 2 },
    { name: "Gana", tamilName: "கண பொருத்தம்", matched: GANA[nak1 % 3] === GANA[nak2 % 3] || GANA[nak1 % 3] === "தேவ" },
    { name: "Mahendra", tamilName: "மகேந்திர பொருத்தம்", matched: [4,7,10,13,16,19,22,25].includes((nak2 - nak1 + 27) % 27) },
    { name: "Sthree Dheerga", tamilName: "ஸ்திரீ தீர்க்கம்", matched: (nak2 - nak1 + 27) % 27 >= 13 },
    { name: "Yoni", tamilName: "யோனி பொருத்தம்", matched: YONI[nak1 % 13] === YONI[nak2 % 13] },
    { name: "Rasi", tamilName: "ராசி பொருத்தம்", matched: [2,3,4,6].includes((rasi2 - rasi1 + 12) % 12) },
    { name: "Rasi Athipathi", tamilName: "ராசி அதிபதி", matched: Math.abs(rasi1 - rasi2) <= 2 },
    { name: "Vasya", tamilName: "வச்ய பொருத்தம்", matched: VASYA_MAP[rasi1]?.includes(rasi2) || false },
    { name: "Rajju", tamilName: "ரஜ்ஜு பொருத்தம்", matched: (nak1 % 5) !== (nak2 % 5) },
    { name: "Vedha", tamilName: "வேதை பொருத்தம்", matched: Math.abs(nak1 - nak2) !== 6 && Math.abs(nak1 - nak2) !== 16 },
  ].map((p) => ({ ...p, score: p.matched ? 1 : 0, maxScore: 1 }));

  const score = items.reduce((s, p) => s + p.score, 0);
  return { score, max: 10, breakdown: items };
}

// ---- Preference comparison ----
function ageFromDob(dob: string): number {
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

function comparePreferences(pref: any, candidate: any) {
  const result: Record<string, { matched: boolean; label: string; tamilLabel: string }> = {};
  if (!pref) return { result, score: 0 };

  const age = ageFromDob(candidate.date_of_birth);
  result.age = {
    matched: (!pref.age_min || age >= pref.age_min) && (!pref.age_max || age <= pref.age_max),
    label: `Age ${age} (wanted ${pref.age_min ?? "—"}–${pref.age_max ?? "—"})`,
    tamilLabel: `வயது ${age}`,
  };
  result.height = {
    matched: !candidate.height_cm || ((!pref.height_min || candidate.height_cm >= pref.height_min) && (!pref.height_max || candidate.height_cm <= pref.height_max)),
    label: `Height ${candidate.height_cm ?? "—"} cm`,
    tamilLabel: `உயரம் ${candidate.height_cm ?? "—"} செ.மீ`,
  };
  result.marital_status = {
    matched: !pref.marital_status?.length || pref.marital_status.includes(candidate.marital_status),
    label: `Marital: ${candidate.marital_status}`,
    tamilLabel: `திருமண நிலை: ${candidate.marital_status}`,
  };
  result.mother_tongue = {
    matched: !pref.mother_tongue?.length || pref.mother_tongue.includes(candidate.mother_tongue),
    label: `Mother tongue: ${candidate.mother_tongue}`,
    tamilLabel: `தாய்மொழி: ${candidate.mother_tongue}`,
  };
  result.caste = {
    matched: !pref.caste?.length || (candidate.caste && pref.caste.includes(candidate.caste)),
    label: `Caste: ${candidate.caste ?? "—"}`,
    tamilLabel: `சாதி: ${candidate.caste ?? "—"}`,
  };
  result.education = {
    matched: !pref.education?.length || (candidate.education && pref.education.includes(candidate.education)),
    label: `Education: ${candidate.education ?? "—"}`,
    tamilLabel: `கல்வி: ${candidate.education ?? "—"}`,
  };
  result.occupation = {
    matched: !pref.occupation?.length || (candidate.occupation && pref.occupation.includes(candidate.occupation)),
    label: `Occupation: ${candidate.occupation ?? "—"}`,
    tamilLabel: `தொழில்: ${candidate.occupation ?? "—"}`,
  };
  result.country = {
    matched: !pref.country?.length || pref.country.includes(candidate.country),
    label: `Country: ${candidate.country}`,
    tamilLabel: `நாடு: ${candidate.country}`,
  };
  result.state = {
    matched: !pref.state?.length || (candidate.state && pref.state.includes(candidate.state)),
    label: `State: ${candidate.state ?? "—"}`,
    tamilLabel: `மாநிலம்: ${candidate.state ?? "—"}`,
  };

  const total = Object.keys(result).length;
  const matched = Object.values(result).filter((r) => r.matched).length;
  const score = total ? Math.round((matched / total) * 100) : 0;
  return { result, score };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Load admin config
    const { data: cfgRows } = await supabase
      .from("system_configurations")
      .select("key,value")
      .like("key", "matrimony.%");
    const cfg: Record<string, any> = {};
    cfgRows?.forEach((r) => { cfg[r.key] = r.value; });
    const minPorutham = Number(cfg["matrimony.porutham_min_score"] ?? 6);
    const minPrefPct = Number(cfg["matrimony.preference_min_match_pct"] ?? 40);
    const maxCandidates = Number(cfg["matrimony.auto_match_max_candidates"] ?? 100);

    // Self profile
    const { data: self } = await supabase
      .from("matrimony_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!self) return new Response(JSON.stringify({ error: "Profile not found. Please complete your matrimony profile first." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: prefs } = await supabase
      .from("partner_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const oppGender = self.gender === "male" ? "female" : "male";

    // Candidates
    const { data: candidates } = await supabase
      .from("matrimony_profiles")
      .select("*")
      .eq("gender", oppGender)
      .eq("visibility", "public")
      .neq("user_id", user.id)
      .limit(maxCandidates);

    const matches: any[] = [];
    for (const c of candidates ?? []) {
      const por = calcPorutham({ dob: self.date_of_birth }, { dob: c.date_of_birth });
      if (por.score < minPorutham) continue;
      const pref = comparePreferences(prefs, c);
      if (pref.score < minPrefPct) continue;
      const combined = Math.round(por.score * 5 + pref.score * 0.5); // weighted
      matches.push({
        requester_id: user.id,
        candidate_id: c.user_id,
        porutham_score: por.score,
        porutham_max: por.max,
        porutham_breakdown: por.breakdown,
        preference_match: pref.result,
        preference_score: pref.score,
        combined_score: combined,
      });
    }

    // Upsert (preserve unlock state via on conflict do update on score fields only)
    if (matches.length) {
      const { error: upErr } = await supabase
        .from("auto_matches")
        .upsert(matches, { onConflict: "requester_id,candidate_id", ignoreDuplicates: false });
      if (upErr) console.error("upsert err", upErr);
    }

    return new Response(JSON.stringify({ count: matches.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});