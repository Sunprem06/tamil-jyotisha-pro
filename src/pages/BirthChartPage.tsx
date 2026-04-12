import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SouthIndianChart } from "@/components/charts/SouthIndianChart";
import { generateHoroscope, calculateNavamsa } from "@/lib/astrology/engine";
import { RASI_NAMES, NAKSHATRA_DATA } from "@/lib/astrology/constants";
import type { BirthData, HoroscopeChart, NavamsaChart } from "@/lib/astrology/types";
import { BackButton } from "@/components/BackButton";
import { PlaceAutocomplete } from "@/components/PlaceAutocomplete";

export default function BirthChartPage() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: "", dateOfBirth: new Date(1990, 0, 1), timeOfBirth: "06:00",
    place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5,
  });
  const [chart, setChart] = useState<HoroscopeChart | null>(null);
  const [navamsa, setNavamsa] = useState<NavamsaChart | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = () => {
    const horoscope = generateHoroscope(birthData);
    setChart(horoscope);
    setNavamsa(calculateNavamsa(horoscope.planets));
  };

  const handleSave = async () => {
    if (!user || !chart) return;
    const { error } = await supabase.from("birth_charts").insert({
      user_id: user.id,
      chart_type: "rasi",
      name: birthData.name || "Unnamed Chart",
      chart_data: { chart, navamsa, birthData: { ...birthData, dateOfBirth: birthData.dateOfBirth.toISOString() } } as any,
    });
    if (error) toast({ title: "பிழை", description: error.message, variant: "destructive" });
    else toast({ title: "சேமிக்கப்பட்டது!", description: "ஜாதகம் வெற்றிகரமாக சேமிக்கப்பட்டது" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">ஜாதக கணிப்பு</span>
          </h1>
          <p className="text-center text-muted-foreground font-tamil mb-8">Birth Chart Generation</p>

          <div className="rasi-card max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-tamil">பெயர் (Name)</Label>
                <Input value={birthData.name} onChange={e => setBirthData({...birthData, name: e.target.value})} placeholder="பெயர் உள்ளிடவும்" />
              </div>
              <div>
                <Label className="font-tamil">பிறந்த தேதி (Date of Birth)</Label>
                <Input type="date" value={birthData.dateOfBirth.toISOString().split('T')[0]}
                  onChange={e => setBirthData({...birthData, dateOfBirth: new Date(e.target.value)})} />
              </div>
              <div>
                <Label className="font-tamil">பிறந்த நேரம் (Time of Birth)</Label>
                <div className="flex gap-2">
                  <Input type="time" value={birthData.timeOfBirth}
                    onChange={e => setBirthData({...birthData, timeOfBirth: e.target.value})} className="flex-1" />
                  <span className="flex items-center text-sm text-muted-foreground px-2 bg-muted rounded-md">
                    {(() => { const h = parseInt(birthData.timeOfBirth.split(':')[0] || '0'); return h >= 12 ? 'PM' : 'AM'; })()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">24-hour format — AM/PM shown automatically</p>
              </div>
              <div>
                <Label className="font-tamil">பிறந்த இடம் (Place)</Label>
                <PlaceAutocomplete
                  value={birthData.place}
                  onChange={(place, lat, lng) => setBirthData({...birthData, place, latitude: lat, longitude: lng})}
                  placeholder="Chennai"
                />
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
            <Button variant="sacred" className="w-full mt-6 font-tamil" onClick={handleGenerate}>
              ஜாதகம் கணிக்க (Generate Chart)
            </Button>
          </div>

          {chart && (
            <div className="flex justify-center mb-6">
              {user && (
                <Button variant="outline" className="font-tamil" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" /> ஜாதகம் சேமிக்க (Save Chart)
                </Button>
              )}
            </div>
          )}

          {chart && (
            <div className="animate-fade-up space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SouthIndianChart lagna={chart.lagna} planets={chart.planets} title="ராசி சக்கரம்" />
                {navamsa && (
                  <SouthIndianChart
                    lagna={chart.lagna}
                    planets={navamsa.planets.map((p, i) => ({
                      ...chart.planets[i], rasi: p.rasi, rasiName: p.rasiName,
                      rasiTamilName: RASI_NAMES[p.rasi].ta, degree: 15,
                    }))}
                    title="நவாம்ச சக்கரம் (D9)"
                  />
                )}
              </div>

              <div className="rasi-card overflow-x-auto">
                <h3 className="text-xl font-bold font-tamil mb-4">கிரக நிலைகள் (Planet Positions)</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2 font-tamil">கிரகம்</th>
                      <th className="text-left p-2">Planet</th>
                      <th className="text-left p-2 font-tamil">ராசி</th>
                      <th className="text-left p-2">Degree</th>
                      <th className="text-left p-2 font-tamil">நட்சத்திரம்</th>
                      <th className="text-left p-2">Pada</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.planets.map(p => (
                      <tr key={p.planet} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="p-2 font-tamil font-semibold">{p.tamilName}</td>
                        <td className="p-2">{p.planet}</td>
                        <td className="p-2 font-tamil">{p.rasiTamilName}</td>
                        <td className="p-2">{p.degree.toFixed(2)}°</td>
                        <td className="p-2 font-tamil">{p.nakshatraTamilName}</td>
                        <td className="p-2">{p.nakshatraPada}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rasi-card">
                <h3 className="text-xl font-bold font-tamil mb-2">லக்னம் (Ascendant)</h3>
                <p className="font-tamil text-lg">{RASI_NAMES[chart.lagna].ta} ({RASI_NAMES[chart.lagna].en})</p>
                <p className="text-muted-foreground font-tamil mt-1">
                  சந்திர நட்சத்திரம்: {chart.planets.find(p => p.planet === "Moon")?.nakshatraTamilName}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
