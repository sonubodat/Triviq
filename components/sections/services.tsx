import { services } from "@/lib/content";

import { ServiceCard } from "./service-card";

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
              <ServiceCard service={s} index={i} count={services.length} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
