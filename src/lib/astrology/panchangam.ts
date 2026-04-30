// Enhanced Panchangam calculations for calendar
// Nalla Neram, Gowri Nalla Neram, Rahu Kalam, Emagandam, Kuligai, etc.

interface TimeSlot {
  start: string;
  end: string;
}

function formatTime(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function getSunTimes(
  date: Date,
  lat: number = 13.0827,
  lng: number = 80.2707,
  tz: number = 5.5,
): { sunrise: number; sunset: number } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180);
  const latRad = lat * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  const arg = -Math.tan(latRad) * Math.tan(decRad);
  // Polar regions guard
  const clamped = Math.max(-1, Math.min(1, arg));
  const hourAngle = Math.acos(clamped) * 180 / Math.PI;
  // Local clock noon offset from solar noon (longitude vs timezone meridian)
  const noonOffset = tz - lng / 15;
  return {
    sunrise: 12 + noonOffset - hourAngle / 15,
    sunset: 12 + noonOffset + hourAngle / 15,
  };
}

export function getRahuKalam(date: Date, lat?: number): TimeSlot {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const slots = [8, 2, 7, 5, 6, 4, 3]; // Sun-Sat
  const duration = (sunset - sunrise) / 8;
  const start = sunrise + (slots[date.getDay()] - 1) * duration;
  return { start: formatTime(start), end: formatTime(start + duration) };
}

export function getYamagandam(date: Date, lat?: number): TimeSlot {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const slots = [5, 4, 3, 2, 1, 7, 6];
  const duration = (sunset - sunrise) / 8;
  const start = sunrise + (slots[date.getDay()] - 1) * duration;
  return { start: formatTime(start), end: formatTime(start + duration) };
}

export function getKuligai(date: Date, lat?: number): TimeSlot {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const slots = [7, 6, 5, 4, 3, 2, 1];
  const duration = (sunset - sunrise) / 8;
  const start = sunrise + (slots[date.getDay()] - 1) * duration;
  return { start: formatTime(start), end: formatTime(start + duration) };
}

// Nalla Neram (Good Time) - time slots excluding Rahu, Yama, Gulikai
export function getNallaNeram(date: Date, lat?: number): TimeSlot[] {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const rahu = getRahuKalam(date, lat);
  const yama = getYamagandam(date, lat);
  const guli = getKuligai(date, lat);

  // Day is divided into 8 slots; the ones NOT taken by rahu/yama/gulikai are nalla neram
  const duration = (sunset - sunrise) / 8;
  const badSlotNums = new Set<number>();
  const rahuSlots = [8, 2, 7, 5, 6, 4, 3];
  const yamaSlots = [5, 4, 3, 2, 1, 7, 6];
  const guliSlots = [7, 6, 5, 4, 3, 2, 1];
  badSlotNums.add(rahuSlots[date.getDay()]);
  badSlotNums.add(yamaSlots[date.getDay()]);
  badSlotNums.add(guliSlots[date.getDay()]);

  const good: TimeSlot[] = [];
  for (let i = 1; i <= 8; i++) {
    if (!badSlotNums.has(i)) {
      const s = sunrise + (i - 1) * duration;
      good.push({ start: formatTime(s), end: formatTime(s + duration) });
    }
  }
  return good;
}

// Gowri Nalla Neram (Gowri Panchangam based good times)
// Based on weekday - specific hours are considered auspicious
export function getGowriNallaNeram(date: Date, lat?: number): TimeSlot[] {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const duration = (sunset - sunrise) / 8;

  // Gowri Panchangam slots for each day (1-indexed slots that are "Amirtham" or "Uthi")
  // Each day has specific auspicious slots
  const gowriSlots: number[][] = [
    [3, 6],     // Sunday
    [2, 5, 7],  // Monday  
    [1, 4, 8],  // Tuesday
    [3, 5, 7],  // Wednesday
    [2, 4, 6],  // Thursday
    [1, 3, 8],  // Friday
    [2, 6, 7],  // Saturday
  ];

  return gowriSlots[date.getDay()].map(slot => {
    const s = sunrise + (slot - 1) * duration;
    return { start: formatTime(s), end: formatTime(s + duration) };
  });
}

// Graha Orai (Planetary Hours)
// Each hour of the day is ruled by a planet, starting from the day's ruler
export function getGrahaOrai(date: Date, lat?: number): Array<{ planet_tamil: string; planet_english: string; start: string; end: string }> {
  const { sunrise, sunset } = getSunTimes(date, lat);
  const dayDuration = sunset - sunrise;
  const nightDuration = 24 - dayDuration;
  const dayHourDuration = dayDuration / 12;

  // Planet order for hora: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
  const planets = [
    { tamil: 'சூரியன்', english: 'Sun' },
    { tamil: 'சுக்கிரன்', english: 'Venus' },
    { tamil: 'புதன்', english: 'Mercury' },
    { tamil: 'சந்திரன்', english: 'Moon' },
    { tamil: 'சனி', english: 'Saturn' },
    { tamil: 'குரு', english: 'Jupiter' },
    { tamil: 'செவ்வாய்', english: 'Mars' },
  ];

  // Day ruler starts: Sun=0, Moon=3, Mars=6, Mercury=2, Jupiter=5, Venus=1, Saturn=4
  const dayStartIndex = [0, 3, 6, 2, 5, 1, 4];
  let startIdx = dayStartIndex[date.getDay()];

  const orai = [];
  for (let i = 0; i < 12; i++) {
    const s = sunrise + i * dayHourDuration;
    orai.push({
      ...planets[(startIdx + i) % 7],
      start: formatTime(s),
      end: formatTime(s + dayHourDuration),
    });
  }
  return orai;
}

