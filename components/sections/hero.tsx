import Link from "next/link";

import { HeroVisual } from "@/components/hero/hero-visual";

export function Hero() {
  return (
    <section className="tile tile-black blueprint" data-motion-section="hero">
      <div className="wrap grid items-center gap-12 lg:min-h-[min(760px,calc(100svh_-_204px))] lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="mono status muted" data-motion="hero-eyebrow">Product &amp; engineering studio</p>
          <h1 className="t-hero-xl mt-5" data-motion="hero-title">
            <span className="motion-line-clip"><span data-motion="hero-line">We turn</span></span>
            <span className="motion-line-clip"><span data-motion="hero-line">ambitious ideas</span></span>
            <span className="motion-line-clip"><span data-motion="hero-line">into working software.</span></span>
          </h1>
          <p className="t-lead mt-6 max-w-xl muted" data-motion="hero-copy">
            Triviq is an independent product and engineering studio building websites, apps, SaaS platforms and digital experiences for
            businesses worldwide.
          </p>
          {/* Stacked below sm on purpose: side by side only fits once the Geist font swaps in, and that re-wrap shifted the page by 56px. */}
          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row" data-motion="hero-ctas">
            <Link href="/contact" className="btn btn-primary">Start a project <span aria-hidden="true">&rarr;</span></Link>
            <Link href="/#work" className="btn btn-ghost">Explore our work</Link>
          </div>
          <div data-motion="hero-meta">
            <p className="mono mt-10 muted">India · Working worldwide</p>
            <p className="mono mt-2 muted">Web · Apps · SaaS · Games · Product Engineering</p>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
