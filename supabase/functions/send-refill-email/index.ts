
/* eslint-disable */
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface Payload {
  user_id: string;
  prescription_id: string;
  pharmacy_email: string;
  message?: string;
}

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL")!;
const FROM_NAME = Deno.env.get("RESEND_FROM_NAME") || "MediTrack";

async function sendEmail(to: string, subject: string, html: string) {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html
    })
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(JSON.stringify(data));
  }
  return data;
}

serve(async (req) => {
  try {
    const payload = (await req.json()) as Payload;
    if (!payload.pharmacy_email || !payload.prescription_id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), { status: 400 });
    }
    const subject = `Refill Request – Prescription ${payload.prescription_id}`;
    const html = `
      <h2>MediTrack Refill Request</h2>
      <p>User: ${payload.user_id}</p>
      <p>Prescription: ${payload.prescription_id}</p>
      <p>Message: ${payload.message || "Please process the refill."}</p>
    `;
    const res = await sendEmail(payload.pharmacy_email, subject, html);
    return new Response(JSON.stringify({ ok: true, id: res.id || res.data?.id }), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
