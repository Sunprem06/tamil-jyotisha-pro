export const RASI_NAMES = [
  { en: "Aries", ta: "மேஷம்", symbol: "♈" },
  { en: "Taurus", ta: "ரிஷபம்", symbol: "♉" },
  { en: "Gemini", ta: "மிதுனம்", symbol: "♊" },
  { en: "Cancer", ta: "கடகம்", symbol: "♋" },
  { en: "Leo", ta: "சிம்மம்", symbol: "♌" },
  { en: "Virgo", ta: "கன்னி", symbol: "♍" },
  { en: "Libra", ta: "துலாம்", symbol: "♎" },
  { en: "Scorpio", ta: "விருச்சிகம்", symbol: "♏" },
  { en: "Sagittarius", ta: "தனுசு", symbol: "♐" },
  { en: "Capricorn", ta: "மகரம்", symbol: "♑" },
  { en: "Aquarius", ta: "கும்பம்", symbol: "♒" },
  { en: "Pisces", ta: "மீனம்", symbol: "♓" },
];

export const NAKSHATRA_DATA = [
  { en: "Ashwini", ta: "அஸ்வினி", lord: "Ketu", deity: "Ashwini Kumaras" },
  { en: "Bharani", ta: "பரணி", lord: "Venus", deity: "Yama" },
  { en: "Krittika", ta: "கார்த்திகை", lord: "Sun", deity: "Agni" },
  { en: "Rohini", ta: "ரோகிணி", lord: "Moon", deity: "Brahma" },
  { en: "Mrigashira", ta: "மிருகசீரிடம்", lord: "Mars", deity: "Soma" },
  { en: "Ardra", ta: "திருவாதிரை", lord: "Rahu", deity: "Rudra" },
  { en: "Punarvasu", ta: "புனர்பூசம்", lord: "Jupiter", deity: "Aditi" },
  { en: "Pushya", ta: "பூசம்", lord: "Saturn", deity: "Brihaspati" },
  { en: "Ashlesha", ta: "ஆயில்யம்", lord: "Mercury", deity: "Sarpa" },
  { en: "Magha", ta: "மகம்", lord: "Ketu", deity: "Pitris" },
  { en: "Purva Phalguni", ta: "பூரம்", lord: "Venus", deity: "Bhaga" },
  { en: "Uttara Phalguni", ta: "உத்திரம்", lord: "Sun", deity: "Aryaman" },
  { en: "Hasta", ta: "ஹஸ்தம்", lord: "Moon", deity: "Savitar" },
  { en: "Chitra", ta: "சித்திரை", lord: "Mars", deity: "Tvashtar" },
  { en: "Swati", ta: "சுவாதி", lord: "Rahu", deity: "Vayu" },
  { en: "Vishakha", ta: "விசாகம்", lord: "Jupiter", deity: "Indragni" },
  { en: "Anuradha", ta: "அனுஷம்", lord: "Saturn", deity: "Mitra" },
  { en: "Jyeshtha", ta: "கேட்டை", lord: "Mercury", deity: "Indra" },
  { en: "Moola", ta: "மூலம்", lord: "Ketu", deity: "Nirriti" },
  { en: "Purva Ashadha", ta: "பூராடம்", lord: "Venus", deity: "Apas" },
  { en: "Uttara Ashadha", ta: "உத்திராடம்", lord: "Sun", deity: "Vishvedevas" },
  { en: "Shravana", ta: "திருவோணம்", lord: "Moon", deity: "Vishnu" },
  { en: "Dhanishta", ta: "அவிட்டம்", lord: "Mars", deity: "Vasu" },
  { en: "Shatabhisha", ta: "சதயம்", lord: "Rahu", deity: "Varuna" },
  { en: "Purva Bhadrapada", ta: "பூரட்டாதி", lord: "Jupiter", deity: "Ajaikapada" },
  { en: "Uttara Bhadrapada", ta: "உத்திரட்டாதி", lord: "Saturn", deity: "Ahirbudhnya" },
  { en: "Revati", ta: "ரேவதி", lord: "Mercury", deity: "Pushan" },
];

