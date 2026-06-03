import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TO = process.env.CONTACT_TO || "ilija@undertheradar.agency";
// Until the domain is verified in Resend, their shared sender works out of the box.
const FROM = process.env.CONTACT_FROM || "Under the Radar <onboarding@resend.dev>";

const esc = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export async function POST(request) {
  if (!process.env.RESEND_API_KEY) {
    return Response.json(
      { error: "Email service not configured." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const org = (body.org || "").trim();
  const email = (body.email || "").trim();
  const project = (body.project || "").trim();
  const message = (body.message || "").trim();

  // Honeypot — bots fill hidden fields; humans don't.
  if ((body.company || "").trim()) {
    return Response.json({ ok: true });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (!message && !project) {
    return Response.json(
      { error: "Tell us a little about the project." },
      { status: 400 }
    );
  }

  const subject = `[UTR] ${project || "New transmission"} — ${name || "Anonymous"}`;
  const text = [
    `Name: ${name}`,
    `Org: ${org}`,
    `Email: ${email}`,
    `Project: ${project}`,
    "",
    message,
  ].join("\n");
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, sans-serif; color:#111; line-height:1.6;">
      <h2 style="margin:0 0 16px;">New transmission — Under the Radar</h2>
      <p><strong>Name:</strong> ${esc(name) || "—"}</p>
      <p><strong>Org:</strong> ${esc(org) || "—"}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <p><strong>Project:</strong> ${esc(project) || "—"}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;">${esc(message) || "—"}</p>
    </div>
  `;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject,
      text,
      html,
    });

    if (error) {
      return Response.json({ error: "Could not send. Try again." }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not send. Try again." }, { status: 502 });
  }
}
