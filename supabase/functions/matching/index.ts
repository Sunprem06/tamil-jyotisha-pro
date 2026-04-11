import { corsHeaders } from "@supabase/supabase-js/cors";

const NAKSHATRAS = ["அசுவினி","பரணி","கிருத்திகை","ரோகிணி","மிருகசீரிஷம்","திருவாதிரை","புனர்பூசம்","பூசம்","ஆயில்யம்","மகம்","பூரம்","உத்திரம்","ஹஸ்தம்","சித்திரை","சுவாதி","விசாகம்","அனுஷம்","கேட்டை","மூலம்","பூராடம்","உத்திராடம்","திருவோணம்","அவிட்டம்","சதயம்","பூரட்டாதி","உத்திரட்டாதி","ரேவதி"];
const RASI_NAMES = ["மேஷம்","ரிஷபம்","மிதுனம்","கடகம்","சிம்மம்","கன்னி","துலாம்","விருச்சிகம்","தனுசு","மகரம்","கும்பம்","மீனம்"];
const YONI = ["குதிரை","யானை","ஆடு","பாம்பு","நாய்","பூனை","எலி","மான்","குரங்கு","எருமை","புலி","மாடு","சிங்கம்"];
const GANA = ["தேவ","மனுஷ்ய","ராக்ஷஸ"];
const VASYA_MAP: Record<number, number[]> = {0:[4],1:[1,11],2:[5],3:[10],4:[0,3],5:[2],6:[6],7:[3],8:[8],9:[9],10:[1],11:[11]};

function getNakFromDob(dob: Date, tz: number): number {
  const jd = Math.floor(365.25*(dob.getFullYear()+4716))+Math.floor(30.6001*(dob.getMonth()+2))+dob.getDate()-1524.5;
  const days = jd - 2451545.0;
  const T = days/36525;
  const ay = 23.856+0.0138*T;
  const ml = ((218.316+13.176396*days+6.289*Math.sin((134.963+13.064993*days)*Math.PI/180))-ay)%360;
  return Math.floor((ml<0?ml+360:ml)/(360/27));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { person1, person2 } = await req.json();
    const nak1 = getNakFromDob(new Date(person1.dateOfBirth), person1.timezone||5.5);
    const nak2 = getNakFromDob(new Date(person2.dateOfBirth), person2.timezone||5.5);
    const rasi1 = Math.floor(nak1 * 30 / (360/12)) % 12;
    const rasi2 = Math.floor(nak2 * 30 / (360/12)) % 12;

    const poruthams = [
      { name: "Dina", tamilName: "தின பொருத்தம்", matched: ((nak2 - nak1 + 27) % 27) % 9 !== 2, score: 0, maxScore: 1 },
      { name: "Gana", tamilName: "கண பொருத்தம்", matched: GANA[nak1%3] === GANA[nak2%3] || GANA[nak1%3] === "தேவ", score: 0, maxScore: 1 },
      { name: "Mahendra", tamilName: "மகேந்திர பொருத்தம்", matched: [4,7,10,13,16,19,22,25].includes((nak2-nak1+27)%27), score: 0, maxScore: 1 },
      { name: "Sthree Dheerga", tamilName: "ஸ்திரீ தீர்க்கம்", matched: (nak2-nak1+27)%27 >= 13, score: 0, maxScore: 1 },
      { name: "Yoni", tamilName: "யோனி பொருத்தம்", matched: YONI[nak1%13] === YONI[nak2%13], score: 0, maxScore: 1 },
      { name: "Rasi", tamilName: "ராசி பொருத்தம்", matched: [2,3,4,6].includes((rasi2-rasi1+12)%12), score: 0, maxScore: 1 },
      { name: "Rasi Athipathi", tamilName: "ராசி அதிபதி", matched: Math.abs(rasi1-rasi2)<=2, score: 0, maxScore: 1 },
      { name: "Vasya", tamilName: "வச்ய பொருத்தம்", matched: VASYA_MAP[rasi1]?.includes(rasi2)||false, score: 0, maxScore: 1 },
      { name: "Rajju", tamilName: "ரஜ்ஜு பொருத்தம்", matched: (nak1%5) !== (nak2%5), score: 0, maxScore: 1 },
      { name: "Vedha", tamilName: "வேதை பொருத்தம்", matched: Math.abs(nak1-nak2)!==6 && Math.abs(nak1-nak2)!==16, score: 0, maxScore: 1 },
    ];

    poruthams.forEach(p => { p.score = p.matched ? 1 : 0; });
    const totalScore = poruthams.reduce((s,p) => s+p.score, 0);
    const percentage = (totalScore/10)*100;

    const result = {
      totalScore, maxScore: 10, percentage, poruthams,
      recommendation: percentage >= 70 ? "நல்ல பொருத்தம்" : percentage >= 50 ? "சுமாரான பொருத்தம்" : "பொருத்தம் குறைவு",
      tamilRecommendation: percentage >= 70 ? "திருமணத்திற்கு மிகவும் நல்ல பொருத்தம்" : percentage >= 50 ? "திருமணம் செய்யலாம், சில பரிகாரங்கள் தேவை" : "பரிகாரங்கள் செய்த பின் திருமணம் செய்யலாம்",
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
