import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Sparkles, ShieldAlert, Calendar, CalendarDays, CalendarRange, Star, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TamilLoader } from "@/components/TamilLoader";
import { TamilEmptyState } from "@/components/TamilEmptyState";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  weekly_palan: { icon: CalendarDays, label: "வார பலன்", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/30" },
  monthly_palan: { icon: CalendarRange, label: "மாத பலன்", color: "from-purple-500/20 to-violet-500/20 border-purple-500/30" },
  yearly_palan: { icon: Star, label: "வருட பலன்", color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30" },
};

const categories = [
  { value: "all", label: "அனைத்தும்" },
  { value: "general", label: "பொது" },
  { value: "money", label: "பணம்" },
  { value: "family", label: "குடும்பம்" },
  { value: "health", label: "உடல்நலம்" },
  { value: "spiritual", label: "ஆன்மீகம்" },
];

const predictionTabs = [
  { value: "daily", label: "தினசரி", icon: Calendar },
  { value: "weekly", label: "வாரம்", icon: CalendarDays },
  { value: "monthly", label: "மாதம்", icon: CalendarRange },
  { value: "yearly", label: "வருடம்", icon: Star },
];

export default function SpiritualUpdatesPage() {
  const [updates, setUpdates] = useState<SpiritualUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [category, setCategory] = useState("all");
  const [predictionType, setPredictionType] = useState("daily");

  useEffect(() => {
    fetchUpdates();
  }, [category, predictionType]);

  async function fetchUpdates() {
    setLoading(true);

    const updateTypes =
      predictionType === "daily" ? ["guidance", "do_this", "avoid_this"] :
      predictionType === "weekly" ? ["weekly_palan"] :
      predictionType === "monthly" ? ["monthly_palan"] :
      ["yearly_palan"];

    let query = supabase
      .from("spiritual_updates")
      .select("*")
      .eq("is_active", true)
      .in("update_type", updateTypes as any)
      .order("created_at", { ascending: false })
      .limit(30);

    if (category !== "all") {
      query = query.eq("category", category as any);
    }

    const { data } = await query;
    setUpdates(data || []);
    setLoading(false);
  }

  async function handleGenerateNow() {
    setGenerating(true);
    try {
      const mode = predictionType === "daily" ? "daily" :
                   predictionType === "weekly" ? "weekly" :
                   predictionType === "monthly" ? "monthly" : "yearly";

      const { data, error } = await supabase.functions.invoke("generate-spiritual-update", {
        body: { mode },
      });

      if (error) throw error;

      toast.success(`${data.generated} புதிய ${predictionTabs.find(t => t.value === predictionType)?.label} பலன்கள் உருவாக்கப்பட்டன!`);
      fetchUpdates();
    } catch (err: any) {
      console.error("Generation error:", err);
      toast.error("AI உருவாக்கம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-6">
        <BackButton />

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold font-tamil text-gradient-sacred">
            ஆன்மீக தினசரி அப்டேட்
          </h1>
          <p className="text-muted-foreground">
            AI-Powered Daily Spiritual Guidance in Tamil
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            <span>Powered by Lovable AI • 100% Original Tamil Content</span>
          </div>
        </div>

        {/* Prediction Type Tabs */}
        <div className="flex flex-wrap justify-center gap-2">
          {predictionTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.value}
                variant={predictionType === tab.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPredictionType(tab.value)}
                className="font-tamil gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Category Filter */}
        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="flex flex-wrap justify-center h-auto gap-1">
            {categories.map((c) => (
              <TabsTrigger key={c.value} value={c.value} className="text-sm font-tamil">
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateNow}
            disabled={generating}
            variant="outline"
            className="gap-2 font-tamil"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "AI உருவாக்குகிறது..." : "புதிய பலன்கள் உருவாக்கு"}
          </Button>
        </div>

        {loading ? (
          <TamilLoader message="ஆன்மீக செய்திகள் ஏற்றப்படுகிறது..." />
        ) : updates.length === 0 ? (
          <div className="text-center space-y-4">
            <TamilEmptyState message="இந்த பிரிவில் அப்டேட்கள் இல்லை" />
            <p className="text-sm text-muted-foreground font-tamil">
              "புதிய பலன்கள் உருவாக்கு" பொத்தானை அழுத்தி AI மூலம் புதிய பலன்களை உருவாக்கலாம்
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {updates.map((u) => {
              const config = typeConfig[u.update_type] || typeConfig.guidance;
              const Icon = config.icon;
              const createdDate = new Date(u.created_at);
              const dateStr = createdDate.toLocaleDateString("ta-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              return (
                <Card key={u.id} className={`bg-gradient-to-br ${config.color} border transition-all hover:shadow-lg`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs font-tamil">
                        {config.label}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-muted-foreground" />
                        <Icon className="h-4 w-4 text-sacred" />
                      </div>
                    </div>
                    <CardTitle className="text-lg font-tamil leading-relaxed">
                      {u.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{dateStr}</p>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="font-tamil leading-relaxed">{u.message}</p>
                    <div className="p-2 rounded bg-background/50">
                      <p className="font-semibold text-xs text-muted-foreground mb-1">
                        செய்ய வேண்டியது:
                      </p>
                      <p className="font-tamil text-sacred font-medium">{u.action}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-muted-foreground mb-1">
                        பலன்:
                      </p>
                      <p className="font-tamil text-sm">{u.benefit}</p>
                    </div>
                    <div className="flex items-center gap-1 pt-1">
                      <Badge variant="secondary" className="text-[10px] font-tamil">
                        {categories.find((c) => c.value === u.category)?.label || u.category}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        AI Generated
                      </Badge>
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
