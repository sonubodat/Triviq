import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="bg-parchment py-8 text-xs tracking-[-0.12px] text-ink-80">
      <div className="wrap flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} {siteConfig.companyName}. All rights reserved.</p>
        <p className="text-ink-48">Websites, apps and software for India and the world.</p>
      </div>
    </footer>
  );
}
