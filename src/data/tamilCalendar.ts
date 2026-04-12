// Tamil Calendar Data - 60 Year Cycle, Tamil Months, Nakshatras, Tithis, Yogams, Karanams

export const TAMIL_YEAR_CYCLE = [
  { no: 1, tamil: 'பிரபவ', english: 'Prabhava' },
  { no: 2, tamil: 'விபவ', english: 'Vibhava' },
  { no: 3, tamil: 'சுக்ல', english: 'Shukla' },
  { no: 4, tamil: 'பிரமோதூத', english: 'Pramoduta' },
  { no: 5, tamil: 'பிரசோற்பத்தி', english: 'Prajothpatti' },
  { no: 6, tamil: 'ஆங்கீரச', english: 'Angirasa' },
  { no: 7, tamil: 'ஸ்ரீமுக', english: 'Srimukha' },
  { no: 8, tamil: 'பவ', english: 'Bhava' },
  { no: 9, tamil: 'யுவ', english: 'Yuva' },
  { no: 10, tamil: 'தாது', english: 'Dhatu' },
  { no: 11, tamil: 'ஈஸ்வர', english: 'Eswara' },
  { no: 12, tamil: 'வெகுதான்ய', english: 'Bahudhanya' },
  { no: 13, tamil: 'பிரமாதி', english: 'Pramathi' },
  { no: 14, tamil: 'விக்கிரம', english: 'Vikrama' },
  { no: 15, tamil: 'விஷு', english: 'Vishu' },
  { no: 16, tamil: 'சித்திரபானு', english: 'Chitrabhanu' },
  { no: 17, tamil: 'சுபானு', english: 'Subhanu' },
  { no: 18, tamil: 'தாரண', english: 'Dharana' },
  { no: 19, tamil: 'பார்த்திப', english: 'Parthiva' },
  { no: 20, tamil: 'விய', english: 'Vyaya' },
  { no: 21, tamil: 'சர்வஜித்', english: 'Sarvajith' },
  { no: 22, tamil: 'சர்வதாரி', english: 'Sarvadhari' },
  { no: 23, tamil: 'விரோதி', english: 'Virodhi' },
  { no: 24, tamil: 'விக்ருதி', english: 'Vikrithi' },
  { no: 25, tamil: 'கர', english: 'Khara' },
  { no: 26, tamil: 'நந்தன', english: 'Nandana' },
  { no: 27, tamil: 'விஜய', english: 'Vijaya' },
  { no: 28, tamil: 'ஜய', english: 'Jaya' },
  { no: 29, tamil: 'மன்மத', english: 'Manmatha' },
  { no: 30, tamil: 'துர்முகி', english: 'Durmukhi' },
  { no: 31, tamil: 'ஹேவிளம்பி', english: 'Hevilambi' },
  { no: 32, tamil: 'விளம்பி', english: 'Vilambi' },
  { no: 33, tamil: 'விகாரி', english: 'Vikari' },
  { no: 34, tamil: 'சார்வரி', english: 'Sarvari' },
  { no: 35, tamil: 'பிலவ', english: 'Plava' },
  { no: 36, tamil: 'சுபகிருது', english: 'Subhakrithu' },
  { no: 37, tamil: 'சோபகிருது', english: 'Sobhakrithu' },
  { no: 38, tamil: 'குரோதி', english: 'Krodhi' },
  { no: 39, tamil: 'விசுவாவசு', english: 'Vishvavasu' },
  { no: 40, tamil: 'பராபவ', english: 'Parabhava' },
  { no: 41, tamil: 'பிலவங்க', english: 'Plavanga' },
  { no: 42, tamil: 'கீலக', english: 'Keelaka' },
  { no: 43, tamil: 'சௌமிய', english: 'Sowmya' },
  { no: 44, tamil: 'சாதாரண', english: 'Sadharana' },
  { no: 45, tamil: 'விரோதிகிருது', english: 'Virodhikrithu' },
  { no: 46, tamil: 'பரிதாபி', english: 'Paridhabhi' },
  { no: 47, tamil: 'பிரமாதீச', english: 'Pramadicha' },
  { no: 48, tamil: 'ஆனந்த', english: 'Ananda' },
  { no: 49, tamil: 'ராட்சச', english: 'Rakshasa' },
  { no: 50, tamil: 'நள', english: 'Nala' },
  { no: 51, tamil: 'பிங்கள', english: 'Pingala' },
  { no: 52, tamil: 'காளயுக்தி', english: 'Kalayukthi' },
  { no: 53, tamil: 'சித்தார்த்தி', english: 'Siddharthi' },
  { no: 54, tamil: 'ரௌத்திரி', english: 'Raudri' },
  { no: 55, tamil: 'துன்மதி', english: 'Durmathi' },
  { no: 56, tamil: 'துந்துபி', english: 'Dundhubhi' },
  { no: 57, tamil: 'ருத்ரோத்காரி', english: 'Rudhrodgari' },
  { no: 58, tamil: 'ரக்தாட்சி', english: 'Raktakshi' },
  { no: 59, tamil: 'குரோதன', english: 'Krodhana' },
  { no: 60, tamil: 'அட்சய', english: 'Akshaya' },
];

