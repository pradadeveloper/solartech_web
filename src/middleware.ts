import { NextResponse, type NextRequest } from "next/server";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";

// Guarda la atribución de campaña (UTM, gclid, fbclid) en una cookie first-party
// cuando el visitante llega con esos parámetros. /api/leads la adjunta al lead.

const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;

export function middleware(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;
  if (!PARAMS.some((p) => searchParams.has(p))) return NextResponse.next();

  const attribution: Record<string, string> = {};
  for (const p of PARAMS) {
    const value = searchParams.get(p);
    if (value) attribution[p] = value.slice(0, 200);
  }
  attribution.landing_page = pathname;
  attribution.referrer = (request.headers.get("referer") ?? "").slice(0, 300);
  attribution.ts = new Date().toISOString();

  const response = NextResponse.next();
  response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(attribution), {
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/|api/|images/|videos/|og/|.*\\.(?:svg|png|jpg|jpeg|webp|avif|ico|xml|txt|mp4|webm)$).*)"],
};
