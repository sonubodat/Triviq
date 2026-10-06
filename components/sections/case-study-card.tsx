import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Project } from "@/lib/content";

import { ProjectMedia } from "./project-media";

export function CaseStudyCard({ project, dark = false }: { project: Project; dark?: boolean }) {
  const { media, details } = project;
  return (
    <article className={`cs ${dark ? "cs-dark" : ""}`} data-motion="project-card" data-project={project.slug}>
      <div className="cs-media" data-motion="project-media">
        <ProjectMedia media={media} />
      </div>
      <div className="cs-body" data-motion="project-copy">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span className={dark ? "accent-cyan" : "accent"}>{project.kind === "product" ? "Triviq product" : "Platform build"}</span>
          {project.status && <span className="status accent">{project.status}</span>}
        </p>
        <h3 className="t-title">
          <Link href={`/work/${project.slug}`} className="cs-title-link">
            {project.name}
            <ArrowUpRight className="size-5" aria-hidden="true" />
            <span className="sr-only"> case study</span>
          </Link>
        </h3>
        <p className="muted">{project.descriptor}</p>
        <ul className="proof-chips" aria-label={`${project.name} proof points`}>
          {project.proofPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        <dl className="cs-facts">
          <div><dt className="mono">Built</dt><dd>{project.built}</dd></div>
          <div><dt className="mono">System</dt><dd>{project.system}</dd></div>
        </dl>
        <details className="cs-more">
          <summary>View project details</summary>
          <dl className="cs-detail">
            <div><dt className="mono">Problem</dt><dd>{details.problem}</dd></div>
            <div><dt className="mono">Approach</dt><dd>{details.approach}</dd></div>
            <div><dt className="mono">System</dt><dd>{details.system}</dd></div>
          </dl>
        </details>
      </div>
    </article>
  );
}
