const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RASI_NAMES = ["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];
const RASI_EN = ["Mesha","Rishabha","Mithuna","Kataka","Simha","Kanni","Thula","Vrischika","Dhanus","Makara","Kumbha","Meena"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { moonRasi } = await req.json();
    const moonSign = moonRasi || 0;
    const now = new Date();
    const jd = Math.floor((now.getTime() / 86400000) + 2440587.5);
    const days = jd - 2451545.0;

    // Approximate current positions
    const saturnRasi = Math.floor(((50.08 + 0.03336 * days) % 360) / 30);
    const jupiterRasi = Math.floor(((34.35 + 0.08309 * days) % 360) / 30);
    const rahuRasi = Math.floor(((125.04 - 0.05295 * days + 360) % 360) / 30);

    const saturnFromMoon = (saturnRasi - moonSign + 12) % 12;
    const jupiterFromMoon = (jupiterRasi - moonSign + 12) % 12;

    const transits = [
      {
        planet: "Saturn", tamilName: "சனி",
        currentRasi: RASI_EN[saturnRasi], currentRasiTamil: RASI_NAMES[saturnRasi],
        effect: [0,1,11].includes(saturnFromMoon)
          ? "Ezharai Sani period - challenging time requiring patience"
          : saturnFromMoon === 7 ? "Ashtama Sani - health and obstacles"
          : "Neutral transit",
        tamilEffect: [0,1,11].includes(saturnFromMoon)
          ? "ஏழரை சனி காலம் - பொறுமையுடன் செயல்படவும். பரிகாரம் செய்யவும்."
          : saturnFromMoon === 7 ? "அஷ்டம சனி - உடல்நலம் கவனிக்கவும்."
          : "சனி பெயர்ச்சி சாதகமாக உள்ளது.",
        startDate: "2025-01-01", endDate: "2027-06-01",
      },
      {
        planet: "Jupiter", tamilName: "குரு",
        currentRasi: RASI_EN[jupiterRasi], currentRasiTamil: RASI_NAMES[jupiterRasi],
        effect: [1,4,6,8,10].includes(jupiterFromMoon)
          ? "Favorable Jupiter transit - growth and prosperity"
          : "Challenging Jupiter transit - be cautious",
        tamilEffect: [1,4,6,8,10].includes(jupiterFromMoon)
          ? "குரு பெயர்ச்சி சாதகமாக உள்ளது. வளர்ச்சி மற்றும் செழிப்பு உண்டு."
          : "குரு பெயர்ச்சி சவாலாக உள்ளது. கவனமாக செயல்படவும்.",
        startDate: "2025-05-01", endDate: "2026-05-01",
      },
      {
        planet: "Rahu", tamilName: "ராகு",
        currentRasi: RASI_EN[rahuRasi], currentRasiTamil: RASI_NAMES[rahuRasi],
        effect: rahuRasi === moonSign ? "Rahu over Moon sign - mental confusion possible" : "Neutral Rahu transit",
        tamilEffect: rahuRasi === moonSign ? "ராகு உங்கள் ராசியில் உள்ளது. மன குழப்பம் ஏற்படலாம்." : "ராகு பெயர்ச்சி சாதாரணமாக உள்ளது.",
        startDate: "2025-01-01", endDate: "2026-07-01",
      },
    ];

    return new Response(JSON.stringify({ transits }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
