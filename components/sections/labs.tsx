import { products } from "@/lib/content";

import { CaseStudyCard } from "./case-study-card";

export function ProductsSection() {
  return (
    <section id="products" className="tile tile-dark" data-motion-section="labs">
      <div className="wrap">
        <p className="mono accent-cyan" data-motion="section-kicker">03 / Triviq Labs</p>
        <h2 className="t-display mt-3 max-w-3xl" data-motion="section-title">We build our own things too.</h2>
        <p className="t-lead mt-4 max-w-2xl muted" data-motion="section-copy">
          Client work sharpens our engineering. Our own products let us experiment beyond the brief.
        </p>
        <div className="mt-16 grid gap-6 lg:grid-cols-2" data-motion="project-grid">
          {products.map((p) => (
            <CaseStudyCard key={p.slug} project={p} dark />
          ))}
          <article className="cs-soon">
            <p className="mono muted">Product 02</p>
            <h3 className="t-title">Coming soon</h3>
            <p className="muted">Triviq Labs is where we build and test our own ideas before anyone asks for them.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
