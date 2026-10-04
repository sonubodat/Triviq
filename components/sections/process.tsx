const steps = [
  {
    title: "Understand",
    description:
      "We clarify goals, users, requirements, constraints, and the highest-value first release.",
  },
  {
    title: "Plan",
    description:
      "We define scope, technical direction, milestones, integrations, and launch expectations.",
  },
  {
    title: "Build",
    description:
      "We design, develop, test, and iterate with clear communication throughout delivery.",
  },
  {
    title: "Launch",
    description:
      "We prepare deployment, SEO basics, analytics, performance checks, and post-launch support.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="border-b border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Process
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
            A practical path from idea to shipped product.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-border p-6">
              <p className="text-sm font-semibold text-muted">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 leading-7 text-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
