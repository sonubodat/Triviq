"use client";

import { type ReactNode, useRef } from "react";

import { gsap, registerGsap, useGSAP } from "@/lib/gsap";

registerGsap();

// Only the step heading dims, never the body copy: at 0.65 the ink still clears 4.5:1 on white, and the muted body grey (5.1:1) cannot
// be dimmed at all. The step number turns blue as the active cue, so no text drops below WCAG AA at any scroll position.
const INACTIVE = 0.65;
const GREY = "#b4c5d8";
const BLUE = "#0a67d4";
const MUTED = "#5f6f82";
const STAGES = ["discover", "design", "build", "launch"] as const;

// Desktop-only pinned story: one blueprint evolves Discover > Design > Build > Launch, scrubbed to scroll.
// Everything else (tablet, phone, reduced motion, short viewports) keeps the finished static layout with no triggers.
export function ProcessStory({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (min-height: 810px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = root.current?.querySelector<HTMLElement>("[data-process]");
          if (!section) return;
          const steps = gsap.utils.toArray<HTMLElement>("[data-step]", section);
          const groups = STAGES.map((id) => section.querySelector<SVGGElement>(`#bp-${id}`));
          const heads = steps.map((s) => s.querySelector<HTMLElement>("h3"));
          const nums = steps.map((s) => s.querySelector<HTMLElement>(".mono"));
          if (steps.length !== 4 || groups.some((g) => !g) || heads.some((h) => !h) || nums.some((n) => !n)) return;
          const accents = groups.map((g) => gsap.utils.toArray<SVGElement>(".flow, .hl, .fl", g!));
          const fill = section.querySelector(".rail-fill");
          const dots = gsap.utils.toArray<HTMLElement>(".rail-dot", section);

          // initial state: stage 1 active, the rest dimmed/grey but fully visible
          gsap.set(heads.slice(1), { opacity: INACTIVE });
          gsap.set(nums[0], { color: BLUE });
          gsap.set(groups.slice(1), { color: GREY });
          gsap.set(accents.slice(1).flat(), { opacity: 0.25 });
          gsap.set(dots.slice(1), { backgroundColor: GREY });
          gsap.set(fill, { scaleX: 0 });

          const tl = gsap.timeline({
            defaults: { ease: "none", duration: 0.5, immediateRender: false },
            scrollTrigger: {
              trigger: section,
              start: "top 44px", // sits under the sticky header
              end: "+=160%",
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          for (let i = 1; i < 4; i += 1) {
            const at = i - 0.5;
            tl.fromTo(heads[i - 1], { opacity: 1 }, { opacity: INACTIVE }, at)
              .fromTo(heads[i], { opacity: INACTIVE }, { opacity: 1 }, at)
              .fromTo(nums[i - 1], { color: BLUE }, { color: MUTED }, at)
              .fromTo(nums[i], { color: MUTED }, { color: BLUE }, at)
              .fromTo(groups[i], { color: GREY }, { color: BLUE }, at)
              .fromTo(accents[i], { opacity: 0.25 }, { opacity: 1 }, at)
              .fromTo(dots[i], { backgroundColor: GREY }, { backgroundColor: BLUE }, at)
              .fromTo(fill, { scaleX: (i - 1) / 3 }, { scaleX: i / 3 }, at);
          }
          tl.to({}, { duration: 0.5 }); // rest on the finished blueprint before the pin releases
        },
        root,
      );
      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
