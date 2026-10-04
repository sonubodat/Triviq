const services = [
  ["Websites and web apps", "Fast, responsive sites, dashboards, portals and full-stack products."],
  ["Mobile apps", "iOS and Android apps built around real user journeys."],
  ["Backend and APIs", "Databases, auth, integrations and secure cloud services."],
  ["Automation", "Internal tools and workflows that remove repetitive work."],
  ["UI and product design", "Interfaces, design systems and prototypes that convert."],
  ["Care and growth", "Performance, SEO, analytics, fixes and ongoing updates."],
];

export function HelpSection() {
  return (
    <section id="services" className="tile tile-dark">
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">What we build.</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">From first sketch to production, one team end to end.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(([title, body]) => (
            <article key={title} className="card-dark">
              <h3 className="t-tagline">{title}</h3>
              <p className="mt-2 muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
