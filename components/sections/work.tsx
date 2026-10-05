import { work } from "@/lib/content";

import { CaseStudyCard } from "./case-study-card";

export function WorkSection() {
  return (
    <section id="work" className="tile tile-surface">
      <div className="wrap">
        <p className="mono muted">02 / Selected work</p>
        <h2 className="t-display mt-3 max-w-2xl">Products we&rsquo;ve designed, engineered and shipped.</h2>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {work.map((p) => (
            <CaseStudyCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
