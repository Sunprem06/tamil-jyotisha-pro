import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { BackButton } from "@/components/BackButton";

const ALL_ROLES = ["super_admin", "admin", "moderator", "support_agent", "analyst", "user", "astrologer"];

export default function AdminRolesPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [rolePerms, setRolePerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isSuperAdmin } = useAdminAuth();

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const [permsRes, rpRes] = await Promise.all([
      supabase.from("permissions").select("*").order("category"),
      supabase.from("role_permissions").select("*"),
    ]);
    setPermissions(permsRes.data ?? []);
    setRolePerms(rpRes.data ?? []);
    setLoading(false);
  }

  function hasRolePerm(role: string, permId: string) {
    return rolePerms.some(rp => rp.role === role && rp.permission_id === permId);
  }

  async function togglePerm(role: string, permId: string) {
    if (!isSuperAdmin) return;
    const existing = rolePerms.find(rp => rp.role === role && rp.permission_id === permId);
    if (existing) {
      await supabase.from("role_permissions").delete().eq("id", existing.id);
    } else {
      await supabase.from("role_permissions").insert({ role: role as any, permission_id: permId });
    }
    fetchData();
  }

  const categories = [...new Set(permissions.map(p => p.category))];

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <div>
          <h1 className="text-2xl font-bold">Roles & Permissions</h1>
          <p className="text-muted-foreground">Configurable permission matrix — {isSuperAdmin ? "click to toggle" : "read-only"}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          categories.map(cat => (
            <Card key={cat}>
              <CardHeader><CardTitle className="capitalize">{cat}</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4">Permission</th>
                        {ALL_ROLES.map(r => <th key={r} className="text-center px-2 py-2"><Badge variant="secondary" className="text-xs">{r}</Badge></th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {permissions.filter(p => p.category === cat).map(perm => (
                        <tr key={perm.id} className="border-b last:border-0">
                          <td className="py-2 pr-4">{perm.description}</td>
                          {ALL_ROLES.map(role => (
                            <td key={role} className="text-center px-2 py-2">
                              <Checkbox
                                checked={hasRolePerm(role, perm.id)}
                                onCheckedChange={() => togglePerm(role, perm.id)}
                                disabled={!isSuperAdmin}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
