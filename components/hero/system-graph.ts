// Positions for the hero "system": seven nodes that start scattered (chaos), settle into a hub-and-spoke
// order around the Triviq core, then (scroll hand-off) tighten toward the core and align on a horizontal line
// that sits just above the DOM step rail. Pure and import-free.
export type NodeInfo = { id: string; label: string; stack: string[] };

export const NODES: NodeInfo[] = [
  { id: "product", label: "Product", stack: ["Strategy", "UX", "MVP", "Roadmap"] },
  { id: "apps", label: "Apps", stack: ["iOS", "Android", "Dashboards", "Portals"] },
  { id: "platform", label: "Platform", stack: ["APIs", "Auth", "Integrations", "Data"] },
  { id: "infra", label: "Infra", stack: ["Cloud", "Monitoring", "Performance", "Reliability"] },
  { id: "ai", label: "AI", stack: ["LLMs", "Automation", "Workflows", "Ops"] },
  { id: "systems", label: "Systems", stack: ["Admin", "Billing", "Reports", "Permissions"] },
  { id: "launch", label: "Launch", stack: ["QA", "Deploy", "Analytics", "Support"] },
];

const RX = 3.3;
const RY = 2.45;
const TIGHT = 0.72; // ring radius multiplier at the tightest point
const FRONT = 0.7; // nodes cross in front of the core on their way to the line, never through it
export const LINE_STEP = 1.1;
export const LINE_Y = -2.25;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = NODES.length;
const rand = mulberry32(7);
export const CHAOS: number[] = [];
export const ORDER: number[] = [];
export const LINE: number[] = [];
for (let i = 0; i < n; i += 1) {
  // chaos: uniform direction, radius 4..7 so nodes start outside the frame centre
  const u = rand() * 2 - 1;
  const phi = rand() * Math.PI * 2;
  const r = 4 + rand() * 3;
  const s = Math.sqrt(1 - u * u);
  CHAOS.push(r * s * Math.cos(phi) * 1.1, r * u * 0.9, r * s * Math.sin(phi) * 0.8);
  // order: ellipse in the XY plane (same angles as the static SVG), alternating depth for parallax
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
  ORDER.push(RX * Math.cos(a), RY * Math.sin(a) + 0.1, i % 2 === 0 ? 0.35 : -0.35);
  // line: evenly spaced along x, spanning the same width as the DOM rail (10.4%..89.6% of the visual box)
  LINE.push((i - (n - 1) / 2) * LINE_STEP, LINE_Y, 0);
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (v: number) => v * v * (3 - 2 * v);
const win = (c: number, from: number, to: number) => ease(clamp01((c - from) / (to - from)));

/**
 * Collapse choreography. `c` is the scrubbed scroll progress 0..1; every value is 0 at c=0 and 1 at c=1.
 * Order matters: tighten -> core recedes -> connections quiet down -> nodes align -> chain appears.
 * The DOM rail (hero-visual.tsx) appears after `line` has mostly finished.
 */
export function phases(c: number) {
  return {
    tight: win(c, 0, 0.4), // nodes gather toward the core
    core: win(c, 0.15, 0.55), // T-core recedes slightly
    hush: win(c, 0.2, 0.55), // spokes, pulses fade; labels fade (below)
    labels: win(c, 0.05, 0.35),
    line: win(c, 0.3, 0.78), // nodes align horizontally
    chain: win(c, 0.55, 0.85), // neighbour links replace the spokes
  };
}

/** Writes node positions into `out` (length n*3): chaos -> order by `t`, then tighten + align by `c`. Both 0..1. */
export function layoutInto(out: Float32Array | number[], t: number, c: number): void {
  const tt = ease(clamp01(t));
  const { tight, line } = phases(c);
  const k = 1 - (1 - TIGHT) * tight;
  const front = Math.sin(Math.PI * line) * FRONT; // 0 at both ends of the move
  for (let i = 0; i < n * 3; i += 1) {
    const ordered = CHAOS[i] + (ORDER[i] - CHAOS[i]) * tt;
    const isDepth = i % 3 === 2;
    const gathered = isDepth ? ordered : ordered * k; // x/y gather toward the core; depth is left alone
    out[i] = gathered + (LINE[i] - gathered) * line + (isDepth ? front : 0);
  }
}
