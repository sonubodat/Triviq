// Run: node --test lib/seo.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

import { breadcrumbJsonLd, pageMeta, serviceJsonLd, webPageJsonLd } from "./seo.ts";

const base = "https://triviq.com";

test("breadcrumbs: 1-based positions and absolute URLs, home has no trailing slash", () => {
  const b = breadcrumbJsonLd(base, [{ name: "Home", path: "/" }, { name: "Services", path: "/services" }, { name: "Web", path: "/services/web-platforms" }]);
  assert.equal(b["@type"], "BreadcrumbList");
  assert.deepEqual(b.itemListElement.map((i) => i.position), [1, 2, 3]);
  assert.deepEqual(b.itemListElement.map((i) => i.item), ["https://triviq.com", "https://triviq.com/services", "https://triviq.com/services/web-platforms"]);
});

test("service and page nodes point at the site-wide Organization / WebSite ids", () => {
  const s = serviceJsonLd(base, { name: "Web & Platforms", description: "d", path: "/services/web-platforms" });
  assert.equal(s["@type"], "Service");
  assert.equal(s.url, "https://triviq.com/services/web-platforms");
  assert.deepEqual(s.provider, { "@id": "https://triviq.com/#organization" });
  const p = webPageJsonLd(base, { name: "Streefi", description: "d", path: "/work/streefi" });
  assert.deepEqual(p.isPartOf, { "@id": "https://triviq.com/#website" });
  assert.doesNotThrow(() => JSON.parse(JSON.stringify([s, p])), "serialisable");
});

test("pageMeta repeats every shared Open Graph field, because a page-level openGraph replaces the root one", () => {
  const m = pageMeta({ name: "Triviq", locale: "en_US", socialImageAlt: "Card" }, { title: "Streefi", description: "Street-food platform.", path: "/work/streefi" });
  assert.equal(m.title, "Streefi");
  assert.deepEqual(m.alternates, { canonical: "/work/streefi" });
  assert.deepEqual(m.openGraph, { type: "website", siteName: "Triviq", locale: "en_US", title: "Streefi | Triviq", description: "Street-food platform.", url: "/work/streefi", images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Card" }] });
  assert.deepEqual(m.twitter, { card: "summary_large_image", title: "Streefi | Triviq", description: "Street-food platform.", images: [{ url: "/twitter-image.png", width: 1200, height: 630, alt: "Card" }] });
});
