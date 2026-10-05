// One blueprint, four layers. Each group is `is-active` (blue) in the static final state;
// the Phase 4 scroll story toggles that class (inactive = light slate, active = blue).
export function ProcessBlueprint() {
  return (
    <svg viewBox="0 0 520 440" className="dg bp" role="img" aria-label="Blueprint of a product: sketch, interface, API and database, then deployment to the cloud.">
      <g id="bp-discover" className="is-active">
        <rect className="ln" x="24" y="24" width="90" height="56" rx="8" strokeDasharray="4 4" />
        <rect className="ln" x="130" y="24" width="90" height="56" rx="8" strokeDasharray="4 4" />
        <path className="ln" d="M36 44H100M36 56H84M142 44H206M142 56H190" strokeDasharray="4 4" />
      </g>
      <g id="bp-design" className="is-active">
        <rect className="ln" x="24" y="110" width="270" height="170" rx="12" />
        <path className="ln" d="M24 138H294" />
        <circle className="fl" cx="40" cy="124" r="3" />
        <circle className="ln" cx="52" cy="124" r="3" />
        <rect className="ln" x="40" y="152" width="96" height="112" rx="6" />
        <path className="ln" d="M152 160H278M152 176H260M152 192H278M152 224H220" />
        <rect className="ln" x="330" y="96" width="92" height="184" rx="16" />
        <path className="ln" d="M362 108H390" />
        <rect className="ln" x="342" y="128" width="68" height="52" rx="6" />
        <path className="ln" d="M342 200H410M342 214H394" />
      </g>
      <g id="bp-build" className="is-active">
        <rect className="ac" x="24" y="330" width="110" height="50" rx="8" />
        <ellipse className="ac" cx="226" cy="342" rx="34" ry="10" />
        <path className="ac" d="M192 342V372C192 378 207 383 226 383S260 378 260 372V342" />
        <path className="ac flow" d="M134 355H190M79 330V280M226 332V280" />
        <circle className="fl" cx="79" cy="280" r="4" />
        <circle className="fl" cx="226" cy="280" r="4" />
        <circle className="hl" cx="162" cy="355" r="3.5" />
      </g>
      <g id="bp-launch" className="is-active">
        <path className="ln" d="M348 372C328 372 326 344 346 340C348 320 380 314 392 332C412 324 432 340 424 358C436 362 432 380 416 380H352" />
        <path className="ac flow" d="M260 358H320" />
        <circle className="hl" cx="290" cy="358" r="3.5" />
        <circle className="fl" cx="470" cy="360" r="14" />
        <path d="M463 360L468 365L478 354" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
