import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Save } from "lucide-react";

interface Config {
  id: string;
  key: string;
  value: any;
  category: string;
  description: string | null;
}

export default function AdminConfigPage() {
  const [configs, setConfigs] = useState<Config[]>([]);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission("config.update");

  useEffect(() => { fetchConfigs(); }, []);

  async function fetchConfigs() {
    const { data } = await supabase.from("system_configurations").select("*").order("category");
    setConfigs(data ?? []);
    const vals: Record<string, string> = {};
    data?.forEach((c) => { vals[c.key] = JSON.stringify(c.value, null, 2); });
    setEditValues(vals);
    setLoading(false);
  }

  async function saveConfig(key: string) {
    setSaving(key);
    try {
      const parsed = JSON.parse(editValues[key]);
      const { error } = await supabase.from("system_configurations").update({ value: parsed, updated_by: user?.id }).eq("key", key);
      if (error) throw error;
      toast({ title: "Configuration saved" });
      fetchConfigs();
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Invalid JSON", variant: "destructive" });
    }
    setSaving(null);
  }

  const categories = [...new Set(configs.map((c) => c.category))];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Configuration</h1>
          <p className="text-muted-foreground">All business rules are configurable — no hardcoded values</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} className="space-y-4">
              <h2 className="text-lg font-semibold capitalize">{cat}</h2>
              {configs.filter((c) => c.category === cat).map((config) => (
                <Card key={config.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{config.key}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{config.category}</Badge>
                    </div>
                    {config.description && <CardDescription>{config.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={editValues[config.key] ?? ""}
                      onChange={(e) => setEditValues((v) => ({ ...v, [config.key]: e.target.value }))}
                      rows={Math.min(Object.keys(config.value as object).length + 2, 10)}
                      className="font-mono text-sm"
                      disabled={!canEdit}
                    />
                    {canEdit && (
                      <Button size="sm" className="mt-3" onClick={() => saveConfig(config.key)} disabled={saving === config.key}>
                        <Save className="h-3 w-3 mr-1" /> {saving === config.key ? "Saving..." : "Save"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
