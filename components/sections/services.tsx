import { services } from "@/lib/site";

export function ServicesSection() {
  return (
    <section id="services" className="tile tile-dark">
      <div className="wrap">
        <div className="text-center">
          <h2 className="t-display">What we build.</h2>
          <p className="t-lead mx-auto mt-3 max-w-2xl muted">Concrete capabilities you can hire Triviq for.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="card-dark">
              <h3 className="t-tagline">{s.title}</h3>
              <p className="mt-2 muted">{s.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
