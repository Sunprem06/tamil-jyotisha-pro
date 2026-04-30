import { RASI_NAMES, NAKSHATRA_DATA, PLANET_DATA } from './constants';
import type { PlanetPosition, HoroscopeChart, BirthData, NavamsaChart } from './types';

// Julian Day Number calculation
function toJulianDay(date: Date): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate() + (date.getHours() + date.getMinutes() / 60) / 24;
  
  let yr = y, mo = m;
  if (mo <= 2) { yr -= 1; mo += 12; }
  
  const A = Math.floor(yr / 100);
  const B = 2 - A + Math.floor(A / 4);
  
  return Math.floor(365.25 * (yr + 4716)) + Math.floor(30.6001 * (mo + 1)) + d + B - 1524.5;
}

// Lahiri Ayanamsa calculation
export function getLahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0; // centuries from J2000
  // Lahiri ayanamsa approximation
  const ayanamsa = 23.856 + 0.0138 * (jd - 2451545.0) / 365.25;
  return ayanamsa;
}

// Simplified mean longitude calculations for planets
function getMeanSunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let L = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);
  L = (L + C) % 360;
  if (L < 0) L += 360;
  return L;
}

function getMeanMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let L = 218.3165 + 481267.8813 * T;
  // Add some perturbation terms
  const D = 297.8502 + 445267.1115 * T;
  const M = 357.5291 + 35999.0503 * T;
  const Mp = 134.9634 + 477198.8676 * T;
  const F = 93.2720 + 483202.0175 * T;
  
  const Drad = D * Math.PI / 180;
  const Mrad = M * Math.PI / 180;
  const Mprad = Mp * Math.PI / 180;
  const Frad = F * Math.PI / 180;
  
  L += 6.289 * Math.sin(Mprad);
  L += 1.274 * Math.sin(2 * Drad - Mprad);
  L += 0.658 * Math.sin(2 * Drad);
  L += 0.214 * Math.sin(2 * Mprad);
  L -= 0.186 * Math.sin(Mrad);
  
  L = L % 360;
  if (L < 0) L += 360;
  return L;
}

function getPlanetLongitude(planet: string, jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  
  // Simplified mean longitudes
  switch (planet) {
    case "Sun": return getMeanSunLongitude(jd);
    case "Moon": return getMeanMoonLongitude(jd);
    case "Mars": {
      let L = 355.433 + 19140.2993 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Mercury": {
      let L = 252.251 + 149472.6746 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Jupiter": {
      let L = 34.351 + 3034.9057 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Venus": {
      let L = 181.979 + 58517.8156 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Saturn": {
      let L = 50.077 + 1222.1138 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Rahu": {
      // Mean node of Moon (Rahu)
      let L = 125.044 - 1934.1362 * T;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    case "Ketu": {
      let L = 125.044 - 1934.1362 * T + 180;
      L = L % 360; if (L < 0) L += 360; return L;
    }
    default: return 0;
  }
}

function getSiderealLongitude(tropicalLong: number, ayanamsa: number): number {
  let sid = tropicalLong - ayanamsa;
  if (sid < 0) sid += 360;
  if (sid >= 360) sid -= 360;
  return sid;
}

function getRasi(longitude: number): number {
  return Math.floor(longitude / 30);
}

function getNakshatra(longitude: number): { index: number; pada: number } {
  const nakshatraSpan = 360 / 27; // 13.333...
  const index = Math.floor(longitude / nakshatraSpan);
  const padaSpan = nakshatraSpan / 4;
  const posInNakshatra = longitude - (index * nakshatraSpan);
  const pada = Math.floor(posInNakshatra / padaSpan) + 1;
  return { index: index % 27, pada };
}

export function calculatePlanetPositions(birthData: BirthData): PlanetPosition[] {
  const [hours, minutes] = birthData.timeOfBirth.split(':').map(Number);
  const dateTime = new Date(birthData.dateOfBirth);
  dateTime.setHours(hours, minutes, 0, 0);
  
  // Adjust for timezone
  const utcDate = new Date(dateTime.getTime() - birthData.timezone * 3600000);
  const jd = toJulianDay(utcDate);
  const ayanamsa = getLahiriAyanamsa(jd);
  
  const planets: PlanetPosition[] = [];
  
  for (const planetInfo of PLANET_DATA) {
    const tropicalLong = getPlanetLongitude(planetInfo.en, jd);
    const siderealLong = getSiderealLongitude(tropicalLong, ayanamsa);
    const rasiIndex = getRasi(siderealLong);
    const { index: nakshatraIndex, pada } = getNakshatra(siderealLong);
    const degreeInRasi = siderealLong - (rasiIndex * 30);
    
    planets.push({
      planet: planetInfo.en,
      tamilName: planetInfo.ta,
      longitude: Math.round(siderealLong * 100) / 100,
      rasi: rasiIndex,
      rasiName: RASI_NAMES[rasiIndex].en,
      rasiTamilName: RASI_NAMES[rasiIndex].ta,
      degree: Math.round(degreeInRasi * 100) / 100,
      nakshatra: NAKSHATRA_DATA[nakshatraIndex].en,
      nakshatraTamilName: NAKSHATRA_DATA[nakshatraIndex].ta,
      nakshatraPada: pada,
      isRetrograde: false,
    });
  }
  
  return planets;
}

export function calculateLagna(birthData: BirthData): number {
  const [hours, minutes] = birthData.timeOfBirth.split(':').map(Number);
  const dateTime = new Date(birthData.dateOfBirth);
  dateTime.setHours(hours, minutes, 0, 0);
  
  const utcDate = new Date(dateTime.getTime() - birthData.timezone * 3600000);
  const jd = toJulianDay(utcDate);
  const ayanamsa = getLahiriAyanamsa(jd);
  
  // Simplified ascendant calculation
  const T = (jd - 2451545.0) / 36525.0;
  const GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  const localSiderealTime = (GMST + birthData.longitude) % 360;
  
  const latRad = birthData.latitude * Math.PI / 180;
  const obliquity = 23.4393 - 0.0130 * T;
  const oblRad = obliquity * Math.PI / 180;
  const lstRad = localSiderealTime * Math.PI / 180;
  
  let asc = Math.atan2(Math.cos(lstRad), -(Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad)));
  asc = (asc * 180 / Math.PI) % 360;
  if (asc < 0) asc += 360;
  
  const siderealAsc = getSiderealLongitude(asc, ayanamsa);
  return getRasi(siderealAsc);
}

