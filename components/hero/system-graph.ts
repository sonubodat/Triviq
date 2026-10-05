// Positions for the hero "system": seven nodes that start scattered (chaos), settle into a hub-and-spoke
// order around the Triviq core, and can collapse onto a line (scroll hand-off). Pure and import-free.
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
  // line: evenly spaced along x
  LINE.push((i - (n - 1) / 2) * 1.1, -2.9, 0);
}

const ease = (v: number) => v * v * (3 - 2 * v);

/** Writes node positions into `out` (length n*3): chaos -> order by `t`, then -> line by `c`. Both 0..1. */
export function layoutInto(out: Float32Array | number[], t: number, c: number): void {
  const tt = ease(Math.min(1, Math.max(0, t)));
  const cc = ease(Math.min(1, Math.max(0, c)));
  for (let i = 0; i < n * 3; i += 1) {
    const ordered = CHAOS[i] + (ORDER[i] - CHAOS[i]) * tt;
    out[i] = ordered + (LINE[i] - ordered) * cc;
  }
}
