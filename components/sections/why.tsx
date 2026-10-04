const reasons = [
  ["Built to last", "Clean architecture and documentation, so your software keeps working as you grow."],
  ["Plain communication", "Clear scope, realistic timelines and updates without jargon."],
  ["Local and global", "Working with clients in India and internationally, across time zones and currencies."],
];

export function WhySection() {
  return (
    <section className="tile tile-light">
      <div className="wrap">
        <h2 className="t-display text-center">Why Triviq.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map(([title, body]) => (
            <article key={title} className="card">
              <h3 className="t-tagline">{title}</h3>
              <p className="mt-2 muted">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
