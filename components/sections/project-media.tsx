import Image from "next/image";
import type { CSSProperties } from "react";

import type { Project } from "@/lib/content";

import { QrFlowDiagram } from "./service-diagrams";

// Phones with the real screens, or the procedural QR flow for the anonymised project. Shared by the card and the case-study page.
// `eager` is for the case-study hero, where the first screenshot is the largest contentful element: it must not wait for lazy loading.
export function ProjectMedia({ media, eager = false }: { media: Project["media"]; eager?: boolean }) {
  if (media.type === "diagram") {
    return (
      <div className="mt-10 w-full max-w-[420px] self-start">
        <QrFlowDiagram />
      </div>
    );
  }
  return media.images.map((img, index) => (
    <div key={img.src} className="phone" style={{ "--phone-shift": `${index * 28}px` } as CSSProperties}>
      <Image
        src={img.src}
        alt={img.alt}
        width={img.width}
        height={img.height}
        sizes="188px"
        loading={eager ? "eager" : undefined}
        fetchPriority={eager && index === 0 ? "high" : undefined}
      />
    </div>
  ));
}
