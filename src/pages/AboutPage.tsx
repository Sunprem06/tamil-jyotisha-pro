import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <h1 className="text-3xl font-bold font-display mb-2 text-center">
            <span className="text-gradient-sacred font-tamil">எங்களைப் பற்றி</span>
          </h1>
          <p className="text-center text-muted-foreground mb-8">About Us</p>
          <div className="rasi-card space-y-4">
            <p className="font-tamil leading-relaxed">தமிழ் ஜோதிடம் என்பது வேத ஜோதிட அறிவியலை நவீன தொழில்நுட்பத்துடன் இணைத்து வழங்கும் ஒரு முழுமையான ஜோதிட தளமாகும்.</p>
            <p className="font-tamil leading-relaxed">எங்கள் குழு 60+ ஆண்டுகள் அனுபவமுள்ள மூத்த தமிழ் ஜோதிடர்களின் வழிகாட்டுதலின் கீழ் செயல்படுகிறது. லாஹிரி அயனாம்சம், சுவிஸ் எபிமெரிஸ் கணக்கீடு முறைகள் ஆகியவற்றை அடிப்படையாகக் கொண்டு துல்லியமான ஜாதக கணிப்புகளை வழங்குகிறோம்.</p>
            <p className="font-tamil leading-relaxed">ராசி சக்கரம், நவாம்சம், விம்சோத்தரி தசா, 10 பொருத்தங்கள், தோஷ பரிசோதனை, கோசாரம் மற்றும் பரிகாரங்கள் உள்ளிட்ட அனைத்து ஜோதிட சேவைகளையும் ஒரே இடத்தில் பெறலாம்.</p>
            <div className="bg-muted/50 rounded-lg p-4 mt-6">
              <h3 className="font-bold font-tamil mb-2">Maanagarram Hi Tech Solutions</h3>
              <p className="text-sm text-muted-foreground">
                <a href="https://mhtsdigixr.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mhtsdigixr.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
