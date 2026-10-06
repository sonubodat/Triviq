// Lead handling shared by the contact API and its tests: validation plus the two emails.
// Pure and import-free (option lists and site info are passed in) so `node --test lib/leads.test.mjs` runs it directly.

export type LeadOptions = {
  services: readonly string[];
  budgets: readonly string[];
  timelines: readonly string[];
  projectTypes: readonly string[];
};

export type Lead = {
  name: string;
  email: string;
  company: string;
  service: string;
  projectType: string; // optional: "" or one of options.projectTypes
  budgetRange: string;
  timeline: string;
  message: string;
};

export type ParsedLead = { ok: true; lead: Lead } | { ok: false; error: string };

// Single-line fields: collapse every run of whitespace (newlines included) so nothing can break a subject or header.
const line = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
// The message keeps its line breaks but loses other control characters.
const text = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max) : "";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseLead(body: unknown, options: LeadOptions): ParsedLead {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const lead: Lead = {
    name: line(b.name, 100),
    email: line(b.email, 200),
    company: line(b.company, 150),
    service: line(b.service, 100),
    projectType: line(b.projectType, 100),
    budgetRange: line(b.budgetRange, 100),
    timeline: line(b.timeline, 100),
    message: text(b.message, 4000),
  };
  if (!lead.name || lead.message.length < 10) return { ok: false, error: "Please fill in your name and project details." };
  if (!EMAIL.test(lead.email)) return { ok: false, error: "Please enter a valid email address." };
  if (!options.services.includes(lead.service) || !options.budgets.includes(lead.budgetRange) || !options.timelines.includes(lead.timeline)) {
    return { ok: false, error: "Please choose a service, budget range and timeline." };
  }
  if (lead.projectType && !options.projectTypes.includes(lead.projectType)) return { ok: false, error: "Please choose a valid project type." };
  return { ok: true, lead };
}

// "$6k–25k (₹5–20 lakh)" -> "$6k–25k"; "ASAP (within a month)" -> "ASAP"
const short = (s: string) => s.replace(/\s*\(.*\)\s*$/, "");

/** Notification to the team. The subject carries budget and timeline so the inbox can be triaged at a glance. */
export function teamEmail(lead: Lead, receivedAt: string, host: string) {
  const who = lead.company ? `${lead.name}, ${lead.company}` : lead.name;
  const subject = `[${short(lead.budgetRange)} · ${short(lead.timeline)}] New inquiry: ${lead.service} (${who})`.slice(0, 200);
  const body = [
    `New inquiry via ${host}`,
    "",
    `Name:         ${lead.name}`,
    `Email:        ${lead.email}`,
    `Company:      ${lead.company || "-"}`,
    `Service:      ${lead.service}`,
    `Project type: ${lead.projectType || "-"}`,
    `Budget:       ${lead.budgetRange}`,
    `Timeline:     ${lead.timeline}`,
    "",
    "Message:",
    lead.message,
    "",
    `Received: ${receivedAt}`,
  ].join("\n");
  return { subject, text: body };
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/**
 * Confirmation to the person who wrote in. It repeats only their category choices, never their free text, so the form
 * cannot be used to push arbitrary content into a stranger's inbox.
 */
export function autoReply(lead: Lead, site: { name: string; url: string }) {
  const first = lead.name.split(" ")[0].slice(0, 40) || "there";
  const rows: [string, string][] = [
    ["Service", lead.service],
    ...(lead.projectType ? ([["Project type", lead.projectType]] as [string, string][]) : []),
    ["Budget", lead.budgetRange],
    ["Timeline", lead.timeline],
  ];
  const host = site.url.replace(/^https?:\/\//, "");
  const subject = `We received your inquiry | ${site.name}`;
  const textBody = [
    `Hi ${first},`,
    "",
    "Thanks for getting in touch. We received your inquiry and will reply within one business day.",
    "",
    "What you told us",
    ...rows.map(([k, v]) => `  ${k}: ${v}`),
    "",
    "If anything is urgent, or you want to add details, just reply to this email.",
    "",
    site.name,
    "Product & engineering studio",
    site.url,
    "",
    `You are receiving this once because you sent a message through the contact form at ${host}. We do not add you to any mailing list.`,
  ].join("\n");
  const htmlBody = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111827;max-width:560px;line-height:1.5">
<p>Hi ${escapeHtml(first)},</p>
<p>Thanks for getting in touch. We received your inquiry and will reply within one business day.</p>
<p style="margin:24px 0 6px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#5f6f82">What you told us</p>
<table role="presentation" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:2px 16px 2px 0;color:#5f6f82">${escapeHtml(k)}</td><td style="padding:2px 0">${escapeHtml(v)}</td></tr>`)
    .join("")}</table>
<p style="margin-top:24px">If anything is urgent, or you want to add details, just reply to this email.</p>
<p style="margin-top:24px"><strong>${escapeHtml(site.name)}</strong><br>Product &amp; engineering studio<br><a href="${escapeHtml(site.url)}" style="color:#0a67d4">${escapeHtml(host)}</a></p>
<p style="margin-top:24px;font-size:12px;color:#5f6f82">You are receiving this once because you sent a message through the contact form at ${escapeHtml(host)}. We do not add you to any mailing list.</p>
</div>`;
  return { subject, text: textBody, html: htmlBody };
}
