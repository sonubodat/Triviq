"use client";

import { usePathname } from "next/navigation";

import { gsap, registerGsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

registerGsap();

const EASE = {
  enter: "power3.out",
  standard: "power2.inOut",
  product: "power3.out",
} as const;

function all<T extends Element>(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<T>(selector));
}

function one<T extends Element>(root: ParentNode, selector: string) {
  return root.querySelector<T>(selector);
}

function svgLength(el: Element) {
  if (!("getTotalLength" in el)) return 0;
  try {
    return (el as SVGGeometryElement).getTotalLength();
  } catch {
    return 0;
  }
}

function revealEditorial(section: Element | null, id: string) {
  if (!section) return;
  const parts = all<HTMLElement>(section, '[data-motion="section-kicker"], [data-motion="section-title"], [data-motion="section-copy"]');
  if (!parts.length) return;

  gsap.set(parts, { autoAlpha: 0, y: 32, willChange: "transform, opacity" });
  gsap.timeline({
    scrollTrigger: {
      id: `editorial-${id}`,
      trigger: section,
      start: "top 75%",
      once: true,
    },
  }).to(parts, {
    autoAlpha: 1,
    y: 0,
    duration: 0.75,
    ease: EASE.enter,
    stagger: 0.08,
    clearProps: "willChange",
  });
}

// Draw-in once as the grid scrolls into view, then hand over to CSS. The final state is the SSR drawing itself, so nothing is hidden
// until this runs and nothing stays hidden if it never does. Connectors (.flow) are dashed on purpose: they fade in instead of being
// drawn, and every inline style is cleared at the end so the hover "march" in globals.css and the SMIL pulses work on the real markup.
function animateServiceDiagrams(root: Element | null) {
  if (!root) return;
  const grid = one<HTMLElement>(root, '[data-motion="services-grid"]');
  const diagrams = all<SVGSVGElement>(root, '[data-motion="service-diagram"]');
  if (!grid || !diagrams.length) return;

  ScrollTrigger.create({
    id: "service-diagrams",
    trigger: grid,
    start: "top 78%",
    once: true,
    onEnter: () => {
      diagrams.forEach((svg, index) => {
        const strokes = all<SVGGeometryElement>(svg, ".ln, .ac").filter((el) => svgLength(el) > 0);
        const flows = all<SVGElement>(svg, ".flow");
        const marks = all<SVGElement>(svg, ".fl, .hl");
        const labels = all<SVGElement>(svg, ".lbl");
        const tl = gsap.timeline({ delay: index * 0.05 }); // 50ms per card: a stagger you can read, not a wave

        strokes.forEach((el) => {
          const length = svgLength(el);
          gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set([...flows, ...labels], { autoAlpha: 0 });

        tl.to(strokes, { strokeDashoffset: 0, duration: 0.7, ease: EASE.enter, stagger: 0.012, clearProps: "strokeDasharray,strokeDashoffset" });
        if (marks.length) { // not every diagram has accent marks, and GSAP warns on an empty target list
          gsap.set(marks, { autoAlpha: 0, scale: 0.78, transformOrigin: "center center" });
          tl.to(marks, { autoAlpha: 1, scale: 1, duration: 0.28, ease: EASE.enter, stagger: 0.03, clearProps: "opacity,visibility,transform,transformOrigin" }, 0.18);
        }
        tl.to([...flows, ...labels], { autoAlpha: 1, duration: 0.4, ease: EASE.enter, clearProps: "opacity,visibility" }, 0.45);
        tl.call(() => marks.forEach((el) => el.removeAttribute("style"))); // GSAP leaves an inert transform-origin on SVG marks
      });
    },
  });
}

function revealProjects(section: Element | null, id: string) {
  if (!section) return;
  const grid = one<HTMLElement>(section, '[data-motion="project-grid"]');
  const cards = all<HTMLElement>(section, '[data-motion="project-card"]');
  if (!grid || !cards.length) return;

  const medias = cards.map((card) => one<HTMLElement>(card, '[data-motion="project-media"]')).filter(Boolean);
  const copies = cards.map((card) => one<HTMLElement>(card, '[data-motion="project-copy"]')).filter(Boolean);
  const phones = all<HTMLElement>(section, ".phone");

  gsap.set(medias, {
    clipPath: "inset(7% 0% 0% 0%)",
    scale: 1.045,
    y: 18,
    transformOrigin: "center top",
    willChange: "transform, clip-path",
  });
  gsap.set(copies, { autoAlpha: 0, y: 24, willChange: "transform, opacity" });
  gsap.set(phones, { "--phone-reveal-y": "22px" });
  if (id === "labs") {
    phones.forEach((phone, index) => {
      gsap.set(phone, { "--phone-reveal-x": `${index % 2 === 0 ? -14 : 14}px` });
    });
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      id: `projects-${id}`,
      trigger: grid,
      start: "top 76%",
      once: true,
    },
  });

  tl.to(medias, {
    clipPath: "inset(0% 0% 0% 0%)",
    scale: 1,
    y: 0,
    duration: 1,
    ease: EASE.product,
    stagger: 0.1,
    clearProps: "willChange",
  })
    .to(
      phones,
      {
        "--phone-reveal-y": "0px",
        "--phone-reveal-x": "0px",
        duration: 0.9,
        ease: EASE.product,
        stagger: 0.04,
      },
      0.05,
    )
    .to(
      copies,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.62,
        ease: EASE.enter,
        stagger: 0.08,
        clearProps: "willChange",
      },
      0.28,
    );
}

