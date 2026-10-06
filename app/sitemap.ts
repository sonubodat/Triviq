import type { MetadataRoute } from "next";

import { allProjects, services } from "@/lib/content";
import { siteConfig } from "@/lib/site";

// Built from the same arrays as the pages, so a new service or project is listed the moment it exists.
const routes = [
  { path: "", priority: 1 },
  { path: "/services", priority: 0.8 },
  ...services.map((s) => ({ path: `/services/${s.slug}`, priority: 0.8 })),
  ...allProjects.map((p) => ({ path: `/work/${p.slug}`, priority: 0.7 })),
  ...["/about", "/contact", "/support", "/privacy", "/terms"].map((path) => ({ path, priority: 0.6 })),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map(({ path, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority,
  }));
}
