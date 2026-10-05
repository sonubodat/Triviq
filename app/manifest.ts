import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#05070a",
    icons: [
      {
        src: "/assets/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
