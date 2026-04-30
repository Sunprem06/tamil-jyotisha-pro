import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackButton } from "@/components/BackButton";
import { TamilLoader } from "@/components/TamilLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Coins, CheckCircle2, XCircle, Clock as ClockIcon } from "lucide-react";

interface CreditPack { credits: number; price_inr: number }
interface CreditRequest {
  id: string; requested_credits: number; amount_inr: number; status: string;
  payment_method: string; payment_reference: string | null; admin_note: string | null;
  created_at: string;
}

export default function BuyCreditsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [balance, setBalance] = useState(0);
  const [requests, setRequests] = useState<CreditRequest[]>([]);
  const [selected, setSelected] = useState<CreditPack | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentReference, setPaymentReference] = useState("");
  const [userNote, setUserNote] = useState("");

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const [packCfg, wallet, reqs] = await Promise.all([
      supabase.from("system_configurations").select("value").eq("key", "matrimony.credit_packs").maybeSingle(),
      supabase.from("credits").select("balance").eq("user_id", user.id).maybeSingle(),
      supabase.from("credit_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    ]);
    const pkVal = packCfg.data?.value as any;
    setPacks(Array.isArray(pkVal) ? pkVal : []);
    setBalance(wallet.data?.balance ?? 0);
    setRequests((reqs.data ?? []) as any);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const submit = async () => {
    if (!user || !selected) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("credit_requests").insert({
        user_id: user.id,
        requested_credits: selected.credits,
        amount_inr: selected.price_inr,
        payment_method: paymentMethod,
        payment_reference: paymentReference || null,
        user_note: userNote || null,
      });
      if (error) throw error;
      toast({
        title: "கோரிக்கை சமர்ப்பிக்கப்பட்டது",
        description: "நிர்வாகி அங்கீகரித்த பின் கிரெடிட்கள் சேர்க்கப்படும்.",
      });
      setSelected(null);
      setPaymentReference("");
      setUserNote("");
      await load();
    } catch (e: any) {
      toast({ title: "பிழை", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-6">
          <BackButton />
          <p>கிரெடிட் வாங்க உள்நுழையவும்.</p>
          <Link to="/auth"><Button className="mt-4">உள்நுழை</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/30 to-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-4xl">
        <BackButton />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Coins className="w-7 h-7" /> கிரெடிட் வாங்கு
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            பொருத்தங்களை திறக்க கிரெடிட்கள் தேவை. கீழே ஒரு தொகுப்பை தேர்ந்தெடுத்து கட்டண விவரங்களை சமர்ப்பிக்கவும்.
          </p>
        </div>

        <Card className="mb-6 bg-amber-50/40 border-amber-300/50">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="text-sm">தற்போதைய இருப்பு</span>
            <span className="text-2xl font-bold text-amber-700">{balance} <span className="text-sm font-normal">கிரெடிட்</span></span>
          </CardContent>
        </Card>

        {loading ? <TamilLoader /> : (
          <>
            <h2 className="text-lg font-semibold text-primary mb-3">கிரெடிட் தொகுப்புகள்</h2>
            <div className="grid gap-3 md:grid-cols-3 mb-8">
              {packs.map((p) => (
                <Card
                  key={p.credits}
                  className={`cursor-pointer transition-all ${selected?.credits === p.credits ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"}`}
                  onClick={() => setSelected(p)}
                >
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl text-amber-600">{p.credits}</CardTitle>
                    <p className="text-xs text-muted-foreground">கிரெடிட்கள்</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold">₹{p.price_inr}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      ஒரு கிரெடிட் ≈ ₹{(p.price_inr / p.credits).toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selected && (
              <Card className="mb-8 border-primary/40">
                <CardHeader>
                  <CardTitle className="text-base">கட்டண விவரங்கள்</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    UPI: <strong>premchandar.mhtsl@okicici</strong> · ₹{selected.price_inr} செலுத்தி கீழே குறிப்பு எண்ணை இடவும்.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>கட்டண முறை</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="bank">வங்கி பரிமாற்றம்</SelectItem>
                        <SelectItem value="cash">பணம்</SelectItem>
                        <SelectItem value="other">வேறு</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>கட்டண குறிப்பு எண் / Txn ID</Label>
                    <Input value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="UPI ref / bank txn id" />
                  </div>
                  <div>
                    <Label>குறிப்பு (விருப்பம்)</Label>
                    <Textarea value={userNote} onChange={(e) => setUserNote(e.target.value)} maxLength={300} rows={2} />
                  </div>
                  <Button onClick={submit} disabled={submitting} className="w-full">
                    {submitting ? "சமர்ப்பிக்கப்படுகிறது..." : `₹${selected.price_inr} கோரிக்கையை சமர்ப்பி`}
                  </Button>
                </CardContent>
              </Card>
            )}

            <h2 className="text-lg font-semibold text-primary mb-3">முந்தைய கோரிக்கைகள்</h2>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-sm">இதுவரை கோரிக்கைகள் இல்லை.</p>
            ) : (
              <div className="space-y-2">
                {requests.map((r) => (
                  <Card key={r.id}>
                    <CardContent className="p-4 flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">{r.requested_credits} கிரெடிட் · ₹{r.amount_inr}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(r.created_at).toLocaleString("ta-IN")} · {r.payment_method.toUpperCase()}
                          {r.payment_reference ? ` · ref: ${r.payment_reference}` : ""}
                        </div>
                        {r.admin_note && <div className="text-xs mt-1 italic">"{r.admin_note}"</div>}
                      </div>
                      <Badge
                        variant={r.status === "approved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}
                        className="gap-1"
                      >
                        {r.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : r.status === "rejected" ? <XCircle className="w-3 h-3" /> : <ClockIcon className="w-3 h-3" />}
                        {r.status === "approved" ? "அங்கீகரிக்கப்பட்டது" : r.status === "rejected" ? "நிராகரிக்கப்பட்டது" : "காத்திருக்கிறது"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}