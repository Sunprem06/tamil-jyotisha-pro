const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TITHIS = ["பிரதமை","துவிதியை","திருதியை","சதுர்த்தி","பஞ்சமி","சஷ்டி","சப்தமி","அஷ்டமி","நவமி","தசமி","ஏகாதசி","துவாதசி","திரயோதசி","சதுர்த்தசி","பௌர்ணமி","பிரதமை","துவிதியை","திருதியை","சதுர்த்தி","பஞ்சமி","சஷ்டி","சப்தமி","அஷ்டமி","நவமி","தசமி","ஏகாதசி","துவாதசி","திரயோதசி","சதுர்த்தசி","அமாவாசை"];
const NAKSHATRAS = ["அசுவினி","பரணி","கிருத்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை","மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"];
const YOGAS = ["விஷ்கம்பம்","ப்ரீதி","ஆயுஷ்மான்","சௌபாக்யம்","சோபனம்","அதிகண்டம்","சுகர்மா","த்ருதி","சூலம்","கண்டம்","வ்ருத்தி","த்ருவம்","வ்யாகாதம்","ஹர்ஷணம்","வஜ்ரம்","சித்தி","வ்யதீபாதம்","வரீயான்","பரிகம்","சிவம்","சித்தம்","சாத்யம்","சுபம்","சுக்லம்","ப்ரம்மம்","ஐந்திரம்","வைத்ருதி"];
const KARANAS = ["பவம்","பாலவம்","கௌலவம்","தைதுலம்","கரம்","வணிஜம்","விஷ்டி","சகுனி","சதுஷ்பாதம்","நாகவம்","கிம்ஸ்துக்னம்"];
const DAYS_TA = ["ஞாயிறு","திங்கள்","செவ்வாய்","புதன்","வியாழன்","வெள்ளி","சனி"];
const TAMIL_MONTHS = ["சித்திரை","வைகாசி","ஆனி","ஆடி","ஆவணி","புரட்டாசி","ஐப்பசி","கார்த்திகை","மார்கழி","தை","மாசி","பங்குனி"];

function formatTime(h: number, m: number) {
  return `${String(Math.floor(h)).padStart(2,'0')}:${String(Math.floor(m)).padStart(2,'0')}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { date, latitude, longitude, timezone } = await req.json();
    const d = date ? new Date(date) : new Date();
    const lat = latitude || 13.0827;
    const tz = timezone || 5.5;

    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
    const sunriseH = 6 + (lat - 13) * 0.02 + Math.sin(dayOfYear * Math.PI / 182.5) * 0.5;
    const sunsetH = 18 - (lat - 13) * 0.02 - Math.sin(dayOfYear * Math.PI / 182.5) * 0.3;
    const dayLen = sunsetH - sunriseH;
    const segment = dayLen / 8;

    const dayIdx = d.getDay();
    const rahuOrder = [7, 1, 6, 4, 5, 3, 2];
    const yamaOrder = [4, 3, 2, 1, 7, 6, 5];
    const gulOrder = [6, 5, 4, 3, 2, 1, 7];

    const rahuStart = sunriseH + rahuOrder[dayIdx] * segment;
    const yamaStart = sunriseH + yamaOrder[dayIdx] * segment;
    const gulStart = sunriseH + gulOrder[dayIdx] * segment;

    const jd = Math.floor((d.getTime() / 86400000) + 2440587.5);
    const tithiIdx = Math.floor(((jd * 12.19) % 30));
    const nakIdx = Math.floor(((jd * 13.176) % 27));
    const yogaIdx = Math.floor(((jd * 0.98 + jd * 13.17) % 27));
    const karanaIdx = Math.floor(((jd * 2) % 11));

    const tamilMonthIdx = (d.getMonth() + 8) % 12;

    const panchangam = {
      date: d.toISOString().split('T')[0],
      day: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][dayIdx],
      tamilDay: DAYS_TA[dayIdx],
      tithi: TITHIS[tithiIdx] || TITHIS[0],
      tithiTamil: TITHIS[tithiIdx] || TITHIS[0],
      nakshatra: NAKSHATRAS[nakIdx],
      nakshatraTamil: NAKSHATRAS[nakIdx],
      yoga: YOGAS[yogaIdx],
      yogaTamil: YOGAS[yogaIdx],
      karana: KARANAS[karanaIdx],
      karanaTamil: KARANAS[karanaIdx],
      sunrise: formatTime(Math.floor(sunriseH), (sunriseH % 1) * 60),
      sunset: formatTime(Math.floor(sunsetH), (sunsetH % 1) * 60),
      moonrise: formatTime(Math.floor(sunriseH + 6 + tithiIdx * 0.8), ((sunriseH + 6 + tithiIdx * 0.8) % 1) * 60),
      rahuKalam: `${formatTime(Math.floor(rahuStart), (rahuStart % 1) * 60)} - ${formatTime(Math.floor(rahuStart + segment), ((rahuStart + segment) % 1) * 60)}`,
      yamagandam: `${formatTime(Math.floor(yamaStart), (yamaStart % 1) * 60)} - ${formatTime(Math.floor(yamaStart + segment), ((yamaStart + segment) % 1) * 60)}`,
      gulikai: `${formatTime(Math.floor(gulStart), (gulStart % 1) * 60)} - ${formatTime(Math.floor(gulStart + segment), ((gulStart + segment) % 1) * 60)}`,
      tamilMonth: TAMIL_MONTHS[tamilMonthIdx],
      tamilYear: "விகாரி",
    };

    return new Response(JSON.stringify(panchangam), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
