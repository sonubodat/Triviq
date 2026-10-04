const projectTypes = [
  ["Business websites", "Brand sites that load fast and rank."],
  ["SaaS dashboards", "Data-heavy products with clean UX."],
  ["Customer portals", "Secure self-service for your clients."],
  ["Booking platforms", "Scheduling and payments, handled."],
  ["E-commerce", "Storefronts built to convert."],
  ["Mobile MVPs", "Ship an app idea in weeks."],
];

export function ProjectsSection() {
  return (
    <section id="work" className="tile tile-light">
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">Built around outcomes.</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">The kinds of projects we take on.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projectTypes.map(([title, body]) => (
            <article key={title} className="card">
              <div className="mb-6 aspect-[4/3] rounded-lg bg-parchment" aria-hidden="true" />
              <h3 className="t-strong">{title}</h3>
              <p className="mt-1 muted">{body}</p>
              <a href="#contact" className="link mt-3 inline-block">Start yours &rsaquo;</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
