import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Clock, Star, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useUniversalTempleSearch } from "@/hooks/useUniversalTempleSearch";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";

const deityColors: Record<string, string> = {
  "முருகன்": "bg-red-100 text-red-800 border-red-200",
  "விநாயகர்": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "மாரியம்மன்": "bg-orange-100 text-orange-800 border-orange-200",
  "காமாட்சி": "bg-green-100 text-green-800 border-green-200",
  "மகாலட்சுமி": "bg-amber-100 text-amber-800 border-amber-200",
  "சரஸ்வதி": "bg-blue-100 text-blue-800 border-blue-200",
  "அய்யனார்": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "முனீஸ்வரர்": "bg-purple-100 text-purple-800 border-purple-200",
  "கருப்பசாமி": "bg-gray-100 text-gray-800 border-gray-200",
};

function TempleCard({ temple }: { temple: any }) {
  const [expanded, setExpanded] = useState(false);
  const varalaru = temple.sthala_varalaru?.[0];

  return (
    <Card className="border-border hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Link to={`/temple/${temple.id}`} className="hover:underline">
              <h3 className="text-lg font-bold font-tamil text-foreground">{temple.name_tamil}</h3>
              <p className="text-sm text-muted-foreground">{temple.name_english}</p>
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {temple.is_arupadai_veedu && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap">ஆறுபடை #{temple.arupadai_number}</Badge>
            )}
            {temple.is_shakti_peetham && (
              <Badge variant="secondary" className="text-xs whitespace-nowrap">சக்தி பீடம்</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <Badge variant="outline" className={deityColors[temple.deity_name_tamil] || "bg-muted text-foreground"}>
            {temple.deity_name_tamil}
          </Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {temple.location}, {temple.district}
          </span>
        </div>

        {temple.auspicious_day && (
          <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 text-primary" />
            <span className="font-tamil">{temple.auspicious_day}</span>
          </div>
        )}

        {temple.blessing_for && (
          <p className="text-sm mt-2 text-muted-foreground font-tamil">
            <span className="font-semibold text-foreground">வரம்:</span> {temple.blessing_for}
          </p>
        )}

        <div className="flex items-center gap-2 mt-3">
          {varalaru && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-tamil text-primary"
            >
              ஸ்தல வரலாறு {expanded ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
            </Button>
          )}
          {temple.google_maps_url && (
            <a href={temple.google_maps_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="text-xs">
                <ExternalLink className="h-3 w-3 mr-1" /> திசை பெறுக
              </Button>
            </a>
          )}
        </div>

        {expanded && varalaru && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm font-tamil leading-relaxed text-foreground">{varalaru.story_tamil}</p>
            {varalaru.puranic_reference && (
              <Badge variant="outline" className="mt-2 text-xs">{varalaru.puranic_reference}</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function UniversalSearchPage() {
  const { query, setQuery, deityFilter, setDeityFilter, temples, deities, allDeities, loading } = useUniversalTempleSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Search */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-10">
          <div className="container max-w-3xl text-center">
          <BackButton />
            <h1 className="text-3xl md:text-4xl font-bold font-tamil text-foreground mb-2">
              தேவதை & கோவில் தேடல்
            </h1>
            <p className="text-muted-foreground font-tamil mb-6">
              தமிழகத்தின் அனைத்து கோவில்களையும் தேவதைகளையும் தேடுங்கள்
            </p>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setDeityFilter(null); }}
                placeholder="தேவதை அல்லது கோவில் பெயர் தேடுக..."
                className="pl-12 h-14 text-lg font-tamil rounded-xl border-2 border-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Deity Filter Pills */}
        <section className="container py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={deityFilter === null ? "default" : "outline"}
              size="sm"
              onClick={() => { setDeityFilter(null); setQuery(""); }}
              className="font-tamil"
            >
              அனைத்தும்
            </Button>
            {allDeities.map((d) => (
              <Button
                key={d.id}
                variant={deityFilter === d.name_tamil ? "default" : "outline"}
                size="sm"
                onClick={() => { setDeityFilter(d.name_tamil); setQuery(""); }}
                className="font-tamil"
              >
                {d.name_tamil}
              </Button>
            ))}
          </div>
        </section>

        {/* Deity Results */}
        {deities.length > 0 && (
          <section className="container pb-4">
            <h2 className="text-lg font-bold font-tamil text-foreground mb-3">தேவதைகள்</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deities.map((d) => (
                <Link key={d.id} to={`/deity/${encodeURIComponent(d.name_english)}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-xl font-tamil font-bold">
                        {d.name_tamil.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold font-tamil">{d.name_tamil}</p>
                        <p className="text-sm text-muted-foreground">{d.name_english} · {d.tradition}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Temple Results */}
        <section className="container pb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-tamil text-foreground">
              கோவில்கள் {temples.length > 0 && <span className="text-muted-foreground font-normal text-sm">({temples.length})</span>}
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-10 text-muted-foreground font-tamil">தேடுகிறது...</div>
          ) : temples.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground font-tamil">
              இந்த தேவதையின் கோவில்கள் விரைவில் சேர்க்கப்படும்
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {temples.map((t) => <TempleCard key={t.id} temple={t} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
