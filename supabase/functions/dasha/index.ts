import { corsHeaders } from "@supabase/supabase-js/cors";

const DASHA_YEARS = [
  { planet: "Ketu", tamil: "கேது", years: 7 },
  { planet: "Venus", tamil: "சுக்கிரன்", years: 20 },
  { planet: "Sun", tamil: "சூரியன்", years: 6 },
  { planet: "Moon", tamil: "சந்திரன்", years: 10 },
  { planet: "Mars", tamil: "செவ்வாய்", years: 7 },
  { planet: "Rahu", tamil: "ராகு", years: 18 },
  { planet: "Jupiter", tamil: "குரு", years: 16 },
  { planet: "Saturn", tamil: "சனி", years: 19 },
  { planet: "Mercury", tamil: "புதன்", years: 17 },
];

const NAKSHATRAS = ["அசுவினி","பரணி","கிருத்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை","மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"];
const NAK_LORDS = [0,3,2,7,8,5,6,1,4, 0,3,2,7,8,5,6,1,4, 0,3,2,7,8,5,6,1,4];
const TOTAL_YEARS = 120;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { dateOfBirth, timeOfBirth, latitude, longitude, timezone } = await req.json();
    const dob = new Date(dateOfBirth);
    const [h, m] = (timeOfBirth || "06:00").split(":").map(Number);
    const utcH = h + m / 60 - (timezone || 5.5);

    const jd = Math.floor(365.25 * (dob.getFullYear() + 4716)) + Math.floor(30.6001 * (dob.getMonth() + 1 + 1)) + dob.getDate() + utcH / 24 - 1524.5;
    const T = (jd - 2451545.0) / 36525;
    const ayanamsa = 23.856 + 0.0138 * T;
    const days = jd - 2451545.0;
    const moonLong = ((218.316 + 13.176396 * days + 6.289 * Math.sin((134.963 + 13.064993 * days) * Math.PI / 180)) - ayanamsa) % 360;
    const ml = moonLong < 0 ? moonLong + 360 : moonLong;

    const nakIdx = Math.floor(ml / (360 / 27));
    const lordIdx = NAK_LORDS[nakIdx];
    const posInNak = (ml % (360 / 27)) / (360 / 27);
    const balance = (1 - posInNak) * DASHA_YEARS[lordIdx].years;

    const periods = [];
    let currentDate = new Date(dob);

    for (let i = 0; i < 9; i++) {
      const idx = (lordIdx + i) % 9;
      const dashaInfo = DASHA_YEARS[idx];
      const years = i === 0 ? balance : dashaInfo.years;
      const startDate = new Date(currentDate);
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + Math.floor(years * 365.25));

      // Sub-periods (Bhukti)
      const subPeriods = [];
      let subStart = new Date(startDate);
      for (let j = 0; j < 9; j++) {
        const subIdx = (idx + j) % 9;
        const subYears = (years * DASHA_YEARS[subIdx].years) / TOTAL_YEARS;
        const subEnd = new Date(subStart);
        subEnd.setDate(subEnd.getDate() + Math.floor(subYears * 365.25));
        subPeriods.push({
          planet: DASHA_YEARS[subIdx].planet,
          tamilName: DASHA_YEARS[subIdx].tamil,
          startDate: subStart.toISOString(),
          endDate: subEnd.toISOString(),
          years: subYears,
        });
        subStart = new Date(subEnd);
      }

      periods.push({
        planet: dashaInfo.planet,
        tamilName: dashaInfo.tamil,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        years,
        subPeriods,
      });

      currentDate = new Date(endDate);
    }

    return new Response(JSON.stringify({ moonNakshatra: NAKSHATRAS[nakIdx], periods }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
