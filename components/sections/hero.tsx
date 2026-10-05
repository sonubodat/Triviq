import Link from "next/link";

import { HeroVisual } from "@/components/hero/hero-visual";

export function Hero() {
  return (
    <section className="tile tile-black blueprint">
      <div className="wrap grid items-center gap-12 lg:min-h-[min(760px,calc(100svh_-_204px))] lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="mono status muted">Product &amp; engineering studio</p>
          <h1 className="t-hero-xl mt-5">We turn ambitious ideas into working software.</h1>
          <p className="t-lead mt-6 max-w-xl muted">
            Triviq is an independent product and engineering studio building websites, apps, SaaS platforms and digital experiences for
            businesses worldwide.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-primary">Start a project <span aria-hidden="true">&rarr;</span></Link>
            <Link href="/#work" className="btn btn-ghost">Explore our work</Link>
          </div>
          <p className="mono mt-10 muted">India · Working worldwide</p>
          <p className="mono mt-2 muted">Web · Apps · SaaS · Games · Product Engineering</p>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}
