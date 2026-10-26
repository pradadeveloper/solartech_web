// Validación compartida del agendamiento del programa de referidos (formulario y /api/referidos).
import { z } from "zod";
import { EXPECTED_REFERRALS, MEETING_MODES, MEETING_SLOTS, PARTNER_PROFILES } from "@/content/referrals";

const phone = z
  .string()
  .transform((v) => v.replace(/[^\d+]/g, ""))
  .refine((v) => /^(\+?57)?3\d{9}$/.test(v) || /^(\+?57)?60\d{8}$/.test(v), "Ingresa un celular colombiano válido (10 dígitos)");

export const referralMeetingSchema = z.object({
  nombre: z.string().trim().min(3, "Escribe tu nombre completo").max(120),
  email: z.email("Ingresa un correo válido").max(160),
  celular: phone,
  empresa: z.string().trim().max(160).optional(),
  ciudad: z.string().trim().min(2, "Escribe tu ciudad").max(80),
  perfil: z.enum(PARTNER_PROFILES, { error: "Elige tu perfil" }),
  referidosEsperados: z.enum(EXPECTED_REFERRALS, { error: "Elige un rango" }),
  modalidad: z.enum(MEETING_MODES.map((m) => m.value) as ["virtual", "presencial"], { error: "Elige la modalidad" }),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige un día"),
  hora: z.enum(MEETING_SLOTS, { error: "Elige una hora" }),
  mensaje: z.string().trim().max(1000).optional(),
  consentimiento: z.literal(true, { error: "Debes autorizar el tratamiento de datos para continuar" }),
});

export type ReferralMeeting = z.infer<typeof referralMeetingSchema>;
