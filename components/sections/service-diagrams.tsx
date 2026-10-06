// Small procedural diagrams. Structure = slate, important node = blue, data/motion = sky, tiny highlight = cyan.
const label = { fontSize: 10, letterSpacing: "0.06em" } as const;

// ---- Service diagrams -------------------------------------------------------------------------------------------------
// One drawing system for all six, so they read as a set instead of six doodles:
//   * 240 x 114 canvas, nodes centred on the same row, labels on one baseline (y = 108), stacked outputs carry their label inside
//   * structure = slate (.ln), the one core node and its arrows = blue (.ac), data flow = sky dashes (.flow), accents = .fl / .hl
//   * connectors are orthogonal and end in an arrowhead; every arrow points right, so every diagram reads left to right
// Motion is declarative: dashes march on card hover/focus (CSS), and one pulse per link travels the connector (SMIL), staggered so
// only one card is "alive" at a time. Both are switched off for reduced motion in globals.css; the drawing is complete without them.

type Pt = [number, number];
type Link = { d: string; to: Pt; t: number }; // t = step in the pulse sequence (0, 1, 2 ...)

const SLOT = 1.6; // seconds each card owns in the heartbeat
const STEP = 0.45; // seconds one pulse takes to cross a link

const arrow = ([x, y]: Pt) => `M${x - 3.5} ${y - 3.5}L${x} ${y}L${x - 3.5} ${y + 3.5}`;

// Each animation runs for STEP seconds and then restarts one heartbeat later (begin = "first; self.end + rest"). Spanning the whole
// cycle with keyTimes instead kept every pulse "active" on every frame, which cost about 10% of a throttled phone's main thread (about 3% now).
function Pulse({ id, d, begin, cycle }: { id: string; d: string; begin: number; cycle: number }) {
  const again = (self: string) => `${begin}s;${self}.end+${(cycle - STEP).toFixed(2)}s`;
  return (
    <circle className="pulse" r="2.4" opacity="0">
      <animateMotion id={`${id}m`} dur={`${STEP}s`} begin={again(`${id}m`)} path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      <animate id={`${id}o`} attributeName="opacity" dur={`${STEP}s`} begin={again(`${id}o`)} values="0;1;1;0" keyTimes="0;0.15;0.85;1" />
    </circle>
  );
}

function Links({ links, index, count }: { links: Link[]; index: number; count: number }) {
  const cycle = count * SLOT;
  return (
    <>
      {links.map((l) => (
        <g key={l.d}>
          <path className="flow" d={l.d} />
          <path className="ac" d={arrow(l.to)} />
        </g>
      ))}
      {links.map((l, n) => (
        <Pulse key={`p-${l.d}`} id={`p${index}x${n}`} d={l.d} begin={index * SLOT + l.t * STEP} cycle={cycle} />
      ))}
    </>
  );
}

const Api = ({ x, y }: { x: number; y: number }) => (
  <>
    <rect className="ac node" x={x} y={y} width="36" height="28" rx="6" />
    <path className="ac" d={`M${x + 13} ${y + 9}L${x + 8} ${y + 14}L${x + 13} ${y + 19}M${x + 23} ${y + 9}L${x + 28} ${y + 14}L${x + 23} ${y + 19}M${x + 20.5} ${y + 8}L${x + 15.5} ${y + 20}`} />
  </>
);

const Pill = ({ x, y, w, text }: { x: number; y: number; w: number; text: string }) => (
  <>
    <rect className="ln node" x={x} y={y} width={w} height="20" rx="5" />
    <text className="lbl" x={x + w / 2} y={y + 13}>{text}</text>
  </>
);

type Art = { art: React.ReactNode; links: Link[]; labels: [number, string][] };

