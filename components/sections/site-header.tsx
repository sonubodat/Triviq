import Link from "next/link";

import { siteConfig } from "@/lib/site";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Clients", href: "#clients" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 h-11 bg-black text-white">
      <div className="mx-auto flex h-full w-full max-w-[1068px] items-center justify-between px-6">
        <Link href="/" className="text-[15px] font-semibold tracking-tight" aria-label={siteConfig.name}>
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-8 text-xs tracking-[-0.12px] text-white/85 md:flex" aria-label="Primary">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-ink active:scale-95">
          Start a project
        </a>
      </div>
    </header>
  );
}
