import { credibility, engagements } from "@/lib/content";

export function EngagementSection() {
  return (
    <section className="tile tile-surface" data-motion-section="engagement">
      <div className="wrap">
        <div className="text-center">
          <p className="mono muted" data-motion="section-kicker">06 / Working with Triviq</p>
          <h2 className="t-display mx-auto mt-3 max-w-2xl" data-motion="section-title">Built in India. Working worldwide.</h2>
          <p className="t-lead mx-auto mt-4 max-w-2xl muted" data-motion="section-copy">Remote-first delivery with clear milestones, so you always know what ships next.</p>
        </div>
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2" data-motion="chip-list">
          {credibility.map((c) => (
            <li key={c} className="chip">{c}</li>
          ))}
        </ul>
        <div className="mt-12 grid gap-5 md:grid-cols-3" data-motion="engagement-grid">
          {engagements.map((e) => (
            <article key={e.title} className="card">
              <p className="mono muted">Engagement</p>
              <h3 className="t-tagline mt-2">{e.title}</h3>
              <p className="mt-2 muted">{e.body}</p>
            </article>
          ))}
        </div>
        <p className="t-caption mt-6 text-center muted">Every project is scoped and quoted individually.</p>
      </div>
    </section>
  );
}
