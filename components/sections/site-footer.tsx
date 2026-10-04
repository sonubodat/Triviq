import Link from "next/link";

import { footerColumns, siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-parchment py-12 text-xs tracking-[-0.12px] text-ink-80">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-8 border-b border-hairline pb-8 md:grid-cols-4">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <p className="t-caption t-strong text-ink">{col.heading}</p>
              <ul className="mt-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1.5 text-sm hover:underline">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-2 text-ink-48 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
          <a href={`mailto:${siteConfig.email}`} className="hover:underline">{siteConfig.email}</a>
        </div>
      </div>
    </footer>
  );
}
