import Link from "next/link";

export function ProjectCta() {
  return (
    <section className="tile tile-dark text-center">
      <div className="wrap">
        <h2 className="t-display mx-auto max-w-2xl">Have a project in mind?</h2>
        <p className="t-lead mx-auto mt-3 max-w-xl muted">Tell us what you need. We reply within one business day.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">Start a project</Link>
          <Link href="/support" className="btn btn-ghost">Help & support</Link>
        </div>
      </div>
    </section>
  );
}
