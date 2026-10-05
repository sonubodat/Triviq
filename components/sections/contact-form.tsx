"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { services } from "@/lib/content";
import { budgets, siteConfig } from "@/lib/site";

const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again.";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const preset = useSearchParams().get("service") ?? "";
  const defaultService = [...services.map((s) => s.title), "Something else"].includes(preset) ? preset : "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const data: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      setState("done");
    } catch (err) {
      // fetch() rejects with a TypeError when the network is down; server errors carry their own message.
      setError(err instanceof TypeError ? NETWORK_ERROR : err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="card text-center" role="status">
        <h3 className="t-tagline">Thank you.</h3>
        <p className="mt-2 muted">We received your inquiry and will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form className="card grid gap-4" onSubmit={onSubmit}>
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
        <select className="field" name="service" defaultValue={defaultService} required>
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
