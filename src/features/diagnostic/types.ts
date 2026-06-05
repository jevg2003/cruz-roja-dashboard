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
  | 'convenios_makaia'
  | 'soporte_ejecutivo'
  | 'entrega_servicios'
  | 'planificacion_estrategica'
  | 'roles_datos'
  | 'datos_maestros'
  | 'calidad_datos'
  | 'seguridad_datos'
  | 'comite_inventario_ia'
  | 'transparencia_explicabilidad_ia'
  | 'equidad_monitoreo_sesgos'
  | 'supervision_humana_ia';

export interface Question {
  key: DiagnosticScoreKey;
  category: string;
  title: string;
  desc: string;
  impact: string;
  minDesc: string;
  maxDesc: string;
  tab?: 'ti' | 'datos' | 'ia';
}
