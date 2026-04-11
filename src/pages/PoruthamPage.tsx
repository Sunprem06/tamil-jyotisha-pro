import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculatePorutham } from "@/lib/astrology/matching";
import { NAKSHATRA_DATA, RASI_NAMES } from "@/lib/astrology/constants";
import type { MatchingResult } from "@/lib/astrology/types";
import { Heart, Check, X } from "lucide-react";

export default function PoruthamPage() {
  const [boyNakshatra, setBoyNakshatra] = useState<number>(0);
  const [boyRasi, setBoyRasi] = useState<number>(0);
  const [girlNakshatra, setGirlNakshatra] = useState<number>(0);
  const [girlRasi, setGirlRasi] = useState<number>(0);
  const [result, setResult] = useState<MatchingResult | null>(null);

  const handleMatch = () => {
    setResult(calculatePorutham(boyNakshatra, boyRasi, girlNakshatra, girlRasi));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">திருமண பொருத்தம்</span>
          </h1>
          <p className="text-center text-muted-foreground font-tamil mb-8">10 பொருத்தங்கள் - Marriage Matching</p>

          <div className="rasi-card max-w-3xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Boy */}
              <div className="space-y-4">
                <h3 className="font-bold font-tamil text-lg text-center">மாப்பிள்ளை (Groom)</h3>
                <div>
                  <Label className="font-tamil">நட்சத்திரம்</Label>
                  <Select value={String(boyNakshatra)} onValueChange={v => setBoyNakshatra(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NAKSHATRA_DATA.map((n, i) => (
                        <SelectItem key={i} value={String(i)}>{n.ta} ({n.en})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-tamil">ராசி</Label>
                  <Select value={String(boyRasi)} onValueChange={v => setBoyRasi(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RASI_NAMES.map((r, i) => (
                        <SelectItem key={i} value={String(i)}>{r.ta} ({r.en})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Girl */}
              <div className="space-y-4">
                <h3 className="font-bold font-tamil text-lg text-center">மணப்பெண் (Bride)</h3>
                <div>
                  <Label className="font-tamil">நட்சத்திரம்</Label>
                  <Select value={String(girlNakshatra)} onValueChange={v => setGirlNakshatra(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {NAKSHATRA_DATA.map((n, i) => (
                        <SelectItem key={i} value={String(i)}>{n.ta} ({n.en})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-tamil">ராசி</Label>
                  <Select value={String(girlRasi)} onValueChange={v => setGirlRasi(Number(v))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {RASI_NAMES.map((r, i) => (
                        <SelectItem key={i} value={String(i)}>{r.ta} ({r.en})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button variant="sacred" className="w-full mt-6 font-tamil gap-2" onClick={handleMatch}>
              <Heart className="h-5 w-5" /> பொருத்தம் பார்க்க
            </Button>
          </div>

          {result && (
            <div className="animate-fade-up space-y-6">
              {/* Score */}
              <div className="rasi-card text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-sacred mb-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary-foreground">{result.totalScore}/10</p>
                    <p className="text-sm text-primary-foreground/80">{result.percentage}%</p>
                  </div>
                </div>
                <p className="text-lg font-bold font-tamil">{result.tamilRecommendation}</p>
                <p className="text-muted-foreground">{result.recommendation}</p>
              </div>

              {/* Individual Poruthams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.poruthams.map(p => (
                  <div key={p.name} className={`rasi-card ${p.matched ? 'border-green-500/30' : 'border-destructive/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold font-tamil">{p.tamilName}</h4>
                      {p.matched ? (
                        <span className="flex items-center gap-1 text-green-600 text-sm"><Check className="h-4 w-4" /> பொருத்தம்</span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive text-sm"><X className="h-4 w-4" /> பொருந்தவில்லை</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.name}</p>
                    <p className="text-sm font-tamil mt-1">{p.tamilExplanation}</p>
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
