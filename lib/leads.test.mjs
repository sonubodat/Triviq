// Run: node --test lib/leads.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

import { autoReply, escapeHtml, parseLead, teamEmail } from "./leads.ts";

const options = {
  services: ["Web & Platforms", "Something else"],
  budgets: ["Under $1k (₹1 lakh)", "$6k–25k (₹5–20 lakh)", "Not sure yet"],
  timelines: ["ASAP (within a month)", "1–3 months"],
  projectTypes: ["New product", "Not sure yet"],
};
const valid = {
  name: "Jane Doe",
  email: "jane@acme.test",
  company: "Acme",
  service: "Web & Platforms",
  projectType: "New product",
  budgetRange: "$6k–25k (₹5–20 lakh)",
  timeline: "1–3 months",
  message: "We need a customer portal with billing.",
};
const site = { name: "Triviq", url: "https://triviq.com" };
const err = (body) => {
  const r = parseLead(body, options);
  assert.equal(r.ok, false);
  return r.error;
};

test("valid lead parses; project type is optional", () => {
  const r = parseLead({ ...valid, name: "  Jane Doe  " }, options);
  assert.equal(r.ok, true);
  assert.equal(r.lead.name, "Jane Doe");
  assert.equal(parseLead({ ...valid, projectType: "" }, options).ok, true);
  assert.equal(parseLead({ ...valid, company: undefined, projectType: undefined }, options).ok, true);
});

test("rejects missing or malformed required fields", () => {
  assert.match(err({ ...valid, name: "" }), /name and project details/);
  assert.match(err({ ...valid, message: "short" }), /name and project details/);
  for (const email of ["", "a@b", "a b@c.d", "plain"]) assert.match(err({ ...valid, email }), /valid email/);
  assert.match(err({ ...valid, service: "Hacking" }), /service, budget range and timeline/);
  assert.match(err({ ...valid, budgetRange: "free" }), /service, budget range and timeline/);
  assert.match(err({ ...valid, timeline: "" }), /service, budget range and timeline/);
  assert.match(err({ ...valid, projectType: "Other" }), /project type/);
  for (const body of [null, "x", [], 5]) assert.equal(parseLead(body, options).ok, false);
});

test("single-line fields cannot carry line breaks; message keeps its own", () => {
  const r = parseLead({ ...valid, name: "Jane\r\nBcc: evil@x.test", message: "line one\nline two\u0007\u0000 end" }, options);
  assert.equal(r.ok, true);
  assert.equal(r.lead.name, "Jane Bcc: evil@x.test");
  assert.equal(r.lead.message, "line one\nline two end");
  const { subject } = teamEmail(r.lead, "2026-10-06T00:00:00.000Z", "triviq.com");
  assert.ok(!/[\r\n]/.test(subject), "subject is one line");
});

test("team email: subject triages by budget and timeline", () => {
  const { subject, text } = teamEmail(parseLead(valid, options).lead, "2026-10-06T00:00:00.000Z", "triviq.com");
  assert.equal(subject, "[$6k–25k · 1–3 months] New inquiry: Web & Platforms (Jane Doe, Acme)");
  assert.match(text, /Timeline:\s+1–3 months/);
  assert.match(text, /Project type:\s+New product/);
  assert.match(text, /Message:\nWe need a customer portal with billing\./);
  const noCompany = teamEmail(parseLead({ ...valid, company: "", projectType: "", timeline: "ASAP (within a month)" }, options).lead, "t", "h");
  assert.equal(noCompany.subject, "[$6k–25k · ASAP] New inquiry: Web & Platforms (Jane Doe)");
  assert.match(noCompany.text, /Company:\s+-/);
});

test("auto-reply repeats choices only, never the free text, and escapes HTML", () => {
  const lead = parseLead({ ...valid, name: "<script>alert(1)</script> Jo", message: "SECRET PROJECT DETAILS here" }, options).lead;
  const r = autoReply(lead, site);
  assert.equal(r.subject, "We received your inquiry | Triviq");
  for (const body of [r.text, r.html]) {
    assert.ok(!body.includes("SECRET PROJECT DETAILS"), "message text is not echoed");
    assert.match(body, /within one business day/);
    assert.match(body, /\$6k–25k/);
  }
  assert.ok(!r.html.includes("<script>"), "name is escaped in HTML");
  assert.match(r.html, /&lt;script&gt;/);
  assert.match(r.text, /^Hi <script>alert\(1\)<\/script>,/); // plain text is not HTML, so no escaping there
  const none = autoReply(parseLead({ ...valid, projectType: "" }, options).lead, site);
  assert.ok(!none.text.includes("Project type"), "empty project type row is omitted");
  assert.equal(escapeHtml(`<a href="x">'&'</a>`), "&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;");
});
