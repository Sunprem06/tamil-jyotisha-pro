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
import { generateHoroscope, calculateNavamsa, getCurrentPanchangamBasic } from "@/lib/astrology/engine";
import {
  RASI_NAMES,
  NAKSHATRA_DATA,
  TAMIL_DAYS,
  TAMIL_MONTHS,
  TITHI_NAMES,
  YOGA_NAMES,
  NAKSHATRA_GANA,
  NAKSHATRA_YONI,
  NAKSHATRA_RAJJU,
} from "@/lib/astrology/constants";
import {
  getRahuKalam,
  getYamagandam,
  getKuligai,
  getSunriseTime,
  getSunsetTime,
} from "@/lib/astrology/panchangam";
import { detectDoshas, detectYogas } from "@/lib/astrology/dosha";
import { calculateVimshottariDasha, getCurrentDasha } from "@/lib/astrology/dasha";
import type { BirthData, HoroscopeChart, NavamsaChart, DoshaResult, YogaResult, DashaPeriod } from "@/lib/astrology/types";
import { BackButton } from "@/components/BackButton";
import { PlaceAutocomplete } from "@/components/PlaceAutocomplete";
import { BirthDateSelect, formatDateForInput, parseInputDate } from "@/components/forms/BirthDateSelect";

export default function BirthChartPage() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: "", dateOfBirth: new Date(1990, 0, 1), timeOfBirth: "06:00",
    place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5,
  });
  const [chart, setChart] = useState<HoroscopeChart | null>(null);
  const [navamsa, setNavamsa] = useState<NavamsaChart | null>(null);
  const [doshas, setDoshas] = useState<DoshaResult[]>([]);
  const [yogas, setYogas] = useState<YogaResult[]>([]);
  const [dashas, setDashas] = useState<DashaPeriod[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = () => {
    const horoscope = generateHoroscope(birthData);
    setChart(horoscope);
    setNavamsa(calculateNavamsa(horoscope.planets));
    setDoshas(detectDoshas(horoscope.planets, horoscope.lagna));
    setYogas(detectYogas(horoscope.planets, horoscope.lagna));
    const moon = horoscope.planets.find(p => p.planet === "Moon");
    if (moon) {
      const nakSpan = 360 / 27;
      const degInNak = moon.longitude % nakSpan;
      setDashas(calculateVimshottariDasha(moon.nakshatra, degInNak, birthData.dateOfBirth));
    }
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
                <BirthDateSelect
                  value={formatDateForInput(birthData.dateOfBirth)}
                  onChange={value => setBirthData({...birthData, dateOfBirth: parseInputDate(value)})}
                />
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

              {/* Birth Panchangam Details */}
              {(() => {
                const moon = chart.planets.find(p => p.planet === "Moon");
                if (!moon) return null;
                const moonNakIdx = NAKSHATRA_DATA.findIndex(n => n.en === moon.nakshatra);
                const pan = getCurrentPanchangamBasic(birthData.dateOfBirth, birthData.latitude, birthData.longitude);
                const tithi = TITHI_NAMES[pan.tithiIndex] || TITHI_NAMES[0];
                const yoga = YOGA_NAMES[pan.yogaIndex] || "-";
                const tamilDay = TAMIL_DAYS[birthData.dateOfBirth.getDay()];
                const tamilMonth = TAMIL_MONTHS[birthData.dateOfBirth.getMonth()];
                const gana = moonNakIdx >= 0 ? NAKSHATRA_GANA[moonNakIdx] : "-";
                const yoni = moonNakIdx >= 0 ? NAKSHATRA_YONI[moonNakIdx] : null;
                const rajju = moonNakIdx >= 0 ? NAKSHATRA_RAJJU[moonNakIdx] : "-";
                const rahu = getRahuKalam(birthData.dateOfBirth, birthData.latitude);
                const yama = getYamagandam(birthData.dateOfBirth, birthData.latitude);
                const guli = getKuligai(birthData.dateOfBirth, birthData.latitude);
                const sunrise = getSunriseTime(birthData.dateOfBirth, birthData.latitude);
                const sunset = getSunsetTime(birthData.dateOfBirth, birthData.latitude);
                const sun = chart.planets.find(p => p.planet === "Sun");

                const rows: Array<[string, string, string]> = [
                  ["பெயர்", "Name", birthData.name || "-"],
                  ["பிறந்த தேதி", "Date of Birth", birthData.dateOfBirth.toLocaleDateString("en-GB")],
                  ["பிறந்த நேரம்", "Time of Birth", birthData.timeOfBirth],
                  ["பிறந்த இடம்", "Place of Birth", birthData.place],
                  ["தமிழ் கிழமை", "Tamil Day", tamilDay],
                  ["தமிழ் மாதம்", "Tamil Month", tamilMonth],
                  ["திதி", "Tithi", `${tithi.ta} (${tithi.en})`],
                  ["யோகம்", "Yoga", yoga],
                  ["கரணம்", "Karana", String(pan.karanaIndex + 1)],
                  ["நட்சத்திரம்", "Nakshatra", `${moon.nakshatraTamilName} - பாதம் ${moon.nakshatraPada}`],
                  ["சந்திர ராசி", "Moon Sign (Rasi)", `${moon.rasiTamilName} (${moon.rasiName})`],
                  ["சூரிய ராசி", "Sun Sign", sun ? `${sun.rasiTamilName} (${sun.rasiName})` : "-"],
                  ["லக்னம்", "Lagna (Ascendant)", `${RASI_NAMES[chart.lagna].ta} (${RASI_NAMES[chart.lagna].en})`],
                  ["கணம்", "Gana", gana],
                  ["யோனி", "Yoni", yoni ? `${yoni.animal} (${yoni.gender})` : "-"],
                  ["ரஜ்ஜு", "Rajju", rajju],
                  ["சூரிய உதயம்", "Sunrise", sunrise],
                  ["சூரிய அஸ்தமனம்", "Sunset", sunset],
                  ["ராகு காலம்", "Rahu Kalam", `${rahu.start} - ${rahu.end}`],
                  ["எமகண்டம்", "Yamagandam", `${yama.start} - ${yama.end}`],
                  ["குளிகை", "Kuligai", `${guli.start} - ${guli.end}`],
                ];

                return (
                  <div className="rasi-card overflow-x-auto">
                    <h3 className="text-xl font-bold font-tamil mb-4">ஜோதிட விவரங்கள் (Astrological Details)</h3>
                    <table className="w-full text-sm">
                      <tbody>
                        {rows.map(([ta, en, val], i) => (
                          <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="p-2 font-tamil font-semibold w-1/3">{ta}</td>
                            <td className="p-2 text-muted-foreground w-1/3">{en}</td>
                            <td className="p-2 font-tamil">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

              {/* Current Dasha & Bhukti */}
              {dashas.length > 0 && (() => {
                const { mahadasha, bhukti } = getCurrentDasha(dashas);
                return (
                  <div className="rasi-card">
                    <h3 className="text-xl font-bold font-tamil mb-3">தற்போதைய தசா (Current Dasha)</h3>
                    {mahadasha ? (
                      <div className="space-y-2 font-tamil">
                        <p><span className="text-muted-foreground">மகா தசா:</span> <span className="font-bold text-primary">{mahadasha.tamilName}</span> ({mahadasha.startDate.toLocaleDateString()} → {mahadasha.endDate.toLocaleDateString()})</p>
                        {bhukti && (
                          <p><span className="text-muted-foreground">புத்தி:</span> <span className="font-bold">{bhukti.tamilName}</span> ({bhukti.startDate.toLocaleDateString()} → {bhukti.endDate.toLocaleDateString()})</p>
                        )}
                      </div>
                    ) : <p className="text-muted-foreground">தரவு இல்லை</p>}
                  </div>
                );
              })()}

              {/* Vimshottari Dasha Timeline */}
              {dashas.length > 0 && (
                <div className="rasi-card overflow-x-auto">
                  <h3 className="text-xl font-bold font-tamil mb-4">விம்சோத்தரி தசா (Vimshottari Dasha)</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 font-tamil">கிரகம்</th>
                        <th className="text-left p-2">Planet</th>
                        <th className="text-left p-2 font-tamil">தொடக்கம்</th>
                        <th className="text-left p-2 font-tamil">முடிவு</th>
                        <th className="text-left p-2 font-tamil">ஆண்டுகள்</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashas.map((d, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="p-2 font-tamil font-semibold">{d.tamilName}</td>
                          <td className="p-2">{d.planet}</td>
                          <td className="p-2">{d.startDate.toLocaleDateString()}</td>
                          <td className="p-2">{d.endDate.toLocaleDateString()}</td>
                          <td className="p-2">{d.years}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Doshas */}
              {doshas.length > 0 && (
                <div className="rasi-card">
                  <h3 className="text-xl font-bold font-tamil mb-4">தோஷ பரிசோதனை (Dosha Analysis)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doshas.map((d, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${d.isPresent ? 'border-destructive/40 bg-destructive/5' : 'border-green-500/30 bg-green-500/5'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold font-tamil">{d.tamilName}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${d.isPresent ? 'bg-destructive/20 text-destructive' : 'bg-green-500/20 text-green-700'}`}>
                            {d.isPresent ? `உள்ளது (${d.severity})` : 'இல்லை'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{d.name}</p>
                        <p className="text-sm font-tamil">{d.tamilExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Yogas */}
              {yogas.length > 0 && (
                <div className="rasi-card">
                  <h3 className="text-xl font-bold font-tamil mb-4">யோகங்கள் (Yogas)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {yogas.map((y, i) => (
                      <div key={i} className={`p-4 rounded-lg border ${y.isPresent ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/20'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold font-tamil">{y.tamilName}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded ${y.isPresent ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {y.isPresent ? 'உள்ளது' : 'இல்லை'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{y.name}</p>
                        <p className="text-sm font-tamil">{y.tamilExplanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
