import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { TamilLoader } from "@/components/TamilLoader";
import { TamilEmptyState } from "@/components/TamilEmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock, Sparkles, CheckCircle2, XCircle, RefreshCw, Coins, Eye, Filter } from "lucide-react";

interface AutoMatch {
  id: string;
  candidate_id: string;
  porutham_score: number;
  porutham_max: number;
  porutham_breakdown: any[];
  preference_match: Record<string, { matched: boolean; label: string; tamilLabel: string }>;
  preference_score: number;
  combined_score: number;
  is_unlocked: boolean;
  unlock_order: number | null;
  credits_spent: number;
}

interface CandidateProfile {
  user_id: string;
  date_of_birth: string;
  gender: string;
  city: string | null;
  state: string | null;
  caste: string | null;
  education: string | null;
  occupation: string | null;
  height_cm: number | null;
  photos: string[] | null;
  about_me: string | null;
}

export default function AutoMatchesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [matches, setMatches] = useState<AutoMatch[]>([]);
  const [candidates, setCandidates] = useState<Record<string, CandidateProfile>>({});
  const [config, setConfig] = useState({ freeQuota: 3, price: 10 });
  const [credits, setCredits] = useState<number>(0);
  const [detailMatch, setDetailMatch] = useState<AutoMatch | null>(null);
  const [sortBy, setSortBy] = useState<"combined" | "porutham" | "preference">("combined");
  const [minPorutham, setMinPorutham] = useState<number>(0);
  const [minPreference, setMinPreference] = useState<number>(0);
  const [unlockFilter, setUnlockFilter] = useState<"all" | "unlocked" | "locked">("all");

  const loadAll = async () => {
    if (!user) return;
    setLoading(true);
    const { data: cfg } = await supabase
      .from("system_configurations")
      .select("key,value")
      .in("key", ["matrimony.free_matches_count", "matrimony.match_unlock_price"]);
    const cfgMap: Record<string, any> = {};
    cfg?.forEach((r) => { cfgMap[r.key] = r.value; });
    setConfig({
      freeQuota: Number(cfgMap["matrimony.free_matches_count"] ?? 3),
      price: Number(cfgMap["matrimony.match_unlock_price"] ?? 10),
    });

    const { data: creditRow } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    setCredits(creditRow?.balance ?? 0);

    const { data: m } = await supabase
      .from("auto_matches")
      .select("*")
      .eq("requester_id", user.id)
      .order("combined_score", { ascending: false });
    setMatches((m ?? []) as any);

    const ids = (m ?? []).map((x: any) => x.candidate_id);
    if (ids.length) {
      const { data: profs } = await supabase
        .from("matrimony_profiles")
        .select("user_id,date_of_birth,gender,city,state,caste,education,occupation,height_cm,photos,about_me")
        .in("user_id", ids);
      const map: Record<string, CandidateProfile> = {};
      profs?.forEach((p: any) => { map[p.user_id] = p; });
      setCandidates(map);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); /* eslint-disable-next-line */ }, [user]);

  // Animated progress while edge function runs
  useEffect(() => {
    if (!generating) return;
    setProgress(5);
    const steps = [
      { p: 15, l: "உங்கள் ஜாதக விவரம் ஏற்றப்படுகிறது..." },
      { p: 35, l: "எதிர்பாலின சுயவிவரங்கள் சேகரிக்கப்படுகின்றன..." },
      { p: 55, l: "10 பொருத்தம் (Porutham) கணக்கிடப்படுகிறது..." },
      { p: 78, l: "பங்காளி விருப்பம் ஒப்பிடப்படுகிறது..." },
      { p: 92, l: "முடிவுகள் தரவரிசைப்படுத்தப்படுகின்றன..." },
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i >= steps.length) return;
      setProgress(steps[i].p);
      setProgressLabel(steps[i].l);
      i++;
    }, 700);
    return () => clearInterval(id);
  }, [generating]);

  const runAutoMatch = async () => {
    setGenerating(true);
    setProgress(5);
    setProgressLabel("தொடங்குகிறது...");
    try {
      const { data, error } = await supabase.functions.invoke("auto-match");
      if (error) throw error;
      setProgress(100);
      setProgressLabel("முடிந்தது!");
      toast({ title: "பொருத்தம் கணக்கிடப்பட்டது", description: `${data?.count ?? 0} பொருத்தங்கள் கிடைத்தன` });
      await loadAll();
    } catch (e: any) {
      toast({ title: "பிழை", description: e.message, variant: "destructive" });
    } finally {
      setTimeout(() => setGenerating(false), 400);
    }
  };

  const unlock = async (matchId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("unlock-match", { body: { matchId } });
      if (error) throw error;
      toast({
        title: data.isFree ? "இலவசமாக திறக்கப்பட்டது" : `${data.cost} கிரெடிட்கள் பயன்படுத்தப்பட்டன`,
        description: `பொருத்தம் #${data.order}`,
      });
      await loadAll();
    } catch (e: any) {
      const msg = e.context?.error || e.message || "பிழை";
      toast({ title: "திறக்க முடியவில்லை", description: msg, variant: "destructive" });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <BackButton />
          <TamilEmptyState message="உள்நுழைய வேண்டும்" subMessage="ஆட்டோ பொருத்தத்தைப் பார்க்க உள்நுழையவும்" />
          <Link to="/auth"><Button className="mt-4">உள்நுழை</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  const unlockedCount = matches.filter((m) => m.is_unlocked).length;
  const remainingFree = Math.max(0, config.freeQuota - unlockedCount);

  // Filtering & sorting
  const visible = matches
    .filter((m) => m.porutham_score >= minPorutham && m.preference_score >= minPreference)
    .filter((m) => unlockFilter === "all" || (unlockFilter === "unlocked" ? m.is_unlocked : !m.is_unlocked))
    .sort((a, b) =>
      sortBy === "porutham" ? b.porutham_score - a.porutham_score
      : sortBy === "preference" ? b.preference_score - a.preference_score
      : b.combined_score - a.combined_score
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/30 to-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-6xl">
        <BackButton />
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary">ஆட்டோ பொருத்தம்</h1>
            <p className="text-muted-foreground text-sm mt-1">
              உங்கள் ஜாதகம் & விருப்பங்களின் அடிப்படையில் தானியங்கி பொருத்தம்
            </p>
          </div>
          <Button onClick={runAutoMatch} disabled={generating} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "கணக்கிடுகிறது..." : "மீண்டும் கணக்கிடு"}
          </Button>
        </div>

        <Card className="mb-6 border-amber-300/50 bg-amber-50/40">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span><strong>{remainingFree}</strong> / {config.freeQuota} இலவச திறப்புகள்</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>இருப்பு: <strong>{credits}</strong> கிரெடிட்கள்</span>
            </div>
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="text-muted-foreground">
                ஒரு திறப்பு: <strong>{config.price}</strong> கிரெடிட்கள்
              </span>
              {credits < config.price && remainingFree === 0 && (
                <Link to="/profile"><Button size="sm" variant="outline">டாப்-அப்</Button></Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Progress screen */}
        {generating && (
          <Card className="mb-6 border-primary/30">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">{progressLabel || "செயலாக்கப்படுகிறது..."}</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
              <p className="text-xs text-muted-foreground">
                சேவையகம் Porutham & பங்காளி விருப்பங்களை கணக்கிடுகிறது. சில நொடிகள் ஆகலாம்.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        {!loading && matches.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="text-xs text-muted-foreground flex items-center gap-1 mb-1"><Filter className="w-3 h-3" /> வரிசை</label>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="combined">கூட்டு மதிப்பு</SelectItem>
                    <SelectItem value="porutham">ஜாதகம் (Porutham)</SelectItem>
                    <SelectItem value="preference">விருப்பம் (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">குறைந்த Porutham</label>
                <Input type="number" min={0} max={10} value={minPorutham} onChange={(e) => setMinPorutham(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">குறைந்த விருப்பம் %</label>
                <Input type="number" min={0} max={100} value={minPreference} onChange={(e) => setMinPreference(Number(e.target.value) || 0)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">நிலை</label>
                <Select value={unlockFilter} onValueChange={(v) => setUnlockFilter(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">அனைத்தும்</SelectItem>
                    <SelectItem value="unlocked">திறக்கப்பட்டவை</SelectItem>
                    <SelectItem value="locked">பூட்டியவை</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <TamilLoader />
        ) : matches.length === 0 ? (
          <div className="space-y-4">
            <TamilEmptyState
              message="பொருத்தம் இல்லை"
              subMessage="உங்கள் சுயவிவரம் & பங்காளி விருப்பங்களைப் பூர்த்தி செய்து 'மீண்டும் கணக்கிடு' அழுத்தவும்."
            />
            <div className="flex gap-2 justify-center">
              <Link to="/matrimony/profile"><Button variant="outline">சுயவிவரம்</Button></Link>
              <Link to="/matrimony/preferences"><Button variant="outline">விருப்பங்கள்</Button></Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {visible.length === 0 ? (
              <div className="md:col-span-2"><TamilEmptyState message="வடிகட்டலுக்கு எதுவும் பொருந்தவில்லை" /></div>
            ) : visible.map((m) => {
              const c = candidates[m.candidate_id];
              const photo = c?.photos?.[0];
              return (
                <Card key={m.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3 items-center">
                        <div className={`w-16 h-16 rounded-full bg-muted overflow-hidden border-2 border-amber-300 ${!m.is_unlocked ? "blur-md" : ""}`}>
                          {photo ? (
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {m.is_unlocked ? `Profile ${m.candidate_id.slice(0, 8)}` : "🔒 பூட்டப்பட்டது"}
                          </CardTitle>
                          <div className="text-xs text-muted-foreground">
                            {c?.city ?? "—"}{c?.state ? `, ${c.state}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-amber-500">{m.combined_score}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">பொருத்த மதிப்பு</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2 flex-wrap text-xs">
                      <Badge variant="outline">ஜாதகம்: {m.porutham_score}/{m.porutham_max}</Badge>
                      <Badge variant="outline">விருப்பம்: {m.preference_score}%</Badge>
                      <button
                        onClick={() => setDetailMatch(m)}
                        className="ml-auto inline-flex items-center gap-1 text-primary hover:underline text-xs"
                      >
                        <Eye className="w-3 h-3" /> Porutham விவரம்
                      </button>
                    </div>

                    {/* Gap report */}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-primary font-medium">
                        விரிவான பொருத்தம் / ஒத்துப்போகாதவை ▾
                      </summary>
                      <div className="mt-2 space-y-1">
                        <div className="font-semibold text-amber-700 mt-2">10 பொருத்தம்:</div>
                        {m.porutham_breakdown?.map((p: any, i: number) => (
                          <div key={i} className="flex items-center gap-1">
                            {p.matched ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-red-500" />}
                            <span>{p.tamilName}</span>
                          </div>
                        ))}
                        <div className="font-semibold text-amber-700 mt-2">பங்காளி விருப்பங்கள்:</div>
                        {Object.entries(m.preference_match ?? {}).map(([k, v]) => (
                          <div key={k} className="flex items-center gap-1">
                            {v.matched ? <CheckCircle2 className="w-3 h-3 text-green-600" /> : <XCircle className="w-3 h-3 text-red-500" />}
                            <span>{v.tamilLabel}</span>
                          </div>
                        ))}
                      </div>
                    </details>

                    {m.is_unlocked ? (
                      <Link to={`/matrimony/profile/${m.candidate_id}`}>
                        <Button className="w-full" variant="default">முழு சுயவிவரம் பார்க்க</Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={() => unlock(m.id)}
                        disabled={remainingFree === 0 && credits < config.price}
                        className="w-full gap-2"
                        variant={remainingFree > 0 ? "default" : "secondary"}
                      >
                        <Lock className="w-4 h-4" />
                        {remainingFree > 0
                          ? "இலவசமாக திற"
                          : credits >= config.price
                            ? `${config.price} கிரெடிட்களில் திற`
                            : `கிரெடிட் போதாது (${credits}/${config.price})`}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Porutham detail dialog */}
        <Dialog open={!!detailMatch} onOpenChange={(o) => !o && setDetailMatch(null)}>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-tamil">10 பொருத்தம் விவரம் (Porutham Details)</DialogTitle>
            </DialogHeader>
            {detailMatch && (
              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-amber-500">மொத்தம்: {detailMatch.porutham_score}/{detailMatch.porutham_max}</Badge>
                  <Badge variant="outline">விருப்பம்: {detailMatch.preference_score}%</Badge>
                  <Badge variant="outline">கூட்டு: {detailMatch.combined_score}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-amber-700">ஜாதக பொருத்தம்</h4>
                  <div className="space-y-1 text-sm">
                    {detailMatch.porutham_breakdown?.map((p: any, i: number) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 py-1">
                        <span className="flex items-center gap-2">
                          {p.matched ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                          <span>{p.tamilName} <span className="text-muted-foreground text-xs">({p.name})</span></span>
                        </span>
                        <span className="text-xs text-muted-foreground">{p.score}/{p.maxScore}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-amber-700">பங்காளி விருப்பம்</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(detailMatch.preference_match ?? {}).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 border-b border-border/50 py-1">
                        {v.matched ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                        <span>{v.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}