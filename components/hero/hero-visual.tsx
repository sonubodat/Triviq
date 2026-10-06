"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { StepRail } from "@/components/motion/step-rail";
import { canRunWebGLHero, detectHeroEnv } from "@/lib/capability";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";

import { HeroDiagram } from "./hero-diagram";
import { NODES } from "./system-graph";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });
const EXIT_STAGES = ["IDEA", "DESIGN", "BUILD", "SHIP"];
const DOT_ON = "#0a67d4";

registerGsap();

// SSR and first paint are the static SVG for phones, reduced motion and no-JS; CSS (.hero-static) hides it where the
// WebGL scene will mount, so desktop never flashes it. The scene loads after `load` + idle.
export function HeroVisual() {
  const [mode, setMode] = useState<"svg" | "webgl">("svg");
  const [ready, setReady] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);
  // const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const collapse = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const upgrade = () => {
      if (cancelled) return;
      if (canRunWebGLHero(detectHeroEnv())) setMode("webgl");
      else setNoWebgl(true); // CSS already shows the diagram on phones / reduced motion; this covers no WebGL2 and saveData
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(upgrade, { timeout: 1500 });
      else setTimeout(upgrade, 200); // Safari has no requestIdleCallback
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
    };
  }, []);

  // Keep the WebGL hero running continuously. Do not pause it when it leaves the viewport.
  // useEffect(() => {
  //   const el = box.current;
  //   if (!el || mode !== "webgl") return;
  //   const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
  //   io.observe(el);
  //   return () => io.disconnect();
  // }, [mode]);

  const fallback = () => {
    // Keep this fallback disabled per request: never switch back to the old static SVG.
    // collapse.current = 0;
    // setMode("svg");
    // setReady(false);
  };
  const node = hover === null ? null : NODES[hover];

  // 4B: hero exit. Scroll scrubs `collapse` 0..1, which the 3D scene turns into: nodes tighten -> core recedes ->
  // connections quiet down -> nodes align on a line. The DOM rail then appears under that line and fills.
  // No pin and no canvas transform: the hero scrolls away normally afterwards (rail included).
  // Runs only when the WebGL scene is live on a desktop-size, motion-allowed viewport; matchMedia reverts it otherwise.
  useGSAP(
    () => {
      if (mode !== "webgl" || !ready) return;
      const hero = box.current?.closest<HTMLElement>("section");
      if (!hero) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const rail = box.current?.querySelector<HTMLElement>(".hero-exit-rail");
        const fill = rail?.querySelector<HTMLElement>(".rail-fill");
        const pulse = rail?.querySelector<HTMLElement>(".rail-pulse");
        if (!rail || !fill || !pulse) return;
        const dots = gsap.utils.toArray<HTMLElement>(".rail-dot", rail);
        const labels = gsap.utils.toArray<HTMLElement>(".mono", rail);
        if (dots.length !== EXIT_STAGES.length) return;

        gsap.set(fill, { scaleX: 0 });
        gsap.set(labels, { y: 6, autoAlpha: 0 });
        gsap.set(pulse, { left: "0%", autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "none", immediateRender: false },
          scrollTrigger: {
            trigger: hero,
            start: "top 44px", // hero top under the sticky header = the first pixel of scroll
            end: () => `+=${Math.round(window.innerHeight * 0.5)}`, // half a viewport of scroll; the hero then exits normally
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress > 0.04) setHover((h) => (h === null ? h : null)); // hover card has no place on the collapsing system
            },
          },
        });
        tl.to(collapse, { current: 1, duration: 1 }, 0) // read by the scene every frame (see phases() in system-graph.ts)
          .to(rail, { autoAlpha: 1, duration: 0.12 }, 0.64)
          .to(labels, { y: 0, autoAlpha: 1, duration: 0.14, stagger: 0.02 }, 0.66)
          .to(fill, { scaleX: 1, duration: 0.25 }, 0.72)
          .to(pulse, { autoAlpha: 1, duration: 0.02 }, 0.72)
          .to(pulse, { left: "100%", duration: 0.25 }, 0.72)
          .to(pulse, { autoAlpha: 0, duration: 0.03 }, 0.97);
        dots.forEach((dot, i) => {
          // each dot lights as the fill reaches it; the last one ends exactly at 1 so the timeline is 1 long
          tl.to(dot, { backgroundColor: DOT_ON, duration: 0.03 }, 0.72 + (0.25 * i) / (dots.length - 1));
        });

        return () => {
          collapse.current = 0; // matchMedia changed (resize / reduced motion): the scene must not stay collapsed
        };
      });

      return () => {
        collapse.current = 0;
        mm.revert();
      };
    },
    { scope: box, dependencies: [mode, ready], revertOnUpdate: true },
  );

  return (
    <div ref={box} className="relative aspect-[620/520] w-full">
      <div className="hero-static absolute inset-0" data-state={mode === "webgl" ? "gl" : noWebgl ? "static" : undefined}>
        <HeroDiagram />
      </div>
      {mode === "webgl" && (
        <div className="absolute inset-0" aria-hidden="true">
          <HeroScene
            active
            guard={false}
            collapse={collapse}
            onHover={(i) => setHover(i !== null && collapse.current < 0.04 ? i : null)}
            onSlow={fallback}
            onFirstFrame={() => setReady(true)}
          />
        </div>
      )}
      {mode === "webgl" && ready && <StepRail labels={EXIT_STAGES} ariaHidden pulse className="hero-exit-rail" />}
      {node && (
        <p className="mono pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--triviq-border-dark)] bg-[var(--triviq-dark-card)] px-4 py-2 text-white" role="status">
          <span className="accent-cyan">{node.label}</span> · {node.stack.join(" · ")}
        </p>
      )}
    </div>
  );
}
