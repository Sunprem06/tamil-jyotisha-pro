import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TEMPLES_DATA, PLANET_DATA } from "@/lib/astrology/constants";
import { MapPin, BookOpen, Calendar, Gem } from "lucide-react";

const remedies = [
  {
    planet: "Sun", tamilPlanet: "சூரியன்",
    temple: "சூரியனார் கோயில், கும்பகோணம்",
    mantra: "ஓம் ஸூர்யாய நமஹ",
    fasting: "ஞாயிறு விரதம்",
    gemstone: "மாணிக்கம் (Ruby)",
    charity: "கோதுமை, சிவப்பு ஆடை தானம்",
  },
  {
    planet: "Moon", tamilPlanet: "சந்திரன்",
    temple: "திங்களூர், தஞ்சாவூர்",
    mantra: "ஓம் சந்த்ராய நமஹ",
    fasting: "திங்கள் விரதம்",
    gemstone: "முத்து (Pearl)",
    charity: "அரிசி, வெள்ளை ஆடை தானம்",
  },
  {
    planet: "Mars", tamilPlanet: "செவ்வாய்",
    temple: "வைத்தீஸ்வரன் கோயில்",
    mantra: "ஓம் அங்காரகாய நமஹ",
    fasting: "செவ்வாய் விரதம்",
    gemstone: "பவளம் (Red Coral)",
    charity: "துவரம் பருப்பு, சிவப்பு பொருட்கள்",
  },
  {
    planet: "Mercury", tamilPlanet: "புதன்",
    temple: "திருவெண்காடு",
    mantra: "ஓம் புதாய நமஹ",
    fasting: "புதன் விரதம்",
    gemstone: "மரகதம் (Emerald)",
    charity: "பச்சை பயிறு, பச்சை ஆடை",
  },
  {
    planet: "Jupiter", tamilPlanet: "குரு",
    temple: "ஆலங்குடி",
    mantra: "ஓம் குரவே நமஹ",
    fasting: "வியாழன் விரதம்",
    gemstone: "புஷ்பராகம் (Yellow Sapphire)",
    charity: "கடலை பருப்பு, மஞ்சள் ஆடை",
  },
  {
    planet: "Venus", tamilPlanet: "சுக்கிரன்",
    temple: "கஞ்சனூர்",
    mantra: "ஓம் சுக்ராய நமஹ",
    fasting: "வெள்ளி விரதம்",
    gemstone: "வைரம் (Diamond)",
    charity: "நெய், வெள்ளை ஆடை",
  },
  {
    planet: "Saturn", tamilPlanet: "சனி",
    temple: "திருநள்ளாறு",
    mantra: "ஓம் சனைஸ்சராய நமஹ",
    fasting: "சனி விரதம்",
    gemstone: "நீலம் (Blue Sapphire)",
    charity: "எள், கருப்பு ஆடை",
  },
  {
    planet: "Rahu", tamilPlanet: "ராகு",
    temple: "திருநாகேஸ்வரம்",
    mantra: "ஓம் ராஹவே நமஹ",
    fasting: "சர்ப்ப சாந்தி",
    gemstone: "கோமேதகம் (Hessonite)",
    charity: "உளுந்து, கரும்பு",
  },
  {
    planet: "Ketu", tamilPlanet: "கேது",
    temple: "கீழ்பெரும்பள்ளம்",
    mantra: "ஓம் கேதவே நமஹ",
    fasting: "விநாயகர் வழிபாடு",
    gemstone: "வைடூரியம் (Cat's Eye)",
    charity: "எள் எண்ணெய், போர்வை",
  },
];

export default function RemediesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-5xl">
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">பரிகாரங்கள்</span>
          </h1>
          <p className="text-center text-muted-foreground font-tamil mb-8">
            நவகிரக பரிகாரங்கள் - Remedies for Nine Planets
          </p>

          {/* Navagraha Temples */}
          <div className="rasi-card mb-8">
            <h2 className="text-xl font-bold font-tamil mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> நவகிரக கோயில்கள்
            </h2>
            <p className="text-muted-foreground font-tamil mb-4">
              தமிழ்நாட்டில் உள்ள புகழ்பெற்ற நவகிரக கோயில்கள்
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {TEMPLES_DATA.map(t => (
                <div key={t.name} className="bg-muted/50 rounded-lg p-3">
                  <p className="font-bold font-tamil text-sm">{t.tamilName}</p>
                  <p className="text-xs text-muted-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1"><MapPin className="h-3 w-3 inline mr-1" />{t.location}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Planet-wise Remedies */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {remedies.map(r => (
              <div key={r.planet} className="rasi-card">
                <h3 className="text-lg font-bold font-tamil mb-3">{r.tamilPlanet} ({r.planet})</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="font-tamil">{r.temple}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="font-tamil">{r.mantra}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="font-tamil">{r.fasting}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gem className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <p className="font-tamil">{r.gemstone}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-2 mt-2">
                    <p className="text-xs text-muted-foreground font-tamil">தானம்: {r.charity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