export const PLANET_DATA = [
  { en: "Sun", ta: "சூரியன்", abbr: "Su" },
  { en: "Moon", ta: "சந்திரன்", abbr: "Mo" },
  { en: "Mars", ta: "செவ்வாய்", abbr: "Ma" },
  { en: "Mercury", ta: "புதன்", abbr: "Me" },
  { en: "Jupiter", ta: "குரு", abbr: "Ju" },
  { en: "Venus", ta: "சுக்கிரன்", abbr: "Ve" },
  { en: "Saturn", ta: "சனி", abbr: "Sa" },
  { en: "Rahu", ta: "ராகு", abbr: "Ra" },
  { en: "Ketu", ta: "கேது", abbr: "Ke" },
];

// Vimshottari Dasha periods in years
export const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

// Dasha sequence
export const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

export const TAMIL_DAYS = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"];

export const TITHI_NAMES = [
  { en: "Pratipada", ta: "பிரதமை" }, { en: "Dwitiya", ta: "துவிதியை" },
  { en: "Tritiya", ta: "திருதியை" }, { en: "Chaturthi", ta: "சதுர்த்தி" },
  { en: "Panchami", ta: "பஞ்சமி" }, { en: "Shashthi", ta: "சஷ்டி" },
  { en: "Saptami", ta: "சப்தமி" }, { en: "Ashtami", ta: "அஷ்டமி" },
  { en: "Navami", ta: "நவமி" }, { en: "Dashami", ta: "தசமி" },
  { en: "Ekadashi", ta: "ஏகாதசி" }, { en: "Dwadashi", ta: "துவாதசி" },
  { en: "Trayodashi", ta: "திரயோதசி" }, { en: "Chaturdashi", ta: "சதுர்தசி" },
  { en: "Pournami/Amavasai", ta: "பௌர்ணமி/அமாவாசை" },
];

export const YOGA_NAMES = [
  "விஷ்கம்பம்", "ப்ரீதி", "ஆயுஷ்மான்", "சௌபாக்யம்", "சோபனம்",
  "அதிகண்டம்", "சுகர்மா", "த்ருதி", "சூலம்", "கண்டம்",
  "விருத்தி", "த்ருவம்", "வ்யாகாதம்", "ஹர்ஷணம்", "வஜ்ரம்",
  "சித்தி", "வ்யதீபாதம்", "வரீயான்", "பரிகம்", "சிவம்",
  "சித்தம்", "சாத்யம்", "சுபம்", "சுக்லம்", "பிரம்மம்",
  "இந்திரம்", "வைத்ருதி",
];

// Yoni for Porutham matching
export const NAKSHATRA_YONI: Record<number, { animal: string, gender: string }> = {
  0: { animal: "Horse", gender: "M" }, 1: { animal: "Elephant", gender: "M" },
  2: { animal: "Goat", gender: "F" }, 3: { animal: "Serpent", gender: "M" },
  4: { animal: "Serpent", gender: "F" }, 5: { animal: "Dog", gender: "F" },
  6: { animal: "Cat", gender: "F" }, 7: { animal: "Goat", gender: "M" },
  8: { animal: "Cat", gender: "M" }, 9: { animal: "Rat", gender: "M" },
  10: { animal: "Rat", gender: "F" }, 11: { animal: "Cow", gender: "M" },
  12: { animal: "Buffalo", gender: "F" }, 13: { animal: "Tiger", gender: "F" },
  14: { animal: "Buffalo", gender: "M" }, 15: { animal: "Tiger", gender: "M" },
  16: { animal: "Deer", gender: "F" }, 17: { animal: "Deer", gender: "M" },
  18: { animal: "Dog", gender: "M" }, 19: { animal: "Monkey", gender: "M" },
  20: { animal: "Mongoose", gender: "M" }, 21: { animal: "Monkey", gender: "F" },
  22: { animal: "Lion", gender: "M" }, 23: { animal: "Horse", gender: "F" },
  24: { animal: "Lion", gender: "F" }, 25: { animal: "Cow", gender: "F" },
  26: { animal: "Elephant", gender: "F" },
};

