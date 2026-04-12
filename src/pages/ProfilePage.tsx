import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Users, Plus, Trash2, Save } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { PlaceAutocomplete } from "@/components/PlaceAutocomplete";

interface FamilyMember {
  id: string;
  name: string;
  date_of_birth: string;
  time_of_birth: string;
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
  relationship: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "", date_of_birth: "", time_of_birth: "06:00",
    place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5, relationship: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadFamilyMembers();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user!.id).single();
    if (data) {
      setDisplayName(data.display_name || "");
      setPhone(data.phone || "");
    }
  };

  const loadFamilyMembers = async () => {
    const { data } = await supabase.from("family_members").select("*").eq("user_id", user!.id).order("created_at");
    if (data) setFamilyMembers(data);
  };

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update({ display_name: displayName, phone }).eq("user_id", user!.id);
    if (error) toast({ title: "பிழை", description: error.message, variant: "destructive" });
    else toast({ title: "சேமிக்கப்பட்டது!", description: "சுயவிவரம் புதுப்பிக்கப்பட்டது" });
  };

  const addFamilyMember = async () => {
    const { error } = await supabase.from("family_members").insert({
      user_id: user!.id,
      name: newMember.name,
      date_of_birth: newMember.date_of_birth,
      time_of_birth: newMember.time_of_birth,
      place: newMember.place,
      latitude: newMember.latitude,
      longitude: newMember.longitude,
      timezone: newMember.timezone,
      relationship: newMember.relationship || null,
    });
    if (error) {
      toast({ title: "பிழை", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "சேர்க்கப்பட்டது!", description: `${newMember.name} சேர்க்கப்பட்டார்` });
      setShowAddForm(false);
      setNewMember({ name: "", date_of_birth: "", time_of_birth: "06:00", place: "Chennai", latitude: 13.0827, longitude: 80.2707, timezone: 5.5, relationship: "" });
      loadFamilyMembers();
    }
  };

  const deleteMember = async (id: string) => {
    await supabase.from("family_members").delete().eq("id", id);
    loadFamilyMembers();
    toast({ title: "நீக்கப்பட்டது" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <BackButton />
          <h1 className="text-3xl font-bold font-tamil text-gradient-sacred mb-8 text-center">
            சுயவிவரம் (Profile)
          </h1>

          <div className="rasi-card mb-8">
            <h2 className="text-xl font-bold font-tamil mb-4 flex items-center gap-2">
              <User className="h-5 w-5" /> உங்கள் விவரங்கள்
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-tamil">பெயர்</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div>
                <Label className="font-tamil">தொலைபேசி</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <Button variant="sacred" className="mt-4 font-tamil" onClick={saveProfile}>
              <Save className="h-4 w-4 mr-2" /> சேமிக்க
            </Button>
          </div>

          <div className="rasi-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold font-tamil flex items-center gap-2">
                <Users className="h-5 w-5" /> குடும்ப உறுப்பினர்கள்
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-1" /> சேர்
              </Button>
            </div>

            {showAddForm && (
              <div className="border border-border rounded-lg p-4 mb-4 bg-muted/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="font-tamil text-xs">பெயர்</Label>
                    <Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                  </div>
                  <div>
                    <Label className="font-tamil text-xs">உறவு</Label>
                    <Input value={newMember.relationship} onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })} placeholder="மனைவி, மகன்..." />
                  </div>
                  <div>
                    <Label className="text-xs">Date of Birth</Label>
                    <Input type="date" value={newMember.date_of_birth} onChange={(e) => setNewMember({ ...newMember, date_of_birth: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs">Time of Birth</Label>
                    <Input type="time" value={newMember.time_of_birth} onChange={(e) => setNewMember({ ...newMember, time_of_birth: e.target.value })} />
                  </div>
                  <div>
                    <Label className="text-xs font-tamil">பிறந்த இடம் (Place)</Label>
                    <PlaceAutocomplete
                      value={newMember.place}
                      onChange={(place, lat, lng) => setNewMember({ ...newMember, place, latitude: lat, longitude: lng })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Latitude</Label>
                    <Input type="number" step="0.0001" value={newMember.latitude} readOnly className="bg-muted/50" />
                  </div>
                  <div>
                    <Label className="text-xs">Longitude</Label>
                    <Input type="number" step="0.0001" value={newMember.longitude} readOnly className="bg-muted/50" />
                  </div>
                </div>
                <Button variant="sacred" className="mt-3 font-tamil" onClick={addFamilyMember}>
                  <Plus className="h-4 w-4 mr-1" /> குடும்ப உறுப்பினர் சேர்
                </Button>
              </div>
            )}

            {familyMembers.length === 0 ? (
              <p className="text-muted-foreground text-sm font-tamil text-center py-4">
                குடும்ப உறுப்பினர்கள் இல்லை. மேலே "சேர்" பொத்தானை கிளிக் செய்யவும்.
              </p>
            ) : (
              <div className="space-y-3">
                {familyMembers.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
                    <div>
                      <p className="font-bold font-tamil">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.relationship && <span className="mr-2">{m.relationship}</span>}
                        {m.date_of_birth} • {m.time_of_birth} • {m.place}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => deleteMember(m.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
