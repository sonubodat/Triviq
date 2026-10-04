import Link from "next/link";

export function Hero() {
  return (
    <section className="tile tile-light text-center">
      <div className="wrap">
        <p className="t-tagline"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--cyan)] align-middle" aria-hidden="true" />Technology studio</p>
        <h1 className="t-hero mx-auto mt-3 max-w-3xl">We build software that solves real problems.</h1>
        <p className="t-lead mx-auto mt-4 max-w-2xl muted">
          Triviq is an independent technology studio building digital products for businesses, and products of our own.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">Start a project</Link>
          <a href="#services" className="btn btn-ghost">Explore services</a>
        </div>

        <ul className="mx-auto mt-14 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="What we do">
          {["Client Solutions", "Apps", "Games & Interactive", "Triviq Products"].map((x) => (
            <li key={x} className="chip">{x}</li>
          ))}
        </ul>

        <div className="relative mx-auto mt-14 max-w-3xl" aria-hidden="true">
          <div className="product overflow-hidden rounded-[18px] bg-white text-left">
            <div className="flex items-center gap-1.5 bg-parchment px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 rounded-full bg-white px-4 py-0.5 text-xs muted">app.yourproduct.com</span>
            </div>
            <div className="grid gap-6 p-8 sm:grid-cols-[1.2fr_1fr] sm:p-12">
              <div>
                <p className="t-display">From first idea<br />to shipped product.</p>
                <span className="btn btn-primary mt-6 !min-h-9 !px-5 !text-sm">Get started</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Discover", "Design", "Build", "Launch"].map((x) => (
                  <div key={x} className="rounded-[11px] bg-parchment p-4 t-caption t-strong">{x}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
