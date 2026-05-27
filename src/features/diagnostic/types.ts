// src/features/diagnostic/types.ts
import { z } from 'zod';
import {
  DiagnosticScoresSchema,
  N8nWebhookPayloadSchema,
  AiBrechaCriticaSchema,
  AiPlanPriorizadoSchema,
  GeminiAiAnalysisResponseSchema,
  WebhookResponseSchema,
  EmailPayloadSchema
} from './schema';

export type DiagnosticScores = z.infer<typeof DiagnosticScoresSchema>;
export type N8nWebhookPayload = z.infer<typeof N8nWebhookPayloadSchema>;
export type AiBrechaCritica = z.infer<typeof AiBrechaCriticaSchema>;
export type AiPlanPriorizado = z.infer<typeof AiPlanPriorizadoSchema>;
export type GeminiAiAnalysisResponse = z.infer<typeof GeminiAiAnalysisResponseSchema>;
export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;
export type EmailPayload = z.infer<typeof EmailPayloadSchema>;

export type DiagnosticScoreKey =
  | 'responsabilidad'
  | 'conformidad'
  | 'servidores'
  | 'backups'
  | 'interoperabilidad'
  | 'canales_donantes'
  | 'portal_educativo'
  | 'apropiacion_digital'
  | 'mesa_ayuda'
  | 'convenios_makaia';

export interface Question {
  key: DiagnosticScoreKey;
  category: string;
  title: string;
  desc: string;
  impact: string;
  minDesc: string;
  maxDesc: string;
}
