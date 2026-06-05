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
  
  // IT Governance
  soporte_ejecutivo: z.number().int().min(0).max(5),
  entrega_servicios: z.number().int().min(0).max(5),
  planificacion_estrategica: z.number().int().min(0).max(5),

  // Data Governance (DAMA)
  roles_datos: z.number().int().min(0).max(5),
  datos_maestros: z.number().int().min(0).max(5),
  calidad_datos: z.number().int().min(0).max(5),
  seguridad_datos: z.number().int().min(0).max(5),

  // AI Governance
  comite_inventario_ia: z.number().int().min(0).max(5),
  transparencia_explicabilidad_ia: z.number().int().min(0).max(5),
  equidad_monitoreo_sesgos: z.number().int().min(0).max(5),
  supervision_humana_ia: z.number().int().min(0).max(5),
});

