import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PhotoUpload } from "@/components/matrimony/PhotoUpload";
import { BackButton } from "@/components/BackButton";
import { BirthDateSelect } from "@/components/forms/BirthDateSelect";

export default function MatrimonyProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [form, setForm] = useState({
    gender: "", date_of_birth: "", height_cm: "", weight_kg: "",
    complexion: "", body_type: "", marital_status: "never_married",
    mother_tongue: "Tamil", religion: "Hindu", caste: "", sub_caste: "", gothram: "",
    education: "", education_detail: "", occupation: "", occupation_detail: "",
    annual_income: "", company_name: "",
    city: "", state: "Tamil Nadu", country: "India",
    about_me: "", family_type: "", family_status: "",
    father_occupation: "", mother_occupation: "", siblings_count: "0",
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  // Load existing profile
  useEffect(() => {
    if (!user) return;
    supabase.from("matrimony_profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setPhotos(data.photos ?? []);
        setForm({
          gender: data.gender ?? "", date_of_birth: data.date_of_birth ?? "",
          height_cm: data.height_cm?.toString() ?? "", weight_kg: data.weight_kg?.toString() ?? "",
          complexion: data.complexion ?? "", body_type: data.body_type ?? "",
          marital_status: data.marital_status ?? "never_married",
          mother_tongue: data.mother_tongue ?? "Tamil", religion: data.religion ?? "Hindu",
          caste: data.caste ?? "", sub_caste: data.sub_caste ?? "", gothram: data.gothram ?? "",
          education: data.education ?? "", education_detail: data.education_detail ?? "",
          occupation: data.occupation ?? "", occupation_detail: data.occupation_detail ?? "",
          annual_income: data.annual_income ?? "", company_name: data.company_name ?? "",
          city: data.city ?? "", state: data.state ?? "Tamil Nadu", country: data.country ?? "India",
          about_me: data.about_me ?? "", family_type: data.family_type ?? "",
          family_status: data.family_status ?? "", father_occupation: data.father_occupation ?? "",
          mother_occupation: data.mother_occupation ?? "", siblings_count: data.siblings_count?.toString() ?? "0",
        });
      }
    });
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!form.gender) {
      toast({ title: "பாலினம் தேவை", description: "Please select gender", variant: "destructive" });
      return;
    }
    if (!form.date_of_birth) {
      toast({ title: "பிறந்த தேதி தேவை", description: "Please enter date of birth", variant: "destructive" });
      return;
    }
    const dob = new Date(form.date_of_birth);
    const ageYears = (Date.now() - dob.getTime()) / (365.25 * 24 * 3600 * 1000);
    if (ageYears < 18) {
      toast({ title: "வயது குறைவு", description: "Must be at least 18 years old", variant: "destructive" });
      return;
    }
    if (form.about_me && form.about_me.length > 1000) {
      toast({ title: "About me too long", description: "Maximum 1000 characters", variant: "destructive" });
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("matrimony_profiles").upsert({
      user_id: user.id,
      ...form,
      photos,
      height_cm: form.height_cm ? parseInt(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseInt(form.weight_kg) : null,
      siblings_count: parseInt(form.siblings_count) || 0,
    }, { onConflict: "user_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "திருமண சுயவிவரம் சேமிக்கப்பட்டது!" });
      navigate("/matrimony/search");
    }
    setSaving(false);
  }

  const Field = ({ label, name, placeholder, type = "text" }: { label: string; name: string; placeholder?: string; type?: string }) => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {type === "date" ? (
        <BirthDateSelect value={(form as any)[name]} onChange={value => set(name, value)} />
      ) : (
        <Input type={type} value={(form as any)[name]} onChange={e => set(name, e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          <div>
          <BackButton />
            <h1 className="text-2xl font-bold font-tamil">திருமண சுயவிவரம்</h1>
            <p className="text-muted-foreground">Matrimony Profile</p>
          </div>

          <Card>
            <CardHeader><CardTitle>அடிப்படை தகவல்கள் (Basic Info)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>பாலினம் (Gender) *</Label>
                <Select value={form.gender} onValueChange={v => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">ஆண் (Male)</SelectItem>
                    <SelectItem value="female">பெண் (Female)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="பிறந்த தேதி (DOB) *" name="date_of_birth" type="date" />
              <Field label="உயரம் (cm)" name="height_cm" type="number" />
              <Field label="எடை (kg)" name="weight_kg" type="number" />
              <div className="space-y-1.5">
                <Label>திருமண நிலை</Label>
                <Select value={form.marital_status} onValueChange={v => set("marital_status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never_married">முதல் திருமணம்</SelectItem>
                    <SelectItem value="divorced">விவாகரத்து</SelectItem>
                    <SelectItem value="widowed">விதவை/விதவன்</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field label="நிறம் (Complexion)" name="complexion" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>மதம் & ஜாதி (Religion & Caste)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="தாய்மொழி" name="mother_tongue" />
              <Field label="மதம்" name="religion" />
              <Field label="ஜாதி" name="caste" />
              <Field label="உப ஜாதி" name="sub_caste" />
              <Field label="கோத்திரம்" name="gothram" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>கல்வி & தொழில் (Education & Career)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="கல்வி" name="education" />
              <Field label="கல்வி விவரம்" name="education_detail" />
              <Field label="தொழில்" name="occupation" />
              <Field label="நிறுவனம்" name="company_name" />
              <Field label="வருடாந்திர வருமானம்" name="annual_income" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>இடம் (Location)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="நகரம்" name="city" />
              <Field label="மாநிலம்" name="state" />
              <Field label="நாடு" name="country" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>குடும்ப விவரம் (Family)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="குடும்ப வகை" name="family_type" placeholder="Joint / Nuclear" />
              <Field label="குடும்ப நிலை" name="family_status" placeholder="Middle / Upper" />
              <Field label="தந்தை தொழில்" name="father_occupation" />
              <Field label="தாய் தொழில்" name="mother_occupation" />
              <Field label="உடன்பிறப்புகள்" name="siblings_count" type="number" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>என்னைப் பற்றி (About Me)</CardTitle></CardHeader>
            <CardContent>
              <Textarea value={form.about_me} onChange={e => set("about_me", e.target.value)} rows={4} placeholder="உங்களைப் பற்றி சுருக்கமாக எழுதுங்கள்..." />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>புகைப்படங்கள் (Photos)</CardTitle></CardHeader>
            <CardContent>
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={saving || !form.gender || !form.date_of_birth}>
            {saving ? "சேமிக்கிறது..." : "சுயவிவரத்தை சேமி"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
