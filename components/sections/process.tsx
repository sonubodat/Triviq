const steps = [
  ["Understand", "Goals, users and the highest-value first release."],
  ["Plan", "Scope, milestones, tech choices and a fixed timeline."],
  ["Build", "Design, develop and test with weekly demos."],
  ["Launch", "Deploy, measure and support after go-live."],
];

export function ProcessSection() {
  return (
    <section id="process" className="tile tile-dark-2">
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">Idea to shipped.</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">Four steps. No surprises.</p>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, body], i) => (
            <li key={title}>
              <p className="t-lead">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="t-tagline mt-3">{title}</h3>
              <p className="mt-2 muted">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
