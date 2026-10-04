import type { Metadata } from "next";

import { ProjectCta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { services } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: "Triviq is an independent technology studio building software for businesses and products of its own." };

const principles = [
  ["Ship real things", "We measure ourselves by working software in users' hands, not slide decks."],
  ["Honest scope", "Clear estimates, plain updates, and early notice when something changes."],
  ["Build to last", "Maintainable code, sensible architecture and documentation you can hand to another team."],
];

export default function About() {
  return (
    <>
      <PageHero title="We build software that solves real problems." lead="Triviq is an independent technology studio building digital products for businesses, and products of our own." />
      <section className="tile tile-light">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-display">Two sides of one studio.</h2>
            <p className="mt-4 muted">
              <span className="t-strong text-ink">Client solutions.</span> We design and engineer websites, SaaS platforms, mobile apps, business
              software and automation for organisations in India and around the world.
            </p>
            <p className="mt-4 muted">
              <span className="t-strong text-ink">Triviq products.</span> Alongside client work we build apps, games and software of our own, and
              what we learn there makes our client work better.
            </p>
          </div>
          <ul className="grid gap-3 self-start">
            {services.map((s) => (
              <li key={s.title} className="card !p-5"><span className="t-strong">{s.title}</span><span className="block muted">{s.body}</span></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="tile tile-parchment">
        <div className="wrap">
          <h2 className="t-display text-center">How we think.</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {principles.map(([t, b]) => (
              <article key={t} className="card"><h3 className="t-tagline">{t}</h3><p className="mt-2 muted">{b}</p></article>
            ))}
          </div>
        </div>
      </section>
      <ProjectCta />
    </>
  );
}
