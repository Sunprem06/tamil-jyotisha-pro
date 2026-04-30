import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role admin client (we re-check role below)
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // RBAC check
    const { data: roles } = await admin
      .from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = roles?.some((r) => r.role === "admin" || r.role === "super_admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const { requestId, action, adminNote } = body as {
      requestId?: string; action?: "approve" | "reject"; adminNote?: string;
    };
    if (!requestId || (action !== "approve" && action !== "reject")) {
      return new Response(JSON.stringify({ error: "requestId and action (approve|reject) required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: reqRow, error: reqErr } = await admin
      .from("credit_requests").select("*").eq("id", requestId).maybeSingle();
    if (reqErr || !reqRow) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (reqRow.status !== "pending") {
      return new Response(JSON.stringify({ error: `Already ${reqRow.status}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reject") {
      await admin.from("credit_requests").update({
        status: "rejected", admin_note: adminNote ?? null,
        reviewed_by: user.id, reviewed_at: new Date().toISOString(),
      }).eq("id", requestId);
      return new Response(JSON.stringify({ ok: true, status: "rejected" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Approve: top up wallet
    const { data: wallet } = await admin
      .from("credits").select("id,balance").eq("user_id", reqRow.user_id).maybeSingle();
    const newBalance = (wallet?.balance ?? 0) + reqRow.requested_credits;

    if (wallet) {
      await admin.from("credits").update({ balance: newBalance }).eq("id", wallet.id);
    } else {
      await admin.from("credits").insert({ user_id: reqRow.user_id, balance: newBalance });
    }

    await admin.from("credit_transactions").insert({
      user_id: reqRow.user_id,
      amount: reqRow.requested_credits,
      type: "purchase",
      description: `Credit purchase approved (₹${reqRow.amount_inr}, ${reqRow.payment_method})`,
      reference_id: reqRow.id,
    });

    await admin.from("credit_requests").update({
      status: "approved", admin_note: adminNote ?? null,
      reviewed_by: user.id, reviewed_at: new Date().toISOString(),
    }).eq("id", requestId);

    await admin.from("audit_logs").insert({
      user_id: user.id, action: "credit_request_approved",
      entity_type: "credit_requests", entity_id: requestId,
      details: { credits: reqRow.requested_credits, amount_inr: reqRow.amount_inr, target_user: reqRow.user_id },
    });

    return new Response(JSON.stringify({ ok: true, status: "approved", new_balance: newBalance }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});