import type { NextConfig } from "next";
import legacyRedirects from "./src/content/redirects.json";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  // Las URLs del sitio llevan slash final (igual que el WordPress actual).
  trailingSlash: true,
  // Permite correr `next dev` (revisión de borradores) junto a `next start` sin compartir .next.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // 301 de todas las URLs del WordPress (generado desde audit/redirects.json).
    // statusCode explícito: `permanent: true` respondería 308, y el brief pide 301.
    return legacyRedirects.map(({ source, destination }) => ({ source, destination, statusCode: 301 as const }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // Videos del hero: caché larga (si se re-codifican, cambiar el nombre del archivo).
      { source: "/videos/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
    ];
  },
};

export default nextConfig;
