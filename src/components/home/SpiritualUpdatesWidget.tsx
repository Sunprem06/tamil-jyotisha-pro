import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
};

export function SpiritualUpdatesWidget() {
  const [updates, setUpdates] = useState<SpiritualUpdate[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const now = new Date();
        const dayOfYear = Math.floor(
          (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
        );
        const { data } = await supabase
          .from("spiritual_updates")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true });

        if (data && data.length > 0) {
          const guidance = data.filter((u) => u.update_type === "guidance");
          const doThis = data.filter((u) => u.update_type === "do_this");
          const avoidThis = data.filter((u) => u.update_type === "avoid_this");
          const pick = (arr: any[]) => arr.length > 0 ? arr[dayOfYear % arr.length] : null;
          setUpdates([pick(guidance), pick(doThis), pick(avoidThis)].filter(Boolean));
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
              Daily Spiritual Updates
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
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold font-tamil mb-3 text-foreground">
              {update.title}
            </h3>

            {/* Message */}
            <p className="text-muted-foreground font-tamil leading-relaxed mb-5">
              {update.message}
            </p>

            {/* Action - highlighted */}
            <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-border/50">
              <p className="text-xs text-muted-foreground font-tamil mb-1">செய்ய வேண்டியது:</p>
              <p className="font-semibold text-primary font-tamil">{update.action}</p>
            </div>

            {/* Benefit */}
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
        </div>
      </div>
    </section>
  );
}
