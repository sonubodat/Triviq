import { work } from "@/lib/content";

import { CaseStudyCard } from "./case-study-card";
// Showreel is switched off for now, not removed: the component, the HyperFrames project (media/showreel) and the encoded files
// in public/media are all still here. To bring it back, uncomment this import and the <Showreel /> block below, and change the
// grid margin back from mt-16 to mt-6.
// import { Showreel } from "./showreel";

export function WorkSection() {
  return (
    <section id="work" className="tile tile-surface" data-motion-section="work">
      <div className="wrap">
        <p className="mono muted" data-motion="section-kicker">02 / Selected work</p>
        <h2 className="t-display mt-3 max-w-3xl" data-motion="section-title">Products we&rsquo;ve designed, engineered and shipped.</h2>
        {/* <div className="mt-14">
          <Showreel />
        </div> */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2" data-motion="project-grid">
          {work.map((p) => (
            <CaseStudyCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
