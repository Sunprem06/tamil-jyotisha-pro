import { supabase } from "@/integrations/supabase/client";
import { RASI_NAMES, NAKSHATRA_DATA, PLANET_DATA } from "./constants";
import type { BirthData, HoroscopeChart, PlanetPosition } from "./types";

interface SwissPlanet {
  planet: string;
  longitude: number;
  rasi: number;
  degree: number;
  nakshatra: string;
  nakshatraPada: number;
  isRetrograde: boolean;
}

interface SwissResponse {
  julianDay: number;
  ayanamsa: number;
  lagna: number;
  lagnaLongitude: number;
  planets: SwissPlanet[];
  engine: string;
  version: string;
}

export async function generateSwissHoroscope(birth: BirthData): Promise<{ chart: HoroscopeChart; meta: { ayanamsa: number; engine: string; jd: number } }> {
  const [hh, mm] = birth.timeOfBirth.split(":").map(Number);
  const dob = birth.dateOfBirth;
  const { data, error } = await supabase.functions.invoke<SwissResponse>("swiss-chart", {
    body: {
      year: dob.getFullYear(),
      month: dob.getMonth() + 1,
      day: dob.getDate(),
      hour: hh || 0,
      minute: mm || 0,
      latitude: birth.latitude,
      longitude: birth.longitude,
      timezone: birth.timezone,
    },
  });
  if (error || !data) throw new Error(error?.message || "Swiss chart engine failed");

  const planets: PlanetPosition[] = data.planets.map((p) => {
    const meta = PLANET_DATA.find((d) => d.en === p.planet);
    const nak = NAKSHATRA_DATA.find((n) => n.en === p.nakshatra);
    return {
      planet: p.planet,
      tamilName: meta?.ta || p.planet,
      longitude: p.longitude,
      rasi: p.rasi,
      rasiName: RASI_NAMES[p.rasi].en,
      rasiTamilName: RASI_NAMES[p.rasi].ta,
      degree: p.degree,
      nakshatra: p.nakshatra,
      nakshatraTamilName: nak?.ta || p.nakshatra,
      nakshatraPada: p.nakshatraPada,
      isRetrograde: p.isRetrograde,
    };
  });

  const moon = planets.find((p) => p.planet === "Moon");
  return {
    chart: {
      lagna: data.lagna,
      lagnaNakshatra: moon?.nakshatra || "",
      planets,
      houses: Array.from({ length: 12 }, (_, i) => (data.lagna + i) % 12),
    },
    meta: { ayanamsa: data.ayanamsa, engine: data.engine, jd: data.julianDay },
  };
}