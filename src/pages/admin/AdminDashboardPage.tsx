import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, AlertTriangle, CreditCard, Heart, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BackButton } from "@/components/BackButton";

interface DashboardStats {
  totalUsers: number;
  verifiedProfiles: number;
  pendingProfiles: number;
  suspiciousUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  totalMatches: number;
  recentReports: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0, verifiedProfiles: 0, pendingProfiles: 0, suspiciousUsers: 0,
    totalRevenue: 0, activeSubscriptions: 0, totalMatches: 0, recentReports: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [profiles, matProfiles, subs, fraudLogs, reports] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("matrimony_profiles").select("id, is_verified, profile_status", { count: "exact" }),
        supabase.from("subscriptions").select("id, status, amount"),
        supabase.from("fraud_logs").select("id", { count: "exact", head: true }).eq("resolved", false),
        supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);

      const verified = matProfiles.data?.filter((p) => p.is_verified).length ?? 0;
      const pending = matProfiles.data?.filter((p) => p.profile_status === "pending").length ?? 0;
      const activeSubs = subs.data?.filter((s) => s.status === "active") ?? [];
      const revenue = activeSubs.reduce((sum, s) => sum + (s.amount || 0), 0);

      setStats({
        totalUsers: profiles.count ?? 0,
        verifiedProfiles: verified,
        pendingProfiles: pending,
        suspiciousUsers: fraudLogs.count ?? 0,
        totalRevenue: revenue,
        activeSubscriptions: activeSubs.length,
        totalMatches: matProfiles.count ?? 0,
        recentReports: reports.count ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
    { label: "Verified Profiles", value: stats.verifiedProfiles, icon: UserCheck, color: "text-green-600" },
    { label: "Pending Profiles", value: stats.pendingProfiles, icon: Users, color: "text-amber-600" },
    { label: "Suspicious Users", value: stats.suspiciousUsers, icon: AlertTriangle, color: "text-destructive" },
    { label: "Active Subscriptions", value: stats.activeSubscriptions, icon: CreditCard, color: "text-purple-600" },
    { label: "Revenue (₹)", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600" },
    { label: "Matrimony Profiles", value: stats.totalMatches, icon: Heart, color: "text-pink-600" },
    { label: "Pending Reports", value: stats.recentReports, icon: AlertTriangle, color: "text-orange-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
          <BackButton />
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your platform</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
