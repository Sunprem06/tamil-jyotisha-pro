import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero pattern-kolam">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-sacred opacity-10 blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-gradient-gold opacity-10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-gold/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-gold/20" />
      </div>

      <div className="container relative z-10 text-center py-16">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-sacred text-5xl shadow-glow animate-glow">
          <span className="text-primary-foreground">ௐ</span>
        </div>

        <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold font-display text-foreground animate-fade-up">
          <span className="text-gradient-sacred">தமிழ் ஜோதிடம்</span>
        </h1>
        <p className="mb-2 text-xl md:text-2xl font-display text-muted-foreground animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Tamil Jothidam
        </p>
        <p className="mb-8 max-w-2xl mx-auto text-lg text-muted-foreground font-tamil animate-fade-up" style={{ animationDelay: "0.2s" }}>
          வேத ஜோதிடத்தின் பழமையான ஞானத்துடன் உங்கள் எதிர்காலத்தை கண்டறியுங்கள்.
          தினசரி ராசிபலன், பஞ்சாங்கம், முகூர்த்தம் மற்றும் பொருத்தம் ஆகியவற்றை பெறுங்கள்.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/birth-chart">
            <Button variant="sacred" size="xl" className="gap-2">
              <Star className="h-5 w-5" />
              <span className="font-tamil">ஜாதகம் கணிக்க</span>
            </Button>
          </Link>
          <Link to="/panchangam">
            <Button variant="outline" size="xl" className="gap-2">
              <Calendar className="h-5 w-5" />
              <span className="font-tamil">பஞ்சாங்கம்</span>
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { num: "12", label: "ராசிகள்" },
            { num: "27", label: "நட்சத்திரங்கள்" },
            { num: "9", label: "கிரகங்கள்" },
            { num: "10", label: "பொருத்தங்கள்" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary font-display">{stat.num}</div>
              <div className="text-sm text-muted-foreground font-tamil">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
