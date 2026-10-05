import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function ProjectCta() {
  return (
    <section className="tile tile-black text-center">
      <div className="wrap">
        <p className="mono accent-cyan">Have something to build?</p>
        <h2 className="t-display mx-auto mt-4 max-w-2xl">Let&rsquo;s turn it into a product.</h2>
        <div className="mt-8">
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
