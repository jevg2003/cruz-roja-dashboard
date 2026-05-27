// src/features/diagnostic/types.ts
import { z } from 'zod';
import { DiagnosticScoresSchema } from './schema';

export type DiagnosticScores = z.infer<typeof DiagnosticScoresSchema>;

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
