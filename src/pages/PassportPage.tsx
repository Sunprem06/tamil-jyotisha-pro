import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, Star, Trash2, BookOpen } from "lucide-react";

const PILGRIMAGE_GOALS = [
  { label: "நவகிரக தலங்கள்", total: 9, filter: "is_navagraha" },
  { label: "ஆறுபடை வீடுகள்", total: 6, filter: "is_arupadai_veedu" },
  { label: "12 ஜோதிர்லிங்கங்கள்", total: 12, filter: "is_jyotirlinga" },
];

export default function PassportPage() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-xl font-bold font-tamil text-foreground mb-2">யாத்திரை பதிவேட்டை பயன்படுத்த உள்நுழையுங்கள்</h2>
              <p className="text-sm text-muted-foreground font-tamil mb-4">உங்கள் கோவில் பயணங்களை பதிவு செய்யுங்கள்</p>
              <Link to="/auth">
                <Button variant="sacred" className="font-tamil"><LogIn className="h-4 w-4 mr-2" /> உள்நுழைக</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const { data: visits = [] } = useQuery({
    queryKey: ["temple-visits", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("temple_visits").select("*, temples(*)").eq("user_id", user.id).order("visited_date", { ascending: false });
      return data ?? [];
    },
  });

  const { data: wishlist = [] } = useQuery({
    queryKey: ["temple-wishlist", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("temple_wishlist").select("*, temples(*)").eq("user_id", user.id).order("added_at", { ascending: false });
      return data ?? [];
    },
  });

  // Count special visits
  const { data: progressCounts } = useQuery({
    queryKey: ["passport-progress", user.id],
    queryFn: async () => {
      const visitedTempleIds = visits.map((v: any) => v.temple_id).filter(Boolean);
      if (visitedTempleIds.length === 0) return { is_navagraha: 0, is_arupadai_veedu: 0, is_jyotirlinga: 0 };

      const { data } = await supabase
        .from("temples")
        .select("is_navagraha, is_arupadai_veedu, is_jyotirlinga")
        .in("id", visitedTempleIds);

      return {
        is_navagraha: data?.filter((t) => t.is_navagraha).length ?? 0,
        is_arupadai_veedu: data?.filter((t) => t.is_arupadai_veedu).length ?? 0,
        is_jyotirlinga: data?.filter((t) => t.is_jyotirlinga).length ?? 0,
      };
    },
    enabled: visits.length > 0,
  });

  const removeWishlist = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("temple_wishlist").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["temple-wishlist"] }),
  });

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "யாத்ரீகர்";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-primary/10 to-background py-6">
          <div className="container max-w-4xl">
            <BackButton />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold font-tamil text-foreground">வணக்கம் {displayName}! 🙏</h1>
                <p className="text-sm font-tamil text-muted-foreground">உங்கள் யாத்திரை பயணம்</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="font-tamil">வெளியேறு</Button>
            </div>
          </div>
        </section>

        <div className="container max-w-4xl py-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{visits.length}</p><p className="text-xs font-tamil text-muted-foreground">சென்ற கோவில்கள்</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{progressCounts?.is_navagraha ?? 0}</p><p className="text-xs font-tamil text-muted-foreground">நவகிரக தலங்கள்</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{progressCounts?.is_arupadai_veedu ?? 0}</p><p className="text-xs font-tamil text-muted-foreground">ஆறுபடை வீடுகள்</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{progressCounts?.is_jyotirlinga ?? 0}</p><p className="text-xs font-tamil text-muted-foreground">ஜோதிர்லிங்கங்கள்</p></CardContent></Card>
          </div>

          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-bold font-tamil text-foreground mb-4">யாத்திரை முன்னேற்றம்</h2>
              {PILGRIMAGE_GOALS.map((goal) => {
                const visited = progressCounts?.[goal.filter as keyof typeof progressCounts] ?? 0;
                const pct = Math.round((visited / goal.total) * 100);
                return (
                  <div key={goal.filter} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-tamil text-foreground">{goal.label}</span>
                      <span className="text-muted-foreground">{visited} / {goal.total} ({pct}%)</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Visited Temples */}
          <div>
            <h2 className="text-lg font-bold font-tamil text-foreground mb-3">நான் சென்ற கோவில்கள்</h2>
            {visits.length === 0 ? (
              <Card><CardContent className="p-6 text-center"><p className="font-tamil text-muted-foreground">இன்னும் எந்த கோவிலும் பதிவு செய்யவில்லை. கோவில் பக்கத்தில் ✓ பொத்தானை அழுத்துங்கள்.</p></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {visits.map((v: any) => (
                  <Link key={v.id} to={`/temple/${v.temple_id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h3 className="font-bold font-tamil text-sm text-foreground">{v.temple_name_tamil}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{v.visited_date}</p>
                        {v.rating && (
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= v.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`} />
                            ))}
                          </div>
                        )}
                        {v.visit_notes && <p className="text-xs italic font-tamil text-muted-foreground mt-1 line-clamp-1">{v.visit_notes}</p>}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <div>
            <h2 className="text-lg font-bold font-tamil text-foreground mb-3">செல்ல விரும்பும் கோவில்கள் ♡</h2>
            {wishlist.length === 0 ? (
              <Card><CardContent className="p-6 text-center"><p className="font-tamil text-muted-foreground">இன்னும் எந்த கோவிலும் சேர்க்கவில்லை</p></CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {wishlist.map((w: any) => (
                  <Card key={w.id}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <Link to={`/temple/${w.temple_id}`} className="flex-1">
                        <h3 className="font-bold font-tamil text-sm text-foreground">{w.temple_name_tamil}</h3>
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => removeWishlist.mutate(w.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
