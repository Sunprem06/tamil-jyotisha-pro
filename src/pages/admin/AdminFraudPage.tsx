import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { BackButton } from "@/components/BackButton";

export default function AdminFraudPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => { fetchLogs(); }, []);

  async function fetchLogs() {
    setLoading(true);
    const { data } = await supabase.from("fraud_logs").select("*").order("created_at", { ascending: false });
    setLogs(data ?? []);
    setLoading(false);
  }

  async function resolve(id: string) {
    const { error } = await supabase.from("fraud_logs").update({ resolved: true, resolved_by: user?.id, resolved_at: new Date().toISOString() }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Resolved" }); fetchLogs(); }
  }

  const severityColor = (s: string) => s === "high" ? "destructive" : s === "medium" ? "default" : "secondary";

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <div>
          <h1 className="text-2xl font-bold">Fraud Detection</h1>
          <p className="text-muted-foreground">{logs.filter(l => !l.resolved).length} unresolved alerts</p>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No fraud alerts</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Signal</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.signal_type}</TableCell>
                      <TableCell><Badge variant={severityColor(log.severity)}>{log.severity}</Badge></TableCell>
                      <TableCell className="text-xs">{log.user_id.slice(0, 8)}...</TableCell>
                      <TableCell><Badge variant={log.resolved ? "default" : "destructive"}>{log.resolved ? "Resolved" : "Open"}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {!log.resolved && <Button size="sm" onClick={() => resolve(log.id)}>Resolve</Button>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
