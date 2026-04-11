import { createClient } from "https://esm.sh/@supabase/supabase-js@2.103.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { user_id } = await req.json();
    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Fetch all relevant data in parallel
    const [profileRes, matProfileRes, reportsRes, subsRes, creditsRes, fraudRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user_id).maybeSingle(),
      supabase.from("matrimony_profiles").select("*").eq("user_id", user_id).maybeSingle(),
      supabase.from("reports").select("id").eq("reported_user_id", user_id),
      supabase.from("subscriptions").select("id, status").eq("user_id", user_id),
      supabase.from("credit_transactions").select("amount, type").eq("user_id", user_id),
      supabase.from("fraud_logs").select("id, resolved").eq("user_id", user_id),
    ]);

    // 1. Profile Completeness (0-100)
    let profileCompleteness = 0;
    const profile = profileRes.data;
    const matProfile = matProfileRes.data;
    if (profile) {
      if (profile.display_name) profileCompleteness += 10;
      if (profile.phone) profileCompleteness += 10;
    }
    if (matProfile) {
      const fields = ["education", "occupation", "about_me", "height_cm", "city", "state",
        "gothram", "caste", "family_type", "father_occupation", "mother_occupation"];
      const filled = fields.filter((f) => (matProfile as any)[f]).length;
      profileCompleteness += Math.round((filled / fields.length) * 60);
      if (matProfile.photos && matProfile.photos.length > 0) profileCompleteness += 10;
      if (matProfile.is_verified) profileCompleteness += 10;
    }

    // 2. Verification Level (0-100)
    let verificationLevel = 0;
    if (profile) verificationLevel += 20; // has profile
    if (matProfile) {
      if (matProfile.is_verified) verificationLevel += 50;
      if (matProfile.photos && matProfile.photos.length > 0) verificationLevel += 15;
      if (matProfile.profile_status === "active") verificationLevel += 15;
    }

    // 3. Behavior Score (0-100)
    const reportCount = reportsRes.data?.length ?? 0;
    const unresolvedFraud = fraudRes.data?.filter((f) => !f.resolved).length ?? 0;
    let behaviorScore = 100;
    behaviorScore -= reportCount * 15;
    behaviorScore -= unresolvedFraud * 25;
    behaviorScore = Math.max(0, Math.min(100, behaviorScore));

    // 4. Payment History Score (0-100)
    const activeSubs = subsRes.data?.filter((s) => s.status === "active").length ?? 0;
    const totalCredits = creditsRes.data?.reduce((sum, t) => sum + (t.type === "purchase" ? t.amount : 0), 0) ?? 0;
    let paymentHistoryScore = 0;
    if (activeSubs > 0) paymentHistoryScore += 50;
    paymentHistoryScore += Math.min(50, totalCredits * 5);

    // 5. Activity Quality (0-100)
    let activityQuality = 50; // base
    if (matProfile?.about_me && matProfile.about_me.length > 50) activityQuality += 20;
    if (matProfile?.photos && matProfile.photos.length >= 3) activityQuality += 15;
    if (reportCount === 0) activityQuality += 15;
    activityQuality = Math.min(100, activityQuality);

    // Weighted final score
    const weights = { profile: 0.25, verification: 0.20, behavior: 0.25, payment: 0.15, activity: 0.15 };
    const finalScore = Math.round(
      profileCompleteness * weights.profile +
      verificationLevel * weights.verification +
      behaviorScore * weights.behavior +
      paymentHistoryScore * weights.payment +
      activityQuality * weights.activity
    );

    // Upsert trust score
    const { error } = await supabase.from("trust_scores").upsert({
      user_id,
      score: finalScore,
      profile_completeness: profileCompleteness,
      verification_level: verificationLevel,
      behavior_score: behaviorScore,
      payment_history_score: paymentHistoryScore,
      activity_quality: activityQuality,
      report_count: reportCount,
      last_calculated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });

    if (error) throw error;

    return new Response(JSON.stringify({
      score: finalScore, profileCompleteness, verificationLevel,
      behaviorScore, paymentHistoryScore, activityQuality, reportCount
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
