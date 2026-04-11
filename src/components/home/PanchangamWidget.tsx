import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sunrise, Sunset, ArrowRight } from "lucide-react";
import { getCurrentPanchangamBasic } from "@/lib/astrology/engine";
import { NAKSHATRA_DATA, TITHI_NAMES, YOGA_NAMES, TAMIL_DAYS } from "@/lib/astrology/constants";

export function PanchangamWidget() {
  const panchangam = useMemo(() => {
    const now = new Date();
    // Default to Chennai coordinates
    return getCurrentPanchangamBasic(now, 13.0827, 80.2707);
  }, []);

  const today = new Date();
  const dayName = TAMIL_DAYS[today.getDay()];
  const tithi = TITHI_NAMES[panchangam.tithiIndex];
  const nakshatra = NAKSHATRA_DATA[panchangam.nakshatraIndex];
  const yoga = YOGA_NAMES[panchangam.yogaIndex];

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              <span className="text-gradient-sacred font-tamil">இன்றைய பஞ்சாங்கம்</span>
            </h2>
            <p className="text-muted-foreground font-tamil">
              {today.toLocaleDateString('ta-IN')} - {dayName}
            </p>
          </div>

          <div className="rasi-card p-6 md:p-8 animate-fade-up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-sacred mx-auto mb-2">
                  <Sunrise className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-tamil">சூரிய உதயம்</p>
                <p className="font-bold">{panchangam.sunrise}</p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold mx-auto mb-2">
                  <Sunset className="h-6 w-6 text-accent-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-tamil">சூரிய அஸ்தமனம்</p>
                <p className="font-bold">{panchangam.sunset}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-tamil">திதி</p>
                <p className="font-bold font-tamil">{tithi?.ta}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-tamil">நட்சத்திரம்</p>
                <p className="font-bold font-tamil">{nakshatra?.ta}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground font-tamil">யோகம்</p>
                <p className="font-semibold text-sm font-tamil">{yoga}</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground font-tamil">ராகு காலம்</p>
                <p className="font-semibold text-sm">{panchangam.rahuKalam}</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground font-tamil">யமகண்டம்</p>
                <p className="font-semibold text-sm">{panchangam.yamagandam}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground font-tamil">குளிகை</p>
                <p className="font-semibold text-sm">{panchangam.gulikai}</p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/panchangam">
                <Button variant="outline" className="gap-2 font-tamil">
                  முழு பஞ்சாங்கம் <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
