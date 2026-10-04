import { PageHero } from "./page-hero";
import { siteConfig } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <PageHero title={title} lead={`Last updated ${siteConfig.lastUpdated}`} />
      <section className="tile tile-light pt-0">
        <div className="mx-auto max-w-[700px] px-6 prose-legal">{children}</div>
      </section>
    </>
  );
}
