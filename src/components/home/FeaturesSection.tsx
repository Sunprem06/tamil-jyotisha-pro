import { Link } from "react-router-dom";
import { Heart, Calendar, Star, FileText, ArrowRight, Eye, Shield, Orbit } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { icon: Star, title: "ஜாதகம்", titleEn: "Birth Chart", description: "ராசி, நவாம்சம் மற்றும் கிரக நிலைகள்", href: "/birth-chart", color: "from-saffron to-gold" },
  { icon: Calendar, title: "பஞ்சாங்கம்", titleEn: "Panchangam", description: "தினசரி திதி, நட்சத்திரம், ராகு காலம்", href: "/panchangam", color: "from-maroon to-maroon-light" },
  { icon: Heart, title: "பொருத்தம்", titleEn: "Marriage Matching", description: "10 பொருத்தங்கள் - திருமண இணக்கம்", href: "/porutham", color: "from-pink-500 to-rose-500" },
  { icon: Orbit, title: "தசா புத்தி", titleEn: "Dasha System", description: "விம்சோத்தரி தசா, புத்தி, அந்தரம்", href: "/dasha", color: "from-emerald-600 to-teal-500" },
  { icon: Shield, title: "தோஷம்", titleEn: "Dosha Analysis", description: "செவ்வாய், கால சர்ப்பம், ராகு தோஷம்", href: "/dosha", color: "from-blue-600 to-indigo-500" },
  { icon: Eye, title: "கோசாரம்", titleEn: "Transit", description: "சனி பெயர்ச்சி, குரு பெயர்ச்சி", href: "/transit", color: "from-amber-500 to-orange-500" },
  { icon: FileText, title: "பரிகாரம்", titleEn: "Remedies", description: "கோயில், மந்திரம், விரதம்", href: "/remedies", color: "from-purple-500 to-violet-500" },
  { icon: Star, title: "ராசிபலன்", titleEn: "Daily Horoscope", description: "12 ராசிகளுக்கும் தினசரி பலன்", href: "/rasi", color: "from-red-500 to-orange-500" },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            <span className="text-gradient-sacred font-tamil">எங்கள் சேவைகள்</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-tamil">
            வேத ஜோதிடத்தின் முழுமையான சேவைகளை ஒரே இடத்தில் பெறுங்கள்
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Link key={feature.href} to={feature.href} className="group animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="rasi-card h-full group-hover:border-primary/30">
                <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br shadow-sacred transition-transform group-hover:scale-110", feature.color)}>
                  <feature.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold font-tamil mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">{feature.titleEn}</p>
                <p className="text-sm text-muted-foreground font-tamil">{feature.description}</p>
                <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="font-tamil">மேலும்</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
