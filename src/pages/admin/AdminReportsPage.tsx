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

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => { fetchReports(); }, []);

  async function fetchReports() {
    setLoading(true);
    const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    setReports(data ?? []);
    setLoading(false);
  }

  async function resolveReport(id: string, status: string) {
    const { error } = await supabase.from("reports").update({ status, resolved_by: user?.id }).eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: `Report ${status}` }); fetchReports(); }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <div>
          <h1 className="text-2xl font-bold">User Reports</h1>
          <p className="text-muted-foreground">{reports.filter(r => r.status === "pending").length} pending</p>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : reports.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">No reports</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.reason}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">{r.details ?? "—"}</TableCell>
                      <TableCell><Badge variant={r.status === "pending" ? "secondary" : r.status === "resolved" ? "default" : "destructive"}>{r.status}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {r.status === "pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => resolveReport(r.id, "resolved")}>Resolve</Button>
                            <Button size="sm" variant="destructive" onClick={() => resolveReport(r.id, "dismissed")}>Dismiss</Button>
                          </div>
                        )}
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
