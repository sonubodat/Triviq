import Image from "next/image";
import Link from "next/link";

import { nav, siteConfig } from "@/lib/site";

import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  return (
    <header className="on-black sticky top-0 z-30 bg-[var(--triviq-black)] text-white">
      <div className="mx-auto flex h-11 w-full max-w-[1068px] items-center justify-between px-6">
        <Link href="/" aria-label={`${siteConfig.name} home`}>
          <Image src={siteConfig.logo} alt={siteConfig.name} width={377} height={136} className="h-6 w-auto" priority />
        </Link>
        <nav className="hidden items-center gap-7 text-xs tracking-[-0.12px] text-white/85 min-[834px]:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-ink active:scale-95">
            Start a project
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
