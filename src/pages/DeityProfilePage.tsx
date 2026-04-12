import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";
import { useDeityProfile } from "@/hooks/useUniversalTempleSearch";
import { BackButton } from "@/components/BackButton";

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="p-3 rounded-lg bg-muted/50 border border-border">
      <p className="text-xs text-muted-foreground font-tamil mb-1">{label}</p>
      <p className="text-sm font-semibold font-tamil text-foreground">{value}</p>
    </div>
  );
}

export default function DeityProfilePage() {
  const { deityName } = useParams();
  const { deity, temples, loading } = useDeityProfile(deityName);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-tamil">ஏற்றுகிறது...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!deity) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-tamil">தேவதை கிடைக்கவில்லை</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Deity Header */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-10">
          <div className="container max-w-4xl text-center">
          <BackButton />
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-4xl font-tamil font-bold mb-4 shadow-lg">
              {deity.name_tamil.charAt(0)}
            </div>
            <h1 className="text-4xl font-bold font-tamil text-foreground">{deity.name_tamil}</h1>
            <p className="text-xl text-muted-foreground mt-1">{deity.name_english}</p>
            <Badge className="mt-3">{deity.tradition}</Badge>
          </div>
        </section>

        {/* Info Grid */}
        <section className="container max-w-4xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoItem label="வாகனம்" value={deity.vahana_tamil} />
            <InfoItem label="ஆயுதம்" value={deity.weapon_tamil} />
            <InfoItem label="துணைவர்" value={deity.consort_tamil} />
            <InfoItem label="வழிபடும் நாள்" value={deity.day_of_week} />
            <InfoItem label="நட்சத்திரம்" value={deity.star_nakshatra} />
            <InfoItem label="நிறம்" value={deity.color_association} />
            <InfoItem label="மலர்" value={deity.flower_offering} />
            <InfoItem label="பழம்" value={deity.fruit_offering} />
            <InfoItem label="மந்திரம்" value={deity.main_mantra} />
          </div>
        </section>

        {/* Significance */}
        {deity.significance && (
          <section className="container max-w-4xl pb-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-tamil text-foreground mb-2">முக்கியத்துவம்</h2>
                <p className="text-sm font-tamil leading-relaxed text-muted-foreground">{deity.significance}</p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Temples */}
        <section className="container max-w-4xl pb-10">
          <h2 className="text-xl font-bold font-tamil text-foreground mb-4">
            இந்த தெய்வத்தின் கோவில்கள் <span className="text-muted-foreground text-sm font-normal">({temples.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {temples.map((t) => (
              <Link key={t.id} to={`/temple/${t.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <h3 className="font-bold font-tamil text-foreground">{t.name_tamil}</h3>
                    <p className="text-sm text-muted-foreground">{t.name_english}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {t.location}, {t.district}{t.country && t.country !== 'India' ? `, ${t.country}` : ''}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {t.is_arupadai_veedu && <Badge variant="secondary" className="text-xs">ஆறுபடை #{t.arupadai_number}</Badge>}
                      {(t.is_shakti_peetham || t.is_shakti_peetha) && <Badge variant="secondary" className="text-xs">சக்தி பீடம் {t.shakti_peetha_number ? `#${t.shakti_peetha_number}` : ''}</Badge>}
                      {t.auspicious_day && (
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" /> {t.auspicious_day}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
