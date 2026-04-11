const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { planets, lagna } = await req.json();

    // Dosha detection
    const doshas = [];
    const mars = planets?.find((p: any) => p.planet === "Mars");
    const rahu = planets?.find((p: any) => p.planet === "Rahu");
    const ketu = planets?.find((p: any) => p.planet === "Ketu");
    const saturn = planets?.find((p: any) => p.planet === "Saturn");
    const sun = planets?.find((p: any) => p.planet === "Sun");

    // Sevvai Dosham
    const marsHouse = mars ? (mars.rasi - (lagna || 0) + 12) % 12 : -1;
    const sevvai = [0, 1, 3, 6, 7, 11].includes(marsHouse);
    doshas.push({
      name: "Mangal Dosha", tamilName: "செவ்வாய் தோஷம்",
      isPresent: sevvai, severity: sevvai ? "moderate" : "none",
      explanation: sevvai ? "Mars is in house " + (marsHouse + 1) : "No Mars dosha",
      tamilExplanation: sevvai ? `செவ்வாய் ${marsHouse + 1}-ம் வீட்டில் உள்ளது. திருமணத்தில் தாமதம் அல்லது சிக்கல் ஏற்படலாம்.` : "செவ்வாய் தோஷம் இல்லை.",
    });

    // Kala Sarpa
    if (rahu && ketu && planets) {
      const rahuRasi = rahu.rasi;
      const ketuRasi = ketu.rasi;
      const allBetween = planets.filter((p: any) => !["Rahu", "Ketu"].includes(p.planet))
        .every((p: any) => {
          const r = p.rasi;
          if (rahuRasi < ketuRasi) return r >= rahuRasi && r <= ketuRasi;
          return r >= rahuRasi || r <= ketuRasi;
        });
      doshas.push({
        name: "Kala Sarpa Yoga", tamilName: "கால சர்ப்ப யோகம்",
        isPresent: allBetween, severity: allBetween ? "severe" : "none",
        explanation: allBetween ? "All planets between Rahu-Ketu axis" : "Not present",
        tamilExplanation: allBetween ? "அனைத்து கிரகங்களும் ராகு-கேது அச்சில் உள்ளன. தீவிர பரிகாரம் தேவை." : "கால சர்ப்ப யோகம் இல்லை.",
      });
    }

    // Rahu-Ketu Dosha
    const rahuHouse = rahu ? (rahu.rasi - (lagna || 0) + 12) % 12 : -1;
    const rahuDosha = [0, 3, 6, 7].includes(rahuHouse);
    doshas.push({
      name: "Rahu-Ketu Dosha", tamilName: "ராகு-கேது தோஷம்",
      isPresent: rahuDosha, severity: rahuDosha ? "mild" : "none",
      explanation: rahuDosha ? "Rahu in challenging house" : "No Rahu-Ketu dosha",
      tamilExplanation: rahuDosha ? "ராகு சவாலான வீட்டில் உள்ளது. பரிகாரம் செய்யவும்." : "ராகு-கேது தோஷம் இல்லை.",
    });

    // Pitru Dosha
    const sunHouse = sun ? (sun.rasi - (lagna || 0) + 12) % 12 : -1;
    const pitru = sunHouse === 8 || (saturn && sun && saturn.rasi === sun.rasi);
    doshas.push({
      name: "Pitru Dosha", tamilName: "பித்ரு தோஷம்",
      isPresent: !!pitru, severity: pitru ? "moderate" : "none",
      explanation: pitru ? "Sun afflicted - ancestral karma indicated" : "No Pitru dosha",
      tamilExplanation: pitru ? "சூரியன் பாதிக்கப்பட்டுள்ளது. மூதாதையர் கர்மா சுட்டிக்காட்டப்படுகிறது." : "பித்ரு தோஷம் இல்லை.",
    });

    // Yoga detection
    const yogas = [];
    const jupiter = planets?.find((p: any) => p.planet === "Jupiter");
    const moon = planets?.find((p: any) => p.planet === "Moon");
    const venus = planets?.find((p: any) => p.planet === "Venus");

    // Raja Yoga
    const jupHouse = jupiter ? (jupiter.rasi - (lagna || 0) + 12) % 12 : -1;
    const raja = [0, 3, 6, 9].includes(jupHouse);
    yogas.push({
      name: "Raja Yoga", tamilName: "ராஜ யோகம்",
      isPresent: raja,
      explanation: raja ? "Jupiter in angular house" : "Not present",
      tamilExplanation: raja ? "குரு கேந்திர வீட்டில் உள்ளது. அதிகாரம் மற்றும் புகழ் கிடைக்கும்." : "ராஜ யோகம் இல்லை.",
    });

    // Dhana Yoga
    const venusHouse = venus ? (venus.rasi - (lagna || 0) + 12) % 12 : -1;
    const dhana = venusHouse === 1 || venusHouse === 10;
    yogas.push({
      name: "Dhana Yoga", tamilName: "தன யோகம்",
      isPresent: dhana,
      explanation: dhana ? "Venus in wealth house" : "Not present",
      tamilExplanation: dhana ? "சுக்கிரன் செல்வ வீட்டில் உள்ளது. நிதி வளம் உண்டு." : "தன யோகம் இல்லை.",
    });

    // Chandra-Mangal Yoga
    const chandraMangal = moon && mars && moon.rasi === mars.rasi;
    yogas.push({
      name: "Chandra-Mangal Yoga", tamilName: "சந்திர-செவ்வாய் யோகம்",
      isPresent: !!chandraMangal,
      explanation: chandraMangal ? "Moon conjunct Mars" : "Not present",
      tamilExplanation: chandraMangal ? "சந்திரனும் செவ்வாயும் இணைந்துள்ளன. செல்வமும் தைரியமும் உண்டு." : "சந்திர-செவ்வாய் யோகம் இல்லை.",
    });

    return new Response(JSON.stringify({ doshas, yogas }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
