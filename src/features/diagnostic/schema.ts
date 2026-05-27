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

export const N8nWebhookPayloadSchema = z.object({
  timestamp: z.string().datetime({ offset: true }),
  empresa: z.string(),
  assessment_version: z.string(),
  iso_38500_scores: DiagnosticScoresSchema,
  computed_maturity: z.number().min(0).max(5),
  conformance_status: z.enum(['GOBERNANZA COMPLETA', 'GOBIERNO PARCIAL', 'RIESGO CRÍTICO']),
  recommended_directives_peti: z.array(z.string()),
  estimated_investment_required: z.string(),
});

export const AiBrechaCriticaSchema = z.object({
  dimension: z.string(),
  score: z.number().min(0).max(5),
  impacto_negocio: z.string(),
  accion_inmediata: z.string(),
});

export const AiPlanPriorizadoSchema = z.object({
  prioridad: z.union([z.number(), z.string()]),
  proyecto: z.string(),
  inversion_estimada: z.string(),
  plazo: z.string(),
  roi_esperado: z.string(),
});

export const GeminiAiAnalysisResponseSchema = z.object({
  nivel_riesgo: z.string(),
  color_riesgo: z.enum(['red', 'amber', 'green']),
  resumen_ejecutivo: z.string(),
  siguiente_paso: z.string(),
  mensaje_junta: z.string(),
  brechas_criticas: z.array(AiBrechaCriticaSchema),
  plan_priorizado: z.array(AiPlanPriorizadoSchema),
  madurez_digital_evaluada: z.number().min(0).max(5),
  iso_27001_evaluado: z.number().min(0).max(100),
  disponibilidad_hemocentro_evaluado: z.number().min(0).max(100),
  ejecucion_presupuesto_evaluado: z.number().min(0).max(100),
  ingresos_hemocentro_evaluado: z.string(),
  foda_ia: z.object({
    debilidades: z.array(z.string()),
    oportunidades: z.array(z.string()),
    diagnostico: z.string(),
  }),
  radar_chart_ia: z.object({
    actual: z.array(z.number()),
    target: z.array(z.number()),
  }),
});

export const WebhookResponseSchema = z.object({
  status: z.string(),
  n8n_execution_id: z.string().optional(),
  data: GeminiAiAnalysisResponseSchema.optional(),
});

export const EmailPayloadSchema = z.object({
  action: z.literal('send_email'),
  email: z.string().email(),
  aiAnalysis: GeminiAiAnalysisResponseSchema,
  computed_maturity: z.number().min(0).max(5),
  conformance_status: z.enum(['GOBERNANZA COMPLETA', 'GOBIERNO PARCIAL', 'RIESGO CRÍTICO']),
  iso_38500_scores: DiagnosticScoresSchema,
});
