import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BackButton } from "@/components/BackButton";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Coins, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Req {
  id: string; user_id: string; requested_credits: number; amount_inr: number;
  payment_method: string; payment_reference: string | null; user_note: string | null;
  status: string; admin_note: string | null; created_at: string; reviewed_at: string | null;
}

export default function AdminCreditRequestsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState<Req[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async (status: string) => {
    const { data } = await supabase
      .from("credit_requests").select("*")
      .eq("status", status).order("created_at", { ascending: false }).limit(100);
    setItems((data ?? []) as any);
  };

  useEffect(() => { load(tab); }, [tab]);

  const review = async (id: string, action: "approve" | "reject") => {
    setBusyId(id);
    try {
      const { data, error } = await supabase.functions.invoke("review-credit-request", {
        body: { requestId: id, action, adminNote: notes[id] ?? null },
      });
      if (error) throw error;
      toast({ title: action === "approve" ? "அங்கீகரிக்கப்பட்டது" : "நிராகரிக்கப்பட்டது", description: data?.new_balance ? `புதிய இருப்பு: ${data.new_balance}` : undefined });
      await load(tab);
    } catch (e: any) {
      toast({ title: "பிழை", description: e.message, variant: "destructive" });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AdminLayout>
      <BackButton />
      <h1 className="text-2xl font-bold text-primary flex items-center gap-2 mb-4">
        <Coins className="w-6 h-6" /> Credit Purchase Requests
      </h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pending"><Clock className="w-4 h-4 mr-1" /> Pending</TabsTrigger>
          <TabsTrigger value="approved"><CheckCircle2 className="w-4 h-4 mr-1" /> Approved</TabsTrigger>
          <TabsTrigger value="rejected"><XCircle className="w-4 h-4 mr-1" /> Rejected</TabsTrigger>
        </TabsList>

        {["pending", "approved", "rejected"].map((s) => (
          <TabsContent key={s} value={s}>
            {items.length === 0 ? (
              <p className="text-muted-foreground p-4">No {s} requests.</p>
            ) : (
              <div className="space-y-3 mt-4">
                {items.map((r) => (
                  <Card key={r.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <CardTitle className="text-base">
                          {r.requested_credits} credits · ₹{r.amount_inr}
                        </CardTitle>
                        <Badge variant={r.status === "pending" ? "secondary" : r.status === "approved" ? "default" : "destructive"}>
                          {r.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        User: <span className="font-mono">{r.user_id.slice(0, 8)}…</span> ·
                        {" "}{new Date(r.created_at).toLocaleString()}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        <strong>Method:</strong> {r.payment_method.toUpperCase()}
                        {r.payment_reference && <> · <strong>Ref:</strong> <span className="font-mono">{r.payment_reference}</span></>}
                      </div>
                      {r.user_note && <div className="italic text-muted-foreground">"{r.user_note}"</div>}
                      {r.admin_note && <div className="text-xs"><strong>Admin note:</strong> {r.admin_note}</div>}
                      {r.status === "pending" && (
                        <div className="flex gap-2 items-center pt-2">
                          <Input
                            placeholder="Optional admin note"
                            value={notes[r.id] ?? ""}
                            onChange={(e) => setNotes({ ...notes, [r.id]: e.target.value })}
                            className="flex-1"
                          />
                          <Button size="sm" disabled={busyId === r.id} onClick={() => review(r.id, "approve")}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" disabled={busyId === r.id} onClick={() => review(r.id, "reject")}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AdminLayout>
  );
}