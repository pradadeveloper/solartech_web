import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { quoteStepsSchema } from "@/lib/lead-schema";
import { computeQuote, QuoteError } from "@/lib/quote-engine";
import { renderQuotePdf } from "@/lib/server/quote-pdf";
import { clientIp, hashIp, rateLimited } from "@/lib/server/security";

// Descarga del PDF de la pre-cotización. Recalcula desde los datos del wizard;
// no lee ni expone información guardada de leads.
const bodySchema = z.object({ input: quoteStepsSchema, name: z.string().trim().min(1).max(120) });

export async function POST(request: NextRequest) {
  if (rateLimited(`pdf:${hashIp(clientIp(request.headers))}`, 10, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: "Demasiadas descargas. Intenta más tarde." }, { status: 429 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Solicitud inválida." }, { status: 400 });

  try {
    const { input, name } = parsed.data;
    const result = computeQuote(input);
    const pdf = await renderQuotePdf({ result, name, city: `${input.municipio}, ${input.departamento}`, date: new Date() });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="pre-cotizacion-solartech.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (err instanceof QuoteError) return NextResponse.json({ ok: false, error: err.message }, { status: 422 });
    throw err;
  }
}
