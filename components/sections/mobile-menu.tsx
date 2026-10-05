"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { nav } from "@/lib/site";

export function MobileMenu() {
  const pathname = usePathname();
  // Remember the path the menu was opened on: navigating elsewhere closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenPath((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenPath(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-[834px]:hidden">
      <button
        type="button"
        className="menu-btn"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="menu-bar" />
        <span className="menu-bar" />
      </button>
      <nav id="mobile-nav" className="menu-panel" data-open={open} aria-label="Mobile" inert={!open}>
        <div className="menu-inner px-6 pb-6">
          {[...nav, { label: "Contact", href: "/contact" }].map((item) => (
            <Link key={item.href} href={item.href} className="menu-link" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary mt-6 w-full" onClick={() => setOpen(false)}>
            Start a project
          </Link>
        </div>
      </nav>
    </div>
  );
}
