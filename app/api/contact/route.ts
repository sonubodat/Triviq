import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { services } from "@/lib/content";
import { autoReply, parseLead, teamEmail } from "@/lib/leads";
import { budgets, projectTypes, siteConfig, timelines } from "@/lib/site";

const options = { services: [...services.map((s) => s.title), "Something else"], budgets, timelines, projectTypes };
const host = siteConfig.url.replace(/^https?:\/\//, "");
const hits = new Map<string, number[]>(); // ponytail: per-instance rate limit, use KV/Upstash if deployed serverless at scale

const bad = (error: string, status = 400) => Response.json({ error }, { status });
const filled = (v: unknown) => typeof v === "string" && v.trim() !== "";

// Resend REST call. RESEND_API_URL exists so tests can point at a local mock; it defaults to the real API.
async function sendMail(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(process.env.RESEND_API_URL ?? "https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false; // a network failure is a failed send
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return bad("Too many requests. Please try again shortly.", 429);
  hits.set(ip, [...recent, now]);

  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return bad("Request too large.", 413);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("Invalid request.");
  }

  if (filled((body as { website?: unknown } | null)?.website)) return Response.json({ ok: true }); // honeypot: pretend success, store nothing

  const parsed = parseLead(body, options);
  if (!parsed.ok) return bad(parsed.error);
  const { lead } = parsed;
  const receivedAt = new Date().toISOString();

  // Always keep a local copy in dev so leads are never lost.
  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "inquiries.jsonl"), JSON.stringify({ ...lead, createdAt: receivedAt }) + "\n");
  }

  const to = (process.env.CONTACT_TO_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const from = process.env.CONTACT_FROM_EMAIL;
  let confirmation = false;

  if (process.env.RESEND_API_KEY && to.length) {
    const mail = teamEmail(lead, receivedAt, host);
    const delivered = await sendMail({
      from: from ?? `${siteConfig.name} <onboarding@resend.dev>`,
      to,
      reply_to: lead.email,
      subject: mail.subject,
      text: mail.text,
    });
    if (!delivered) return bad("We could not send your inquiry right now.", 502);

    // Confirmation to the sender: opt-in, and only from a verified domain (the Resend sandbox sender cannot mail strangers).
    // The lead is already delivered, so a failure here is logged and never reaches the visitor as an error.
    if (from && process.env.CONTACT_AUTOREPLY === "1") {
      const reply = autoReply(lead, { name: siteConfig.name, url: siteConfig.url });
      confirmation = await sendMail({ from, to: lead.email, reply_to: to[0], subject: reply.subject, text: reply.text, html: reply.html });
      if (!confirmation) console.error("Auto-reply could not be sent for a delivered inquiry");
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("Contact delivery not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL", { ...lead, receivedAt });
    return bad("We could not send your inquiry right now.", 503);
  }

  return Response.json({ ok: true, confirmation });
}