// Gana classification for each nakshatra
export const NAKSHATRA_GANA: Record<number, string> = {
  0: "Deva", 1: "Manushya", 2: "Rakshasa", 3: "Deva", 4: "Deva",
  5: "Manushya", 6: "Deva", 7: "Deva", 8: "Rakshasa", 9: "Rakshasa",
  10: "Manushya", 11: "Manushya", 12: "Deva", 13: "Rakshasa", 14: "Deva",
  15: "Rakshasa", 16: "Deva", 17: "Rakshasa", 18: "Rakshasa", 19: "Manushya",
  20: "Manushya", 21: "Deva", 22: "Rakshasa", 23: "Manushya", 24: "Manushya",
  25: "Manushya", 26: "Deva",
};

// Rajju classification
export const NAKSHATRA_RAJJU: Record<number, string> = {
  0: "Pada", 1: "Kati", 2: "Nabhi", 3: "Kanta", 4: "Siro",
  5: "Siro", 6: "Kanta", 7: "Nabhi", 8: "Kati", 9: "Pada",
  10: "Kati", 11: "Nabhi", 12: "Kanta", 13: "Siro", 14: "Siro",
  15: "Kanta", 16: "Nabhi", 17: "Kati", 18: "Pada", 19: "Kati",
  20: "Nabhi", 21: "Kanta", 22: "Siro", 23: "Siro", 24: "Kanta",
  25: "Nabhi", 26: "Kati",
};

// Vasya groups
export const RASI_VASYA: Record<number, number[]> = {
  0: [4, 8], // Aries -> Leo, Sagittarius
  1: [3, 6], // Taurus -> Cancer, Libra
  2: [5], // Gemini -> Virgo
  3: [8, 4], // Cancer -> Sagittarius, Leo
  4: [0], // Leo -> Aries
  5: [2, 11], // Virgo -> Gemini, Pisces
  6: [1, 7], // Libra -> Taurus, Scorpio
  7: [3], // Scorpio -> Cancer
  8: [11], // Sagittarius -> Pisces
  9: [0, 10], // Capricorn -> Aries, Aquarius
  10: [0], // Aquarius -> Aries
  11: [9], // Pisces -> Capricorn
};

export const TAMIL_MONTHS = [
  "சித்திரை", "வைகாசி", "ஆனி", "ஆடி", "ஆவணி", "புரட்டாசி",
  "ஐப்பசி", "கார்த்திகை", "மார்கழி", "தை", "மாசி", "பங்குனி",
];

export const TEMPLES_DATA = [
  { name: "Navagraha Temples", tamilName: "நவகிரக கோயில்கள்", planet: "All", location: "Kumbakonam area", description: "Nine temples dedicated to the nine celestial bodies" },
  { name: "Suryanar Koil", tamilName: "சூரியனார் கோயில்", planet: "Sun", location: "Kumbakonam", description: "Temple for Sun (Surya)" },
  { name: "Thingaloor", tamilName: "திங்களூர்", planet: "Moon", location: "Thanjavur", description: "Temple for Moon (Chandra)" },
  { name: "Vaitheeswaran Koil", tamilName: "வைத்தீஸ்வரன் கோயில்", planet: "Mars", location: "Nagapattinam", description: "Temple for Mars (Chevvai)" },
  { name: "Thiruvenkadu", tamilName: "திருவெண்காடு", planet: "Mercury", location: "Nagapattinam", description: "Temple for Mercury (Budhan)" },
  { name: "Alangudi", tamilName: "ஆலங்குடி", planet: "Jupiter", location: "Pudukkottai", description: "Temple for Jupiter (Guru)" },
  { name: "Kanjanoor", tamilName: "கஞ்சனூர்", planet: "Venus", location: "Kumbakonam", description: "Temple for Venus (Sukra)" },
  { name: "Thirunallar", tamilName: "திருநள்ளாறு", planet: "Saturn", location: "Karaikal", description: "Temple for Saturn (Sani)" },
  { name: "Thirunageswaram", tamilName: "திருநாகேஸ்வரம்", planet: "Rahu", location: "Kumbakonam", description: "Temple for Rahu" },
  { name: "Keezhperumpallam", tamilName: "கீழ்பெரும்பள்ளம்", planet: "Ketu", location: "Nagapattinam", description: "Temple for Ketu" },
];
