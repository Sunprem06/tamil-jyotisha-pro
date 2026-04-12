import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star } from "lucide-react";
import { BackButton } from "@/components/BackButton";

const astrologers = [
  { name: "Dr. ராமசாமி", speciality: "ஜாதக கணிப்பு", experience: "35+ ஆண்டுகள்", rating: 4.9 },
  { name: "பண்டிட் கிருஷ்ணமூர்த்தி", speciality: "பொருத்தம் & முகூர்த்தம்", experience: "40+ ஆண்டுகள்", rating: 4.8 },
  { name: "ஜோதிடர் சுந்தரம்", speciality: "தோஷ பரிகாரம்", experience: "25+ ஆண்டுகள்", rating: 4.7 },
  { name: "Dr. லக்ஷ்மி", speciality: "நாடி ஜோதிடம்", experience: "30+ ஆண்டுகள்", rating: 4.9 },
];

export default function AstrologersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-display mb-8 text-center">
            <span className="text-gradient-sacred font-tamil">ஜோதிடர்கள்</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {astrologers.map(a => (
              <div key={a.name} className="rasi-card">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-sacred flex items-center justify-center text-2xl text-primary-foreground">ௐ</div>
                  <div>
                    <h3 className="font-bold font-tamil text-lg">{a.name}</h3>
                    <p className="text-sm text-muted-foreground font-tamil">{a.speciality}</p>
                    <p className="text-xs text-muted-foreground font-tamil">{a.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-xs font-bold">{a.rating}</span>
                    </div>
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
