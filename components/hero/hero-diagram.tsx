// Static architecture graphic: SSR/LCP visual, mobile visual, reduced-motion visual (the WebGL scene upgrades it later).
const CX = 320;
const CY = 290;
const RX = 232;
const RY = 190;

const nodes = [
  { label: "CLOUD", sub: "AWS" },
  { label: "MOBILE", sub: "iOS · Android" },
  { label: "API", sub: "Node · FastAPI" },
  { label: "DATABASE", sub: "SQL · NoSQL" },
  { label: "GAMES", sub: "Interactive" },
  { label: "AI", sub: "Automation" },
  { label: "WEB", sub: "Next.js · React" },
].map((n, i, all) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / all.length;
  return { ...n, x: Math.round(CX + RX * Math.cos(a)), y: Math.round(CY + RY * Math.sin(a)) };
});

export function HeroDiagram() {
  return (
    <svg
      viewBox="10 60 620 520"
      className="h-auto w-full"
      role="img"
      aria-label="Triviq at the centre of a connected system: web, mobile, API, database, cloud, AI and games."
    >
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke="#029dff" strokeOpacity=".2" strokeWidth="1" />
      {nodes.map((n) => (
        <line key={n.label} x1={CX} y1={CY} x2={n.x} y2={n.y} className="hd-flow" stroke="#029dff" strokeOpacity=".45" strokeWidth="1" strokeDasharray="3 6" />
      ))}
      {nodes.map((n) => (
        <g key={n.label} transform={`translate(${n.x - 66} ${n.y - 28})`}>
          <rect width="132" height="56" rx="10" fill="#101722" stroke="#029dff" strokeOpacity=".35" />
          <text x="66" y="24" textAnchor="middle" fill="#fff" className="mono" style={{ fontSize: 14, letterSpacing: "0.08em" }}>{n.label}</text>
          <text x="66" y="43" textAnchor="middle" fill="#98a6b8" className="mono" style={{ fontSize: 11.5, letterSpacing: "0.02em", textTransform: "none" }}>{n.sub}</text>
        </g>
      ))}
      {/* Core: T monogram + orbit, echoing the logo */}
      <g transform={`translate(${CX} ${CY})`}>
        <circle r="58" fill="#0a67d4" />
        <rect x="-26" y="-28" width="52" height="15" rx="2" fill="#fff" />
        <rect x="-8" y="-15" width="16" height="46" rx="2" fill="#fff" />
        <ellipse rx="86" ry="28" transform="rotate(-18)" fill="none" stroke="#029dff" strokeWidth="3" />
        <rect x="34" y="-52" width="7" height="7" fill="#03d7fe" />
        <rect x="46" y="-62" width="5" height="5" fill="#03d7fe" opacity=".7" />
        <rect x="24" y="-64" width="4" height="4" fill="#03d7fe" opacity=".5" />
      </g>
      <text x={CX} y="560" textAnchor="middle" fill="#98a6b8" className="mono" style={{ fontSize: 13 }}>TRIVIQ SYSTEM</text>
    </svg>
  );
}
