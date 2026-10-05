import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { services } from "@/lib/content";

import { ServiceDiagram } from "./service-diagrams";

export function ServicesSection() {
  return (
    <section id="services" className="tile tile-light" data-motion-section="services">
      <div className="wrap">
        <p className="mono muted" data-motion="section-kicker">01 / What we build</p>
        <h2 className="t-display mt-3 max-w-3xl" data-motion="section-title">One team for every layer of your product.</h2>
        <p className="t-lead mt-4 max-w-2xl muted" data-motion="section-copy">Six capabilities, from first sketch to production.</p>
        <ul className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-motion="services-grid">
          {services.map((s, i) => (
            <li key={s.id}>
              <Link href={`/contact?service=${encodeURIComponent(s.title)}`} className="svc">
                <div className="flex items-start justify-between">
                  <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                  <ArrowUpRight className="svc-arrow size-5" aria-hidden="true" />
                </div>
                <ServiceDiagram id={s.id} />
                <h3 className="t-tagline">{s.title}</h3>
                <p className="muted">{s.body}</p>
                <p className="mono mt-auto pt-2 text-soft">{s.stack}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
