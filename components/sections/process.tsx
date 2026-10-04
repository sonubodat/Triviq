const steps = [
  ["Discover", "Goals, users, constraints and the highest-value first release."],
  ["Design", "Flows, interface and technical architecture, agreed before code."],
  ["Build", "Iterative development with regular demos and honest updates."],
  ["Launch", "Deployment, monitoring and continued improvement."],
];

export function ProcessSection() {
  return (
    <section id="process" className="tile tile-dark-2">
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">How we work.</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">Four steps. Clear scope at each one.</p>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title}>
              <p className="t-lead text-[var(--primary-on-dark)]">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="t-tagline mt-3">{title}</h3>
              <p className="mt-2 muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
