import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/lib/site";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          className="flex items-center gap-3"
          href="/"
          aria-label={siteConfig.companyName}
        >
          <Image src={siteConfig.logo} alt="" width={40} height={40} priority />
          <span className="text-lg font-semibold">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
          {navItems.map((item) => (
            <a key={item.href} className="transition hover:text-foreground" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-background transition hover:opacity-90"
          href="#contact"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}
