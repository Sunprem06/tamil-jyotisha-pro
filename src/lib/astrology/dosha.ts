import type { PlanetPosition, DoshaResult, YogaResult } from './types';

export function detectDoshas(planets: PlanetPosition[], lagna: number): DoshaResult[] {
  const doshas: DoshaResult[] = [];
  
  // 1. Sevvai Dosham (Mangal/Mars Dosha)
  const mars = planets.find(p => p.planet === "Mars");
  if (mars) {
    const marsHouse = ((mars.rasi - lagna + 12) % 12) + 1;
    const mangalDoshaHouses = [1, 2, 4, 7, 8, 12];
    const hasMangalDosha = mangalDoshaHouses.includes(marsHouse);
    
    let severity: DoshaResult['severity'] = 'none';
    if (hasMangalDosha) {
      severity = [7, 8].includes(marsHouse) ? 'severe' : [1, 4].includes(marsHouse) ? 'moderate' : 'mild';
    }
    
    doshas.push({
      name: "Mangal Dosha (Sevvai Dosham)",
      tamilName: "செவ்வாய் தோஷம்",
      isPresent: hasMangalDosha,
      severity,
      explanation: hasMangalDosha
        ? `Mars is placed in the ${marsHouse}${getOrdinal(marsHouse)} house from Lagna, indicating Mangal Dosha. This may cause delays or challenges in marriage.`
        : "Mars is not placed in houses 1, 2, 4, 7, 8, or 12 from Lagna. No Mangal Dosha.",
      tamilExplanation: hasMangalDosha
        ? `செவ்வாய் லக்னத்திலிருந்து ${marsHouse}-ஆவது வீட்டில் உள்ளார். இது செவ்வாய் தோஷத்தைக் குறிக்கிறது. திருமணத்தில் தாமதம் அல்லது சிக்கல்கள் ஏற்படலாம்.`
        : "செவ்வாய் 1, 2, 4, 7, 8, 12 ஆகிய வீடுகளில் இல்லை. செவ்வாய் தோஷம் இல்லை.",
    });
  }
  
  // 2. Kala Sarpa Dosha
  const rahu = planets.find(p => p.planet === "Rahu");
  const ketu = planets.find(p => p.planet === "Ketu");
  if (rahu && ketu) {
    const rahuLong = rahu.longitude;
    const ketuLong = ketu.longitude;
    
    const otherPlanets = planets.filter(p => !["Rahu", "Ketu"].includes(p.planet));
    const allOnOneSide = otherPlanets.every(p => {
      const pLong = p.longitude;
      if (rahuLong < ketuLong) {
        return pLong >= rahuLong && pLong <= ketuLong;
      } else {
        return pLong >= rahuLong || pLong <= ketuLong;
      }
    });
    
    doshas.push({
      name: "Kala Sarpa Dosha",
      tamilName: "கால சர்ப்ப தோஷம்",
      isPresent: allOnOneSide,
      severity: allOnOneSide ? 'severe' : 'none',
      explanation: allOnOneSide
        ? "All planets are hemmed between Rahu and Ketu, forming Kala Sarpa Dosha. This can cause sudden ups and downs in life."
        : "Planets are not all positioned between Rahu and Ketu. No Kala Sarpa Dosha.",
      tamilExplanation: allOnOneSide
        ? "அனைத்து கிரகங்களும் ராகு-கேதுவிற்கு இடையே உள்ளன. கால சர்ப்ப தோஷம் உள்ளது. வாழ்க்கையில் திடீர் ஏற்ற இறக்கங்கள் ஏற்படலாம்."
        : "கிரகங்கள் ராகு-கேதுவிற்கு இடையே இல்லை. கால சர்ப்ப தோஷம் இல்லை.",
    });
  }
  
  // 3. Rahu-Ketu Dosha
  if (rahu) {
    const rahuHouse = ((rahu.rasi - lagna + 12) % 12) + 1;
    const rahuDosha = [1, 5, 7, 9].includes(rahuHouse);
    
    doshas.push({
      name: "Rahu Dosha",
      tamilName: "ராகு தோஷம்",
      isPresent: rahuDosha,
      severity: rahuDosha ? (rahuHouse === 7 ? 'severe' : 'moderate') : 'none',
      explanation: rahuDosha
        ? `Rahu is placed in the ${rahuHouse}${getOrdinal(rahuHouse)} house, indicating Rahu Dosha. This may cause confusion and obstacles.`
        : "Rahu is well placed. No significant Rahu Dosha.",
      tamilExplanation: rahuDosha
        ? `ராகு ${rahuHouse}-ஆவது வீட்டில் உள்ளார். ராகு தோஷம் உள்ளது. குழப்பங்களும் தடைகளும் ஏற்படலாம்.`
        : "ராகு நல்ல நிலையில் உள்ளார். குறிப்பிடத்தக்க ராகு தோஷம் இல்லை.",
    });
  }
  
  // 4. Pitru Dosha
  const sun = planets.find(p => p.planet === "Sun");
  if (sun && rahu) {
    const sunRahuConjunction = Math.abs(sun.longitude - rahu.longitude) < 15 ||
                                Math.abs(sun.longitude - rahu.longitude) > 345;
    const sunHouse = ((sun.rasi - lagna + 12) % 12) + 1;
    const pitruDosha = sunRahuConjunction || sunHouse === 9;
    
    doshas.push({
      name: "Pitru Dosha",
      tamilName: "பித்ரு தோஷம்",
      isPresent: pitruDosha,
      severity: pitruDosha ? (sunRahuConjunction ? 'severe' : 'mild') : 'none',
      explanation: pitruDosha
        ? "Sun is afflicted by Rahu or placed in the 9th house, indicating Pitru Dosha. Ancestral karmic debts may need to be resolved."
        : "No significant Pitru Dosha detected.",
      tamilExplanation: pitruDosha
        ? "சூரியன் ராகுவால் பாதிக்கப்பட்டுள்ளார் அல்லது 9-ஆவது வீட்டில் உள்ளார். பித்ரு தோஷம் உள்ளது. முன்னோர் கர்ம கடன்கள் தீர்க்கப்பட வேண்டும்."
        : "குறிப்பிடத்தக்க பித்ரு தோஷம் இல்லை.",
    });
  }
  
  return doshas;
}

