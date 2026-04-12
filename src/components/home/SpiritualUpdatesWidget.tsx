import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles, ShieldAlert, ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SpiritualUpdate {
  id: string;
  title: string;
  message: string;
  action: string;
  benefit: string;
  update_type: string;
  category: string;
}

const typeConfig: Record<string, { icon: typeof Flame; label: string; color: string }> = {
  guidance: { icon: Sparkles, label: "வழிகாட்டுதல்", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
  do_this: { icon: Flame, label: "இதைச் செய்யுங்கள்", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
  avoid_this: { icon: ShieldAlert, label: "இதைத் தவிர்க்கவும்", color: "from-red-500/20 to-rose-500/20 border-red-500/30" },
  weekly_palan: { icon: CalendarDays, label: "வார பலன்", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
  monthly_palan: { icon: CalendarRange, label: "மாத பலன்", color: "from-purple-500/20 to-violet-500/20 border-purple-500/30" },
  yearly_palan: { icon: Star, label: "வருட பலன்", color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30" },
};

export function SpiritualUpdatesWidget() {
  const [updates, setUpdates] = useState<SpiritualUpdate[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        // Fetch latest of each type
        const { data } = await supabase
          .from("spiritual_updates")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(50);

        if (data && data.length > 0) {
          // Pick one of each type (latest)
          const seen = new Set<string>();
          const picked: SpiritualUpdate[] = [];
          for (const u of data) {
            if (!seen.has(u.update_type)) {
              seen.add(u.update_type);
              picked.push(u);
            }
            if (picked.length >= 6) break;
          }
          setUpdates(picked);
        }
      } catch (err) {
        console.error("Failed to fetch spiritual updates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUpdates();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  if (updates.length === 0) return null;

  const update = updates[current];
  const config = typeConfig[update.update_type] || typeConfig.guidance;
  const Icon = config.icon;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-2">
              <span className="text-gradient-sacred font-tamil">ஆன்மீக தினசரி அப்டேட்</span>
            </h2>
            <p className="text-muted-foreground font-tamil text-sm">
              AI-Powered Spiritual Updates • தினசரி | வாரம் | மாதம் | வருடம்
            </p>
          </div>

          <div className={`relative rounded-2xl border bg-gradient-to-br ${config.color} p-6 md:p-8 transition-all duration-500`}>
            {/* Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-tamil">
                {config.label}
              </span>
              <Sparkles className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>

            <h3 className="text-xl md:text-2xl font-bold font-tamil mb-3 text-foreground">
              {update.title}
            </h3>

            <p className="text-muted-foreground font-tamil leading-relaxed mb-5">
              {update.message}
            </p>

            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-tamil mb-1">செய்ய வேண்டியது:</p>
              <p className="font-semibold text-primary font-tamil">{update.action}</p>
            </div>

            <p className="text-sm text-muted-foreground font-tamil">
              ✨ {update.benefit}
            </p>

            {/* Navigation */}
            {updates.length > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrent((c) => (c - 1 + updates.length) % updates.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="flex gap-2">
                  {updates.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrent((c) => (c + 1) % updates.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-center mt-4">
            <Link to="/spiritual-updates">
              <Button variant="outline" size="sm" className="font-tamil gap-2">
                <Sparkles className="h-3 w-3" />
                அனைத்து பலன்களையும் காண
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
