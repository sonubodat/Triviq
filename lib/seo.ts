// SEO helpers for the inner pages. Pure (the only import is a type), so they can be tested with node.
// The Organization and WebSite nodes live in app/layout.tsx; the JSON-LD builders reference them by @id.
import type { Metadata } from "next";

/**
 * Metadata for an inner page. Next merges metadata shallowly, so a page-level `openGraph` replaces the root layout's
 * wholesale: the shared fields are repeated here. Without this every share card read "Triviq | Product & engineering studio"
 * and og:url pointed at the home page.
 */
export function pageMeta(site: { name: string; locale: string; socialImageAlt: string }, p: { title: string; description: string; path: string }): Metadata {
  const shared = `${p.title} | ${site.name}`;
  // The root app/opengraph-image.png and app/twitter-image.png are dropped by the same replacement, so they are listed again here.
  const image = (url: string) => [{ url, width: 1200, height: 630, alt: site.socialImageAlt }];
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: p.path },
    openGraph: { type: "website", siteName: site.name, locale: site.locale, title: shared, description: p.description, url: p.path, images: image("/opengraph-image.png") },
    twitter: { card: "summary_large_image", title: shared, description: p.description, images: image("/twitter-image.png") },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(base: string, crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: `${base}${c.path === "/" ? "" : c.path}` })),
  };
}

export function serviceJsonLd(base: string, s: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.name,
    serviceType: s.name,
    description: s.description,
    url: `${base}${s.path}`,
    areaServed: "Worldwide",
    provider: { "@id": `${base}/#organization` },
  };
}

export function webPageJsonLd(base: string, p: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: p.name,
    description: p.description,
    url: `${base}${p.path}`,
    isPartOf: { "@id": `${base}/#website` },
    about: { "@id": `${base}/#organization` },
  };
}
