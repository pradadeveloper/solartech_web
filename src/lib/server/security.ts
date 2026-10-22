import "server-only";
import { createHash } from "node:crypto";

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "0.0.0.0";
}

/** Hash de la IP: permite limitar envíos sin guardar la IP en claro. */
export function hashIp(ip: string) {
  return createHash("sha256")
    .update(`${process.env.IP_HASH_SALT ?? "solartech"}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

/** Modo de prueba (E2E en CI): sin Supabase ni Turnstile. Nunca activarlo en producción real. */
export const leadsDryRun = process.env.LEADS_DRY_RUN === "1";

/** Verifica el token de Cloudflare Turnstile. Sin clave configurada solo se omite fuera de producción. */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NODE_ENV !== "production" || leadsDryRun;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

// Límite en memoria por instancia (primera barrera). /api/leads además consulta
// Supabase por ip_hash para que el límite se mantenga entre instancias serverless.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