export function detectYogas(planets: PlanetPosition[], lagna: number): YogaResult[] {
  const yogas: YogaResult[] = [];
  
  const getPlanet = (name: string) => planets.find(p => p.planet === name);
  const getHouse = (p: PlanetPosition) => ((p.rasi - lagna + 12) % 12) + 1;
  
  // 1. Raja Yoga - Lords of trine (1,5,9) and kendra (1,4,7,10) in conjunction or exchange
  const jupiter = getPlanet("Jupiter");
  const venus = getPlanet("Venus");
  const sun = getPlanet("Sun");
  const moon = getPlanet("Moon");
  
  if (jupiter && sun) {
    const jupHouse = getHouse(jupiter);
    const sunHouse = getHouse(sun);
    const kendras = [1, 4, 7, 10];
    const trines = [1, 5, 9];
    const isRajaYoga = (kendras.includes(jupHouse) && trines.includes(sunHouse)) ||
                        (trines.includes(jupHouse) && kendras.includes(sunHouse));
    
    yogas.push({
      name: "Raja Yoga",
      tamilName: "ராஜ யோகம்",
      isPresent: isRajaYoga,
      explanation: isRajaYoga
        ? "Jupiter and Sun are well placed in kendras and trines, forming Raja Yoga. This indicates power, authority, and success."
        : "Raja Yoga conditions are not met in this chart.",
      tamilExplanation: isRajaYoga
        ? "குரு மற்றும் சூரியன் கேந்திர-திரிகோண வீடுகளில் நன்கு அமர்ந்துள்ளனர். ராஜ யோகம் உள்ளது. அதிகாரம், வெற்றி மற்றும் புகழ் கிடைக்கும்."
        : "ராஜ யோக நிபந்தனைகள் இந்த ஜாதகத்தில் பூர்த்தியாகவில்லை.",
    });
  }
  
  // 2. Dhana Yoga
  if (jupiter && venus) {
    const jupHouse = getHouse(jupiter);
    const venHouse = getHouse(venus);
    const dhanaHouses = [2, 5, 9, 11];
    const isDhanaYoga = dhanaHouses.includes(jupHouse) && dhanaHouses.includes(venHouse);
    
    yogas.push({
      name: "Dhana Yoga",
      tamilName: "தன யோகம்",
      isPresent: isDhanaYoga,
      explanation: isDhanaYoga
        ? "Jupiter and Venus in wealth houses indicate Dhana Yoga - prosperity and financial abundance."
        : "Dhana Yoga conditions not found.",
      tamilExplanation: isDhanaYoga
        ? "குரு மற்றும் சுக்கிரன் செல்வ வீடுகளில் உள்ளனர். தன யோகம் உள்ளது. பொருளாதார செழிப்பு கிடைக்கும்."
        : "தன யோக நிபந்தனைகள் இல்லை.",
    });
  }
  
  // 3. Chandra-Mangal Yoga
  const mars = getPlanet("Mars");
  if (moon && mars) {
    const conjunct = Math.abs(moon.longitude - mars.longitude) < 15;
    
    yogas.push({
      name: "Chandra-Mangal Yoga",
      tamilName: "சந்திர-செவ்வாய் யோகம்",
      isPresent: conjunct,
      explanation: conjunct
        ? "Moon and Mars are in conjunction, forming Chandra-Mangal Yoga. This gives courage, wealth, and determination."
        : "Moon and Mars are not in conjunction.",
      tamilExplanation: conjunct
        ? "சந்திரனும் செவ்வாயும் இணைந்துள்ளனர். சந்திர-செவ்வாய் யோகம் உள்ளது. தைரியம், செல்வம் மற்றும் உறுதி கிடைக்கும்."
        : "சந்திரனும் செவ்வாயும் இணையவில்லை.",
    });
  }
  
  // 4. Neecha Bhanga Raja Yoga
  const saturn = getPlanet("Saturn");
  if (saturn) {
    // Saturn debilitated in Aries (rasi 0), if Mars (Aries lord) is in kendra
    const satDebilitated = saturn.rasi === 0;
    if (mars && satDebilitated) {
      const marsHouse = getHouse(mars);
      const isNBRY = [1, 4, 7, 10].includes(marsHouse);
      
      yogas.push({
        name: "Neecha Bhanga Raja Yoga",
        tamilName: "நீச பங்க ராஜ யோகம்",
        isPresent: isNBRY,
        explanation: isNBRY
          ? "Debilitated Saturn's lord (Mars) is in a kendra, cancelling the debilitation and forming a powerful yoga."
          : "Neecha Bhanga conditions not met.",
        tamilExplanation: isNBRY
          ? "நீச சனியின் ராசி நாதன் செவ்வாய் கேந்திரத்தில் உள்ளார். நீசம் பங்கமாகி ராஜ யோகம் உருவாகிறது."
          : "நீச பங்க நிபந்தனைகள் பூர்த்தியாகவில்லை.",
      });
    }
  }
  
  return yogas;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
