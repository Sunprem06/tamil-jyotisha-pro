import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateHoroscope } from "@/lib/astrology/engine";
import { detectDoshas, detectYogas } from "@/lib/astrology/dosha";
import type { BirthData, DoshaResult, YogaResult } from "@/lib/astrology/types";
import { Shield, AlertTriangle, Star } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function DoshaPage() {
  const [birthData, setBirthData] = useState<BirthData>({
    name: "", dateOfBirth: new Date(1990, 0, 1), timeOfBirth: "06:00",
    place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5,
  });
  const [doshas, setDoshas] = useState<DoshaResult[]>([]);
  const [yogas, setYogas] = useState<YogaResult[]>([]);

  const handleAnalyze = () => {
    const chart = generateHoroscope(birthData);
    setDoshas(detectDoshas(chart.planets, chart.lagna));
    setYogas(detectYogas(chart.planets, chart.lagna));
  };

  const severityColors = {
    none: "bg-green-100 text-green-800",
    mild: "bg-yellow-100 text-yellow-800",
    moderate: "bg-orange-100 text-orange-800",
    severe: "bg-red-100 text-red-800",
  };

  const severityLabels = {
    none: "இல்லை", mild: "லேசான", moderate: "மிதமான", severe: "தீவிர",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">தோஷ & யோக பரிசோதனை</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">Dosha & Yoga Analysis</p>

          <div className="rasi-card max-w-2xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Input type="number" step="0.0001" value={birthData.latitude}
                  onChange={e => setBirthData({...birthData, latitude: parseFloat(e.target.value) || 0})} />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input type="number" step="0.0001" value={birthData.longitude}
                  onChange={e => setBirthData({...birthData, longitude: parseFloat(e.target.value) || 0})} />
              </div>
            </div>
            <Button variant="sacred" className="w-full mt-6 font-tamil" onClick={handleAnalyze}>
              <Shield className="h-5 w-5 mr-2" /> பரிசோதிக்க (Analyze)
            </Button>
          </div>

          {doshas.length > 0 && (
            <div className="space-y-6 animate-fade-up">
              <h2 className="text-2xl font-bold font-tamil flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" /> தோஷங்கள் (Doshas)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doshas.map(d => (
                  <div key={d.name} className={`rasi-card ${d.isPresent ? 'border-destructive/30' : 'border-green-500/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold font-tamil">{d.tamilName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${severityColors[d.severity]}`}>
                        {severityLabels[d.severity]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{d.name}</p>
                    <p className="text-sm font-tamil">{d.tamilExplanation}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold font-tamil flex items-center gap-2 mt-8">
                <Star className="h-6 w-6 text-accent" /> யோகங்கள் (Yogas)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {yogas.map(y => (
                  <div key={y.name} className={`rasi-card ${y.isPresent ? 'border-accent/30' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold font-tamil">{y.tamilName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${y.isPresent ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {y.isPresent ? "உள்ளது" : "இல்லை"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{y.name}</p>
                    <p className="text-sm font-tamil">{y.tamilExplanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
