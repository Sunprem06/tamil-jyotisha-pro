import { NAKSHATRA_DATA, NAKSHATRA_GANA, NAKSHATRA_YONI, NAKSHATRA_RAJJU, RASI_VASYA, RASI_NAMES } from './constants';
import type { MatchingResult, PoruthamResult } from './types';

export function calculatePorutham(
  boyNakshatra: number,
  boyRasi: number,
  girlNakshatra: number,
  girlRasi: number
): MatchingResult {
  const poruthams: PoruthamResult[] = [];
  
  // 1. Dina Porutham
  const dinaDiff = ((boyNakshatra - girlNakshatra + 27) % 27);
  const dinaRemainder = dinaDiff % 9;
  const dinaMatch = ![2, 4, 6, 8, 0].includes(dinaRemainder) || dinaRemainder === 0;
  poruthams.push({
    name: "Dina Porutham", tamilName: "தின பொருத்தம்",
    matched: dinaMatch, score: dinaMatch ? 1 : 0, maxScore: 1,
    explanation: dinaMatch ? "Stars are compatible for daily harmony." : "Stars indicate some friction in daily life.",
    tamilExplanation: dinaMatch ? "நட்சத்திரங்கள் தினசரி இணக்கத்திற்கு பொருத்தமானவை." : "தினசரி வாழ்க்கையில் சில உரசல்கள் ஏற்படலாம்.",
  });
  
  // 2. Gana Porutham
  const boyGana = NAKSHATRA_GANA[boyNakshatra];
  const girlGana = NAKSHATRA_GANA[girlNakshatra];
  const ganaMatch = boyGana === girlGana || 
    (boyGana === "Deva" && girlGana === "Manushya") ||
    (boyGana === "Manushya" && girlGana === "Deva");
  poruthams.push({
    name: "Gana Porutham", tamilName: "கண பொருத்தம்",
    matched: ganaMatch, score: ganaMatch ? 1 : 0, maxScore: 1,
    explanation: ganaMatch ? "Temperaments are compatible." : "Different temperaments may cause misunderstandings.",
    tamilExplanation: ganaMatch ? "குணங்கள் பொருத்தமானவை." : "வேறுபட்ட குணங்கள் தவறான புரிதலை ஏற்படுத்தலாம்.",
  });
  
  // 3. Mahendra Porutham
  const mahendraDiff = ((boyNakshatra - girlNakshatra + 27) % 27);
  const mahendraMatch = [4, 7, 10, 13, 16, 19, 22, 25].includes(mahendraDiff);
  poruthams.push({
    name: "Mahendra Porutham", tamilName: "மகேந்திர பொருத்தம்",
    matched: mahendraMatch, score: mahendraMatch ? 1 : 0, maxScore: 1,
    explanation: mahendraMatch ? "Ensures prosperity and progeny." : "Mahendra is not matched, but not critical.",
    tamilExplanation: mahendraMatch ? "செழிப்பு மற்றும் சந்ததி உறுதிப்படுத்தப்படுகிறது." : "மகேந்திரம் பொருந்தவில்லை, ஆனால் முக்கியமானது அல்ல.",
  });
  
  // 4. Sthree Dheerga Porutham
  const streedheerga = ((boyNakshatra - girlNakshatra + 27) % 27);
  const sdMatch = streedheerga >= 13;
  poruthams.push({
    name: "Sthree Dheerga Porutham", tamilName: "ஸ்திரீ தீர்க்க பொருத்தம்",
    matched: sdMatch, score: sdMatch ? 1 : 0, maxScore: 1,
    explanation: sdMatch ? "Ensures longevity and well-being of the wife." : "May need remedies for wife's well-being.",
    tamilExplanation: sdMatch ? "மனைவியின் நீண்ட ஆயுளும் நலமும் உறுதிப்படுத்தப்படுகிறது." : "மனைவியின் நலத்திற்கு பரிகாரம் தேவைப்படலாம்.",
  });
  
  // 5. Yoni Porutham
  const boyYoni = NAKSHATRA_YONI[boyNakshatra];
  const girlYoni = NAKSHATRA_YONI[girlNakshatra];
  const yoniMatch = boyYoni?.animal === girlYoni?.animal || 
    (!areEnemyYonis(boyYoni?.animal, girlYoni?.animal));
  poruthams.push({
    name: "Yoni Porutham", tamilName: "யோனி பொருத்தம்",
    matched: yoniMatch, score: yoniMatch ? 1 : 0, maxScore: 1,
    explanation: yoniMatch ? "Physical and sexual compatibility is good." : "Physical compatibility needs attention.",
    tamilExplanation: yoniMatch ? "உடல் மற்றும் தாம்பத்திய இணக்கம் நல்லது." : "உடல் இணக்கத்தில் கவனம் தேவை.",
  });
  
  // 6. Rasi Porutham
  const rasiDiff = ((boyRasi - girlRasi + 12) % 12) + 1;
  const rasiMatch = ![6, 8].includes(rasiDiff);
  poruthams.push({
    name: "Rasi Porutham", tamilName: "ராசி பொருத்தம்",
    matched: rasiMatch, score: rasiMatch ? 1 : 0, maxScore: 1,
    explanation: rasiMatch ? "Moon signs are compatible." : "Moon signs are in 6-8 position, indicating challenges.",
    tamilExplanation: rasiMatch ? "சந்திர ராசிகள் பொருத்தமானவை." : "சந்திர ராசிகள் 6-8 நிலையில் உள்ளன, சவால்களைக் குறிக்கின்றன.",
  });
  
  // 7. Rasi Athipathi Porutham
  const boyLord = getRasiLord(boyRasi);
  const girlLord = getRasiLord(girlRasi);
  const lordMatch = boyLord === girlLord || areFriendlyPlanets(boyLord, girlLord);
  poruthams.push({
    name: "Rasi Athipathi Porutham", tamilName: "ராசி அதிபதி பொருத்தம்",
    matched: lordMatch, score: lordMatch ? 1 : 0, maxScore: 1,
    explanation: lordMatch ? "Sign lords are friendly - good compatibility." : "Sign lords are not friendly.",
    tamilExplanation: lordMatch ? "ராசி நாதர்கள் நட்புடையவர்கள் - நல்ல பொருத்தம்." : "ராசி நாதர்கள் நட்புடையவர்கள் அல்ல.",
  });
  
  // 8. Vasya Porutham
  const vasyaList = RASI_VASYA[girlRasi] || [];
  const vasyaMatch = vasyaList.includes(boyRasi) || boyRasi === girlRasi;
  poruthams.push({
    name: "Vasya Porutham", tamilName: "வச்ய பொருத்தம்",
    matched: vasyaMatch, score: vasyaMatch ? 1 : 0, maxScore: 1,
    explanation: vasyaMatch ? "Mutual attraction and magnetic pull between partners." : "Vasya is not matched.",
    tamilExplanation: vasyaMatch ? "இருவருக்கும் இடையே கவர்ச்சியும் ஈர்ப்பும் உள்ளது." : "வச்யம் பொருந்தவில்லை.",
  });
  
  // 9. Rajju Porutham
  const boyRajju = NAKSHATRA_RAJJU[boyNakshatra];
  const girlRajju = NAKSHATRA_RAJJU[girlNakshatra];
  const rajjuMatch = boyRajju !== girlRajju;
  poruthams.push({
    name: "Rajju Porutham", tamilName: "ரஜ்ஜு பொருத்தம்",
    matched: rajjuMatch, score: rajjuMatch ? 1 : 0, maxScore: 1,
    explanation: rajjuMatch ? "Rajju is matched - ensures husband's longevity." : "Same Rajju - remedies recommended for husband's well-being.",
    tamilExplanation: rajjuMatch ? "ரஜ்ஜு பொருத்தம் உள்ளது - கணவரின் நீண்ட ஆயுள் உறுதி." : "ஒரே ரஜ்ஜு - கணவரின் நலனுக்கு பரிகாரம் பரிந்துரைக்கப்படுகிறது.",
  });
  
  // 10. Vedha Porutham
  const vedhaMatch = !isVedhaPair(boyNakshatra, girlNakshatra);
  poruthams.push({
    name: "Vedha Porutham", tamilName: "வேதை பொருத்தம்",
    matched: vedhaMatch, score: vedhaMatch ? 1 : 0, maxScore: 1,
    explanation: vedhaMatch ? "No Vedha (obstruction) between the stars." : "Vedha exists between stars - may cause obstacles.",
    tamilExplanation: vedhaMatch ? "நட்சத்திரங்களுக்கிடையே வேதை இல்லை." : "நட்சத்திரங்களுக்கிடையே வேதை உள்ளது - தடைகள் ஏற்படலாம்.",
  });
  
  const totalScore = poruthams.reduce((sum, p) => sum + p.score, 0);
  const maxScore = 10;
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  let recommendation = "";
  let tamilRecommendation = "";
  
  if (percentage >= 80) {
    recommendation = "Excellent match! Marriage is highly recommended.";
    tamilRecommendation = "மிகச்சிறந்த பொருத்தம்! திருமணம் மிகவும் பரிந்துரைக்கப்படுகிறது.";
  } else if (percentage >= 60) {
    recommendation = "Good match. Marriage can proceed with minor remedies.";
    tamilRecommendation = "நல்ல பொருத்தம். சிறிய பரிகாரங்களுடன் திருமணம் நடத்தலாம்.";
  } else if (percentage >= 40) {
    recommendation = "Average match. Consult an astrologer for detailed analysis.";
    tamilRecommendation = "சராசரி பொருத்தம். விரிவான பகுப்பாய்விற்கு ஜோதிடரை அணுகவும்.";
  } else {
    recommendation = "Below average match. Remedies and astrologer consultation strongly advised.";
    tamilRecommendation = "சராசரிக்கும் கீழ் பொருத்தம். பரிகாரங்கள் மற்றும் ஜோதிட ஆலோசனை கடுமையாக பரிந்துரைக்கப்படுகிறது.";
  }
  
  return { totalScore, maxScore, percentage, poruthams, recommendation, tamilRecommendation };
}

