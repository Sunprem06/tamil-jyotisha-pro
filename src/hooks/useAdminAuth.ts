import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export type AdminRole = "super_admin" | "admin" | "moderator" | "support_agent" | "analyst";

export function useAdminAuth() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const adminRoles: AdminRole[] = ["super_admin", "admin", "moderator", "support_agent", "analyst"];

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setPermissions([]);
      setLoading(false);
      return;
    }

    async function fetchRolesAndPermissions() {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);

      const userRoles = roleData?.map((r) => r.role) ?? [];
      setRoles(userRoles);

      if (userRoles.some((r) => adminRoles.includes(r as AdminRole))) {
        const { data: permData } = await supabase
          .from("role_permissions")
          .select("permission_id, permissions(name)")
          .in("role", userRoles);

        const perms = permData?.map((p: any) => p.permissions?.name).filter(Boolean) ?? [];
        setPermissions([...new Set(perms)]);
      }

      setLoading(false);
    }

    fetchRolesAndPermissions();
  }, [user]);

  const isAdmin = roles.some((r) => adminRoles.includes(r as AdminRole));
  const isSuperAdmin = roles.includes("super_admin");
  const hasPermission = (perm: string) => permissions.includes(perm);

  return { user, roles, permissions, isAdmin, isSuperAdmin, hasPermission, loading: authLoading || loading };
}
