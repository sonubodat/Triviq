export function Hero() {
  return (
    <section className="tile tile-light text-center">
      <div className="wrap">
        <p className="t-tagline">Triviq</p>
        <h1 className="t-hero mx-auto mt-3 max-w-3xl">Software, made simple.</h1>
        <p className="t-lead mx-auto mt-4 max-w-2xl muted">
          A small studio building websites, apps and backends for clients across India and around the world.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn btn-primary">Start a project</a>
          <a href="#services" className="btn btn-ghost">See what we build</a>
        </div>

        {/* Product render: browser + phone, carries the one system shadow */}
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="product overflow-hidden rounded-[18px] bg-white text-left" aria-hidden="true">
            <div className="flex items-center gap-1.5 bg-parchment px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-4 rounded-full bg-white px-4 py-0.5 text-xs muted">yourbusiness.com</span>
            </div>
            <div className="grid gap-6 p-8 sm:grid-cols-[1.2fr_1fr] sm:p-12">
              <div>
                <p className="t-display">Your idea,<br />live in weeks.</p>
                <span className="btn btn-primary mt-6 !min-h-9 !px-5 !text-sm">Get started</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["Design", "Build", "Launch", "Grow"].map((x) => (
                  <div key={x} className="rounded-[11px] bg-parchment p-4 t-caption t-strong">{x}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="product absolute -bottom-8 right-2 hidden w-28 rounded-[24px] bg-ink p-2 sm:block md:-right-8 md:w-32" aria-hidden="true">
            <div className="aspect-[9/17] rounded-[18px] bg-white p-3">
              <div className="h-2 w-8 rounded-full bg-hairline" />
              <div className="mt-3 h-14 rounded-[8px] bg-parchment" />
              <div className="mt-2 h-2 w-full rounded-full bg-hairline" />
              <div className="mt-1.5 h-2 w-2/3 rounded-full bg-hairline" />
              <div className="mt-4 h-6 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
