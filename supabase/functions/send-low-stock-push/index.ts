/* eslint-disable */
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface Payload { user_id: string; title?: string; body: string; }

async function sendExpo(to: string, title: string, body: string) {
  const resp = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, title, body, sound: "default", priority: "high" })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(JSON.stringify(data));
  return data;
}

serve(async (req) => {
  try {
    const payload = await req.json() as Payload;
    if (!payload.user_id || !payload.body) {
      return new Response(JSON.stringify({ ok:false, error:"Missing user_id/body" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    // Pull push tokens from your project (service role required here)
    const url = Deno.env.get("SUPABASE_URL")!;
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const res = await fetch(`${url}/rest/v1/user_push_tokens?user_id=eq.${payload.user_id}`, {
      headers: { "apikey": key, "Authorization": `Bearer ${key}` }
    });
    const tokens = await res.json();

    let count = 0;
    for (const t of tokens) {
      await sendExpo(t.expo_push_token, payload.title || "MediTrack Alert", payload.body);
      count++;
    }
    return new Response(JSON.stringify({ ok:true, sent: count }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
