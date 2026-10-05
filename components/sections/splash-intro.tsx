"use client";

import { useEffect, useState } from "react";

export function SplashIntro() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="splash-intro" aria-hidden="true">
      <div className="splash-card">
        <svg className="splash-mark" viewBox="0 0 260 220">
          <path className="splash-orbit splash-orbit-a" d="M48 129C86 80 176 74 214 111C176 158 86 164 48 129Z" />
          <path className="splash-orbit splash-orbit-b" d="M46 128C86 91 174 84 216 116C176 150 88 157 46 128Z" />
          <path className="splash-t-shadow" d="M75 63H188L184 91H148V165H109V91H71Z" />
          <path className="splash-t-face" d="M70 58H183L179 86H143V160H104V86H66Z" />
          <path className="splash-t-highlight" d="M75 63H176L175 72H118C110 72 104 78 104 86H70Z" />
          <rect className="splash-pixel splash-pixel-1" x="183" y="41" width="19" height="19" rx="3" />
          <rect className="splash-pixel splash-pixel-2" x="211" y="28" width="15" height="15" rx="3" />
          <rect className="splash-pixel splash-pixel-3" x="202" y="67" width="12" height="12" rx="2" />
        </svg>
        <div className="splash-loader" role="presentation">
          <span />
        </div>
        <p className="mono splash-word">Waking up Triviq</p>
      </div>
    </div>
  );
}
