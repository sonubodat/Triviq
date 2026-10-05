import Image from "next/image";
import type { CSSProperties } from "react";

import type { Project } from "@/lib/content";

import { QrFlowDiagram } from "./service-diagrams";

export function CaseStudyCard({ project, dark = false }: { project: Project; dark?: boolean }) {
  const { media, details } = project;
  return (
    <article className={`cs ${dark ? "cs-dark" : ""}`}>
      <div className="cs-media">
        {media.type === "phones" ? (
          media.images.map((img, index) => (
            <div key={img.src} className="phone" style={{ "--phone-shift": `${index * 28}px` } as CSSProperties}>
              <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="188px" />
            </div>
          ))
        ) : (
          <div className="mt-10 w-full max-w-[420px] self-start">
            <QrFlowDiagram />
          </div>
        )}
      </div>
      <div className="cs-body">
        <p className="mono flex flex-wrap items-center gap-x-4">
          <span className={dark ? "accent-cyan" : "accent"}>{project.kind === "product" ? "Triviq product" : "Platform build"}</span>
          {project.status && <span className="status accent">{project.status}</span>}
        </p>
        <h3 className="t-title">{project.name}</h3>
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