export function generateHoroscope(birthData: BirthData): HoroscopeChart {
  const planets = calculatePlanetPositions(birthData);
  const lagna = calculateLagna(birthData);
  const moonPos = planets.find(p => p.planet === "Moon");
  const lagnaNakshatra = moonPos?.nakshatra || "Ashwini";
  
  // House cusps (equal house system, 30° each from lagna)
  const houses = Array.from({ length: 12 }, (_, i) => ((lagna * 30) + i * 30) % 360);
  
  return { lagna, lagnaNakshatra, planets, houses };
}

export function calculateNavamsa(planets: PlanetPosition[]): NavamsaChart {
  return {
    planets: planets.map(p => {
      // Navamsa: divide each rasi into 9 parts (3°20' each)
      const navamsaPart = Math.floor(p.degree / (30 / 9));
      // Starting navamsa rasi depends on the element of the original rasi
      const elementOffset = [0, 9, 6, 3]; // Fire, Earth, Air, Water starting rasis (in navamsa)
      const element = p.rasi % 4;
      const navamsaRasi = (elementOffset[element] + navamsaPart) % 12;
      
      return {
        planet: p.planet,
        rasi: navamsaRasi,
        rasiName: RASI_NAMES[navamsaRasi].en,
      };
    }),
  };
}

export function getCurrentPanchangamBasic(date: Date, lat: number, lng: number) {
  const jd = toJulianDay(date);
  const ayanamsa = getLahiriAyanamsa(jd);
  
  const sunTropical = getMeanSunLongitude(jd);
  const moonTropical = getMeanMoonLongitude(jd);
  
  const sunSidereal = getSiderealLongitude(sunTropical, ayanamsa);
  const moonSidereal = getSiderealLongitude(moonTropical, ayanamsa);
  
  // Tithi: Moon - Sun / 12
  let diff = moonSidereal - sunSidereal;
  if (diff < 0) diff += 360;
  const tithiIndex = Math.floor(diff / 12) % 30;
  
  // Nakshatra of Moon
  const { index: nakshatraIndex } = getNakshatra(moonSidereal);
  
  // Yoga: (Sun + Moon) / (360/27)
  const yogaLong = (sunSidereal + moonSidereal) % 360;
  const yogaIndex = Math.floor(yogaLong / (360 / 27)) % 27;
  
  // Karana: half of tithi
  const karanaIndex = Math.floor(diff / 6) % 60;
  
  // Approximate sunrise/sunset for the latitude
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = -23.45 * Math.cos((360 / 365) * (dayOfYear + 10) * Math.PI / 180);
  const latRad = lat * Math.PI / 180;
  const decRad = declination * Math.PI / 180;
  const hourAngle = Math.acos(-Math.tan(latRad) * Math.tan(decRad)) * 180 / Math.PI;
  const sunriseHour = 12 - hourAngle / 15;
  const sunsetHour = 12 + hourAngle / 15;
  
  const formatTime = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h - hrs) * 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };
  
  // Rahu Kalam calculation (based on day of week)
  const dayIndex = date.getDay();
  const rahukaamSlots = [8, 2, 7, 5, 6, 4, 3]; // Slot number for each day (Sun=0 to Sat=6)
  const dayDuration = (sunsetHour - sunriseHour) / 8;
  const rahuStart = sunriseHour + (rahukaamSlots[dayIndex] - 1) * dayDuration;
  const rahuEnd = rahuStart + dayDuration;
  
  // Yamagandam
  const yamaSlots = [5, 4, 3, 2, 1, 7, 6];
  const yamaStart = sunriseHour + (yamaSlots[dayIndex] - 1) * dayDuration;
  const yamaEnd = yamaStart + dayDuration;
  
  // Gulikai
  const gulikiSlots = [7, 6, 5, 4, 3, 2, 1];
  const gulikiStart = sunriseHour + (gulikiSlots[dayIndex] - 1) * dayDuration;
  const gulikiEnd = gulikiStart + dayDuration;
  
  return {
    tithiIndex: tithiIndex % 30,
    nakshatraIndex,
    yogaIndex,
    karanaIndex,
    sunrise: formatTime(sunriseHour),
    sunset: formatTime(sunsetHour),
    rahuKalam: `${formatTime(rahuStart)} - ${formatTime(rahuEnd)}`,
    yamagandam: `${formatTime(yamaStart)} - ${formatTime(yamaEnd)}`,
    gulikai: `${formatTime(gulikiStart)} - ${formatTime(gulikiEnd)}`,
    moonRasi: getRasi(moonSidereal),
    sunRasi: getRasi(sunSidereal),
  };
}
