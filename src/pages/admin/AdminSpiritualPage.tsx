import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SpiritualUpdate {
  id: string;
  title: string;
  message: string;
  action: string;
  benefit: string;
  category: string;
  update_type: string;
  is_active: boolean;
  created_at: string;
}

const CATEGORIES = ["general", "money", "family", "health", "spiritual"];
const UPDATE_TYPES = ["guidance", "do_this", "avoid_this"];
const CATEGORY_LABELS: Record<string, string> = {
  general: "பொது", money: "பணம்", family: "குடும்பம்", health: "ஆரோக்கியம்", spiritual: "ஆன்மீகம்",
};
const TYPE_LABELS: Record<string, string> = {
  guidance: "வழிகாட்டுதல்", do_this: "செய்யுங்கள்", avoid_this: "தவிர்க்கவும்",
};

const emptyForm = { title: "", message: "", action: "", benefit: "", category: "general", update_type: "guidance" };

export default function AdminSpiritualPage() {
  const [updates, setUpdates] = useState<SpiritualUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchUpdates = async () => {
    const { data } = await supabase
      .from("spiritual_updates")
      .select("*")
      .order("created_at", { ascending: false });
    setUpdates((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchUpdates(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.message || !form.action || !form.benefit) {
      toast.error("அனைத்து புலங்களையும் நிரப்பவும்");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase
          .from("spiritual_updates")
          .update({ ...form, category: form.category as any, update_type: form.update_type as any })
          .eq("id", editing);
        if (error) throw error;
        toast.success("புதுப்பிக்கப்பட்டது");
      } else {
        const { error } = await supabase
          .from("spiritual_updates")
          .insert({
            ...form,
            category: form.category as any,
            update_type: form.update_type as any,
          });
        if (error) throw error;
        toast.success("சேர்க்கப்பட்டது");
      }
      setDialogOpen(false);
      setEditing(null);
      setForm(emptyForm);
      fetchUpdates();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("இதை நிச்சயமாக நீக்க வேண்டுமா?")) return;
    const { error } = await supabase.from("spiritual_updates").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("நீக்கப்பட்டது"); fetchUpdates(); }
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("spiritual_updates")
      .update({ is_active: !current })
      .eq("id", id);
    if (error) toast.error(error.message);
    else fetchUpdates();
  };

  const openEdit = (u: SpiritualUpdate) => {
    setForm({ title: u.title, message: u.message, action: u.action, benefit: u.benefit, category: u.category, update_type: u.update_type });
    setEditing(u.id);
    setDialogOpen(true);
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    try {
      const res = await supabase.functions.invoke("generate-spiritual-update", {
        body: { category: form.category, update_type: form.update_type },
      });
      if (res.error) throw res.error;
      const data = res.data;
      if (data?.title) {
        setForm((f) => ({ ...f, title: data.title, message: data.message, action: data.action, benefit: data.benefit }));
        toast.success("AI உருவாக்கியது!");
      }
    } catch (err: any) {
      toast.error("AI generation failed: " + (err.message || "Unknown error"));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-tamil">ஆன்மீக அப்டேட்கள்</h1>
            <p className="text-muted-foreground">Manage Daily Spiritual Updates</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); setForm(emptyForm); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> Add Update</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-tamil">{editing ? "திருத்து" : "புதிய அப்டேட்"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]} ({c})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type</Label>
                    <Select value={form.update_type} onValueChange={(v) => setForm((f) => ({ ...f, update_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {UPDATE_TYPES.map((t) => <SelectItem key={t} value={t}>{TYPE_LABELS[t]} ({t})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleAIGenerate} disabled={generating} className="w-full">
                  {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  AI Auto-Generate Tamil Content
                </Button>

                <div>
                  <Label className="font-tamil">தலைப்பு (Title)</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Short emotional hook in Tamil" />
                </div>
                <div>
                  <Label className="font-tamil">செய்தி (Message)</Label>
                  <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={3} placeholder="2-4 lines explanation" />
                </div>
                <div>
                  <Label className="font-tamil">செயல் (Action)</Label>
                  <Input value={form.action} onChange={(e) => setForm((f) => ({ ...f, action: e.target.value }))} placeholder="What user should do" />
                </div>
                <div>
                  <Label className="font-tamil">பலன் (Benefit)</Label>
                  <Input value={form.benefit} onChange={(e) => setForm((f) => ({ ...f, benefit: e.target.value }))} placeholder="Expected positive result" />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full">
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {editing ? "Update" : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader><CardTitle>All Updates ({updates.length})</CardTitle></CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8"><div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-tamil">தலைப்பு</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {updates.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-tamil max-w-[200px] truncate">{u.title}</TableCell>
                        <TableCell><Badge variant="outline">{CATEGORY_LABELS[u.category] || u.category}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{TYPE_LABELS[u.update_type] || u.update_type}</Badge></TableCell>
                        <TableCell>
                          <Switch checked={u.is_active} onCheckedChange={() => toggleActive(u.id, u.is_active)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
