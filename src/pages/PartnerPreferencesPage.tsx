import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Settings2, Save } from "lucide-react";

export default function PartnerPreferencesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    age_min: 18, age_max: 45,
    height_min: 140, height_max: 200,
    marital_status: ["never_married"],
    mother_tongue: ["Tamil"],
    education: [] as string[],
    occupation: [] as string[],
    caste: [] as string[],
    city: [] as string[],
    state: [] as string[],
    country: ["India"],
    annual_income_min: "",
    star_compatibility_required: true,
    dosha_check_required: true,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("partner_preferences").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setForm({
          age_min: data.age_min ?? 18,
          age_max: data.age_max ?? 45,
          height_min: data.height_min ?? 140,
          height_max: data.height_max ?? 200,
          marital_status: data.marital_status ?? ["never_married"],
          mother_tongue: data.mother_tongue ?? ["Tamil"],
          education: data.education ?? [],
          occupation: data.occupation ?? [],
          caste: data.caste ?? [],
          city: data.city ?? [],
          state: data.state ?? [],
          country: data.country ?? ["India"],
          annual_income_min: data.annual_income_min ?? "",
          star_compatibility_required: data.star_compatibility_required ?? true,
          dosha_check_required: data.dosha_check_required ?? true,
        });
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      age_min: form.age_min,
      age_max: form.age_max,
      height_min: form.height_min,
      height_max: form.height_max,
      marital_status: form.marital_status,
      mother_tongue: form.mother_tongue,
      education: form.education.length > 0 ? form.education : null,
      occupation: form.occupation.length > 0 ? form.occupation : null,
      caste: form.caste.length > 0 ? form.caste : null,
      city: form.city.length > 0 ? form.city : null,
      state: form.state.length > 0 ? form.state : null,
      country: form.country,
      annual_income_min: form.annual_income_min || null,
      star_compatibility_required: form.star_compatibility_required,
      dosha_check_required: form.dosha_check_required,
    };

    const { data: existing } = await supabase.from("partner_preferences").select("id").eq("user_id", user.id).maybeSingle();
    const { error } = existing
      ? await supabase.from("partner_preferences").update(payload).eq("user_id", user.id)
      : await supabase.from("partner_preferences").insert(payload);

    if (error) {
      toast({ title: "பிழை", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "சேமிக்கப்பட்டது!", description: "Partner preferences saved successfully" });
    }
    setSaving(false);
  };

  const educationOptions = ["10th", "12th", "Diploma", "Bachelor's", "Master's", "Doctorate", "Professional"];
  const occupationOptions = ["Software Engineer", "Doctor", "Teacher", "Business", "Government", "Engineer", "Lawyer", "Accountant", "Other"];
  const incomeOptions = ["Below 2 Lakh", "2-5 Lakh", "5-10 Lakh", "10-20 Lakh", "20-50 Lakh", "Above 50 Lakh"];

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-tamil">துணை விருப்பங்கள்</h1>
          <p className="text-muted-foreground">Partner Preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-tamil">
              <Settings2 className="h-5 w-5" /> அடிப்படை விருப்பங்கள்
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-tamil">குறைந்தபட்ச வயது</Label>
                <Input type="number" min={18} max={70} value={form.age_min}
                  onChange={e => setForm({ ...form, age_min: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="font-tamil">அதிகபட்ச வயது</Label>
                <Input type="number" min={18} max={70} value={form.age_max}
                  onChange={e => setForm({ ...form, age_max: Number(e.target.value) })} />
              </div>
            </div>

            {/* Height Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-tamil">குறைந்தபட்ச உயரம் (cm)</Label>
                <Input type="number" min={100} max={220} value={form.height_min}
                  onChange={e => setForm({ ...form, height_min: Number(e.target.value) })} />
              </div>
              <div>
                <Label className="font-tamil">அதிகபட்ச உயரம் (cm)</Label>
                <Input type="number" min={100} max={220} value={form.height_max}
                  onChange={e => setForm({ ...form, height_max: Number(e.target.value) })} />
              </div>
            </div>

            {/* Income */}
            <div>
              <Label className="font-tamil">குறைந்தபட்ச ஆண்டு வருமானம்</Label>
              <Select value={form.annual_income_min} onValueChange={v => setForm({ ...form, annual_income_min: v })}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {incomeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-tamil">கல்வி & தொழில்</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="font-tamil mb-2 block">கல்வி (Education)</Label>
              <div className="flex flex-wrap gap-2">
                {educationOptions.map(e => (
                  <Button key={e} variant={form.education.includes(e) ? "default" : "outline"} size="sm"
                    onClick={() => setForm({ ...form, education: toggleArray(form.education, e) })}>
                    {e}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="font-tamil mb-2 block">தொழில் (Occupation)</Label>
              <div className="flex flex-wrap gap-2">
                {occupationOptions.map(o => (
                  <Button key={o} variant={form.occupation.includes(o) ? "default" : "outline"} size="sm"
                    onClick={() => setForm({ ...form, occupation: toggleArray(form.occupation, o) })}>
                    {o}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-tamil">ஜோதிட விருப்பங்கள்</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-tamil">நட்சத்திர பொருத்தம் அவசியம்</Label>
                <p className="text-sm text-muted-foreground">Star compatibility must match</p>
              </div>
              <Switch checked={form.star_compatibility_required}
                onCheckedChange={v => setForm({ ...form, star_compatibility_required: v })} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-tamil">தோஷ பரிசோதனை அவசியம்</Label>
                <p className="text-sm text-muted-foreground">Dosha check required</p>
              </div>
              <Switch checked={form.dosha_check_required}
                onCheckedChange={v => setForm({ ...form, dosha_check_required: v })} />
            </div>
          </CardContent>
        </Card>

        <Button variant="sacred" className="w-full font-tamil gap-2" onClick={handleSave} disabled={saving}>
          <Save className="h-5 w-5" /> {saving ? "சேமிக்கிறது..." : "விருப்பங்களை சேமிக்க"}
        </Button>
      </main>
      <Footer />
    </div>
  );
}
