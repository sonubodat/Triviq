import Link from "next/link";

import { services } from "@/lib/content";
import { footerColumns, siteConfig } from "@/lib/site";

const columns = [{ heading: "Services", links: services.map((s) => ({ label: s.title, href: `/services/${s.slug}` })) }, ...footerColumns];

export function SiteFooter() {
  return (
    <footer className="tile-black border-t border-[var(--triviq-border-dark)] py-14">
      <div className="wrap">
        <div className="grid gap-10 border-b border-[var(--triviq-border-dark)] pb-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <p className="t-tagline">{siteConfig.name}</p>
            <p className="t-caption muted mt-2 max-w-[22ch]">Digital products engineered from idea to launch.</p>
            <p className="mono accent-cyan mt-4">India · Working worldwide</p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <p className="t-caption t-strong">{col.heading}</p>
              <ul className="mt-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="muted inline-block py-1.5 text-sm transition-colors hover:text-white pointer-coarse:py-3">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="muted mt-6 flex flex-col gap-2 text-xs sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
          <a href={`mailto:${siteConfig.email}`} className="py-1.5 transition-colors hover:text-white pointer-coarse:py-3.5">{siteConfig.email}</a>
        </div>
      </div>
    </footer>
  );
}
