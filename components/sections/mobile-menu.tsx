"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { nav } from "@/lib/site";

export function MobileMenu() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  // Remember the path the menu was opened on: navigating elsewhere closes it without an effect.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenPath((cur) => ((typeof v === "function" ? v(cur === pathname) : v) ? pathname : null));
  const panelOffset = prefersReducedMotion ? 0 : -8;
  const linkOffset = prefersReducedMotion ? 0 : -6;
  const transition = { duration: prefersReducedMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] } as const;

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
        aria-controls={open ? "mobile-nav" : undefined} // the panel is not in the DOM while closed
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="menu-bar" />
        <span className="menu-bar" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="menu-panel"
            aria-label="Mobile"
            inert={!open}
            initial={{ opacity: 0, y: panelOffset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: panelOffset }}
            transition={transition}
          >
            <div className="menu-inner px-6 pb-6">
              {[...nav, { label: "Contact", href: "/contact" }].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: linkOffset }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: linkOffset }}
                  transition={{ ...transition, delay: prefersReducedMotion ? 0 : index * 0.03 }}
                >
                  <Link href={item.href} className="menu-link" onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: linkOffset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: linkOffset }}
                transition={{ ...transition, delay: prefersReducedMotion ? 0 : nav.length * 0.03 }}
              >
                <Link href="/contact" className="btn btn-primary mt-6 w-full" onClick={() => setOpen(false)}>
                  Start a project
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
