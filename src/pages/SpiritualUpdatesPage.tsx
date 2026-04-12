import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TamilLoader } from "@/components/TamilLoader";
import { TamilEmptyState } from "@/components/TamilEmptyState";

interface SpiritualUpdate {
  id: string;
  title: string;
  message: string;
  action: string;
  benefit: string;
  update_type: string;
  category: string;
  created_at: string;
}

const typeConfig: Record<string, { icon: typeof Flame; label: string; color: string }> = {
  guidance: { icon: Sparkles, label: "வழிகாட்டுதல்", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
  do_this: { icon: Flame, label: "இதைச் செய்யுங்கள்", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30" },
  avoid_this: { icon: ShieldAlert, label: "இதைத் தவிர்க்கவும்", color: "from-red-500/20 to-rose-500/20 border-red-500/30" },
};

const categories = [
  { value: "all", label: "அனைத்தும்" },
  { value: "general", label: "பொது" },
  { value: "money", label: "பணம்" },
  { value: "family", label: "குடும்பம்" },
  { value: "health", label: "உடல்நலம்" },
  { value: "spiritual", label: "ஆன்மீகம்" },
];

export default function SpiritualUpdatesPage() {
  const [updates, setUpdates] = useState<SpiritualUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from("spiritual_updates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(50);

      if (category !== "all") {
        query = query.eq("category", category);
      }

      const { data } = await query;
      setUpdates(data || []);
      setLoading(false);
    }
    fetch();
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <BackButton />

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-tamil text-gradient-sacred">
            ஆன்மீக தினசரி அப்டேட்
          </h1>
          <p className="text-muted-foreground">Daily Spiritual Guidance in Tamil</p>
        </div>

        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="flex flex-wrap justify-center h-auto gap-1">
            {categories.map(c => (
              <TabsTrigger key={c.value} value={c.value} className="text-sm font-tamil">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <TamilLoader message="ஆன்மீக செய்திகள் ஏற்றப்படுகிறது..." />
        ) : updates.length === 0 ? (
          <TamilEmptyState message="இந்த பிரிவில் அப்டேட்கள் இல்லை" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {updates.map((u) => {
              const config = typeConfig[u.update_type] || typeConfig.guidance;
              const Icon = config.icon;
              return (
                <Card key={u.id} className={`bg-gradient-to-br ${config.color} border`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-tamil">{config.label}</Badge>
                      <Icon className="h-4 w-4 text-sacred" />
                    </div>
                    <CardTitle className="text-lg font-tamil leading-relaxed">{u.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="font-tamil leading-relaxed">{u.message}</p>
                    <div className="p-2 rounded bg-background/50">
                      <p className="font-semibold text-xs text-muted-foreground mb-1">செய்ய வேண்டியது:</p>
                      <p className="font-tamil text-sacred font-medium">{u.action}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground mb-1">பலன்:</p>
                      <p className="font-tamil text-sm">{u.benefit}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
