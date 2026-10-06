import { JsonLd } from "@/components/json-ld";
import { ProjectCta } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceCard } from "@/components/sections/service-card";
import { services } from "@/lib/content";
import { breadcrumbJsonLd, pageMeta, webPageJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const description = "Web and platforms, mobile apps, SaaS products, AI and automation, business software and games: what Triviq builds, with the stack and the deliverables for each.";

export const metadata = pageMeta(siteConfig, { title: "Services", description, path: "/services" });

export default function Services() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(siteConfig.url, [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]),
          webPageJsonLd(siteConfig.url, { name: "Services", description, path: "/services" }),
        ]}
      />
      <PageHero
        title="What we build."
        lead="Six capabilities, one team, from first sketch to production."
        crumbs={[{ name: "Home", href: "/" }, { name: "Services" }]}
      />
      <section className="tile tile-light pt-0">
        <div className="wrap">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <li key={s.id}>
                <ServiceCard service={s} index={i} count={services.length} as="h2" />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ProjectCta />
    </>
  );
}
