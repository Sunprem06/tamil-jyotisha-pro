import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { useNavagrahaTemples } from "@/hooks/useTemplesByDeity";
import { Search, MapPin, Star, ChevronRight } from "lucide-react";

const TAMIL_DAYS = ["ஞாயிற்றுக்கிழமை", "திங்கட்கிழமை", "செவ்வாய்க்கிழமை", "புதன்கிழமை", "வியாழக்கிழமை", "வெள்ளிக்கிழமை", "சனிக்கிழமை"];

const PLANET_COLORS: Record<number, string> = {
  1: "text-amber-600 bg-amber-50 border-amber-200",
  2: "text-blue-600 bg-blue-50 border-blue-200",
  3: "text-red-600 bg-red-50 border-red-200",
  4: "text-green-600 bg-green-50 border-green-200",
  5: "text-yellow-600 bg-yellow-50 border-yellow-200",
  6: "text-pink-600 bg-pink-50 border-pink-200",
  7: "text-gray-700 bg-gray-100 border-gray-300",
  8: "text-purple-600 bg-purple-50 border-purple-200",
  9: "text-teal-600 bg-teal-50 border-teal-200",
};

const CATEGORIES = [
  { icon: "🪐", titleTa: "நவகிரக தலங்கள்", titleEn: "Navagraha Sthalams", count: "9", desc: "கோள் தோஷ பரிகார தலங்கள்", href: "/navagraha" },
  { icon: "💊", titleTa: "பரிகார தலங்கள்", titleEn: "Parigara Finder", count: "", desc: "உங்கள் தோஷத்திற்கான கோவில்", href: "/remedies" },
  { icon: "🔥", titleTa: "பஞ்சபூத ஸ்தலங்கள்", titleEn: "Pancha Bhuta Stalas", count: "5", desc: "நிலம் நீர் நெருப்பு காற்று ஆகாயம்", href: "/deity-search" },
  { icon: "🌸", titleTa: "108 திவ்ய தேசங்கள்", titleEn: "108 Divya Desams", count: "108", desc: "ஆழ்வார்கள் மங்களாசாசனம் செய்த தலங்கள்", href: "/deity-search" },
  { icon: "⭐", titleTa: "UNESCO தலங்கள்", titleEn: "UNESCO Heritage", count: "15+", desc: "உலக அங்கீகாரம் பெற்ற கோவில்கள்", href: "/deity-search" },
  { icon: "🕉", titleTa: "12 ஜோதிர்லிங்கங்கள்", titleEn: "12 Jyotirlingas", count: "12", desc: "சிவன் ஒளியாக வீற்றிருக்கும் தலங்கள்", href: "/deity-search" },
  { icon: "🦚", titleTa: "ஆறுபடை வீடுகள்", titleEn: "Arupadai Veedu", count: "6", desc: "முருகனின் 6 புனித இல்லங்கள்", href: "/deity/Murugan" },
  { icon: "🗺", titleTa: "கோவில் வரைபடம்", titleEn: "Temple Map", count: "134+", desc: "அருகில் உள்ள கோவில்களை கண்டறிக", href: "/deity-search" },
  { icon: "🌍", titleTa: "உலக கோவில்கள்", titleEn: "World Temples", count: "9 நாடுகள்", desc: "புகழ்மிக்க கோவில்கள்", href: "/deity-search" },
  { icon: "📖", titleTa: "என் யாத்திரை", titleEn: "My Passport", count: "", desc: "உங்கள் யாத்திரை பதிவேடு", href: "/passport" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const [templesRes, countriesRes] = await Promise.all([
        supabase.from("temples").select("id", { count: "exact", head: true }),
        supabase.from("temples").select("country"),
      ]);
      const countries = new Set(countriesRes.data?.map((t) => t.country)).size;
      return { temples: templesRes.count ?? 0, countries };
    },
  });

  const { data: navagrahaTemples } = useNavagrahaTemples();

  const todayTamil = TAMIL_DAYS[new Date().getDay()];
  const { data: todayTemples } = useQuery({
    queryKey: ["today-temples", todayTamil],
    queryFn: async () => {
      const { data } = await supabase
        .from("temples")
        .select("*")
        .ilike("auspicious_day", `%${todayTamil}%`)
        .limit(3);
      return data ?? [];
    },
  });

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setShowResults(false); return; }
    const timer = setTimeout(async () => {
      const q = searchQuery.trim();
      const { data } = await supabase
        .from("temples")
        .select("id,name_tamil,name_english,deity_name_tamil,location")
        .or(`name_tamil.ilike.%${q}%,name_english.ilike.%${q}%,deity_name_tamil.ilike.%${q}%,location.ilike.%${q}%`)
        .limit(8);
      setSearchResults(data ?? []);
      setShowResults(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Stats Bar */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-6">
          <div className="container max-w-6xl">
            <BackButton />
            <h1 className="text-3xl font-bold font-tamil text-foreground mb-4">🛕 கோவில் தரிசனம்</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{stats?.temples ?? "..."}</p><p className="text-xs font-tamil text-muted-foreground">கோவில்கள்</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{stats?.countries ?? "..."}</p><p className="text-xs font-tamil text-muted-foreground">நாடுகள்</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">9</p><p className="text-xs font-tamil text-muted-foreground">நவகிரக தலங்கள்</p></CardContent></Card>
              <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">20+</p><p className="text-xs font-tamil text-muted-foreground">வகைகள்</p></CardContent></Card>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="container max-w-6xl py-6">
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                className="pl-10 h-12 text-base border-2 border-primary/30 focus:border-primary font-tamil"
                placeholder="கோவில் அல்லது தெய்வம் தேடுக... முருகன், காஞ்சி, திருவண்ணாமலை"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
              />
            </div>
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {searchResults.map((t) => (
                  <button
                    key={t.id}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
                    onMouseDown={() => navigate(`/temple/${t.id}`)}
                  >
                    <p className="font-tamil font-semibold text-sm text-foreground">{t.name_tamil}</p>
                    <p className="text-xs text-muted-foreground">{t.name_english} • {t.deity_name_tamil} • {t.location}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Category Grid */}
        <section className="container max-w-6xl pb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <Link key={cat.titleEn} to={cat.href}>
                <Card className="h-full hover:shadow-md transition-shadow border-l-4 border-l-primary/60">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{cat.icon}</span>
                      {cat.count && <Badge variant="secondary" className="text-xs">{cat.count}</Badge>}
                    </div>
                    <h3 className="font-bold font-tamil text-sm mt-2 text-foreground">{cat.titleTa}</h3>
                    <p className="text-xs text-muted-foreground">{cat.titleEn}</p>
                    <p className="text-xs font-tamil text-muted-foreground mt-1">{cat.desc}</p>
                    <p className="text-xs font-tamil text-primary mt-2 flex items-center gap-1">பார்க்க <ChevronRight className="h-3 w-3" /></p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Navagraha Quick View */}
        {navagrahaTemples && navagrahaTemples.length > 0 && (
          <section className="container max-w-6xl pb-8">
            <h2 className="text-xl font-bold font-tamil text-foreground mb-1">நவகிரக தலங்கள் — உங்கள் கோள் எது?</h2>
            <p className="text-sm font-tamil text-muted-foreground mb-4">ஒன்பது கோள்களின் தோஷங்களை நீக்கும் புனித தலங்கள்</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {navagrahaTemples.map((t: any) => {
                const colors = PLANET_COLORS[t.navagraha_order] || "text-foreground bg-muted border-border";
                return (
                  <Card key={t.id} className={`border ${colors.split(" ").slice(1).join(" ")}`}>
                    <CardContent className="p-4">
                      <p className={`text-lg font-bold font-tamil ${colors.split(" ")[0]}`}>{t.navagraha_planet || t.deity_name_tamil}</p>
                      <p className="font-tamil text-sm font-semibold text-foreground mt-1">{t.name_tamil}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" /> {t.district}
                      </div>
                      {t.auspicious_day && <Badge variant="outline" className="mt-2 text-xs">{t.auspicious_day}</Badge>}
                      {t.problem_solved && <p className="text-xs italic font-tamil text-muted-foreground mt-2 line-clamp-1">{t.problem_solved}</p>}
                      <Link to={`/temple/${t.id}`}>
                        <Button variant="ghost" size="sm" className="mt-2 font-tamil text-primary p-0 h-auto">
                          தரிசனம் <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Today's Auspicious Temples */}
        {todayTemples && todayTemples.length > 0 && (
          <section className="container max-w-6xl pb-10">
            <h2 className="text-xl font-bold font-tamil text-foreground mb-4">இன்று வழிபட சிறந்த கோவில்கள் 🙏</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {todayTemples.map((t: any) => (
                <Link key={t.id} to={`/temple/${t.id}`}>
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-4">
                      <h3 className="font-bold font-tamil text-foreground">{t.name_tamil}</h3>
                      <p className="text-sm text-muted-foreground">{t.deity_name_tamil}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" /> {t.location}, {t.district}
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 font-tamil text-primary p-0 h-auto">
                        வழிபட செல்க <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
