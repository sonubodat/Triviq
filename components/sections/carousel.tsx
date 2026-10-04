const stack = ["Next.js", "React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Flutter", "React Native", "AWS", "Stripe", "Figma", "Automation"];

export function CapabilityCarousel() {
  return (
    <section id="clients" className="tile tile-parchment">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-display">Local roots.<br />Global reach.</h2>
            <p className="t-lead mt-4 muted">
              We work with startups and businesses in India and abroad, with clear scope, honest timelines and overlap
              with your working hours.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="card">
              <h3 className="t-tagline">India</h3>
              <p className="mt-2 muted">Invoices in INR with GST, UPI and local payment integrations, support in your language.</p>
            </div>
            <div className="card">
              <h3 className="t-tagline">International</h3>
              <p className="mt-2 muted">USD, EUR or GBP billing, async-first updates, meetings across US, UK, EU and Gulf timezones.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-2" aria-label="Technologies">
          {stack.map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
