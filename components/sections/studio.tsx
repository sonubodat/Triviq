import { deliverySteps } from "@/lib/content";

export function StudioSection() {
  return (
    <section className="tile tile-dark">
      <div className="wrap grid items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="mono muted">05 / The studio</p>
          <h2 className="t-display mt-3">One team from idea to production.</h2>
          <p className="t-lead mt-4 muted">
            No hand-offs between agencies. The same team that plans your product designs, builds and launches it.
          </p>
        </div>
        <ol className="deliver">
          {deliverySteps.map((s, i) => (
            <li key={s}>
              <span className="mono w-6 accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-strong">{s}</span>
            </li>
          ))}
          <li style={{ borderBottom: 0 }}>
            <span className="mono accent-cyan w-6" aria-hidden="true">&rarr;</span>
            <span className="t-tagline">A working product.</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
