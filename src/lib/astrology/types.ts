export interface BirthData {
  name: string;
  dateOfBirth: Date;
  timeOfBirth: string; // HH:MM
  place: string;
  latitude: number;
  longitude: number;
  timezone: number; // offset in hours
}

export interface PlanetPosition {
  planet: string;
  tamilName: string;
  longitude: number; // sidereal longitude in degrees
  rasi: number; // 0-11
  rasiName: string;
  rasiTamilName: string;
  degree: number; // degree within rasi
  nakshatra: string;
  nakshatraTamilName: string;
  nakshatraPada: number;
  isRetrograde: boolean;
}

export interface HoroscopeChart {
  lagna: number;
  lagnaNakshatra: string;
  planets: PlanetPosition[];
  houses: number[]; // house cusps
}

export interface NavamsaChart {
  planets: { planet: string; rasi: number; rasiName: string }[];
}

export interface DashaPeriod {
  planet: string;
  tamilName: string;
  startDate: Date;
  endDate: Date;
  years: number;
  subPeriods?: DashaPeriod[];
}

export interface PanchangamData {
  date: Date;
  day: string;
  tamilDay: string;
  tithi: string;
  tithiTamil: string;
  nakshatra: string;
  nakshatraTamil: string;
  yoga: string;
  yogaTamil: string;
  karana: string;
  karanaTamil: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  rahuKalam: string;
  yamagandam: string;
  gulikai: string;
  tamilMonth: string;
  tamilYear: string;
}

export interface DoshaResult {
  name: string;
  tamilName: string;
  isPresent: boolean;
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  explanation: string;
  tamilExplanation: string;
}

export interface YogaResult {
  name: string;
  tamilName: string;
  isPresent: boolean;
  explanation: string;
  tamilExplanation: string;
}

export interface PoruthamResult {
  name: string;
  tamilName: string;
  matched: boolean;
  score: number;
  maxScore: number;
  explanation: string;
  tamilExplanation: string;
}

export interface MatchingResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  poruthams: PoruthamResult[];
  recommendation: string;
  tamilRecommendation: string;
}

export interface TransitResult {
  planet: string;
  tamilName: string;
  currentRasi: string;
  currentRasiTamil: string;
  effect: string;
  tamilEffect: string;
  startDate: string;
  endDate: string;
}

export interface Remedy {
  type: 'temple' | 'mantra' | 'fasting' | 'gemstone' | 'charity';
  title: string;
  tamilTitle: string;
  description: string;
  tamilDescription: string;
  planet?: string;
}
