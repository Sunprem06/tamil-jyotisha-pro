import { DASHA_YEARS, DASHA_SEQUENCE, NAKSHATRA_DATA, PLANET_DATA } from './constants';
import type { DashaPeriod, PlanetPosition } from './types';

export function calculateVimshottariDasha(
  moonNakshatra: string,
  moonDegreeInNakshatra: number,
  birthDate: Date
): DashaPeriod[] {
  // Find nakshatra lord
  const nakshatraIndex = NAKSHATRA_DATA.findIndex(n => n.en === moonNakshatra);
  if (nakshatraIndex === -1) return [];
  
  const lord = NAKSHATRA_DATA[nakshatraIndex].lord;
  const lordIndex = DASHA_SEQUENCE.indexOf(lord);
  
  // Calculate balance of dasha at birth
  const nakshatraSpan = 360 / 27;
  const proportionElapsed = moonDegreeInNakshatra / nakshatraSpan;
  const totalYears = DASHA_YEARS[lord];
  const balanceYears = totalYears * (1 - proportionElapsed);
  
  const dashas: DashaPeriod[] = [];
  let currentDate = new Date(birthDate);
  
  // First dasha (balance)
  const firstEndDate = addYearsToDate(currentDate, balanceYears);
  const planetInfo = PLANET_DATA.find(p => p.en === lord);
  
  dashas.push({
    planet: lord,
    tamilName: planetInfo?.ta || lord,
    startDate: new Date(currentDate),
    endDate: firstEndDate,
    years: Math.round(balanceYears * 100) / 100,
    subPeriods: calculateBhukti(lord, currentDate, firstEndDate),
  });
  
  currentDate = new Date(firstEndDate);
  
  // Remaining dashas
  for (let i = 1; i < 9; i++) {
    const dashaIndex = (lordIndex + i) % 9;
    const dashaPlanet = DASHA_SEQUENCE[dashaIndex];
    const years = DASHA_YEARS[dashaPlanet];
    const endDate = addYearsToDate(currentDate, years);
    const info = PLANET_DATA.find(p => p.en === dashaPlanet);
    
    dashas.push({
      planet: dashaPlanet,
      tamilName: info?.ta || dashaPlanet,
      startDate: new Date(currentDate),
      endDate,
      years,
      subPeriods: calculateBhukti(dashaPlanet, currentDate, endDate),
    });
    
    currentDate = new Date(endDate);
  }
  
  return dashas;
}

function calculateBhukti(mahadashaPlanet: string, start: Date, end: Date): DashaPeriod[] {
  const totalDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const totalDashaYears = DASHA_YEARS[mahadashaPlanet];
  const startIndex = DASHA_SEQUENCE.indexOf(mahadashaPlanet);
  
  const bhuktis: DashaPeriod[] = [];
  let currentDate = new Date(start);
  
  for (let i = 0; i < 9; i++) {
    const bhuktiIndex = (startIndex + i) % 9;
    const bhuktiPlanet = DASHA_SEQUENCE[bhuktiIndex];
    const bhuktiYears = totalDashaYears * DASHA_YEARS[bhuktiPlanet] / 120;
    const bhuktiDays = totalDays * DASHA_YEARS[bhuktiPlanet] / 120;
    const endDate = new Date(currentDate.getTime() + bhuktiDays * 86400000);
    const info = PLANET_DATA.find(p => p.en === bhuktiPlanet);
    
    bhuktis.push({
      planet: bhuktiPlanet,
      tamilName: info?.ta || bhuktiPlanet,
      startDate: new Date(currentDate),
      endDate,
      years: Math.round(bhuktiYears * 100) / 100,
    });
    
    currentDate = new Date(endDate);
  }
  
  return bhuktis;
}

function addYearsToDate(date: Date, years: number): Date {
  const result = new Date(date);
  const days = years * 365.25;
  result.setTime(result.getTime() + days * 86400000);
  return result;
}

export function getCurrentDasha(dashas: DashaPeriod[], currentDate: Date = new Date()): {
  mahadasha: DashaPeriod | null;
  bhukti: DashaPeriod | null;
} {
  const mahadasha = dashas.find(d => currentDate >= d.startDate && currentDate <= d.endDate) || null;
  let bhukti: DashaPeriod | null = null;
  
  if (mahadasha?.subPeriods) {
    bhukti = mahadasha.subPeriods.find(b => currentDate >= b.startDate && currentDate <= b.endDate) || null;
  }
  
  return { mahadasha, bhukti };
}
