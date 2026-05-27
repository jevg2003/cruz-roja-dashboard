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
  dataMaturityLevel?: string;
  dataQuality: number;
  dataCatalogedAssets: number;
  dataPrivacyCompliance: number;
  dataReqCommittee: boolean;         // 1. Comité de Datos constituido
  dataReqAuditoria1581: boolean;      // 2. Auditoría Ley 1581 en HeVa
  dataReqDisenoDRP: boolean;          // 3. Diseño DRP y Ransomware
  dataReqInventarioCriticidad: boolean; // 4. Inventario de Criticidad
  dataReqPlanIntegracion: boolean;     // 5. Plan de integración HeVa-Siesa
  dataReqGlosarioNegocio: boolean;     // 6. Glosario único de negocio
  dataReqControlesDuplicidad: boolean; // 7. Controles anti-duplicidad
  dataReqAuditoriasCalidad: boolean;   // 8. Auditorías periódicas PETI
}

export interface AIGovernanceState {
  aiMaturity: number;
  aiMaturityLevel?: string;
  aiExplainability: number;
  aiBiasAudit: number;
  aiDriftStatus: 'Normal' | 'Alerta' | 'Crítico';
  aiInventoryCount: number;
  aiReqRiskManagement: boolean;     // 1. Sistema de gestión de riesgos documentado
  aiReqDataQuality: boolean;        // 2. Gobierno y calidad de datos de entrenamiento
  aiReqTechnicalDoc: boolean;       // 3. Documentación técnica completa
  aiReqLogging: boolean;            // 4. Registro y trazabilidad (logging)
  aiReqTransparency: boolean;        // 5. Transparencia hacia usuarios
  aiReqHumanOversight: boolean;     // 6. Supervisión humana obligatoria
  aiReqCybersecurity: boolean;      // 7. Exactitud, robustez y ciberseguridad
  aiReqConformity: boolean;         // 8. Evaluación de conformidad pre-despliegue
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

