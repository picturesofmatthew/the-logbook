import type { NextConfig } from "next";

// A CSP is deliberately absent for now — it needs nonce plumbing to coexist
// with Next's inline runtime and belongs to the v1 hardening track.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  // Let a phone on the LAN hit the dev server. Next 16 blocks cross-origin
  // dev-only assets (client JS, RSC, HMR) by default, which loads the HTML but
  // leaves the page un-hydrated (dead buttons, full-reload links) — so testing
  // on a real device via the Network URL needs its origin allowlisted here.
  allowedDevOrigins: ["192.168.1.7"],
  // React's <ViewTransition> integration — powers the spellbook page-turn.
  experimental: {
    viewTransition: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
