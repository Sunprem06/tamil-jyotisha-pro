import { useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getCurrentPanchangamBasic } from "@/lib/astrology/engine";
import { RASI_NAMES } from "@/lib/astrology/constants";

const transitEffects: Record<string, Record<number, string>> = {
  Saturn: {
    0: "சனி 1-ல் பயணம் - உடல் சோர்வு, மன அழுத்தம் ஏற்படலாம்",
    1: "சனி 2-ல் - பொருளாதார சிக்கல்கள் சாத்தியம்",
    2: "சனி 3-ல் - நல்ல காலம், எதிரிகளை வெல்வீர்கள்",
    3: "சனி 4-ல் - வீடு, வாகன பிரச்சனைகள்",
    4: "சனி 5-ல் - குழந்தை விஷயத்தில் கவனம்",
    5: "சனி 6-ல் - சிறந்த காலம், வெற்றி",
    6: "சனி 7-ல் - ஏழரை சனி, திருமண வாழ்வில் சிக்கல்",
    7: "சனி 8-ல் - ஏழரை சனி, உடல் நலம் கவனம்",
    8: "சனி 9-ல் - கஷ்டங்கள் குறையும்",
    9: "சனி 10-ல் - தொழிலில் மாற்றம்",
    10: "சனி 11-ல் - நல்ல காலம், வருமானம் அதிகரிக்கும்",
    11: "சனி 12-ல் - ஏழரை சனி ஆரம்பம், செலவுகள்",
  },
  Jupiter: {
    0: "குரு 1-ல் - புதிய ஆரம்பம்",
    1: "குரு 2-ல் - பொருளாதார வளர்ச்சி",
    2: "குரு 3-ல் - தைரியம் அதிகரிக்கும்",
    3: "குரு 4-ல் - வீடு, வாகன யோகம்",
    4: "குரு 5-ல் - சிறந்த காலம், புத்தி கூர்மை",
    5: "குரு 6-ல் - எதிரிகளை வெல்வீர்கள்",
    6: "குரு 7-ல் - திருமண யோகம்",
    7: "குரு 8-ல் - சிரமங்கள் சாத்தியம்",
    8: "குரு 9-ல் - அதிர்ஷ்ட காலம்",
    9: "குரு 10-ல் - தொழிலில் உயர்வு",
    10: "குரு 11-ல் - லாபம், வெற்றி",
    11: "குரு 12-ல் - செலவுகள், ஆன்மீக ஈடுபாடு",
  },
};

export default function TransitPage() {
  const panchangam = useMemo(() => getCurrentPanchangamBasic(new Date(), 13.0827, 80.2707), []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">கோசார பலன்</span>
          </h1>
          <p className="text-center text-muted-foreground font-tamil mb-8">Transit Effects (Gocharam)</p>

          {/* Saturn Transit */}
          <div className="rasi-card mb-6">
            <h2 className="text-xl font-bold font-tamil mb-4">சனி பெயர்ச்சி (Saturn Transit)</h2>
            <p className="text-muted-foreground font-tamil mb-4">
              உங்கள் சந்திர ராசியை அடிப்படையாகக் கொண்டு சனி கோசார பலன்
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RASI_NAMES.map((rasi, i) => {
                const saturnFromMoon = ((panchangam.sunRasi - i + 12) % 12);
                const effect = transitEffects.Saturn[saturnFromMoon] || "பொதுவான பலன்";
                const isEzharaiSani = [6, 7, 11].includes(saturnFromMoon);
                return (
                  <div key={i} className={`rounded-lg p-3 ${isEzharaiSani ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-tamil">{rasi.ta}</span>
                      {isEzharaiSani && <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded font-tamil">ஏழரை சனி</span>}
                    </div>
                    <p className="text-sm font-tamil">{effect}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Jupiter Transit */}
          <div className="rasi-card">
            <h2 className="text-xl font-bold font-tamil mb-4">குரு பெயர்ச்சி (Jupiter Transit)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RASI_NAMES.map((rasi, i) => {
                const jupFromMoon = ((panchangam.moonRasi - i + 12) % 12);
                const effect = transitEffects.Jupiter[jupFromMoon] || "பொதுவான பலன்";
                const isGood = [2, 5, 7, 9].includes(jupFromMoon);
                return (
                  <div key={i} className={`rounded-lg p-3 ${isGood ? 'bg-accent/20 border border-accent/30' : 'bg-muted/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold font-tamil">{rasi.ta}</span>
                      {isGood && <span className="text-xs bg-accent/30 text-accent-foreground px-2 py-0.5 rounded font-tamil">நல்ல காலம்</span>}
                    </div>
                    <p className="text-sm font-tamil">{effect}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