const DIAGRAMS: Record<string, Art> = {
  web: {
    art: (
      <>
        <rect className="ln node" x="14" y="22" width="92" height="70" rx="6" />
        <path className="ln" d="M14 36H106" />
        <circle className="fl" cx="23" cy="29" r="1.7" />
        <circle className="ln" cx="30" cy="29" r="1.7" />
        <circle className="ln" cx="37" cy="29" r="1.7" />
        <rect className="ln" x="22" y="44" width="44" height="18" rx="3" />
        <path className="ln" d="M74 48H98M74 54H92M74 60H98" />
        <rect className="ln" x="22" y="68" width="36" height="16" rx="3" />
        <rect className="ln" x="62" y="68" width="36" height="16" rx="3" />
        <Api x={128} y={43} />
        <ellipse className="ln node" cx="207" cy="47" rx="15" ry="5" />
        <path className="ln" d="M192 47V69A15 5 0 0 0 222 69V47M192 58A15 5 0 0 0 222 58" />
      </>
    ),
    links: [
      { d: "M106 57H128", to: [128, 57], t: 0 },
      { d: "M164 57H192", to: [192, 57], t: 1 },
    ],
    labels: [[60, "UI"], [146, "API"], [207, "DB"]],
  },
  mobile: {
    art: (
      <>
        <rect className="ln node" x="22" y="14" width="48" height="84" rx="9" />
        <path className="ln" d="M38 22H54M40 90H52" />
        <rect className="ln" x="29" y="30" width="34" height="12" rx="3" />
        <rect className="ln" x="29" y="47" width="34" height="9" rx="2.5" />
        <rect className="ln" x="29" y="60" width="34" height="9" rx="2.5" />
        <rect className="ln" x="29" y="73" width="22" height="9" rx="2.5" />
        <Api x={104} y={42} />
        <Pill x={176} y={26} w={48} text="AUTH" />
        <Pill x={176} y={66} w={48} text="DATA" />
      </>
    ),
    links: [
      { d: "M70 56H104", to: [104, 56], t: 0 },
      { d: "M140 56H156V36H176", to: [176, 36], t: 1 },
      { d: "M140 56H156V76H176", to: [176, 76], t: 1 },
    ],
    labels: [[46, "APP"], [122, "API"]],
  },
  saas: {
    art: (
      <>
        <rect className="ln node" x="14" y="20" width="88" height="72" rx="6" />
        <path className="ln" d="M14 33H102M34 33V92M20 41H28M20 49H28M20 57H28M42 84H94" />
        <rect className="fl" x="40" y="38" width="18" height="4" rx="1.5" />
        <rect className="ln" x="62" y="38" width="30" height="4" rx="1.5" />
        <rect className="ln" x="46" y="68" width="8" height="16" rx="1.5" />
        <rect className="ln" x="58" y="62" width="8" height="22" rx="1.5" />
        <rect className="ln" x="70" y="54" width="8" height="30" rx="1.5" />
        <rect className="ac" x="82" y="48" width="8" height="36" rx="1.5" />
        <Api x={126} y={42} />
        <Pill x={186} y={26} w={44} text="BILLING" />
        <Pill x={186} y={66} w={44} text="DATA" />
      </>
    ),
    links: [
      { d: "M102 56H126", to: [126, 56], t: 0 },
      { d: "M162 56H174V36H186", to: [186, 36], t: 1 },
      { d: "M162 56H174V76H186", to: [186, 76], t: 1 },
    ],
    labels: [[58, "DASHBOARD"], [144, "API"]],
  },
  ai: {
    art: (
      <>
        <rect className="ln node" x="14" y="40" width="36" height="34" rx="5" />
        <path className="ln" d="M22 50H42M22 57H42M22 64H34" />
        <rect className="ac node" x="80" y="33" width="48" height="48" rx="8" />
        <rect className="ln" x="92" y="45" width="24" height="24" rx="4" />
        <circle className="fl" cx="104" cy="57" r="3" />
        <path className="ac" d="M92 33V27M104 33V27M116 33V27M92 81V87M104 81V87M116 81V87" />
        {[34, 57, 80].map((cy) => (
          <g key={cy}>
            <rect className="ln node" x="176" y={cy - 8} width="48" height="16" rx="4" />
            <path className="ac" d={`M183 ${cy}L186 ${cy + 3}L192 ${cy - 4}`} />
            <path className="ln" d={`M198 ${cy}H214`} />
          </g>
        ))}
      </>
    ),
    links: [
      { d: "M50 57H80", to: [80, 57], t: 0 },
      { d: "M128 57H152V34H176", to: [176, 34], t: 1 },
      { d: "M128 57H176", to: [176, 57], t: 1 },
      { d: "M128 57H152V80H176", to: [176, 80], t: 1 },
    ],
    labels: [[32, "INPUT"], [104, "MODEL"], [200, "ACTIONS"]],
  },
  business: {
    art: (
      <>
        <rect className="ln node" x="14" y="28" width="64" height="60" rx="6" />
        <path className="ln" d="M14 42H78M14 54H78M14 66H78M14 78H78M36 42V88" />
        <rect className="fl" x="19" y="33" width="12" height="4" rx="1.5" />
        <path className="ln" d="M42 36H72M19 48H29M42 48H64M19 60H29M42 60H58M19 72H29M42 72H66M19 83H29M42 83H54" />
        <Pill x={138} y={26} w={86} text="ADMIN" />
        <Pill x={138} y={48} w={86} text="STAFF" />
        <Pill x={138} y={70} w={86} text="PARTNER" />
      </>
    ),
    links: [
      { d: "M78 58H100V36H138", to: [138, 36], t: 0 },
      { d: "M78 58H138", to: [138, 58], t: 0 },
      { d: "M78 58H100V80H138", to: [138, 80], t: 0 },
    ],
    labels: [[46, "DATA"], [181, "ROLES"]],
  },
  games: {
    art: (
      <>
        <rect className="ln node" x="14" y="40" width="48" height="34" rx="14" />
        <path className="ln" d="M27 57H39M33 51V63" />
        <circle className="ln" cx="50" cy="52" r="2.5" />
        <circle className="ac" cx="55" cy="60" r="2.5" />
        <circle className="ln node" cx="110" cy="56" r="22" />
        <path className="ac" d="M99 51A12 12 0 0 1 121 51M121 61A12 12 0 0 1 99 61M117 47L121 51L116 53M103 65L99 61L104 59" />
        <path className="ln node" d="M190 34L209 45V67L190 78L171 67V45Z" />
        <path className="ac" d="M171 45L190 56L209 45M190 56V78" />
      </>
    ),
    links: [
      { d: "M62 57H88", to: [88, 57], t: 0 },
      { d: "M132 56H171", to: [171, 56], t: 1 },
    ],
    labels: [[38, "INPUT"], [110, "LOOP"], [190, "RENDER"]],
  },
};

