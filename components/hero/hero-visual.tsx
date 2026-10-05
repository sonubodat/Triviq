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

registerGsap();

// SSR and first paint are the static SVG (LCP, mobile, reduced motion, weak devices). When the device
// qualifies, the WebGL scene is loaded after `load` + idle and cross-fades over it.
export function HeroVisual() {
  const [mode, setMode] = useState<"svg" | "webgl">("svg");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const collapse = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const upgrade = () => {
      if (cancelled || !canRunWebGLHero(detectHeroEnv())) return;
      setMode("webgl");
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

  useEffect(() => {
    const el = box.current;
    if (!el || mode !== "webgl") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [mode]);

  const fallback = () => {
    collapse.current = 0;
    setMode("svg");
    setReady(false);
  };
  const node = hover === null ? null : NODES[hover];

  useGSAP(
    () => {
      if (mode !== "webgl" || !ready) return;
      const hero = box.current?.closest<HTMLElement>("section");
      if (!hero) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const rail = box.current?.querySelector<HTMLElement>(".hero-exit-rail");
        const fill = rail?.querySelector<HTMLElement>(".rail-fill");
        const dots = rail ? gsap.utils.toArray<HTMLElement>(".rail-dot", rail) : [];
        if (!rail || !fill || dots.length !== EXIT_STAGES.length) return;

        gsap.set(rail, { autoAlpha: 0, y: 18 });
        gsap.set(fill, { scaleX: 0 });
        gsap.set(dots.slice(1), { backgroundColor: "#26384c" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "bottom bottom",
            end: "+=85%",
            scrub: 0.45,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              collapse.current = self.progress;
            },
            onLeaveBack: () => {
              collapse.current = 0;
            },
            onLeave: () => {
              collapse.current = 1;
            },
          },
        });

        tl.to(rail, { autoAlpha: 1, y: 0, duration: 0.18 }, 0)
          .to(fill, { scaleX: 1, duration: 0.58 }, 0.12)
          .to(dots.slice(1), { backgroundColor: "#0a67d4", stagger: 0.09, duration: 0.36 }, 0.2)
          .to(rail, { autoAlpha: 0, y: -14, duration: 0.22 }, 0.78);
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
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
        <HeroDiagram />
      </div>
      {mode === "webgl" && (
        <div className="absolute inset-0" aria-hidden="true">
          <HeroScene active={visible} guard collapse={collapse} onHover={setHover} onSlow={fallback} onFirstFrame={() => setReady(true)} />
        </div>
      )}
      {mode === "webgl" && ready && (
        <StepRail labels={EXIT_STAGES} ariaHidden className="hero-exit-rail pointer-events-none absolute inset-x-6 bottom-4 z-10 hidden lg:block" />
      )}
      {node && (
        <p className="mono pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--triviq-border-dark)] bg-[var(--triviq-dark-card)] px-4 py-2 text-white" role="status">
          <span className="accent-cyan">{node.label}</span> · {node.stack.join(" · ")}
        </p>
      )}
    </div>
  );
}