function animateDelivery(section: Element | null) {
  if (!section) return;
  const list = one<HTMLElement>(section, '[data-motion="delivery-list"]');
  if (!list) return;
  const items = all<HTMLElement>(list, "li");
  const numbers = all<HTMLElement>(list, ".mono");
  if (!items.length) return;

  gsap.set(items, { "--delivery-progress": 0 });
  gsap.timeline({
    scrollTrigger: {
      id: "studio-delivery",
      trigger: list,
      start: "top 76%",
      once: true,
    },
  })
    .to(items, {
      "--delivery-progress": 1,
      duration: 0.55,
      ease: EASE.standard,
      stagger: 0.06,
    })
    .to(
      numbers,
      {
        color: "#029dff",
        duration: 0.32,
        ease: EASE.enter,
        stagger: 0.04,
      },
      0.04,
    );
}

function revealSupport(section: Element | null, id: string) {
  if (!section) return;
  const chips = all<HTMLElement>(section, '[data-motion="chip-list"] > li');
  const cards = all<HTMLElement>(section, '[data-motion="engagement-grid"] > article');
  const cta = one<HTMLElement>(section, '[data-motion="cta-button"]');
  const targets = [...chips, ...cards, ...(cta ? [cta] : [])];
  if (!targets.length) return;

  gsap.set(targets, { autoAlpha: 0, y: 18, willChange: "transform, opacity" });
  gsap.timeline({
    scrollTrigger: {
      id: `support-${id}`,
      trigger: section,
      start: "top 78%",
      once: true,
    },
  }).to(targets, {
    autoAlpha: 1,
    y: 0,
    duration: 0.5,
    ease: EASE.enter,
    stagger: 0.045,
    clearProps: "willChange",
  });
}

function heroIntro(root: Element) {
  const hero = one<HTMLElement>(root, '[data-motion-section="hero"]');
  if (!hero) return;

  const eyebrow = one<HTMLElement>(hero, '[data-motion="hero-eyebrow"]');
  const lines = all<HTMLElement>(hero, '[data-motion="hero-line"]');
  const copy = one<HTMLElement>(hero, '[data-motion="hero-copy"]');
  const ctas = one<HTMLElement>(hero, '[data-motion="hero-ctas"]');
  const meta = one<HTMLElement>(hero, '[data-motion="hero-meta"]');
  const targets = [eyebrow, ...lines, copy, ctas, meta].filter(Boolean);
  if (!targets.length) return;

  gsap.set(lines, { display: "block" });
  gsap.set(targets, { autoAlpha: 0, y: 28, willChange: "transform, opacity" });
  gsap.timeline({ defaults: { ease: EASE.enter } })
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.08)
    .to(lines, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 }, 0.14)
    .to(copy, { autoAlpha: 1, y: 0, duration: 0.62 }, 0.44)
    .to(ctas, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.56)
    .to(meta, { autoAlpha: 1, y: 0, duration: 0.55, clearProps: "willChange" }, 0.64);
}

export function HomeMotion() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = document.querySelector<HTMLElement>("[data-home-motion-scope]");
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        heroIntro(root);

        const services = one(root, '[data-motion-section="services"]');
        const work = one(root, '[data-motion-section="work"]');
        const labs = one(root, '[data-motion-section="labs"]');
        const studio = one(root, '[data-motion-section="studio"]');
        const engagement = one(root, '[data-motion-section="engagement"]');
        const cta = one(root, '[data-motion-section="cta"]');

        revealEditorial(services, "services");
        animateServiceDiagrams(services);
        revealEditorial(work, "work");
        revealProjects(work, "work");
        revealEditorial(labs, "labs");
        revealProjects(labs, "labs");
        revealEditorial(studio, "studio");
        animateDelivery(studio);
        revealEditorial(engagement, "engagement");
        revealSupport(engagement, "engagement");
        revealEditorial(cta, "cta");
        revealSupport(cta, "cta");

        window.setTimeout(() => ScrollTrigger.refresh(), 250);
      });

      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
