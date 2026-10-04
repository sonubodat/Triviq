const projectTypes = [
  "Business websites",
  "SaaS dashboards",
  "Customer portals",
  "Booking platforms",
  "E-commerce flows",
  "Admin panels",
  "Mobile MVPs",
  "Automation tools",
];

export function ProjectsSection() {
  return (
    <section id="projects" className="border-b border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Projects
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
              Built around outcomes, not just screens.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {projectTypes.map((type) => (
              <div
                key={type}
                className="flex min-h-20 items-center rounded-lg border border-border px-5 text-base font-semibold"
              >
                {type}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
