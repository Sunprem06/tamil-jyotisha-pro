import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ContactUnlockButton } from "@/components/matrimony/ContactUnlockButton";
import { User, MapPin, GraduationCap, Briefcase, Heart, ArrowLeft, Star, Shield, Flag, MessageSquare } from "lucide-react";

export default function MatrimonyViewProfilePage() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [matchScore, setMatchScore] = useState<any>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchProfile();
  }, [userId]);

  async function fetchProfile() {
    setLoading(true);
    const { data } = await supabase
      .from("matrimony_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    setProfile(data);
    setLoading(false);

    // Auto-match if both users have profiles
    if (data && user && user.id !== userId) {
      const { data: myProfile } = await supabase
        .from("matrimony_profiles")
        .select("date_of_birth")
        .eq("user_id", user.id)
        .maybeSingle();
      if (myProfile) {
        try {
          const { data: matchData } = await supabase.functions.invoke("matching", {
            body: {
              person1: { dateOfBirth: myProfile.date_of_birth, timezone: 5.5 },
              person2: { dateOfBirth: data.date_of_birth, timezone: 5.5 },
            },
          });
          setMatchScore(matchData);
        } catch { /* matching optional */ }
      }
    }
  }

  async function handleReport() {
    if (!user || !userId || !reportReason) return;
    setReporting(true);
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_user_id: userId,
      reason: reportReason,
      details: reportDetails || null,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "புகார் அளிக்கப்பட்டது", description: "Report submitted. We will review it shortly." });
    }
    setReporting(false);
    setReportOpen(false);
    setReportReason("");
    setReportDetails("");
  }

  async function handleSendMessage() {
    if (!user || !userId) return;
    // Send an initial message
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: userId,
      content: `வணக்கம்! உங்கள் சுயவிவரம் பார்த்தேன். (Hello! I saw your profile.)`,
    });
    toast({ title: "Message sent!" });
    navigate("/messages");
  }

  const age = (dob: string) => {
    const d = new Date(dob);
    return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Profile not found</h2>
          <Link to="/matrimony/search"><Button variant="outline">Back to Search</Button></Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 max-w-4xl space-y-6">
        <Link to="/matrimony/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Search
        </Link>

        {/* Photo & Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photos */}
              <div className="flex-shrink-0">
                {profile.photos && profile.photos.length > 0 ? (
                  <div className="space-y-2">
                    <img src={profile.photos[0]} alt="Profile" className="w-48 h-48 rounded-xl object-cover" />
                    {profile.photos.length > 1 && (
                      <div className="flex gap-2">
                        {profile.photos.slice(1, 4).map((p: string, i: number) => (
                          <img key={i} src={p} alt="Photo" className="w-14 h-14 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-xl bg-primary/10 flex items-center justify-center">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">
                    {age(profile.date_of_birth)} வயது, {profile.gender === "male" ? "ஆண்" : "பெண்"}
                  </h1>
                  {profile.is_verified && <Badge variant="default"><Shield className="h-3 w-3 mr-1" />Verified</Badge>}
                  {profile.is_premium && <Badge className="bg-amber-500"><Star className="h-3 w-3 mr-1" />Premium</Badge>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {profile.city && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" /> {profile.city}, {profile.state}, {profile.country}
                    </div>
                  )}
                  {profile.education && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" /> {profile.education} {profile.education_detail ? `- ${profile.education_detail}` : ""}
                    </div>
                  )}
                  {profile.occupation && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" /> {profile.occupation} {profile.company_name ? `at ${profile.company_name}` : ""}
                    </div>
                  )}
                  {profile.annual_income && (
                    <div className="text-muted-foreground">💰 {profile.annual_income}</div>
                  )}
                </div>

                <div className="flex gap-3 pt-2 flex-wrap">
                  {user && user.id !== profile.user_id && (
                    <>
                      <ContactUnlockButton targetUserId={profile.user_id} targetName={`${age(profile.date_of_birth)} yrs, ${profile.city ?? "Unknown"}`} />
                      <Button variant="outline" size="sm" onClick={handleSendMessage}>
                        <MessageSquare className="h-4 w-4 mr-1" /> Send Message
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setReportOpen(true)}>
                        <Flag className="h-4 w-4 mr-1" /> Report
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horoscope Match Score */}
        {matchScore && (
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold font-tamil mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" /> பொருத்த மதிப்பெண்
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-foreground">{matchScore.totalScore}/10</p>
                    <p className="text-xs text-primary-foreground/80">{matchScore.percentage}%</p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold font-tamil text-lg">{matchScore.tamilRecommendation}</p>
                  <p className="text-muted-foreground text-sm">{matchScore.recommendation}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {matchScore.poruthams?.map((p: any) => (
                      <Badge key={p.name} variant={p.matched ? "default" : "outline"}
                        className={p.matched ? "bg-green-600" : "text-destructive border-destructive"}>
                        {p.tamilName} {p.matched ? "✓" : "✗"}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-tamil text-lg mb-3">தனிப்பட்ட தகவல்</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">திருமண நிலை</dt><dd>{profile.marital_status === "never_married" ? "முதல் திருமணம்" : profile.marital_status}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">தாய்மொழி</dt><dd>{profile.mother_tongue}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">மதம்</dt><dd>{profile.religion}</dd></div>
                {profile.caste && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">ஜாதி</dt><dd>{profile.caste}</dd></div>}
                {profile.sub_caste && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">உட்பிரிவு</dt><dd>{profile.sub_caste}</dd></div>}
                {profile.gothram && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">கோத்திரம்</dt><dd>{profile.gothram}</dd></div>}
                {profile.height_cm && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">உயரம்</dt><dd>{profile.height_cm} cm</dd></div>}
                {profile.weight_kg && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">எடை</dt><dd>{profile.weight_kg} kg</dd></div>}
                {profile.complexion && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">நிறம்</dt><dd>{profile.complexion}</dd></div>}
                {profile.body_type && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">உடல் வாகு</dt><dd>{profile.body_type}</dd></div>}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-tamil text-lg mb-3">குடும்பத் தகவல்</h3>
              <dl className="space-y-2 text-sm">
                {profile.family_type && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">குடும்ப வகை</dt><dd>{profile.family_type}</dd></div>}
                {profile.family_status && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">குடும்ப நிலை</dt><dd>{profile.family_status}</dd></div>}
                {profile.father_occupation && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">தந்தை தொழில்</dt><dd>{profile.father_occupation}</dd></div>}
                {profile.mother_occupation && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">தாய் தொழில்</dt><dd>{profile.mother_occupation}</dd></div>}
                {profile.siblings_count != null && <div className="flex justify-between"><dt className="text-muted-foreground font-tamil">உடன்பிறப்புகள்</dt><dd>{profile.siblings_count}</dd></div>}
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* About Me */}
        {profile.about_me && (
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold font-tamil text-lg mb-2">என்னைப் பற்றி</h3>
              <p className="text-muted-foreground">{profile.about_me}</p>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-tamil">புகார் அளிக்கவும்</DialogTitle>
            <DialogDescription>Report this profile for inappropriate content or behavior</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={reportReason} onValueChange={setReportReason}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fake_profile">Fake Profile / போலி சுயவிவரம்</SelectItem>
                <SelectItem value="harassment">Harassment / தொந்தரவு</SelectItem>
                <SelectItem value="inappropriate_content">Inappropriate Content / பொருத்தமற்ற உள்ளடக்கம்</SelectItem>
                <SelectItem value="scam">Scam / மோசடி</SelectItem>
                <SelectItem value="offensive_language">Offensive Language / அவதூறு</SelectItem>
                <SelectItem value="other">Other / பிற</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              value={reportDetails}
              onChange={e => setReportDetails(e.target.value)}
              placeholder="Additional details (optional)..."
              rows={3}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReport} disabled={reporting || !reportReason}>
              {reporting ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
