export function ContactUs() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 sm:px-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
            Contact us
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">
            Bring us the project. We will help shape the next move.
          </h2>
          <p className="mt-5 leading-8 text-muted">
            Share what you need built, improved, automated, or launched. Triviq
            Solutions can support the full path from planning to delivery.
          </p>
        </div>

        <div className="rounded-lg border border-border p-6 sm:p-8">
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm font-semibold">
              Name
              <input className="h-12 rounded-md border border-border bg-transparent px-4 outline-none focus:border-foreground" />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Email
              <input
                className="h-12 rounded-md border border-border bg-transparent px-4 outline-none focus:border-foreground"
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Project details
              <textarea className="min-h-32 rounded-md border border-border bg-transparent p-4 outline-none focus:border-foreground" />
            </label>
            <button className="h-12 rounded-md bg-foreground px-6 text-sm font-semibold text-background transition hover:opacity-90">
              Send inquiry
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
