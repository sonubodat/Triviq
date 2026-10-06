import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { CaseStudyCard } from "@/components/sections/case-study-card";
import { ProjectCta } from "@/components/sections/cta";
import { ServiceDiagram } from "@/components/sections/service-diagrams";
import { engagements, getProject, getService, processSteps, serviceDetails, services, type Project } from "@/lib/content";
import { breadcrumbJsonLd, pageMeta, serviceJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  const d = serviceDetails[service.id];
  return pageMeta(siteConfig, { title: d.seoTitle, description: d.seoDescription, path: `/services/${service.slug}` });
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const d = serviceDetails[service.id];
  const path = `/services/${service.slug}`;
  const related = d.work.map(getProject).filter((p): p is Project => Boolean(p));
  const others = services.filter((s) => s.id !== service.id);

  // Bands after the hero alternate white / surface, whatever mix of sections this service has.
  const bands: ((tone: string) => ReactNode)[] = [
    (tone) => (
      <section key="scope" className={`tile ${tone}`}>
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="t-display">What we build.</h2>
            <ul className="tick mt-8 grid gap-4">{d.includes.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h2 className="t-display">What you get.</h2>
            <ul className="tick mt-8 grid gap-4">{d.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </section>
    ),
    (tone) => (
      <section key="fit" className={`tile ${tone}`}>
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="mono muted">Good fit</p>
            <h2 className="t-display mt-3">When this is the right call.</h2>
          </div>
          <ul className="grid gap-4">
            {d.goodFit.map((item) => (
              <li key={item} className="card !p-5">{item}</li>
            ))}
          </ul>
        </div>
      </section>
    ),
    (tone) => (
      <section key="how" className={`tile ${tone}`}>
        <div className="wrap">
          <p className="mono muted">How we work</p>
          <h2 className="t-display mt-3 max-w-3xl">Four stages, three ways to work together.</h2>
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <li key={step.id} className="card !p-5">
                <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-tagline mt-3">{step.title}</h3>
                <p className="mt-2 muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-5 grid gap-5 md:grid-cols-3">
            {engagements.map((e) => (
              <li key={e.title} className="card !p-5">
                <h3 className="t-tagline">{e.title}</h3>
                <p className="mt-2 muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
    ...(related.length
      ? [
          (tone: string) => (
            <section key="work" className={`tile ${tone}`}>
              <div className="wrap">
                <p className="mono muted">Related work</p>
                <h2 className="t-display mt-3 max-w-3xl">Built with this.</h2>
                <div className="mt-12 grid gap-6 lg:grid-cols-2">
                  {related.map((p) => <CaseStudyCard key={p.slug} project={p} dark={p.kind === "product"} />)}
                </div>
              </div>
            </section>
          ),
        ]
      : []),
    (tone) => (
      <section key="faq" className={`tile ${tone}`}>
        <div className="wrap">
          <h2 className="t-display">Questions.</h2>
          <div className="mt-8 max-w-[760px]">
            {d.faq.map(([q, a]) => (
              <details key={q} className="faq">
                <summary>{q}</summary>
                <p className="mt-3 muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
    (tone) => (
      <section key="more" className={`tile ${tone}`}>
        <div className="wrap">
          <p className="mono muted">More from Triviq</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.id}><Link className="chip" href={`/services/${s.slug}`}>{s.title}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    ),
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteConfig.url, [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: service.title, path }]),
          serviceJsonLd(siteConfig.url, { name: service.title, description: d.seoDescription, path }),
        ]}
      />
      <section className="tile tile-surface pb-12">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: service.title }]} />
            <h1 className="t-display mt-8">{d.headline}</h1>
            <p className="t-lead mt-5 max-w-xl muted">{d.intro}</p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <Link href={`/contact?service=${encodeURIComponent(service.title)}`} className="btn btn-primary">
                Start a project <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <p className="mono mt-6 text-soft">{service.stack}</p>
          </div>
          <div className="sc-panel sc-panel-lg">
            <ServiceDiagram id={service.id} />
          </div>
        </div>
      </section>
      {bands.map((band, i) => band(i % 2 === 0 ? "tile-light" : "tile-surface"))}
      <ProjectCta />
    </>
  );
}
