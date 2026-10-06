"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { services } from "@/lib/content";
import { track } from "@/lib/analytics";
import { budgets, projectTypes, siteConfig, timelines } from "@/lib/site";

const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again.";
const serviceOptions = [...services.map((s) => s.title), "Something else"];

// Applies ?service= to the select. It sits in its own Suspense boundary so only this empty component waits for the client:
// the form itself is in the server HTML, so nothing appears late and nothing shifts (it used to add 0.53 CLS on phones).
function ServicePreset() {
  const preset = useSearchParams().get("service") ?? "";
  useEffect(() => {
    const select = document.querySelector<HTMLSelectElement>('select[name="service"]');
    if (select && serviceOptions.includes(preset)) select.value = preset;
  }, [preset]);
  return null;
}

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const started = useRef(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data: { error?: string; confirmation?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setConfirmed(Boolean(data.confirmation)); // only claim an email is on its way when the server actually sent one
      setState("done");
      // Categories only, never the name, email or message.
      track("lead_submit", { service: body.service, budget: body.budgetRange, timeline: body.timeline, projectType: body.projectType || "unspecified" });
    } catch (err) {
      // fetch() rejects with a TypeError when the network is down; server errors carry their own message.
      setError(err instanceof TypeError ? NETWORK_ERROR : err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
      track("lead_error", { reason: err instanceof TypeError ? "network" : "server" });
    }
  }

  if (state === "done") {
    return (
      <div className="card text-center" role="status">
        <h3 className="t-tagline">Thank you.</h3>
        <p className="mt-2 muted">
          We received your inquiry and will reply within one business day.{confirmed && " A confirmation is on its way to your inbox."}
        </p>
      </div>
    );
  }

  return (
    <form
      className="card grid gap-4"
      onSubmit={onSubmit}
      onFocusCapture={() => {
        if (started.current) return;
        started.current = true;
        track("lead_start");
      }}
    >
      <Suspense fallback={null}><ServicePreset /></Suspense>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 t-caption t-strong">Name
          <input className="field" name="name" autoComplete="name" required maxLength={100} />
        </label>
        <label className="grid gap-2 t-caption t-strong">Work email
          <input className="field" name="email" type="email" autoComplete="email" required maxLength={200} />
        </label>
        <label className="grid gap-2 t-caption t-strong">Company
          <input className="field" name="company" autoComplete="organization" maxLength={150} />
        </label>
        <label className="grid gap-2 t-caption t-strong">What do you need?
          <select className="field" name="service" defaultValue="" required>
            <option value="" disabled>Select a service</option>
            {services.map((s) => <option key={s.id}>{s.title}</option>)}
            <option>Something else</option>
          </select>
        </label>
        <label className="grid gap-2 t-caption t-strong">Estimated budget
          <select className="field" name="budgetRange" defaultValue="" required>
            <option value="" disabled>Select a range</option>
            {budgets.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label className="grid gap-2 t-caption t-strong">When do you need it?
          <select className="field" name="timeline" defaultValue="" required>
            <option value="" disabled>Select a timeline</option>
            {timelines.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>
      <label className="grid gap-2 t-caption t-strong">
        <span>Project type <span className="muted font-normal">(optional)</span></span>
        <select className="field" name="projectType" defaultValue="">
          <option value="">Select a type</option>
          {projectTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <label className="grid gap-2 t-caption t-strong">Project details
        <textarea className="field" name="message" required minLength={10} maxLength={4000} />
      </label>
      <div className="hp" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state === "error" && (
        <p role="alert" className="t-caption text-[color:var(--triviq-error)]">
          {error} You can also email us at{" "}
          <a className="underline" href={`mailto:${siteConfig.email}?subject=Project%20inquiry`}>{siteConfig.email}</a>.
        </p>
      )}
      <button className="btn btn-primary disabled:opacity-60" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
