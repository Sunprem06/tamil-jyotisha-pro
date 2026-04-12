import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0, matProfiles: 0, contactUnlocks: 0, messagesCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const [users, mat, unlocks, msgs] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("matrimony_profiles").select("id", { count: "exact", head: true }),
        supabase.from("contact_unlocks").select("id", { count: "exact", head: true }),
        supabase.from("messages").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        totalUsers: users.count ?? 0,
        matProfiles: mat.count ?? 0,
        contactUnlocks: unlocks.count ?? 0,
        messagesCount: msgs.count ?? 0,
      });
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <h1 className="text-2xl font-bold">Analytics</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.totalUsers}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Matrimony Profiles</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.matProfiles}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Contact Unlocks</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.contactUnlocks}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-sm text-muted-foreground">Messages</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">{stats.messagesCount}</div></CardContent></Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