export const TAMIL_MONTHS = [
  { no: 1, tamil: 'சித்திரை', english: 'Chithirai', sunSign: 'Aries', startApprox: 'Apr 14' },
  { no: 2, tamil: 'வைகாசி', english: 'Vaigasi', sunSign: 'Taurus', startApprox: 'May 15' },
  { no: 3, tamil: 'ஆனி', english: 'Aani', sunSign: 'Gemini', startApprox: 'Jun 15' },
  { no: 4, tamil: 'ஆடி', english: 'Aadi', sunSign: 'Cancer', startApprox: 'Jul 17' },
  { no: 5, tamil: 'ஆவணி', english: 'Aavani', sunSign: 'Leo', startApprox: 'Aug 17' },
  { no: 6, tamil: 'புரட்டாசி', english: 'Purattasi', sunSign: 'Virgo', startApprox: 'Sep 17' },
  { no: 7, tamil: 'ஐப்பசி', english: 'Aippasi', sunSign: 'Libra', startApprox: 'Oct 18' },
  { no: 8, tamil: 'கார்த்திகை', english: 'Karthigai', sunSign: 'Scorpio', startApprox: 'Nov 17' },
  { no: 9, tamil: 'மார்கழி', english: 'Margazhi', sunSign: 'Sagittarius', startApprox: 'Dec 16' },
  { no: 10, tamil: 'தை', english: 'Thai', sunSign: 'Capricorn', startApprox: 'Jan 15' },
  { no: 11, tamil: 'மாசி', english: 'Maasi', sunSign: 'Aquarius', startApprox: 'Feb 13' },
  { no: 12, tamil: 'பங்குனி', english: 'Panguni', sunSign: 'Pisces', startApprox: 'Mar 15' },
];

export const TAMIL_WEEKDAYS = [
  { tamil: 'ஞாயிற்றுக்கிழமை', short: 'ஞாயிறு', english: 'Sunday', planet: 'சூரியன்' },
  { tamil: 'திங்கட்கிழமை', short: 'திங்கள்', english: 'Monday', planet: 'சந்திரன்' },
  { tamil: 'செவ்வாய்க்கிழமை', short: 'செவ்வாய்', english: 'Tuesday', planet: 'செவ்வாய்' },
  { tamil: 'புதன்கிழமை', short: 'புதன்', english: 'Wednesday', planet: 'புதன்' },
  { tamil: 'வியாழக்கிழமை', short: 'வியாழன்', english: 'Thursday', planet: 'குரு' },
  { tamil: 'வெள்ளிக்கிழமை', short: 'வெள்ளி', english: 'Friday', planet: 'சுக்கிரன்' },
  { tamil: 'சனிக்கிழமை', short: 'சனி', english: 'Saturday', planet: 'சனி' },
];

export const NAKSHATRAS = [
  'அசுவினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்',
  'திருவாதிரை', 'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்',
  'பூரம்', 'உத்திரம்', 'அஸ்தம்', 'சித்திரை', 'சுவாதி',
  'விசாகம்', 'அனுஷம்', 'கேட்டை', 'மூலம்', 'பூராடம்',
  'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்', 'பூரட்டாதி',
  'உத்திரட்டாதி', 'ரேவதி',
];

export const TITHIS = [
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி',
  'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி',
  'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி', 'பௌர்ணமி / அமாவாசை',
];

