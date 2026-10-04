export function ContactUs() {
  return (
    <section id="contact" className="tile tile-parchment">
      <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="t-display">Tell us what you want to build.</h2>
          <p className="t-lead mt-4 muted">We reply within one business day, wherever you are.</p>
        </div>
        <form className="card grid gap-4" action="#" method="post">
          <label className="grid gap-2 t-caption t-strong">
            Name
            <input className="field" name="name" autoComplete="name" required />
          </label>
          <label className="grid gap-2 t-caption t-strong">
            Email
            <input className="field" name="email" type="email" autoComplete="email" required />
          </label>
          <label className="grid gap-2 t-caption t-strong">
            Country
            <input className="field" name="country" autoComplete="country-name" />
          </label>
          <label className="grid gap-2 t-caption t-strong">
            Project details
            <textarea className="field" name="details" required />
          </label>
          <button className="btn btn-primary" type="submit">Send inquiry</button>
        </form>
      </div>
    </section>
  );
}
