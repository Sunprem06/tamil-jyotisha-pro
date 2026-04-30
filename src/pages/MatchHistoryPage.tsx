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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { History, Eye, Clock, Users as UsersIcon } from "lucide-react";

interface MatchRun {
  id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  error_message: string | null;
  inputs_snapshot: any;
  results_summary: any;
  total_candidates: number;
  matches_count: number;
}

export default function MatchHistoryPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<MatchRun[]>([]);
  const [detail, setDetail] = useState<MatchRun | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("match_runs")
        .select("*")
        .eq("user_id", user.id)
        .order("started_at", { ascending: false })
        .limit(50);
      setRuns((data ?? []) as any);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <BackButton />
          <TamilEmptyState message="உள்நுழைய வேண்டும்" />
          <Link to="/auth"><Button className="mt-4">உள்நுழை</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/30 to-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-5xl">
        <BackButton />
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <History className="w-7 h-7" /> பொருத்த வரலாறு
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              உங்கள் முந்தைய ஆட்டோ-பொருத்த அறிக்கைகளை மீண்டும் பார்க்கவும்
            </p>
          </div>
          <Link to="/matrimony/auto-matches">
            <Button>புதிய பொருத்தம் தொடங்கு</Button>
          </Link>
        </div>

        {loading ? (
          <TamilLoader />
        ) : runs.length === 0 ? (
          <TamilEmptyState message="வரலாறு இல்லை" subMessage="ஆட்டோ-பொருத்தம் ஒன்று இயக்கினால் அது இங்கே சேமிக்கப்படும்." />
        ) : (
          <div className="grid gap-3">
            {runs.map((r) => {
              const dur = r.completed_at
                ? Math.round((new Date(r.completed_at).getTime() - new Date(r.started_at).getTime()) / 1000)
                : null;
              return (
                <Card key={r.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          {new Date(r.started_at).toLocaleString("ta-IN")}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground mt-1">
                          {dur !== null ? `கால அளவு: ${dur}s` : "இயங்குகிறது…"}
                        </div>
                      </div>
                      <Badge
                        variant={r.status === "success" ? "default" : r.status === "failed" ? "destructive" : "secondary"}
                      >
                        {r.status === "success" ? "வெற்றி" : r.status === "failed" ? "பிழை" : "இயங்குகிறது"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <UsersIcon className="w-4 h-4 text-muted-foreground" />
                        மொத்த சுயவிவரங்கள்: <strong>{r.total_candidates}</strong>
                      </span>
                      <span>பொருத்தங்கள்: <strong className="text-primary">{r.matches_count}</strong></span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setDetail(r)} className="gap-1">
                      <Eye className="w-4 h-4" /> அறிக்கை பார்
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>பொருத்த அறிக்கை — {detail && new Date(detail.started_at).toLocaleString("ta-IN")}</DialogTitle>
            </DialogHeader>
            {detail && (
              <div className="space-y-4 text-sm">
                {detail.error_message && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded">
                    {detail.error_message}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">பயன்படுத்திய அளவுகோல்கள்</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(detail.inputs_snapshot?.thresholds ?? {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">உங்கள் சுயவிவர ஸ்னாப்ஷாட்</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
                    {JSON.stringify(detail.inputs_snapshot?.profile ?? {}, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700 mb-2">
                    சிறந்த பொருத்தங்கள் (Top {detail.results_summary?.top?.length ?? 0})
                  </h4>
                  {!detail.results_summary?.top?.length ? (
                    <p className="text-muted-foreground">பொருத்தம் ஏதும் இல்லை.</p>
                  ) : (
                    <div className="space-y-1">
                      {detail.results_summary.top.map((t: any, i: number) => (
                        <div key={i} className="flex items-center justify-between border-b border-border/50 py-1.5">
                          <Link to={`/matrimony/profile/${t.candidate_id}`} className="text-primary hover:underline text-xs font-mono">
                            #{i + 1} · {t.candidate_id.slice(0, 8)}
                          </Link>
                          <div className="flex gap-2 text-xs">
                            <Badge variant="outline">P {t.porutham_score}/10</Badge>
                            <Badge variant="outline">விருப்பம் {t.preference_score}%</Badge>
                            <Badge className="bg-amber-500">{t.combined_score}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground border-t pt-3">
                  இது அந்த நேரத்தில் சேமிக்கப்பட்ட ஸ்னாப்ஷாட். தற்போதைய சுயவிவரங்கள் மாறியிருக்கலாம்.
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}