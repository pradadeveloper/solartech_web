// Validación compartida: el wizard (react-hook-form) y /api/leads usan los mismos esquemas.
import { z } from "zod";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(String(v).replace(/[^\d.]/g, ""))),
  z.number().positive().optional(),
);

export const quoteStepsSchema = z
  .object({
    clientType: z.enum(["empresa", "agro", "hogar"], { error: "Elige el tipo de cliente" }),
    departamento: z.string().min(1, "Elige el departamento"),
    municipio: z.string().min(1, "Elige el municipio"),
    billCop: optionalNumber,
    consumptionKwh: optionalNumber,
    tariffCopKwh: z.preprocess((v) => Number(String(v ?? "").replace(/[^\d.]/g, "")), z.number().min(200, "Revisa la tarifa").max(3000, "Revisa la tarifa")),
    roofType: z.enum(["lamina", "teja_barro", "losa", "suelo"]).optional(),
    areaM2: optionalNumber,
    batteries: z.boolean(),
    modelInterest: z.enum(["epc", "ppa", "no_se"]),
  })
  .refine((d) => d.billCop || d.consumptionKwh, { message: "Ingresa el valor de tu factura o tu consumo en kWh", path: ["billCop"] });

const phone = z
  .string()
  .transform((v) => v.replace(/[^\d+]/g, ""))
  .refine((v) => /^(\+?57)?3\d{9}$/.test(v) || /^(\+?57)?60\d{8}$/.test(v), "Ingresa un celular colombiano válido (10 dígitos)");

export const contactSchema = z.object({
  nombre: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  empresa: z.string().trim().max(160).optional(),
  nit: z.string().trim().max(20).optional(),
  email: z.email("Ingresa un correo válido").max(160),
  celular: phone,
  consentimiento: z.literal(true, { error: "Debes autorizar el tratamiento de datos para continuar" }),
});

export const quoteLeadSchema = z.object({ source: z.literal("cotizador") }).and(quoteStepsSchema).and(contactSchema);

export const contactLeadSchema = z
  .object({
    source: z.literal("contacto"),
    mensaje: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres)").max(2000),
  })
  .and(contactSchema);

export type QuoteSteps = z.infer<typeof quoteStepsSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type QuoteLead = z.infer<typeof quoteLeadSchema>;
export type ContactLead = z.infer<typeof contactLeadSchema>;

export const INVOICE_MAX_BYTES = 10 * 1024 * 1024;
export const INVOICE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