export const YOGAMS = [
  'விஷ்கம்பம்', 'பிரீதி', 'ஆயுஷ்மான்', 'சௌபாக்யம்', 'சோபனம்',
  'அதிகண்டம்', 'சுகர்மா', 'திருதி', 'சூலம்', 'கண்டம்',
  'விருத்தி', 'துருவம்', 'வியாகாதம்', 'ஹர்ஷணம்', 'வஜ்ரம்',
  'சித்தி', 'வியதீபாதம்', 'வரீயான்', 'பரிகம்', 'சிவம்',
  'சித்தம்', 'சாத்தியம்', 'சுபம்', 'சுக்கிலம்', 'பிரம்மம்',
  'ஐந்திரம்', 'வைதிருதி',
];

// Approximate Tamil year calculation
// The 60-year cycle: The current cycle started around 1987 (Prabhava)
// Tamil New Year falls on April 14 each year (Chithirai 1)
export function getTamilYear(date: Date): { no: number; tamil: string; english: string } {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  
  // Tamil year starts April 14. Before that, use previous year
  let tamilYear = year;
  if (month < 3 || (month === 3 && day < 14)) {
    tamilYear = year - 1;
  }
  
  // 1987 = Prabhava (cycle index 0)
  const cycleIndex = ((tamilYear - 1987) % 60 + 60) % 60;
  return TAMIL_YEAR_CYCLE[cycleIndex];
}

// Approximate Tamil month from date
export function getTamilMonth(date: Date): { no: number; tamil: string; english: string } {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  
  // Approximate mapping (solar ingress dates vary by ~1 day)
  const transitions = [
    { m: 0, d: 15, idx: 9 },  // Jan 15 -> Thai (10)
    { m: 1, d: 13, idx: 10 }, // Feb 13 -> Maasi (11)
    { m: 2, d: 15, idx: 11 }, // Mar 15 -> Panguni (12)
    { m: 3, d: 14, idx: 0 },  // Apr 14 -> Chithirai (1)
    { m: 4, d: 15, idx: 1 },  // May 15 -> Vaigasi (2)
    { m: 5, d: 15, idx: 2 },  // Jun 15 -> Aani (3)
    { m: 6, d: 17, idx: 3 },  // Jul 17 -> Aadi (4)
    { m: 7, d: 17, idx: 4 },  // Aug 17 -> Aavani (5)
    { m: 8, d: 17, idx: 5 },  // Sep 17 -> Purattasi (6)
    { m: 9, d: 18, idx: 6 },  // Oct 18 -> Aippasi (7)
    { m: 10, d: 17, idx: 7 }, // Nov 17 -> Karthigai (8)
    { m: 11, d: 16, idx: 8 }, // Dec 16 -> Margazhi (9)
  ];
  
  let idx = 8; // default Margazhi
  for (let i = transitions.length - 1; i >= 0; i--) {
    const t = transitions[i];
    if (month > t.m || (month === t.m && day >= t.d)) {
      idx = t.idx;
      break;
    }
  }
  
  return TAMIL_MONTHS[idx];
}

export function getTamilWeekday(date: Date) {
  return TAMIL_WEEKDAYS[date.getDay()];
}

// Get approximate nakshatra for a date (simplified - based on lunar position approximation)
export function getApproxNakshatra(date: Date): string {
  // Moon completes one cycle in ~27.3 days, visiting each nakshatra ~1 day
  const epoch = new Date(2000, 0, 1).getTime();
  const days = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const lunarDays = days / 27.3;
  const idx = Math.floor((lunarDays % 1) * 27) % 27;
  return NAKSHATRAS[idx >= 0 ? idx : idx + 27];
}

// Get approximate tithi
export function getApproxTithi(date: Date): string {
  // Synodic month ~29.53 days, 30 tithis per month
  const epoch = new Date(2000, 0, 6).getTime(); // approximate new moon
  const days = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const lunarDay = (days % 29.53) / 29.53 * 30;
  const idx = Math.floor(lunarDay) % 15;
  return TITHIS[idx];
}

// Get approximate yogam
export function getApproxYogam(date: Date): string {
  const epoch = new Date(2000, 0, 1).getTime();
  const days = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const idx = Math.floor(days % 27) % 27;
  return YOGAMS[idx >= 0 ? idx : idx + 27];
}

// Get paksha (waxing/waning)
export function getPaksha(date: Date): { tamil: string; english: string } {
  const epoch = new Date(2000, 0, 6).getTime();
  const days = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const phase = (days % 29.53) / 29.53;
  return phase < 0.5
    ? { tamil: 'சுக்ல பட்சம்', english: 'Shukla Paksha (Waxing)' }
    : { tamil: 'கிருஷ்ண பட்சம்', english: 'Krishna Paksha (Waning)' };
}
