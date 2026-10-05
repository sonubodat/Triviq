import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { services } from "@/lib/content";
import { budgets, siteConfig } from "@/lib/site";

const services_ = new Set<string>([...services.map((s) => s.title), "Something else"]);
const budgets_ = new Set<string>(budgets);
const hits = new Map<string, number[]>(); // ponytail: per-instance rate limit, use KV/Upstash if deployed serverless at scale

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bad = (error: string, status = 400) => Response.json({ error }, { status });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= 5) return bad("Too many requests. Please try again shortly.", 429);
  hits.set(ip, [...recent, now]);

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return bad("Invalid request.");
  }

  if (str(b.website, 200)) return Response.json({ ok: true }); // honeypot: pretend success, store nothing

  const record = {
    name: str(b.name, 100),
    email: str(b.email, 200),
    company: str(b.company, 150),
    service: str(b.service, 100),
    budgetRange: str(b.budgetRange, 100),
    message: str(b.message, 4000),
    createdAt: new Date().toISOString(),
  };

  if (!record.name || record.message.length < 10) return bad("Please fill in your name and project details.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) return bad("Please enter a valid email address.");
  if (!services_.has(record.service) || !budgets_.has(record.budgetRange)) return bad("Please choose a service and budget range.");

  // Always keep a local copy in dev so leads are never lost.
  if (process.env.NODE_ENV !== "production") {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "inquiries.jsonl"), JSON.stringify(record) + "\n");
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (key && to) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`,
        to,
        reply_to: record.email,
        subject: `New inquiry: ${record.service} (${record.name})`,
        text: Object.entries(record).map(([k, v]) => `${k}: ${v}`).join("\n"),
      }),
    });
    if (!res.ok) return bad("We could not send your inquiry right now.", 502);
  } else if (process.env.NODE_ENV === "production") {
    console.error("Contact delivery not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL", record);
    return bad("We could not send your inquiry right now.", 503);
  }

  return Response.json({ ok: true });
}
