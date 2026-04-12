import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

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
    const path = url.pathname.split("/").filter(Boolean);
    // paths: /spiritual-updates, /spiritual-updates/category/health

    if (req.method === "GET") {
      const category = path.length >= 2 ? path[path.length - 1] : null;

      if (category && category !== "today") {
        // GET by category
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

      // GET today's updates - pick 3 with rotation logic
      // Use day-of-year as seed to rotate content and avoid repeats within 7 days
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

    if (req.method === "POST") {
      // Verify admin
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check admin role
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id, _role: "admin",
      });
      const { data: isSuperAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id, _role: "super_admin",
      });

      if (!isAdmin && !isSuperAdmin) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const body = await req.json();
      const { title, message, action, benefit, category, update_type } = body;

      if (!title || !message || !action || !benefit) {
        return new Response(JSON.stringify({ error: "All fields required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error: insertError } = await supabase
        .from("spiritual_updates")
        .insert({
          title, message, action, benefit,
          category: category || "general",
          update_type: update_type || "guidance",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return new Response(JSON.stringify(data), {
        status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" },
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
