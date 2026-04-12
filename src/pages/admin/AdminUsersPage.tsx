import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Ban, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

interface UserRow {
  id: string;
  user_id: string;
  display_name: string | null;
  phone: string | null;
  created_at: string;
  roles: string[];
  trust_score: number | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roles } = await supabase.from("user_roles").select("user_id, role");
    const { data: scores } = await supabase.from("trust_scores").select("user_id, score");

    const roleMap: Record<string, string[]> = {};
    roles?.forEach((r) => {
      if (!roleMap[r.user_id]) roleMap[r.user_id] = [];
      roleMap[r.user_id].push(r.role);
    });

    const scoreMap: Record<string, number> = {};
    scores?.forEach((s) => { scoreMap[s.user_id] = s.score; });

    const mapped: UserRow[] = (profiles ?? []).map((p) => ({
      id: p.id,
      user_id: p.user_id,
      display_name: p.display_name,
      phone: p.phone,
      created_at: p.created_at,
      roles: roleMap[p.user_id] ?? ["user"],
      trust_score: scoreMap[p.user_id] ?? null,
    }));

    setUsers(mapped);
    setLoading(false);
  }

  async function changeRole(userId: string, newRole: string) {
    if (!hasPermission("users.change_role")) return;
    const { error } = await supabase.from("user_roles").update({ role: newRole as any }).eq("user_id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role updated" });
      fetchUsers();
    }
  }

  const filtered = users.filter((u) =>
    (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">{users.length} total users</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Trust Score</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.display_name ?? "—"}</p>
                          <p className="text-xs text-muted-foreground">{user.user_id.slice(0, 8)}...</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.map((r) => (
                            <Badge key={r} variant={r === "super_admin" ? "destructive" : r === "admin" ? "default" : "secondary"} className="text-xs">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.trust_score !== null ? (
                          <span className={user.trust_score < 30 ? "text-destructive font-bold" : user.trust_score > 70 ? "text-green-600 font-bold" : ""}>
                            {user.trust_score}/100
                          </span>
                        ) : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {hasPermission("users.change_role") && (
                            <Select onValueChange={(val) => changeRole(user.user_id, val)}>
                              <SelectTrigger className="h-8 w-28 text-xs">
                                <SelectValue placeholder="Change role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="moderator">Moderator</SelectItem>
                                <SelectItem value="support_agent">Support</SelectItem>
                                <SelectItem value="analyst">Analyst</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
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