// Subha Muhurtham (auspicious times for the day)
export function getSubhaMuhurtham(date: Date, lat?: number): TimeSlot[] {
  const { sunrise } = getSunTimes(date, lat);
  // Abhijit Muhurta: around noon (roughly 11:45 AM to 12:33 PM)
  // Brahma Muhurta: 1.5 hours before sunrise
  const brahmaStart = sunrise - 1.5;
  const abhijitStart = 11.75; // ~11:45 AM
  
  const muhurthams: TimeSlot[] = [
    { start: formatTime(brahmaStart), end: formatTime(brahmaStart + 0.8) },
    { start: formatTime(abhijitStart), end: formatTime(abhijitStart + 0.8) },
  ];

  // Add Gowri-based muhurthams
  const gowri = getGowriNallaNeram(date, lat);
  if (gowri.length > 0) {
    muhurthams.push(gowri[0]);
  }

  return muhurthams;
}

// Palli Vilum Palan (Sleep direction prediction based on weekday)
export function getPalliVilumPalan(date: Date): { direction_tamil: string; direction_english: string; palan_tamil: string } {
  const palans = [
    { direction_tamil: 'கிழக்கு', direction_english: 'East', palan_tamil: 'அரசாங்க ஆதரவு, வெற்றி, நல்ல செய்தி கிடைக்கும்' },
    { direction_tamil: 'வடக்கு', direction_english: 'North', palan_tamil: 'செல்வம் பெருகும், குடும்ப நலம் மேம்படும்' },
    { direction_tamil: 'மேற்கு', direction_english: 'West', palan_tamil: 'பயணம் ஏற்படும், புதிய தொடர்புகள் கிடைக்கும்' },
    { direction_tamil: 'தெற்கு', direction_english: 'South', palan_tamil: 'ஆரோக்கியம் கவனிக்கவும், எச்சரிக்கையாக இருக்கவும்' },
    { direction_tamil: 'வடகிழக்கு', direction_english: 'Northeast', palan_tamil: 'ஆன்மீக முன்னேற்றம், தெய்வ அருள் கிடைக்கும்' },
    { direction_tamil: 'தென்மேற்கு', direction_english: 'Southwest', palan_tamil: 'நிலம், வீடு சம்பந்தமான நல்ல செய்தி' },
    { direction_tamil: 'வடமேற்கு', direction_english: 'Northwest', palan_tamil: 'வியாபாரம் வளரும், பண வரவு அதிகரிக்கும்' },
  ];
  return palans[date.getDay()];
}

// Manaiadi Sasthiram - House direction prediction for the day
export function getManaiyadiSasthiram(date: Date): { direction_tamil: string; palan_tamil: string; favorable: boolean } {
  const day = date.getDay();
  const predictions = [
    { direction_tamil: 'கிழக்கு முகம்', palan_tamil: 'வீட்டில் சுபிட்சம் நிலவும், மங்கலம் உண்டாகும்', favorable: true },
    { direction_tamil: 'வடக்கு முகம்', palan_tamil: 'குபேர திசை - செல்வம் சேரும், பணம் பெருகும்', favorable: true },
    { direction_tamil: 'மேற்கு முகம்', palan_tamil: 'கலை, கல்வியில் முன்னேற்றம் உண்டாகும்', favorable: true },
    { direction_tamil: 'தெற்கு முகம்', palan_tamil: 'எமதிசை - இன்று வீட்டு கட்டுமானம் தவிர்க்கவும்', favorable: false },
    { direction_tamil: 'வடகிழக்கு (ஈசான்ய)', palan_tamil: 'பூஜை அறை அமைக்க மிகவும் நல்ல திசை', favorable: true },
    { direction_tamil: 'தென்கிழக்கு (அக்னி)', palan_tamil: 'சமையலறை, விளக்கு ஏற்ற சிறந்த திசை', favorable: true },
    { direction_tamil: 'வடமேற்கு (வாயு)', palan_tamil: 'காற்று சீராக வீசும், ஆரோக்கியம் நிலவும்', favorable: true },
  ];
  return predictions[day];
}

export function getSunriseTime(date: Date, lat?: number): string {
  return formatTime(getSunTimes(date, lat).sunrise);
}

export function getSunsetTime(date: Date, lat?: number): string {
  return formatTime(getSunTimes(date, lat).sunset);
}
