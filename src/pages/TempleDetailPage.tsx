import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, ExternalLink, BookOpen, Navigation } from "lucide-react";
import { useTempleDetail } from "@/hooks/useUniversalTempleSearch";
import { BackButton } from "@/components/BackButton";
import { VisitWishlistButtons } from "@/components/temple/VisitWishlistButtons";

export default function TempleDetailPage() {
  const { id } = useParams();
  const { temple, nearbyTemples, loading } = useTempleDetail(id);

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

  if (!temple) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-tamil">கோவில் கிடைக்கவில்லை</p>
        </main>
        <Footer />
      </div>
    );
  }

  const varalaru = temple.sthala_varalaru?.[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Temple Header */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-10">
          <div className="container max-w-4xl">
          <BackButton />
            {temple.image_url && (
              <div className="mb-4 rounded-xl overflow-hidden border border-border shadow-md max-h-72 md:max-h-96">
                <img 
                  src={temple.image_url} 
                  alt={temple.name_tamil} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold font-tamil text-foreground">{temple.name_tamil}</h1>
            <p className="text-lg text-muted-foreground mt-1">{temple.name_english}</p>

            {/* Visit & Wishlist Buttons */}
            <div className="mt-4">
              <VisitWishlistButtons templeId={temple.id} templeNameTamil={temple.name_tamil} />
            </div>

            {/* Deity Info Strip */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <Badge className="text-sm">{temple.deity_name_tamil} ({temple.deity_name_english})</Badge>
              {temple.auspicious_day && <Badge variant="outline"><Star className="h-3 w-3 mr-1" /> {temple.auspicious_day}</Badge>}
              {temple.major_festival && <Badge variant="outline">{temple.major_festival}</Badge>}
            </div>

            {/* Special Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {temple.is_arupadai_veedu && (
                <Badge variant="secondary" className="text-sm bg-primary/10 text-primary border-primary/20">
                  ஆறுபடை வீடு #{temple.arupadai_number}
                </Badge>
              )}
              {temple.is_shakti_peetham && (
                <Badge variant="secondary" className="text-sm bg-secondary/10 text-secondary border-secondary/20">
                  சக்தி பீடம்
                </Badge>
              )}
              {temple.is_divya_desam && (
                <Badge variant="secondary" className="text-sm">திவ்ய தேசம் #{temple.divya_desam_number}</Badge>
              )}
            </div>
          </div>
        </section>

        <div className="container max-w-4xl py-8 space-y-6">
          {/* Practical Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold font-tamil text-foreground mb-4">நடைமுறை தகவல்கள்</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground font-tamil">நேரம்</p>
                    <p className="text-sm text-muted-foreground">{temple.timings}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground font-tamil">இடம்</p>
                    <p className="text-sm text-muted-foreground">{temple.location}, {temple.district}, {temple.state}</p>
                  </div>
                </div>
                {temple.entry_fee && (
                  <div>
                    <p className="text-sm font-semibold text-foreground font-tamil">நுழைவு கட்டணம்</p>
                    <p className="text-sm text-muted-foreground">{temple.entry_fee}</p>
                  </div>
                )}
              </div>
              {temple.google_maps_url && (
                <a href={temple.google_maps_url} target="_blank" rel="noopener noreferrer" className="inline-block mt-4">
                  <Button className="font-tamil">
                    <Navigation className="h-4 w-4 mr-2" /> திசை பெறுக (Google Maps)
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

          {/* Sthala Varalaru */}
          {varalaru && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold font-tamil text-foreground">ஸ்தல வரலாறு</h2>
                </div>
                <p className="font-tamil leading-relaxed text-foreground whitespace-pre-line">{varalaru.story_tamil}</p>
                {varalaru.historical_facts && (
                  <div className="mt-4 p-3 rounded-lg bg-background border border-border">
                    <p className="text-sm font-semibold font-tamil text-foreground mb-1">வரலாற்று உண்மைகள்</p>
                    <p className="text-sm font-tamil text-muted-foreground">{varalaru.historical_facts}</p>
                  </div>
                )}
                {varalaru.puranic_reference && (
                  <Badge variant="outline" className="mt-3">{varalaru.puranic_reference}</Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Blessing & Problem Solved */}
          {(temple.blessing_for || temple.problem_solved) && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-tamil text-foreground mb-4">ஏன் இந்த கோவில்?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {temple.blessing_for && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-800 dark:text-green-200 font-tamil mb-1">வரம் / ஆசீர்வாதம்</p>
                      <p className="text-sm font-tamil text-green-700 dark:text-green-300">{temple.blessing_for}</p>
                    </div>
                  )}
                  {temple.problem_solved && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 font-tamil mb-1">தீர்வு / பரிகாரம்</p>
                      <p className="text-sm font-tamil text-blue-700 dark:text-blue-300">{temple.problem_solved}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* When to Visit */}
          {(temple.auspicious_day || temple.major_festival || temple.festival_month) && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-tamil text-foreground mb-3">எந்த நாள் செல்வது?</h2>
                <div className="flex flex-wrap gap-3">
                  {temple.auspicious_day && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground font-tamil">சிறப்பு நாள்</p>
                      <p className="text-sm font-semibold font-tamil">{temple.auspicious_day}</p>
                    </div>
                  )}
                  {temple.major_festival && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground font-tamil">திருவிழா</p>
                      <p className="text-sm font-semibold font-tamil">{temple.major_festival}</p>
                    </div>
                  )}
                  {temple.festival_month && (
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-xs text-muted-foreground font-tamil">மாதம்</p>
                      <p className="text-sm font-semibold font-tamil">{temple.festival_month}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Significance */}
          {temple.significance && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold font-tamil text-foreground mb-2">சிறப்பு</h2>
                <p className="text-sm font-tamil leading-relaxed text-muted-foreground">{temple.significance}</p>
              </CardContent>
            </Card>
          )}

          {/* Nearby Temples */}
          {nearbyTemples.length > 0 && (
            <div>
              <h2 className="text-lg font-bold font-tamil text-foreground mb-3">அருகில் உள்ள கோவில்கள்</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {nearbyTemples.map((t: any) => (
                  <Link key={t.id} to={`/temple/${t.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                      <CardContent className="p-4">
                        <h3 className="font-bold font-tamil text-sm">{t.name_tamil}</h3>
                        <p className="text-xs text-muted-foreground">{t.deity_name_tamil}</p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {t.location}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
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
