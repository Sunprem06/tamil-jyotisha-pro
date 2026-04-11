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

    const signals: Array<{ type: string; severity: string; details: Record<string, any> }> = [];

    // Fetch user data
    const [profileRes, matProfileRes, messagesRes, unlocksRes, reportsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user_id).maybeSingle(),
      supabase.from("matrimony_profiles").select("*").eq("user_id", user_id).maybeSingle(),
      supabase.from("messages").select("id, created_at, content").eq("sender_id", user_id).order("created_at", { ascending: false }).limit(50),
      supabase.from("contact_unlocks").select("id, created_at").eq("requester_id", user_id).order("created_at", { ascending: false }).limit(20),
      supabase.from("reports").select("id").eq("reported_user_id", user_id),
    ]);

    const matProfile = matProfileRes.data;

    // Signal 1: Incomplete profile with high activity
    if (matProfile && !matProfile.about_me && !matProfile.photos?.length) {
      const msgCount = messagesRes.data?.length ?? 0;
      if (msgCount > 10) {
        signals.push({
          type: "incomplete_profile_high_activity",
          severity: "medium",
          details: { messageCount: msgCount, hasAbout: false, photoCount: 0 }
        });
      }
    }

    // Signal 2: Rapid messaging (>20 messages in 1 hour)
    const messages = messagesRes.data ?? [];
    if (messages.length >= 20) {
      const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
      const recentMsgs = messages.filter((m) => m.created_at > oneHourAgo);
      if (recentMsgs.length >= 20) {
        signals.push({
          type: "rapid_messaging",
          severity: "high",
          details: { messagesInLastHour: recentMsgs.length }
        });
      }
    }

    // Signal 3: Excessive contact unlocks (>5 in 24 hours)
    const unlocks = unlocksRes.data ?? [];
    if (unlocks.length >= 5) {
      const oneDayAgo = new Date(Date.now() - 86400000).toISOString();
      const recentUnlocks = unlocks.filter((u) => u.created_at > oneDayAgo);
      if (recentUnlocks.length >= 5) {
        signals.push({
          type: "excessive_contact_unlocks",
          severity: "high",
          details: { unlocksIn24h: recentUnlocks.length }
        });
      }
    }

    // Signal 4: Multiple reports
    const reportCount = reportsRes.data?.length ?? 0;
    if (reportCount >= 3) {
      signals.push({
        type: "multiple_reports",
        severity: reportCount >= 5 ? "critical" : "high",
        details: { reportCount }
      });
    }

    // Signal 5: Suspicious message patterns (money/phone keywords)
    const suspiciousKeywords = ["money", "send", "bank", "account", "paytm", "gpay", "phone number", "whatsapp", "telegram"];
    const suspiciousMessages = messages.filter((m) =>
      suspiciousKeywords.some((kw) => m.content.toLowerCase().includes(kw))
    );
    if (suspiciousMessages.length >= 3) {
      signals.push({
        type: "suspicious_message_content",
        severity: "high",
        details: { flaggedMessageCount: suspiciousMessages.length }
      });
    }

    // Signal 6: New account with premium (possible scam lure)
    if (matProfile) {
      const accountAge = Date.now() - new Date(matProfile.created_at).getTime();
      const daysSinceCreation = accountAge / 86400000;
      if (daysSinceCreation < 2 && matProfile.is_premium) {
        signals.push({
          type: "new_account_premium",
          severity: "medium",
          details: { accountAgeDays: Math.round(daysSinceCreation * 10) / 10 }
        });
      }
    }

    // Log all detected signals
    if (signals.length > 0) {
      const inserts = signals.map((s) => ({
        user_id,
        signal_type: s.type,
        severity: s.severity,
        details: s.details,
      }));
      await supabase.from("fraud_logs").insert(inserts);
    }

    return new Response(JSON.stringify({
      user_id,
      signalsDetected: signals.length,
      signals,
      riskLevel: signals.some((s) => s.severity === "critical") ? "critical"
        : signals.some((s) => s.severity === "high") ? "high"
        : signals.length > 0 ? "medium" : "low"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
