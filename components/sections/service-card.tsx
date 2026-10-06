import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { Service } from "@/lib/content";

import { ServiceDiagram } from "./service-diagrams";

// One card, two homes: the services section on the home page and the /services index.
// The whole card is one link named by its heading and described by its copy (not by index, chips and arrow), and the drawing is
// decorative. `index` / `count` only decide when this card's pulse runs in the shared heartbeat.
export function ServiceCard({ service, index, count, as: Heading = "h3" }: { service: Service; index: number; count: number; as?: "h2" | "h3" }) {
  const titleId = `sc-${service.id}-title`;
  const descId = `sc-${service.id}-desc`;
  return (
    <Link href={`/services/${service.slug}`} className="sc" aria-labelledby={titleId} aria-describedby={descId}>
      <div className="sc-panel">
        <span className="sc-idx mono" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span className="sc-go" aria-hidden="true"><ArrowUpRight className="size-4" /></span>
        <ServiceDiagram id={service.id} index={index} count={count} />
      </div>
      <Heading id={titleId} className="t-tagline">{service.title}</Heading>
      <p id={descId} className="muted">{service.body}</p>
      <div className="sc-foot">
        <span className="sc-stack">
          {service.stack.split(" · ").map((tech) => (
            <span key={tech} className="sc-chip mono">{tech}</span>
          ))}
        </span>
      </div>
    </Link>
  );
}
