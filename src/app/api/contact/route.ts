import { NextRequest, NextResponse } from "next/server";

/**
 * Minimal contact form receiver.
 * In production you'd wire this to email (Resend, Postmark) or Slack.
 * For now it logs the message and returns 200.
 */
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Expected form" }, { status: 400 });
  }
  const name = String(form.get("name") ?? "");
  const email = String(form.get("email") ?? "");
  const message = String(form.get("message") ?? "");
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  console.log("[contact]", { name, email, message: message.slice(0, 200) });
  return NextResponse.json({ ok: true });
}
