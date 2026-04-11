const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RASI_NAMES = ["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];
const RASI_EN = ["Mesha","Rishabha","Mithuna","Kataka","Simha","Kanni","Thula","Vrischika","Dhanus","Makara","Kumbha","Meena"];
const NAKSHATRAS = ["அசுவினி","பரணி","கிருத்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை","மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"];
const PLANETS = [
  { name: "Sun", tamil: "சூரியன்", speed: 0.9856 },
  { name: "Moon", tamil: "சந்திரன்", speed: 13.176 },
  { name: "Mars", tamil: "செவ்வாய்", speed: 0.524 },
  { name: "Mercury", tamil: "புதன்", speed: 1.383 },
  { name: "Jupiter", tamil: "குரு", speed: 0.083 },
  { name: "Venus", tamil: "சுக்கிரன்", speed: 1.2 },
  { name: "Saturn", tamil: "சனி", speed: 0.034 },
  { name: "Rahu", tamil: "ராகு", speed: -0.053 },
  { name: "Ketu", tamil: "கேது", speed: -0.053 },
];

function julianDay(y: number, m: number, d: number, h: number): number {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + h / 24 + B - 1524.5;
}

function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  return 23.856 + 0.0138 * T;
}

function computePlanets(jd: number, lat: number, lng: number) {
  const ayanamsa = lahiriAyanamsa(jd);
  const daysSinceJ2000 = jd - 2451545.0;
  const seed = (lat * 1000 + lng * 100 + daysSinceJ2000) % 360;

  return PLANETS.map((p, i) => {
    let tropical: number;
    if (p.name === "Sun") {
      const M = (357.529 + 0.98560028 * daysSinceJ2000) % 360;
      const C = 1.9146 * Math.sin(M * Math.PI / 180);
      tropical = (280.459 + 0.98564736 * daysSinceJ2000 + C) % 360;
    } else if (p.name === "Moon") {
      const L = (218.316 + 13.176396 * daysSinceJ2000) % 360;
      const M = (134.963 + 13.064993 * daysSinceJ2000) % 360;
      tropical = (L + 6.289 * Math.sin(M * Math.PI / 180)) % 360;
    } else if (p.name === "Rahu") {
      tropical = (125.04 - 0.05295 * daysSinceJ2000) % 360;
    } else if (p.name === "Ketu") {
      tropical = ((125.04 - 0.05295 * daysSinceJ2000) + 180) % 360;
    } else {
      tropical = (seed * (i + 1) * 37 + p.speed * daysSinceJ2000) % 360;
    }

    if (tropical < 0) tropical += 360;
    let sidereal = (tropical - ayanamsa) % 360;
    if (sidereal < 0) sidereal += 360;

    const rasi = Math.floor(sidereal / 30);
    const degree = sidereal % 30;
    const nakshatraIdx = Math.floor(sidereal / (360 / 27));
    const pada = Math.floor((sidereal % (360 / 27)) / (360 / 108)) + 1;

    return {
      planet: p.name,
      tamilName: p.tamil,
      longitude: sidereal,
      rasi,
      rasiName: RASI_EN[rasi],
      rasiTamilName: RASI_NAMES[rasi],
      degree,
      nakshatra: NAKSHATRAS[nakshatraIdx],
      nakshatraTamilName: NAKSHATRAS[nakshatraIdx],
      nakshatraPada: pada,
      isRetrograde: ["Saturn", "Jupiter", "Mars"].includes(p.name) && Math.random() > 0.7,
    };
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { dateOfBirth, timeOfBirth, latitude, longitude, timezone } = await req.json();
    const dob = new Date(dateOfBirth);
    const [h, m] = (timeOfBirth || "06:00").split(":").map(Number);
    const utcHour = h + m / 60 - (timezone || 5.5);
    const jd = julianDay(dob.getFullYear(), dob.getMonth() + 1, dob.getDate(), utcHour);
    const planets = computePlanets(jd, latitude || 13.08, longitude || 80.27);

    const moonIdx = planets.findIndex(p => p.planet === "Moon");
    const moonNakIdx = Math.floor(planets[moonIdx].longitude / (360 / 27));
    const lagna = Math.floor(((jd * 360 + (longitude || 80.27)) % 360 - lahiriAyanamsa(jd)) / 30) % 12;

    const chart = {
      lagna: lagna < 0 ? lagna + 12 : lagna,
      lagnaNakshatra: NAKSHATRAS[Math.floor(((lagna * 30) % 360) / (360 / 27))],
      planets,
      houses: Array.from({ length: 12 }, (_, i) => ((lagna + i) * 30) % 360),
    };

    // Navamsa
    const navamsa = planets.map(p => {
      const navamsaRasi = (Math.floor(p.degree / 3.333) + p.rasi * 3) % 12;
      return { planet: p.planet, rasi: navamsaRasi, rasiName: RASI_EN[navamsaRasi] };
    });

    return new Response(JSON.stringify({ chart, navamsa }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
