"use client";

import { useEffect, useState } from "react";

export function SplashIntro() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), 1650);
    return () => window.clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <div className="splash-intro" aria-hidden="true">
      <div className="splash-paper">
        <svg className="splash-mark" viewBox="0 0 260 220">
          <path className="splash-orbit splash-orbit-a" d="M44 122 C82 76, 176 72, 216 112 C177 155, 84 160, 44 122Z" />
          <path className="splash-orbit splash-orbit-b" d="M39 126 C83 84, 174 78, 221 116 C178 151, 84 166, 39 126Z" />
          <path className="splash-t splash-t-a" d="M71 64 C103 61, 145 62, 188 65" />
          <path className="splash-t splash-t-b" d="M73 72 C111 70, 150 71, 190 73" />
          <path className="splash-t splash-stem-a" d="M129 66 C128 94, 128 123, 129 158" />
          <path className="splash-t splash-stem-b" d="M139 67 C138 94, 138 125, 139 159" />
          <path className="splash-pixel splash-pixel-1" d="M192 42 L211 43 L210 61 L192 60Z" />
          <path className="splash-pixel splash-pixel-2" d="M217 28 L232 29 L231 43 L216 42Z" />
          <path className="splash-pixel splash-pixel-3" d="M179 25 L190 25 L190 36 L179 36Z" />
        </svg>
        <p className="mono splash-word">Triviq</p>
      </div>
    </div>
  );
}
