const services = [
  {
    title: "Websites and web apps",
    description:
      "Fast, responsive websites, landing pages, dashboards, portals, and full-stack web applications.",
  },
  {
    title: "Mobile applications",
    description:
      "iOS, Android, and cross-platform app experiences built around practical user journeys.",
  },
  {
    title: "Backend and APIs",
    description:
      "Databases, authentication, admin systems, integrations, cloud functions, and secure API layers.",
  },
  {
    title: "Automation and tooling",
    description:
      "Internal tools, workflow automation, reporting systems, and operations support software.",
  },
  {
    title: "UI and product design",
    description:
      "Clean interfaces, design systems, prototypes, and conversion-focused product flows.",
  },
  {
    title: "Maintenance and growth",
    description:
      "Performance improvements, SEO setup, analytics, bug fixes, feature updates, and launch support.",
  },
];

export function HelpSection() {
  return (
    <section id="services" className="border-b border-border py-24">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            How we help
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
            Delivery support for the digital work your business needs.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold">{service.title}</h3>
              <p className="mt-3 leading-7 text-muted">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
