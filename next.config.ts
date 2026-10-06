import type { NextConfig } from "next";

// These files are not content-hashed, so they cannot be cached forever: one day fresh, then a week of stale-while-revalidate.
const staticAsset = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];

// Baseline hardening for every response. HSTS is left to the host (it only counts over HTTPS and should be set where TLS ends).
// ponytail: no Content-Security-Policy yet. Next's inline bootstrap scripts need per-request nonces; add one when a security review asks for it.
const security = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      { source: "/:path*", headers: security },
      { source: "/media/:path*", headers: staticAsset },
      { source: "/assets/:path*", headers: staticAsset },
    ];
  },
};

export default nextConfig;
