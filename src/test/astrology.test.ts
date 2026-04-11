import { describe, it, expect } from "vitest";
import { generateHoroscope, calculateNavamsa, getCurrentPanchangamBasic } from "@/lib/astrology/engine";
import { calculateVimshottariDasha, getCurrentDasha } from "@/lib/astrology/dasha";
import { detectDoshas, detectYogas } from "@/lib/astrology/dosha";
import { calculatePorutham } from "@/lib/astrology/matching";
import type { BirthData } from "@/lib/astrology/types";

const sampleBirthData: BirthData = {
  name: "Test",
  dateOfBirth: new Date(1990, 4, 15),
  timeOfBirth: "06:30",
  place: "Chennai",
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 5.5,
};

describe("Astrology Engine", () => {
  it("generates a horoscope with 9 planets", () => {
    const chart = generateHoroscope(sampleBirthData);
    expect(chart.planets).toHaveLength(9);
    expect(chart.lagna).toBeGreaterThanOrEqual(0);
    expect(chart.lagna).toBeLessThan(12);
  });

  it("planets have valid rasi (0-11) and nakshatra", () => {
    const chart = generateHoroscope(sampleBirthData);
    for (const p of chart.planets) {
      expect(p.rasi).toBeGreaterThanOrEqual(0);
      expect(p.rasi).toBeLessThan(12);
      expect(p.nakshatraTamilName).toBeTruthy();
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
    }
  });

  it("calculates Navamsa chart", () => {
    const chart = generateHoroscope(sampleBirthData);
    const navamsa = calculateNavamsa(chart.planets);
    expect(navamsa.planets).toHaveLength(9);
    for (const p of navamsa.planets) {
      expect(p.rasi).toBeGreaterThanOrEqual(0);
      expect(p.rasi).toBeLessThan(12);
    }
  });
});

describe("Panchangam", () => {
  it("returns valid panchangam data for today", () => {
    const p = getCurrentPanchangamBasic(new Date(), 13.08, 80.27);
    expect(p.sunrise).toBeTruthy();
    expect(p.sunset).toBeTruthy();
    expect(p.rahuKalam).toBeTruthy();
    expect(p.tithiIndex).toBeGreaterThanOrEqual(0);
    expect(p.nakshatraIndex).toBeGreaterThanOrEqual(0);
    expect(p.nakshatraIndex).toBeLessThan(27);
  });
});

describe("Vimshottari Dasha", () => {
  it("calculates 9 maha dasha periods", () => {
    const chart = generateHoroscope(sampleBirthData);
    const moon = chart.planets.find(p => p.planet === "Moon")!;
    const nakshatraSpan = 360 / 27;
    const moonDegreeInNakshatra = moon.longitude % nakshatraSpan;
    const dashas = calculateVimshottariDasha(moon.nakshatra, moonDegreeInNakshatra, sampleBirthData.dateOfBirth);
    expect(dashas).toHaveLength(9);
    for (const d of dashas) {
      expect(d.years).toBeGreaterThan(0);
      expect(d.subPeriods).toHaveLength(9);
    }
  });

  it("getCurrentDasha returns a valid current period", () => {
    const chart = generateHoroscope(sampleBirthData);
    const moon = chart.planets.find(p => p.planet === "Moon")!;
    const nakshatraSpan = 360 / 27;
    const dashas = calculateVimshottariDasha(moon.nakshatra, moon.longitude % nakshatraSpan, sampleBirthData.dateOfBirth);
    const current = getCurrentDasha(dashas);
    expect(current.mahadasha).toBeTruthy();
  });
});

describe("Dosha Detection", () => {
  it("detects doshas from planet positions", () => {
    const chart = generateHoroscope(sampleBirthData);
    const doshas = detectDoshas(chart.planets, chart.lagna);
    expect(doshas.length).toBeGreaterThanOrEqual(3);
    for (const d of doshas) {
      expect(d.tamilName).toBeTruthy();
      expect(["none", "mild", "moderate", "severe"]).toContain(d.severity);
    }
  });

  it("detects yogas from planet positions", () => {
    const chart = generateHoroscope(sampleBirthData);
    const yogas = detectYogas(chart.planets, chart.lagna);
    expect(yogas.length).toBeGreaterThanOrEqual(2);
    for (const y of yogas) {
      expect(y.tamilName).toBeTruthy();
      expect(typeof y.isPresent).toBe("boolean");
    }
  });
});

describe("Marriage Matching (Porutham)", () => {
  it("calculates 10 poruthams between two horoscopes", () => {
    const result = calculatePorutham(0, 0, 5, 3);
    expect(result.poruthams).toHaveLength(10);
    expect(result.totalScore).toBeGreaterThanOrEqual(0);
    expect(result.totalScore).toBeLessThanOrEqual(10);
    expect(result.percentage).toBeGreaterThanOrEqual(0);
    expect(result.percentage).toBeLessThanOrEqual(100);
    expect(result.tamilRecommendation).toBeTruthy();
  });

  it("same nakshatra/rasi yields high compatibility", () => {
    const result = calculatePorutham(5, 2, 5, 2);
    expect(result.totalScore).toBeGreaterThanOrEqual(3);
  });
});
