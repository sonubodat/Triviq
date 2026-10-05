import { StepRail } from "@/components/motion/step-rail";
import { ProcessStory } from "@/components/motion/process-story";
import { processSteps } from "@/lib/content";

import { ProcessBlueprint } from "./process-blueprint";

export function ProcessSection() {
  return (
    <ProcessStory>
    <section id="process" data-process className="tile tile-light process-pin">
      <div className="wrap grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="mono muted">04 / How we build</p>
          <h2 className="t-display mt-3">From idea to shipped product.</h2>
          <p className="t-lead mt-4 muted">Four stages, one blueprint that evolves with your project.</p>
          <StepRail labels={processSteps.map((s) => s.title)} className="mt-6" />
          <ol className="mt-6">
            {processSteps.map((s, i) => (
              <li key={s.id} className="step" data-step={s.id}>
                <span className="mono muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="t-tagline">{s.title}</h3>
                  <p className="mt-1 muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[18px] border border-line bg-surface p-6 sm:p-8">
          <ProcessBlueprint />
        </div>
      </div>
    </section>
    </ProcessStory>
  );
}
