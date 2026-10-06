"use client";

import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

import { analyticsOn, doNotTrack, track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

const subscribe = () => () => {};

// Where a link sits, read from markup that already exists: the section attribute, the header or the footer.
const place = (el: Element) =>
  el.closest("[data-motion-section]")?.getAttribute("data-motion-section") ?? (el.closest("header") ? "header" : el.closest("footer") ? "footer" : "page");

// Mounted once in the root layout. Loads the provider script (never when the browser sends Do Not Track) and turns two kinds
// of interaction into events without touching each component: clicks on any link to /contact, and case-study details opening.
export function Analytics() {
  const load = useSyncExternalStore(subscribe, () => analyticsOn && !doNotTrack(), () => false);

  useEffect(() => {
    if (!analyticsOn && process.env.NODE_ENV === "production") return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href^="/contact"]');
      if (!a) return;
      const service = new URL((a as HTMLAnchorElement).href).searchParams.get("service");
      track("cta_click", {
        location: place(a),
        label: (a.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 40),
        ...(service ? { service } : {}),
      });
    };
    const onToggle = (e: Event) => {
      const d = e.target;
      if (d instanceof HTMLDetailsElement && d.open && d.classList.contains("cs-more")) {
        track("project_details_open", { project: d.closest("[data-project]")?.getAttribute("data-project") ?? "unknown" });
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("toggle", onToggle, true); // toggle does not bubble, so listen in the capture phase
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  return load ? <Script data-domain={siteConfig.analytics.plausibleDomain} src={siteConfig.analytics.plausibleSrc} /> : null;
}
