import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentPanchangamBasic } from "@/lib/astrology/engine";
import { NAKSHATRA_DATA, TITHI_NAMES, YOGA_NAMES, TAMIL_DAYS, RASI_NAMES } from "@/lib/astrology/constants";
import { Sunrise, Sunset, AlertTriangle } from "lucide-react";
import { BackButton } from "@/components/BackButton";

export default function PanchangamPage() {
  const panchangam = useMemo(() => getCurrentPanchangamBasic(new Date(), 13.0827, 80.2707), []);
  const today = new Date();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">இன்றைய பஞ்சாங்கம்</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {today.toLocaleDateString('ta-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sunrise/Sunset */}
            <div className="rasi-card">
              <h3 className="font-bold font-tamil mb-4 text-lg">சூரிய நேரம்</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-sacred flex items-center justify-center">
                    <Sunrise className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-tamil">உதயம்</p>
                    <p className="text-xl font-bold">{panchangam.sunrise}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-gold flex items-center justify-center">
                    <Sunset className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-tamil">அஸ்தமனம்</p>
                    <p className="text-xl font-bold">{panchangam.sunset}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Panchangam details */}
            <div className="rasi-card">
              <h3 className="font-bold font-tamil mb-4 text-lg">பஞ்ச அங்கம்</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-tamil">திதி</span>
                  <span className="font-bold font-tamil">{TITHI_NAMES[panchangam.tithiIndex]?.ta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-tamil">நட்சத்திரம்</span>
                  <span className="font-bold font-tamil">{NAKSHATRA_DATA[panchangam.nakshatraIndex]?.ta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-tamil">யோகம்</span>
                  <span className="font-bold font-tamil">{YOGA_NAMES[panchangam.yogaIndex]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-tamil">வாரம்</span>
                  <span className="font-bold font-tamil">{TAMIL_DAYS[today.getDay()]}</span>
                </div>
              </div>
            </div>

            {/* Inauspicious times */}
            <div className="rasi-card md:col-span-2">
              <h3 className="font-bold font-tamil mb-4 text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                தவிர்க்க வேண்டிய நேரங்கள்
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-destructive/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">ராகு காலம்</p>
                  <p className="text-xl font-bold">{panchangam.rahuKalam}</p>
                </div>
                <div className="bg-destructive/10 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">யமகண்டம்</p>
                  <p className="text-xl font-bold">{panchangam.yamagandam}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">குளிகை</p>
                  <p className="text-xl font-bold">{panchangam.gulikai}</p>
                </div>
              </div>
            </div>

            {/* Current positions */}
            <div className="rasi-card md:col-span-2">
              <h3 className="font-bold font-tamil mb-4 text-lg">கிரக நிலை</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">சூரிய ராசி</p>
                  <p className="font-bold font-tamil">{RASI_NAMES[panchangam.sunRasi]?.ta}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">சந்திர ராசி</p>
                  <p className="font-bold font-tamil">{RASI_NAMES[panchangam.moonRasi]?.ta}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">நட்சத்திரம்</p>
                  <p className="font-bold font-tamil">{NAKSHATRA_DATA[panchangam.nakshatraIndex]?.ta}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground font-tamil">நட்சத்திர நாதர்</p>
                  <p className="font-bold">{NAKSHATRA_DATA[panchangam.nakshatraIndex]?.lord}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
