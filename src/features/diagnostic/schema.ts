// src/features/diagnostic/schema.ts
import { z } from 'zod';

export const DiagnosticScoresSchema = z.object({
  responsabilidad: z.number().int().min(0).max(5),
  conformidad: z.number().int().min(0).max(5),
  servidores: z.number().int().min(0).max(5),
  backups: z.number().int().min(0).max(5),
  interoperabilidad: z.number().int().min(0).max(5),
  canales_donantes: z.number().int().min(0).max(5),
  portal_educativo: z.number().int().min(0).max(5),
  apropiacion_digital: z.number().int().min(0).max(5),
  mesa_ayuda: z.number().int().min(0).max(5),
  convenios_makaia: z.number().int().min(0).max(5),
});
