import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: { user }, error: userErr } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userErr || !user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { matchId } = await req.json();
    if (!matchId) return new Response(JSON.stringify({ error: "matchId required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Load config
    const { data: cfgRows } = await admin
      .from("system_configurations")
      .select("key,value")
      .in("key", ["matrimony.free_matches_count", "matrimony.match_unlock_price"]);
    const cfg: Record<string, any> = {};
    cfgRows?.forEach((r) => { cfg[r.key] = r.value; });
    const freeQuota = Number(cfg["matrimony.free_matches_count"] ?? 3);
    const price = Number(cfg["matrimony.match_unlock_price"] ?? 10);

    // Load match
    const { data: match, error: matchErr } = await admin
      .from("auto_matches")
      .select("*")
      .eq("id", matchId)
      .eq("requester_id", user.id)
      .maybeSingle();
    if (matchErr || !match) return new Response(JSON.stringify({ error: "Match not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (match.is_unlocked) return new Response(JSON.stringify({ ok: true, alreadyUnlocked: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Count existing unlocks for this user
    const { count: unlockedCount } = await admin
      .from("auto_matches")
      .select("id", { count: "exact", head: true })
      .eq("requester_id", user.id)
      .eq("is_unlocked", true);

    const order = (unlockedCount ?? 0) + 1;
    const isFree = order <= freeQuota;
    let cost = 0;

    if (!isFree) {
      // Charge credits
      const { data: credits } = await admin
        .from("credits")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const balance = credits?.balance ?? 0;
      if (balance < price) {
        return new Response(JSON.stringify({ error: "Insufficient credits", required: price, balance }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      cost = price;
      if (credits) {
        await admin.from("credits").update({ balance: balance - price, updated_at: new Date().toISOString() }).eq("user_id", user.id);
      } else {
        await admin.from("credits").insert({ user_id: user.id, balance: -price });
      }
      await admin.from("credit_transactions").insert({
        user_id: user.id,
        amount: -price,
        type: "debit",
        description: `Auto-match unlock #${order}`,
        reference_id: matchId,
      });
    }

    // Mark unlocked
    await admin.from("auto_matches").update({
      is_unlocked: true,
      unlock_order: order,
      credits_spent: cost,
      unlocked_at: new Date().toISOString(),
    }).eq("id", matchId);

    // Audit
    await admin.from("audit_logs").insert({
      user_id: user.id,
      entity_type: "auto_match",
      entity_id: matchId,
      action: isFree ? "unlock_free" : "unlock_paid",
      details: { order, cost, candidate_id: match.candidate_id },
    });

    return new Response(JSON.stringify({ ok: true, isFree, cost, order }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});