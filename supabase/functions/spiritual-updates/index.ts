import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const category = url.searchParams.get("category");

    if (req.method === "GET" || req.method === "POST" && !req.headers.get("content-type")?.includes("json")) {
      if (category) {
        const { data, error } = await supabase
          .from("spiritual_updates")
          .select("*")
          .eq("is_active", true)
          .eq("category", category)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) throw error;
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Today's updates with rotation
      const now = new Date();
      const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
      );

      const { data: allUpdates, error } = await supabase
        .from("spiritual_updates")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const guidance = allUpdates?.filter((u: any) => u.update_type === "guidance") ?? [];
      const doThis = allUpdates?.filter((u: any) => u.update_type === "do_this") ?? [];
      const avoidThis = allUpdates?.filter((u: any) => u.update_type === "avoid_this") ?? [];

      const pick = (arr: any[]) => arr.length > 0 ? arr[dayOfYear % arr.length] : null;
      const todayUpdates = [pick(guidance), pick(doThis), pick(avoidThis)].filter(Boolean);

      return new Response(JSON.stringify(todayUpdates), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