// `index` / `count` place this card in the heartbeat (card 0 of 6 pulses first). A lone diagram (service page) passes neither.
export function ServiceDiagram({ id, index = 0, count = 3 }: { id: string; index?: number; count?: number }) {
  const d = DIAGRAMS[id];
  if (!d) return null;
  return (
    <svg viewBox="0 0 240 114" className="dg dg-sys" data-motion="service-diagram" aria-hidden="true">
      {d.art}
      {d.labels.map(([x, text]) => (
        <text key={text} className="lbl" x={x} y={108}>{text}</text>
      ))}
      <Links links={d.links} index={index} count={count} />
    </svg>
  );
}

export function QrFlowDiagram() {
  const steps = ["QR", "VENDOR", "LEAD", "PAYOUT STATUS"];
  return (
    <svg viewBox="0 0 450 130" className="dg" aria-label="Flow: QR code, vendor, lead, payout status" role="img">
      {steps.map((s, i) => {
        const x = 12 + i * 116;
        return (
          <g key={s} transform={`translate(${x} 20)`}>
            <rect className="ln" width="72" height="72" rx="12" />
            {i === 0 && (
              <>
                <rect className="ln" x="14" y="14" width="18" height="18" />
                <rect className="ln" x="40" y="14" width="18" height="18" />
                <rect className="ln" x="14" y="40" width="18" height="18" />
                <path className="ac" d="M42 42H58M42 50H50M58 50V58H50" />
              </>
            )}
            {i === 1 && (
              <>
                <circle className="ln" cx="36" cy="28" r="11" />
                <path className="ln" d="M14 58C14 46 24 42 36 42S58 46 58 58" />
              </>
            )}
            {i === 2 && (
              <>
                <rect className="ln" x="18" y="12" width="36" height="48" rx="4" />
                <path className="ac" d="M25 26H47M25 36H47M25 46H38" />
              </>
            )}
            {i === 3 && (
              <>
                <circle className="ac" cx="36" cy="36" r="20" />
                <path className="ac" d="M27 36L33 42L46 29" />
              </>
            )}
            <text x="36" y="98" textAnchor="middle" className="mono" style={label}>{s}</text>
            {i < 3 && (
              <>
                <path className="ac flow" d="M76 36H112" />
                <circle className="hl" cx="94" cy="36" r="3" />
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
