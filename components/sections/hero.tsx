import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            {siteConfig.companyName}
          </p>
          <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
            Apps, websites, and digital systems built for real business work.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Triviq plans, designs, and ships reliable digital products for teams
            that need execution across web, mobile, backend, automation, and
            growth-ready infrastructure.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              className="inline-flex h-12 items-center justify-center rounded-md bg-foreground px-6 text-sm font-semibold text-background transition hover:opacity-90"
              href="#contact"
            >
              Discuss your project
            </a>
            <a
              className="inline-flex h-12 items-center justify-center rounded-md border border-border px-6 text-sm font-semibold transition hover:border-foreground"
              href="#services"
            >
              Explore services
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          {[
            ["Product strategy", "Scope, roadmap, and technical planning"],
            ["Design to launch", "Interfaces, APIs, integrations, deployment"],
            ["Ongoing delivery", "Iteration, optimization, and support"],
          ].map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border p-6">
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-2 leading-7 text-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