function areEnemyYonis(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const enemies: Record<string, string> = {
    Cat: "Rat", Rat: "Cat",
    Horse: "Buffalo", Buffalo: "Horse",
    Dog: "Deer", Deer: "Dog",
    Serpent: "Mongoose", Mongoose: "Serpent",
    Monkey: "Goat", Goat: "Monkey",
    Lion: "Elephant", Elephant: "Lion",
    Cow: "Tiger", Tiger: "Cow",
  };
  return enemies[a] === b;
}

function getRasiLord(rasi: number): string {
  const lords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
  return lords[rasi];
}

function areFriendlyPlanets(a: string, b: string): boolean {
  const friends: Record<string, string[]> = {
    Sun: ["Moon", "Mars", "Jupiter"],
    Moon: ["Sun", "Mercury"],
    Mars: ["Sun", "Moon", "Jupiter"],
    Mercury: ["Sun", "Venus"],
    Jupiter: ["Sun", "Moon", "Mars"],
    Venus: ["Mercury", "Saturn"],
    Saturn: ["Mercury", "Venus"],
  };
  return friends[a]?.includes(b) || friends[b]?.includes(a) || false;
}

function isVedhaPair(a: number, b: number): boolean {
  const vedhaPairs: [number, number][] = [
    [0, 9], [1, 10], [2, 11], [3, 12], [4, 13],
    [5, 14], [6, 15], [7, 16], [8, 17],
    [18, 22], [19, 23], [20, 24], [21, 25],
  ];
  return vedhaPairs.some(([x, y]) => 
    (a === x && b === y) || (a === y && b === x)
  );
}
