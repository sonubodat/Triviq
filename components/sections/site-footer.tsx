import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>{siteConfig.companyName}</p>
        <p>Digital products, websites, apps, and automation.</p>
      </div>
    </footer>
  );
}
