import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { ProjectCta } from "@/components/sections/cta";
import { ProjectMedia } from "@/components/sections/project-media";
import { allProjects, getProject, services } from "@/lib/content";
import { breadcrumbJsonLd, pageMeta, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => allProjects.map((p) => ({ slug: p.slug }));

const describe = (p: { descriptor: string; built: string; status?: string }) =>
  `${p.descriptor}${p.status ? ` A Triviq product, ${p.status.toLowerCase()}.` : ""} Built: ${p.built}.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return pageMeta(siteConfig, { title: project.name, description: describe(project), path: `/work/${project.slug}` });
}

export default async function CaseStudy({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const path = `/work/${project.slug}`;
  const related = project.services.map((id) => services.find((s) => s.id === id)).filter((s) => s !== undefined);
  const preset = related[0]?.title ?? "Something else";
  const others = allProjects.filter((p) => p.slug !== project.slug);
  const story: [string, string][] = [
    ["Problem", project.details.problem],
    ["Approach", project.details.approach],
    ["System", project.details.system],
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteConfig.url, [{ name: "Home", path: "/" }, { name: "Work", path: "/#work" }, { name: project.name, path }]),
          webPageJsonLd(siteConfig.url, { name: project.name, description: describe(project), path }),
        ]}
      />
      <section className="tile tile-black pb-12">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Work", href: "/#work" }, { name: project.name }]} />
            <p className="mono mt-8 flex flex-wrap items-center gap-x-4">
              <span className="accent-cyan">{project.kind === "product" ? "Triviq product" : "Platform build"}</span>
              {project.status && <span className="status accent-cyan">{project.status}</span>}
            </p>
            <h1 className="t-display mt-3">{project.name}</h1>
            <p className="t-lead mt-5 max-w-xl muted">{project.descriptor}</p>
            <dl className="cs-facts mt-8">
              <div><dt className="mono">Built</dt><dd>{project.built}</dd></div>
              <div><dt className="mono">System</dt><dd>{project.system}</dd></div>
            </dl>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <Link href={`/contact?service=${encodeURIComponent(preset)}`} className="btn btn-primary">
                Start a project like this <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="cs cs-dark">
            <div className="cs-media">
              <ProjectMedia media={project.media} eager />
            </div>
          </div>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="wrap grid gap-10 lg:grid-cols-3">
          {story.map(([label, text]) => (
            <div key={label}>
              <p className="mono accent">{label}</p>
              <p className="t-lead mt-3">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tile tile-surface">
        <div className="wrap">
          <p className="mono muted">What is inside</p>
          <h2 className="t-display mt-3">The parts of the system.</h2>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {project.scope.map((part) => (
              <li key={part.title} className="card">
                <h3 className="t-tagline">{part.title}</h3>
                <p className="mt-2 muted">{part.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="tile tile-light">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mono muted">Related services</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {related.map((s) => (
                <li key={s.id}><Link className="chip" href={`/services/${s.slug}`}>{s.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono muted">More work</p>
            <ul className="mt-4 grid gap-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="svc !p-5">
                    <span className="t-tagline">{p.name}</span>
                    <span className="muted">{p.descriptor}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <ProjectCta />
    </>
  );
}
