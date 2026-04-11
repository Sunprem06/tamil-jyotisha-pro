import { Link, useLocation, Navigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  LayoutDashboard, Users, Shield, Settings, AlertTriangle,
  CreditCard, MessageSquare, FileText, BarChart3, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: null },
  { href: "/admin/users", label: "Users", icon: Users, permission: "users.read" },
  { href: "/admin/profiles", label: "Profiles", icon: FileText, permission: "profiles.moderate" },
  { href: "/admin/fraud", label: "Fraud Detection", icon: AlertTriangle, permission: "fraud.read" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, permission: "payments.read" },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, permission: "analytics.read" },
  { href: "/admin/roles", label: "Roles & Permissions", icon: Shield, permission: "users.change_role" },
  { href: "/admin/config", label: "Configuration", icon: Settings, permission: "config.read" },
  { href: "/admin/reports", label: "Reports", icon: MessageSquare, permission: "profiles.moderate" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, hasPermission, loading } = useAdminAuth();
  const { signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/" replace />;

  const visibleLinks = sidebarLinks.filter(
    (link) => !link.permission || hasPermission(link.permission)
  );

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-sacred flex items-center justify-center">
              <span className="text-primary-foreground text-sm">ௐ</span>
            </div>
            <div>
              <h2 className="font-bold text-sm">Admin Panel</h2>
              <p className="text-xs text-muted-foreground">Tamil Jothidam</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
