// Small procedural diagrams. Structure = slate, important node = blue, data/motion = sky, tiny highlight = cyan.
const label = { fontSize: 10, letterSpacing: "0.06em" } as const;

export function ServiceDiagram({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 240 96" className="dg" data-motion="service-diagram" aria-hidden="true">
      {id === "web" && (
        <>
          <rect className="ln" x="12" y="8" width="132" height="80" rx="8" />
          <path className="ln" d="M12 26H144" />
          <circle className="fl" cx="24" cy="17" r="2.5" />
          <circle className="ln" cx="34" cy="17" r="2.5" />
          <rect className="ln" x="24" y="36" width="52" height="40" rx="4" />
          <path className="ln" d="M88 40H132M88 52H124M88 64H132" />
          <path className="ac flow" d="M144 48H192" />
          <circle className="hl" cx="168" cy="48" r="3" />
          <rect className="ac" x="192" y="32" width="36" height="32" rx="6" />
        </>
      )}
      {id === "mobile" && (
        <>
          <rect className="ln" x="30" y="6" width="44" height="84" rx="10" />
          <path className="ln" d="M44 14H60" />
          <rect className="ln" x="38" y="26" width="28" height="22" rx="4" />
          <path className="ln" d="M38 60H66M38 70H58" />
          <path className="ac flow" d="M74 36H146M74 66H146" />
          <circle className="hl" cx="110" cy="36" r="3" />
          <circle className="ac" cx="168" cy="36" r="12" />
          <rect className="ln" x="156" y="56" width="24" height="20" rx="4" />
          <path className="ac flow" d="M180 46H222" />
        </>
      )}
      {id === "saas" && (
        <>
          <rect className="ln" x="10" y="30" width="56" height="36" rx="6" />
          <path className="ac flow" d="M66 48H92" />
          <rect className="ac" x="92" y="30" width="56" height="36" rx="6" />
          <path className="ac flow" d="M148 48H176" />
          <ellipse className="ln" cx="202" cy="34" rx="22" ry="8" />
          <path className="ln" d="M180 34V62C180 67 190 71 202 71S224 67 224 62V34" />
          <circle className="fl" cx="120" cy="48" r="3" />
          <circle className="hl" cx="79" cy="48" r="3" />
          <circle className="hl" cx="162" cy="48" r="3" />
        </>
      )}
      {id === "ai" && (
        <>
          <path className="ln" d="M30 48L90 22M30 48L90 74M90 22L150 34M90 74L150 62M90 22L90 74M150 34L210 48M150 62L210 48M150 34L150 62" />
          {[[30, 48], [90, 22], [90, 74], [150, 34], [150, 62]].map(([x, y]) => (
            <circle key={`${x}-${y}`} className="ln" cx={x} cy={y} r="8" />
          ))}
          <circle className="fl" cx="210" cy="48" r="9" />
          <circle className="hl" cx="120" cy="28" r="3" />
        </>
      )}
      {id === "business" && (
        <>
          <rect className="ln" x="8" y="34" width="52" height="28" rx="6" />
          <path className="ac flow" d="M60 48H84" />
          <path className="ac" d="M84 48L108 26L132 48L108 70Z" />
          <path className="ac flow" d="M132 48H156" />
          <rect className="ln" x="156" y="34" width="48" height="28" rx="6" />
          <path className="ln" d="M204 48H228" />
          <path className="ac" d="M216 40L224 48L216 56" />
          <circle className="hl" cx="72" cy="48" r="3" />
        </>
      )}
      {id === "games" && (
        <>
          <circle className="ln" cx="40" cy="66" r="16" />
          <path className="ln" d="M96 82L116 46L136 82Z" />
          <rect className="ln" x="172" y="52" width="32" height="32" rx="3" transform="rotate(12 188 68)" />
          <path className="ac flow" d="M40 50C60 2 124 2 156 32" />
          <circle className="hl" cx="156" cy="32" r="4.5" />
        </>
      )}
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
