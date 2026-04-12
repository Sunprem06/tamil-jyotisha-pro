import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateHoroscope } from "@/lib/astrology/engine";
import { calculateVimshottariDasha, getCurrentDasha } from "@/lib/astrology/dasha";
import { PLANET_DATA } from "@/lib/astrology/constants";
import type { BirthData, DashaPeriod } from "@/lib/astrology/types";
import { BackButton } from "@/components/BackButton";
import { PlaceAutocomplete } from "@/components/PlaceAutocomplete";

export default function DashaPage() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: "", dateOfBirth: new Date(1990, 0, 1), timeOfBirth: "06:00",
    place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5,
  });
  const [dashas, setDashas] = useState<DashaPeriod[]>([]);
  const [expandedDasha, setExpandedDasha] = useState<number | null>(null);

  const handleCalculate = () => {
    const chart = generateHoroscope(birthData);
    const moon = chart.planets.find(p => p.planet === "Moon");
    if (!moon) return;
    
    const nakshatraSpan = 360 / 27;
    const moonDegreeInNakshatra = moon.longitude % nakshatraSpan;
    const result = calculateVimshottariDasha(moon.nakshatra, moonDegreeInNakshatra, birthData.dateOfBirth);
    setDashas(result);
  };

  const current = dashas.length > 0 ? getCurrentDasha(dashas) : null;

  const planetColors: Record<string, string> = {
    Sun: "bg-orange-500", Moon: "bg-blue-300", Mars: "bg-red-500",
    Mercury: "bg-green-500", Jupiter: "bg-yellow-500", Venus: "bg-pink-400",
    Saturn: "bg-gray-600", Rahu: "bg-indigo-500", Ketu: "bg-purple-500",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">விம்சோத்தரி தசா</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">Vimshottari Dasha System</p>

          <div className="rasi-card max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-tamil">பெயர் (Name)</Label>
                <Input type="text" placeholder="உங்கள் பெயர்" value={birthData.name}
                  onChange={e => setBirthData({...birthData, name: e.target.value})} />
              </div>
              <div>
                <Label className="font-tamil">பிறந்த இடம் (Place)</Label>
                <PlaceAutocomplete
                  value={birthData.place}
                  onChange={(place, lat, lng) => setBirthData({...birthData, place, latitude: lat, longitude: lng})}
                  placeholder="சென்னை"
                />
              </div>
              <div>
                <Label className="font-tamil">பிறந்த தேதி</Label>
                <Input type="date" value={birthData.dateOfBirth.toISOString().split('T')[0]}
                  onChange={e => setBirthData({...birthData, dateOfBirth: new Date(e.target.value)})} />
              </div>
              <div>
                <Label className="font-tamil">பிறந்த நேரம்</Label>
                <Input type="time" value={birthData.timeOfBirth}
                  onChange={e => setBirthData({...birthData, timeOfBirth: e.target.value})} />
              </div>
              <div>
                <Label>Latitude</Label>
                <Input type="number" step="0.0001" value={birthData.latitude} readOnly className="bg-muted/50" />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="0.0001" value={birthData.longitude} readOnly className="bg-muted/50" />
              </div>
            </div>
            <Button variant="sacred" className="w-full mt-6 font-tamil" onClick={handleCalculate}>
              தசா கணிக்க (Calculate Dasha)
            </Button>
          </div>

          {current?.mahadasha && (
            <div className="rasi-card mb-8 animate-fade-up">
              <h3 className="text-xl font-bold font-tamil mb-4">தற்போதைய தசா (Current Period)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground font-tamil">மகா தசா</p>
                  <p className="text-2xl font-bold font-tamil">{current.mahadasha.tamilName}</p>
                  <p className="text-sm text-muted-foreground">
                    {current.mahadasha.startDate.toLocaleDateString()} - {current.mahadasha.endDate.toLocaleDateString()}
                  </p>
                </div>
                {current.bhukti && (
                  <div className="bg-accent/20 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground font-tamil">புத்தி</p>
                    <p className="text-2xl font-bold font-tamil">{current.bhukti.tamilName}</p>
                    <p className="text-sm text-muted-foreground">
                      {current.bhukti.startDate.toLocaleDateString()} - {current.bhukti.endDate.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {dashas.length > 0 && (
            <div className="space-y-3 animate-fade-up">
              <h3 className="text-xl font-bold font-tamil">தசா காலநிலை (Dasha Timeline)</h3>
              
              <div className="rasi-card overflow-x-auto">
                <div className="flex gap-1 min-w-[600px] h-12 items-stretch rounded-lg overflow-hidden">
                  {dashas.map((d) => {
                    const totalYears = dashas.reduce((s, dd) => s + dd.years, 0);
                    const widthPercent = (d.years / totalYears) * 100;
                    const isCurrent = current?.mahadasha?.planet === d.planet;
                    return (
                      <div
                        key={d.planet}
                        className={`${planetColors[d.planet] || "bg-muted"} flex items-center justify-center text-xs font-bold rounded ${isCurrent ? "ring-2 ring-foreground" : ""}`}
                        style={{ width: `${widthPercent}%`, minWidth: '30px' }}
                        title={`${d.tamilName} (${d.years} years)`}
                      >
                        <span className="text-primary-foreground truncate px-1">{d.tamilName.slice(0, 3)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {dashas.map((d, i) => (
                <div key={d.planet} className="rasi-card cursor-pointer" onClick={() => setExpandedDasha(expandedDasha === i ? null : i)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${planetColors[d.planet] || "bg-muted"}`} />
                      <div>
                        <span className="font-bold font-tamil">{d.tamilName}</span>
                        <span className="text-muted-foreground ml-2">({d.planet})</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p>{d.years} years</p>
                      <p className="text-muted-foreground">
                        {d.startDate.toLocaleDateString()} - {d.endDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {expandedDasha === i && d.subPeriods && (
                    <div className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-bold font-tamil mb-2">புத்தி காலம் (Bhukti Periods)</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {d.subPeriods.map(sub => (
                          <div key={sub.planet} className="bg-muted/50 rounded-lg p-2 text-sm">
                            <p className="font-semibold font-tamil">{sub.tamilName}</p>
                            <p className="text-xs text-muted-foreground">
                              {sub.startDate.toLocaleDateString()} - {sub.endDate.toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
