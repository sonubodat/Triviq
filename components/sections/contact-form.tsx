"use client";

import { useState } from "react";

import { budgets, services } from "@/lib/site";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Something went wrong.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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
        <select className="field" name="service" defaultValue="" required>
          <option value="" disabled>Select a service</option>
          {services.map((s) => <option key={s.title}>{s.title}</option>)}
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
      {state === "error" && <p role="alert" className="t-caption text-[#c0392b]">{error}</p>}
      <button className="btn btn-primary disabled:opacity-60" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
