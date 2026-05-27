// src/features/dashboard/types/index.ts
import type { DiagnosticScores } from '../../diagnostic/types';

export type DashboardType = 'strategic_ti' | 'integral_ti_datos_ia';

export type TabType =
  | 'autodiagnostico'
  | 'mapa'
  | 'financiero'
  | 'clientes'
  | 'procesos'
  | 'aprendizaje'
  | 'gobernanza'
  | 'prescripcion';

export interface Decisions {
  audit_servidores: boolean;
  audit_seguridad: boolean;
  audit_procesos: boolean;
  b1_ciso: boolean;
  b2_azure: boolean;
  b3_api: boolean;
  b5_portal: boolean;
  b7_datos: boolean;
  b8_capacitacion: boolean;
}

export interface Metric {
  value: number | string;
  target?: number | string;
  status: 'success' | 'warning' | 'danger';
}

export interface TopKpis {
  madurez_digital: Metric;
  iso_27001: Metric;
  disponibilidad_hemocentro: Metric;
  ejecucion_presupuesto: Metric;
  ciso_designado: Metric;
  ingresos_hemocentro: Metric;
}

export interface DataGovernanceState {
  dataMaturity: number;
  dataQuality: number;
  dataCatalogedAssets: number;
  dataPrivacyCompliance: number;
}

export interface AIGovernanceState {
  aiMaturity: number;
  aiExplainability: number;
  aiBiasAudit: number;
  aiDriftStatus: 'Normal' | 'Alerta' | 'Crítico';
  aiInventoryCount: number;
}

export interface DashboardState {
  activeDashboard: DashboardType;
  activeTab: TabType;
  decisions: Decisions;
  diagnosticScores: DiagnosticScores;
  toast: { message: string; title: string; visible: boolean } | null;
  dataGov: DataGovernanceState;
  aiGov: AIGovernanceState;
}

