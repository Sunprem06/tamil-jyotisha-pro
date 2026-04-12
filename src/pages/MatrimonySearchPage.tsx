import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Heart, MapPin, GraduationCap, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ContactUnlockButton } from "@/components/matrimony/ContactUnlockButton";
import { BackButton } from "@/components/BackButton";

export default function MatrimonySearchPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [genderFilter, setGenderFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchProfiles(); }, [genderFilter]);

  async function fetchProfiles() {
    setLoading(true);
    let query = supabase.from("matrimony_profiles").select("*").eq("profile_status", "approved").eq("visibility", "public");
    if (genderFilter !== "all") query = query.eq("gender", genderFilter);
    if (user) query = query.neq("user_id", user.id);
    const { data } = await query.order("created_at", { ascending: false }).limit(50);
    setProfiles(data ?? []);
    setLoading(false);
  }

  const filtered = profiles.filter(p =>
    !search || (p.city ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.education ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (p.caste ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const age = (dob: string) => {
    const d = new Date(dob);
    return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold font-tamil">திருமண பொருத்தம் தேடல்</h1>
            <p className="text-muted-foreground">Find your perfect match</p>
          </div>
          <Link to="/matrimony/profile">
            <Button variant="sacred">Create / Edit Profile</Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by city, education, caste..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="male">ஆண் (Male)</SelectItem>
              <SelectItem value="female">பெண் (Female)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No profiles found</p>
            <Link to="/matrimony/profile"><Button className="mt-4">Create Your Profile</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <Card key={p.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {p.photos && p.photos.length > 0 ? (
                        <img src={p.photos[0]} alt="Profile" className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{age(p.date_of_birth)} வயது, {p.gender === "male" ? "ஆண்" : "பெண்"}</p>
                        <p className="text-sm text-muted-foreground">{p.marital_status === "never_married" ? "முதல் திருமணம்" : p.marital_status}</p>
                      </div>
                    </div>
                    {p.is_verified && <Badge variant="default" className="text-xs">✓ Verified</Badge>}
                    {p.is_premium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
                  </div>

                  <div className="space-y-1.5 text-sm">
                    {p.city && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{p.city}, {p.state}</div>}
                    {p.education && <div className="flex items-center gap-2 text-muted-foreground"><GraduationCap className="h-3.5 w-3.5" />{p.education}</div>}
                    {p.caste && <div className="text-muted-foreground">ஜாதி: {p.caste} {p.gothram ? `| கோத்திரம்: ${p.gothram}` : ""}</div>}
                    {p.height_cm && <div className="text-muted-foreground">{p.height_cm}cm {p.weight_kg ? `| ${p.weight_kg}kg` : ""}</div>}
                  </div>

                  {p.about_me && <p className="text-sm text-muted-foreground line-clamp-2">{p.about_me}</p>}

                  <div className="flex gap-2">
                    <ContactUnlockButton targetUserId={p.user_id} targetName={`${age(p.date_of_birth)} yrs, ${p.city ?? "Unknown"}`} />
                    <Link to={`/matrimony/profile/${p.user_id}`}>
                      <Button variant="outline" size="sm">View Profile</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
