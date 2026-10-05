import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function ProjectCta() {
  return (
    <section className="tile tile-black text-center" data-motion-section="cta">
      <div className="wrap">
        <p className="mono accent-cyan" data-motion="section-kicker">Have something to build?</p>
        <h2 className="t-editorial mx-auto mt-4 max-w-4xl" data-motion="section-title">Let&rsquo;s turn it into a product.</h2>
        <div className="mt-8" data-motion="cta-button">
          <Link href="/contact" className="btn btn-primary">Start a project <span aria-hidden="true">&rarr;</span></Link>
        </div>
        <p className="mt-6 muted">
          <a href={`mailto:${siteConfig.email}`} className="link">{siteConfig.email}</a>
          <span className="mx-3" aria-hidden="true">·</span>
          We reply within one business day
        </p>
      </div>
    </section>
  );
}
