// src/features/dashboard/store/useDashboardStore.ts
import { create } from 'zustand';
import type { TabType, Decisions, DashboardType, DataGovernanceState, AIGovernanceState } from '../types';
import type { DiagnosticScores } from '../../diagnostic/types';
import type { DiagnosticScores as DiagnosticScoresType } from '../../diagnostic/types';

export interface DashboardStoreState {
  // Primary State
  activeDashboard: DashboardType;
  activeTab: TabType;
  decisions: Decisions;
  diagnosticScores: DiagnosticScores;
  toast: { message: string; title: string } | null;
  dataGov: DataGovernanceState;
  aiGov: AIGovernanceState;
  aiResponses: {
    general: string | null;
    seguridad: string | null;
    datos: string | null;
    ia: string | null;
  };
  lastAIRequestTime: number | null;

  // Derived/Computed State (Dashboard 1)
  computedMaturity: number;
  digitalMaturityFinal: number;
  digitalMaturityLevel: string;
  overallMaturityLevel: string;
  totalCost: number;
  budgetFinal: number;
  personalCertified: string;
  practicasCobitValue: string;
  practicasCobitStatusText: string;
  practicasCobitStatus: 'success' | 'warning' | 'danger';
  uptimeFinal: number;
  incomeFinal: number;
  iso27001Final: number;
  systemIntegration: number;
  csatVal: number;
  ticketsVal: number;
  confianzaVal: number;
  digitalTramites: number;
  appProgress: string;
  eduPortalProgress: string;
  eduStatusText: string;
  eduStatus: 'success' | 'warning' | 'danger';
  directiveRating: string;
  directiveStatus: 'success' | 'warning' | 'danger';
  totalEvaluations: number;
  totalDirections: number;

  // Actions
  initialize: () => void;
  setActiveDashboard: (db: DashboardType) => void;
  setActiveTab: (tab: TabType) => void;
  updateScore: (key: keyof DiagnosticScores, score: number) => void;
  updateDecision: (key: keyof Decisions, value: boolean) => void;
  updateDataGov: (data: Partial<DataGovernanceState>) => void;
  updateAIGov: (ai: Partial<AIGovernanceState>) => void;
  saveCheckpoint: () => void;
  restoreCheckpoint: () => void;
  resetState: () => void;
  triggerToast: (message: string, title?: string) => void;
  closeToast: () => void;
  setAIResponse: (focus: 'general' | 'seguridad' | 'datos' | 'ia', response: string | null) => void;
  setLastAIRequestTime: (time: number) => void;
}

export const getMaturityLevelName = (score: number): string => {
  if (score <= 1.0) return 'Nivel 0: Inexistente';
  if (score <= 2.0) return 'Nivel 1: Inicial';
  if (score <= 3.0) return 'Nivel 2: Reactivo';
  if (score <= 4.0) return 'Nivel 3: Definido';
  if (score < 5.0) return 'Nivel 4: Medible';
  return 'Nivel 5: Optimizado';
};

const defaultDecisions: Decisions = {
  audit_servidores: false,
  audit_seguridad: false,
  audit_procesos: false,
  audit_datos: false,
  audit_ia: false,
  b1_ciso: false,
  b2_azure: false,
  b3_api: false,
  b5_portal: false,
  b7_datos: false,
  b8_capacitacion: false,
};

const defaultDiagnosticScores: DiagnosticScores = {
  responsabilidad: 2,
  conformidad: 3,
  servidores: 2,
  backups: 2,
  interoperabilidad: 2,
  canales_donantes: 3,
  portal_educativo: 3,
  apropiacion_digital: 3,
  mesa_ayuda: 4,
  convenios_makaia: 4,
  soporte_ejecutivo: 2,
  entrega_servicios: 2,
  planificacion_estrategica: 2,
  roles_datos: 2,
  datos_maestros: 2,
  calidad_datos: 2,
  seguridad_datos: 2,
  comite_inventario_ia: 1,
  transparencia_explicabilidad_ia: 2,
  equidad_monitoreo_sesgos: 2,
  supervision_humana_ia: 2,
};

const defaultDataGov: DataGovernanceState = {
  dataMaturity: 2.4,
  dataMaturityLevel: 'Nivel 2: Reactivo',
  dataQuality: 72,
  dataCatalogedAssets: 60,
  dataPrivacyCompliance: 65,
  dataReqCommittee: true,           // 1. Comité de Datos constituido
  dataReqAuditoria1581: false,      // 2. Auditoría Ley 1581 en HeVa
  dataReqDisenoDRP: true,            // 3. Diseño DRP y Ransomware
  dataReqInventarioCriticidad: true, // 4. Inventario de Criticidad
  dataReqPlanIntegracion: false,     // 5. Plan de integración HeVa-Siesa
  dataReqGlosarioNegocio: false,     // 6. Glosario único de negocio
  dataReqControlesDuplicidad: false, // 7. Controles anti-duplicidad
  dataReqAuditoriasCalidad: false,   // 8. Auditorías periódicas PETI
};

const defaultAIGov: AIGovernanceState = {
  aiMaturity: 1.8,
  aiMaturityLevel: 'Nivel 1: Inicial',
  aiExplainability: 55,
  aiBiasAudit: 50,
  aiDriftStatus: 'Alerta',
  aiInventoryCount: 3,
  aiReqRiskManagement: false,     // 1. Sistema de gestión de riesgos documentado
  aiReqDataQuality: false,        // 2. Gobierno y calidad de datos de entrenamiento
  aiReqTechnicalDoc: false,       // 3. Documentación técnica completa
  aiReqLogging: true,             // 4. Registro y trazabilidad (logging)
  aiReqTransparency: false,        // 5. Transparencia hacia usuarios
  aiReqHumanOversight: true,      // 6. Supervisión humana obligatoria
  aiReqCybersecurity: false,      // 7. Exactitud, robustez y ciberseguridad
  aiReqConformity: false,         // 8. Evaluación de conformidad pre-despliegue
};

const defaultAIResponses = {
  general: null,
  seguridad: null,
  datos: null,
  ia: null,
};

// Calculations Engine for Dashboard 1 (IT Governance)
const computeDerivedState = (
  decisions: Decisions,
  diagnosticScores: DiagnosticScores,
  dataMaturity = 2.4,
  aiMaturity = 1.8
) => {
  // A. Computed digital maturity from diagnostics (IT Governance keys only to prevent double counting)
  const itKeys: (keyof DiagnosticScores)[] = [
    'responsabilidad',
    'conformidad',
    'servidores',
    'backups',
    'interoperabilidad',
    'canales_donantes',
    'portal_educativo',
    'apropiacion_digital',
    'mesa_ayuda',
    'convenios_makaia',
    'soporte_ejecutivo',
    'entrega_servicios',
    'planificacion_estrategica'
  ];
  const totalScoresSum = itKeys.reduce((acc, key) => acc + ((diagnosticScores[key] as number) ?? 2), 0);
  let computedMaturity = parseFloat((totalScoresSum / itKeys.length).toFixed(1));

  // B. Budget execution spent calculation (Projects + Required Audits)
  let totalCost = 60; // vigentes
  if (decisions.b1_ciso) totalCost += 45;
  if (decisions.b2_azure) totalCost += 80;
  if (decisions.b3_api) totalCost += 55;
  if (decisions.b5_portal) totalCost += 75;
  if (decisions.b7_datos) totalCost += 12;
  if (decisions.b8_capacitacion) totalCost += 15;

  // Add audit costs if required (penalizes poor governance)
  if (decisions.audit_servidores) totalCost += 5;
  if (decisions.audit_seguridad) totalCost += 8;
  if (decisions.audit_procesos) totalCost += 5;
  if (decisions.audit_datos) totalCost += 10;
  if (decisions.audit_ia) totalCost += 12;

  const budgetPercent = Math.round((totalCost / 330) * 100);

  // C. Learning certifications & COBIT
  let personalCertified = '70%';
  let practicasCobitValue = '40%';
  let practicasCobitStatusText = 'Inicial';
  let practicasCobitStatus: 'success' | 'warning' | 'danger' = 'danger';

  if (decisions.b8_capacitacion) {
    personalCertified = '95%';
    practicasCobitValue = '80%';
    practicasCobitStatusText = 'Optimizado';
    practicasCobitStatus = 'success';
  }

  // D. Uptime (Hemocentro Availability)
  let currentUptime = 98.0;
  if (diagnosticScores.servidores >= 1) currentUptime += 0.4;
  if (diagnosticScores.servidores >= 3) currentUptime += 0.4;
  if (diagnosticScores.backups >= 2) currentUptime += 0.7;
  if (decisions.b2_azure) currentUptime = 99.8; 
  currentUptime = Math.min(99.8, parseFloat(currentUptime.toFixed(2)));

  // E. Hemocentro Income
  const baseIncome = 771;
  let incomeLoss = 0;
  if (currentUptime < 99.8) {
    incomeLoss = Math.round((99.8 - currentUptime) * 10 * 3);
  }
  const finalIncome = Math.max(600, baseIncome - incomeLoss);

  // F. Security & ISO 27001 Compliance
  let currentISO = 25;
  currentISO += ((diagnosticScores.conformidad as number) ?? 2) * 5;
  currentISO += ((diagnosticScores.responsabilidad as number) ?? 2) * 5;
  if (decisions.b1_ciso) currentISO = 90;
  currentISO = Math.min(90, currentISO);

  // G. Systems integration
  let systemIntegration = 0;
  if (diagnosticScores.interoperabilidad >= 2) systemIntegration = diagnosticScores.interoperabilidad * 10;
  if (decisions.b3_api) systemIntegration += 70;
  if (decisions.b7_datos) systemIntegration += 10;
  systemIntegration = Math.min(100, systemIntegration);

  // H. CSAT & Support KPIs
  let csatVal = parseFloat((4.0 + ((diagnosticScores.mesa_ayuda as number) ?? 2) * 1.1).toFixed(1));
  csatVal = Math.min(9.5, csatVal);

  let ticketsVal = 40 + ((diagnosticScores.mesa_ayuda as number) ?? 2) * 11;
  ticketsVal = Math.min(95, ticketsVal);

  let confianzaVal = 30 + (((diagnosticScores.responsabilidad as number) ?? 2) + ((diagnosticScores.apropiacion_digital as number) ?? 2)) * 6.5;
  confianzaVal = Math.min(95, Math.round(confianzaVal));

  // I. Digital Trámites & B5 Portal Launch
  let digitalTramites = 30;
  if (diagnosticScores.portal_educativo >= 4) digitalTramites = 50;
  let appProgress = '0%';
  let eduPortalProgress = '0%';
  let eduStatusText = 'Riesgo alto';
  let eduStatus: 'success' | 'warning' | 'danger' = 'danger';

  if (decisions.b5_portal) {
    if (decisions.b2_azure && decisions.b1_ciso) {
      digitalTramites = 90;
      appProgress = '100%';
      eduPortalProgress = '100%';
      eduStatusText = 'Estable';
      eduStatus = 'success';
    } else {
      digitalTramites = 50;
      appProgress = '0% (Bloqueado)';
      eduPortalProgress = '0% (Falla)';
      eduStatusText = 'Falla de seguridad';
      eduStatus = 'danger';
    }
  }

  // J. ISO 38500 Directive Rating
  const totalEvaluations = 
    (decisions.audit_servidores ? 1 : 0) + 
    (decisions.audit_seguridad ? 1 : 0) + 
    (decisions.audit_procesos ? 1 : 0) + 
    (decisions.audit_datos ? 1 : 0) + 
    (decisions.audit_ia ? 1 : 0);
  const totalDirections = (decisions.b1_ciso ? 1 : 0) + (decisions.b2_azure ? 1 : 0) + (decisions.b3_api ? 1 : 0) + (decisions.b5_portal ? 1 : 0) + (decisions.b7_datos ? 1 : 0) + (decisions.b8_capacitacion ? 1 : 0);

  let directiveRating = 'EVALUANDO';
  let directiveStatus: 'success' | 'warning' | 'danger' = 'danger';

  if (totalEvaluations === 0) {
    directiveRating = 'EVALUANDO';
    directiveStatus = 'danger';
  } else if (totalCost > 330) {
    directiveRating = 'SOBRE-PRESUPUESTO';
    directiveStatus = 'danger';
  } else if (decisions.b5_portal && (!decisions.b2_azure || !decisions.b1_ciso)) {
    directiveRating = 'INCUMPLIMIENTO RIESGO';
    directiveStatus = 'danger';
  } else if (totalEvaluations >= 2 && totalDirections >= 5) {
    directiveRating = 'GOBERNANZA COMPLETA';
    directiveStatus = 'success';
  } else {
    directiveRating = 'GOBIERNO PARCIAL';
    directiveStatus = 'warning';
  }

  const digitalMaturityFinal = computedMaturity;
  const iso27001Final = currentISO;
  const uptimeFinal = currentUptime;
  const budgetFinal = budgetPercent;
  const incomeFinal = finalIncome;

  const digitalMaturityLevel = getMaturityLevelName(computedMaturity);
  const overallMaturity = parseFloat(((computedMaturity + dataMaturity + aiMaturity) / 3).toFixed(1));
  const overallMaturityLevel = getMaturityLevelName(overallMaturity);

  return {
    computedMaturity,
    digitalMaturityFinal,
    digitalMaturityLevel,
    overallMaturityLevel,
    totalCost,
    budgetFinal,
    personalCertified,
    practicasCobitValue,
    practicasCobitStatusText,
    practicasCobitStatus,
    uptimeFinal,
    incomeFinal,
    iso27001Final,
    systemIntegration,
    csatVal,
    ticketsVal,
    confianzaVal,
    digitalTramites,
    appProgress,
    eduPortalProgress,
    eduStatusText,
    eduStatus,
    directiveRating,
    directiveStatus,
    totalEvaluations,
    totalDirections,
  };
};

const computeDataMaturity = (
  dataQuality: number,
  dataCatalog: number,
  dataPrivacy: number,
  reqCommittee: boolean,
  reqAuditoria1581: boolean,
  reqDisenoDRP: boolean,
  reqInventario: boolean,
  reqPlan: boolean,
  reqGlosario: boolean,
  reqControles: boolean,
  reqAuditorias: boolean
) => {
  const slidersAvg = ((dataQuality / 20) + (dataCatalog / 20) + (dataPrivacy / 20)) / 3;
  const checkedCount = 
    (reqCommittee ? 1 : 0) + 
    (reqAuditoria1581 ? 1 : 0) + 
    (reqDisenoDRP ? 1 : 0) + 
    (reqInventario ? 1 : 0) + 
    (reqPlan ? 1 : 0) + 
    (reqGlosario ? 1 : 0) + 
    (reqControles ? 1 : 0) + 
    (reqAuditorias ? 1 : 0);

  // Custom weighted formula yielding exactly 2.4 at starting baseline:
  // (slidersAvg = 3.28, checkedCount = 3) => 3.28 * 0.28 + 3 * 0.4 + 0.28 = 2.4.
  const calculated = slidersAvg * 0.28 + checkedCount * 0.4 + 0.28;
  return Math.min(5.0, Math.max(1.0, parseFloat(calculated.toFixed(1))));
};

const computeAIMaturity = (
  aiExplain: number,
  aiBias: number,
  aiDrift: 'Normal' | 'Alerta' | 'Crítico',
  reqRisk: boolean,
  reqData: boolean,
  reqTech: boolean,
  reqLog: boolean,
  reqTrans: boolean,
  reqHuman: boolean,
  reqCyber: boolean,
  reqConf: boolean
) => {
  const driftVal = aiDrift === 'Normal' ? 5 : aiDrift === 'Alerta' ? 3 : 1;
  const slidersAvg = ((aiExplain / 20) + (aiBias / 20) + driftVal) / 3;

  const checkedCount = 
    (reqRisk ? 1 : 0) + 
    (reqData ? 1 : 0) + 
    (reqTech ? 1 : 0) + 
    (reqLog ? 1 : 0) + 
    (reqTrans ? 1 : 0) + 
    (reqHuman ? 1 : 0) + 
    (reqCyber ? 1 : 0) + 
    (reqConf ? 1 : 0);

  // Custom weighted formula yielding exactly 1.8 at starting baseline:
  // (slidersAvg = 2.75, checkedCount = 2) => 2.75 * 0.24 + 2 * 0.43 + 0.28 = 1.8.
  // Perfectly reacts in real-time as tasks are checked/unchecked.
  const calculated = slidersAvg * 0.24 + checkedCount * 0.43 + 0.28;
  return Math.min(5.0, Math.max(1.0, parseFloat(calculated.toFixed(1))));
};

// Pure recalculation helper (no sticky overrides)
const syncGobernanzaWithDecisions = (
  decisions: Decisions,
  dataGov: DataGovernanceState,
  aiGov: AIGovernanceState
) => {
  const nextData = { ...dataGov };
  const nextAI = { ...aiGov };

  // Sync checkboxes from D1 decisions
  nextAI.aiReqDataQuality = decisions.b7_datos;
  nextAI.aiReqCybersecurity = decisions.b1_ciso;

  nextData.dataReqAuditoria1581 = decisions.audit_seguridad;
  nextData.dataReqDisenoDRP = decisions.b2_azure;
  nextData.dataReqPlanIntegracion = decisions.b3_api;
  nextData.dataReqAuditoriasCalidad = decisions.b8_capacitacion;

  nextData.dataMaturity = parseFloat(computeDataMaturity(
    nextData.dataQuality,
    nextData.dataCatalogedAssets,
    nextData.dataPrivacyCompliance,
    nextData.dataReqCommittee,
    nextData.dataReqAuditoria1581,
    nextData.dataReqDisenoDRP,
    nextData.dataReqInventarioCriticidad,
    nextData.dataReqPlanIntegracion,
    nextData.dataReqGlosarioNegocio,
    nextData.dataReqControlesDuplicidad,
    nextData.dataReqAuditoriasCalidad
  ));
  nextData.dataMaturityLevel = getMaturityLevelName(nextData.dataMaturity);

  nextAI.aiMaturity = parseFloat(computeAIMaturity(
    nextAI.aiExplainability,
    nextAI.aiBiasAudit,
    nextAI.aiDriftStatus,
    nextAI.aiReqRiskManagement,
    nextAI.aiReqDataQuality,
    nextAI.aiReqTechnicalDoc,
    nextAI.aiReqLogging,
    nextAI.aiReqTransparency,
    nextAI.aiReqHumanOversight,
    nextAI.aiReqCybersecurity,
    nextAI.aiReqConformity
  ));
  nextAI.aiMaturityLevel = getMaturityLevelName(nextAI.aiMaturity);

  return { nextData, nextAI };
};

const initialDerived = computeDerivedState(defaultDecisions, defaultDiagnosticScores, defaultDataGov.dataMaturity, defaultAIGov.aiMaturity);

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  // Primary state
  activeDashboard: 'strategic_ti',
  activeTab: 'autodiagnostico',
  decisions: defaultDecisions,
  diagnosticScores: defaultDiagnosticScores,
  toast: null,
  dataGov: defaultDataGov,
  aiGov: defaultAIGov,
  aiResponses: defaultAIResponses,
  lastAIRequestTime: null,

  // Derived state
  ...initialDerived,

  // Actions
  initialize: () => {
    if (typeof window === 'undefined') return;
    try {
      // Automatic one-time migration to clear old mismatched browser cache
      const currentVersion = 'v2.4';
      const savedVersion = localStorage.getItem('cruz_roja_store_version');
      if (savedVersion !== currentVersion) {
        localStorage.removeItem('cruz_roja_decisions');
        localStorage.removeItem('cruz_roja_diagnostic');
        localStorage.removeItem('cruz_roja_datagov');
        localStorage.removeItem('cruz_roja_aigov');
        localStorage.setItem('cruz_roja_store_version', currentVersion);
      }

      const savedDecs = localStorage.getItem('cruz_roja_decisions');
      const savedDiag = localStorage.getItem('cruz_roja_diagnostic');
      const savedDash = localStorage.getItem('cruz_roja_active_dashboard') as DashboardType | null;
      const savedData = localStorage.getItem('cruz_roja_datagov');
      const savedAI = localStorage.getItem('cruz_roja_aigov');
      const savedAIResponses = localStorage.getItem('cruz_roja_ai_responses');
      const savedLastAIRequestTime = localStorage.getItem('cruz_roja_last_ai_request_time');

      const loadedDecs = savedDecs ? JSON.parse(savedDecs) : defaultDecisions;
      const loadedDiag = savedDiag ? JSON.parse(savedDiag) : defaultDiagnosticScores;
      const loadedDash = savedDash ? savedDash : 'strategic_ti';
      const loadedData = savedData ? JSON.parse(savedData) : defaultDataGov;
      const loadedAI = savedAI ? JSON.parse(savedAI) : defaultAIGov;
      const loadedAIResponses = savedAIResponses ? JSON.parse(savedAIResponses) : defaultAIResponses;
      const loadedLastAIRequestTime = savedLastAIRequestTime ? Number(savedLastAIRequestTime) : null;

      const { nextData, nextAI } = syncGobernanzaWithDecisions(loadedDecs, loadedData, loadedAI);
      const derived = computeDerivedState(loadedDecs, loadedDiag, nextData.dataMaturity, nextAI.aiMaturity);

      set({
        activeDashboard: loadedDash,
        decisions: loadedDecs,
        diagnosticScores: loadedDiag,
        dataGov: nextData,
        aiGov: nextAI,
        aiResponses: loadedAIResponses,
        lastAIRequestTime: loadedLastAIRequestTime,
        ...derived,
      });
    } catch (e) {
      console.error('Error loading localStorage in Zustand store:', e);
    }
  },

  setActiveDashboard: (db: DashboardType) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_active_dashboard', db);
    }
    set({ activeDashboard: db });
  },

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),

  updateScore: (key: keyof DiagnosticScores, score: number) => {
    const { diagnosticScores, decisions, dataGov, aiGov } = get();
    const nextScores = { ...diagnosticScores, [key]: score };
    const nextData = { ...dataGov };
    const nextAI = { ...aiGov };

    // Sincronizar de forma directa D1 -> D2 (incluye los originales para compatibilidad y los nuevos dedicados)
    if (key === 'interoperabilidad') {
      nextData.dataQuality = score * 20;
    }
    if (key === 'conformidad') {
      nextData.dataPrivacyCompliance = score * 20;
    }
    if (key === 'apropiacion_digital') {
      nextAI.aiExplainability = score * 20;
    }
    if (key === 'responsabilidad') {
      nextAI.aiBiasAudit = score * 20;
    }
    if (key === 'servidores') {
      nextAI.aiDriftStatus = score >= 4 ? 'Normal' : score === 3 ? 'Alerta' : 'Crítico';
    }

    // Nuevos mapeos específicos
    if (key === 'calidad_datos') {
      nextData.dataQuality = score * 20;
    }
    if (key === 'seguridad_datos') {
      nextData.dataPrivacyCompliance = score * 20;
    }
    if (key === 'transparencia_explicabilidad_ia') {
      nextAI.aiExplainability = score * 20;
    }
    if (key === 'equidad_monitoreo_sesgos') {
      nextAI.aiBiasAudit = score * 20;
    }
    if (key === 'roles_datos') {
      nextData.dataReqCommittee = score >= 3;
    }
    if (key === 'datos_maestros') {
      nextData.dataReqGlosarioNegocio = score >= 3;
      nextData.dataReqControlesDuplicidad = score >= 3;
    }
    if (key === 'comite_inventario_ia') {
      nextAI.aiInventoryCount = score;
      nextAI.aiReqRiskManagement = score >= 3;
    }
    if (key === 'supervision_humana_ia') {
      nextAI.aiReqHumanOversight = score >= 3;
    }
    if (key === 'planificacion_estrategica') {
      nextData.dataReqInventarioCriticidad = score >= 3;
      nextAI.aiReqTechnicalDoc = score >= 3;
    }
    if (key === 'entrega_servicios') {
      nextAI.aiReqLogging = score >= 3;
    }

    // Recalcular decisiones de D1
    const nextDecs = { ...decisions };
    nextDecs.audit_servidores = nextScores.servidores <= 3;
    nextDecs.audit_seguridad = nextScores.responsabilidad <= 3 || nextScores.conformidad <= 3 || nextScores.seguridad_datos <= 3;
    nextDecs.audit_procesos = nextScores.apropiacion_digital <= 3 || nextScores.mesa_ayuda <= 3;

    // Auditorías requeridas automáticas de Datos e IA cuando el promedio sea < 3
    const averageDataGov = (nextScores.roles_datos + nextScores.datos_maestros + nextScores.calidad_datos + nextScores.seguridad_datos) / 4;
    nextDecs.audit_datos = averageDataGov < 3.0;

    const averageAIGov = (nextScores.comite_inventario_ia + nextScores.transparencia_explicabilidad_ia + nextScores.equidad_monitoreo_sesgos + nextScores.supervision_humana_ia) / 4;
    nextDecs.audit_ia = averageAIGov < 3.0;

    nextDecs.b1_ciso = nextScores.responsabilidad >= 3 && nextScores.conformidad >= 3 && nextScores.seguridad_datos >= 3;
    nextDecs.b2_azure = nextScores.servidores >= 3 && nextScores.backups >= 3;
    nextDecs.b3_api = nextScores.interoperabilidad >= 3 || nextScores.datos_maestros >= 3;
    nextDecs.b5_portal = nextScores.canales_donantes >= 3 && nextScores.portal_educativo >= 3;
    nextDecs.b7_datos = nextScores.interoperabilidad >= 4 || nextScores.roles_datos >= 3;
    nextDecs.b8_capacitacion = nextScores.apropiacion_digital >= 3 || nextScores.supervision_humana_ia >= 3;

    // Recalcular madurez en D2
    nextData.dataMaturity = parseFloat(computeDataMaturity(
      nextData.dataQuality,
      nextData.dataCatalogedAssets,
      nextData.dataPrivacyCompliance,
      nextData.dataReqCommittee,
      nextData.dataReqAuditoria1581,
      nextData.dataReqDisenoDRP,
      nextData.dataReqInventarioCriticidad,
      nextData.dataReqPlanIntegracion,
      nextData.dataReqGlosarioNegocio,
      nextData.dataReqControlesDuplicidad,
      nextData.dataReqAuditoriasCalidad
    ));
    nextData.dataMaturityLevel = getMaturityLevelName(nextData.dataMaturity);

    nextAI.aiMaturity = parseFloat(computeAIMaturity(
      nextAI.aiExplainability,
      nextAI.aiBiasAudit,
      nextAI.aiDriftStatus,
      nextAI.aiReqRiskManagement,
      nextAI.aiReqDataQuality,
      nextAI.aiReqTechnicalDoc,
      nextAI.aiReqLogging,
      nextAI.aiReqTransparency,
      nextAI.aiReqHumanOversight,
      nextAI.aiReqCybersecurity,
      nextAI.aiReqConformity
    ));
    nextAI.aiMaturityLevel = getMaturityLevelName(nextAI.aiMaturity);

    const derived = computeDerivedState(nextDecs, nextScores, nextData.dataMaturity, nextAI.aiMaturity);

    set({
      diagnosticScores: nextScores,
      decisions: nextDecs,
      dataGov: nextData,
      aiGov: nextAI,
      ...derived,
    });
  },

  updateDecision: (key: keyof Decisions, value: boolean) => {
    const { decisions, diagnosticScores, dataGov, aiGov } = get();
    const nextDecs = { ...decisions, [key]: value };
    const nextData = { ...dataGov };
    const nextAI = { ...aiGov };
    const nextScores = { ...diagnosticScores };

    // Aplicar boosts suaves sólo cuando el usuario activa/desactiva decisiones de forma explícita
    if (key === 'b7_datos') {
      if (value) {
        nextData.dataQuality = Math.max(nextData.dataQuality, 92);
        nextData.dataCatalogedAssets = Math.max(nextData.dataCatalogedAssets, 95);
        nextScores.interoperabilidad = 5;
        nextScores.roles_datos = 5;
        nextScores.calidad_datos = 5;
      } else {
        nextData.dataQuality = Math.min(nextData.dataQuality, 60);
        nextScores.interoperabilidad = 3;
        nextScores.roles_datos = 2;
        nextScores.calidad_datos = 2;
      }
    }
    if (key === 'b1_ciso') {
      if (value) {
        nextData.dataPrivacyCompliance = Math.max(nextData.dataPrivacyCompliance, 90);
        nextScores.conformidad = 5;
        nextScores.seguridad_datos = 5;
      } else {
        nextData.dataPrivacyCompliance = Math.min(nextData.dataPrivacyCompliance, 40);
        nextScores.conformidad = 2;
        nextScores.seguridad_datos = 2;
      }
    }
    if (key === 'b8_capacitacion') {
      if (value) {
        nextAI.aiExplainability = Math.max(nextAI.aiExplainability, 85);
        nextAI.aiBiasAudit = Math.max(nextAI.aiBiasAudit, 80);
        nextScores.apropiacion_digital = 4;
        nextScores.responsabilidad = 4;
        nextScores.supervision_humana_ia = 4;
        nextScores.transparencia_explicabilidad_ia = 4;
      } else {
        nextAI.aiExplainability = Math.min(nextAI.aiExplainability, 40);
        nextAI.aiBiasAudit = Math.min(nextAI.aiBiasAudit, 40);
        nextScores.apropiacion_digital = 2;
        nextScores.responsabilidad = 2;
        nextScores.supervision_humana_ia = 2;
        nextScores.transparencia_explicabilidad_ia = 2;
      }
    }
    if (key === 'b2_azure') {
      if (value) {
        nextAI.aiDriftStatus = 'Normal';
        nextScores.servidores = 5;
        nextScores.backups = Math.max(3, nextScores.backups);
      } else {
        nextAI.aiDriftStatus = 'Alerta';
        nextScores.servidores = 3;
      }
    }

    if (key === 'b7_datos') {
      nextAI.aiReqDataQuality = value;
    }
    if (key === 'b1_ciso') {
      nextAI.aiReqCybersecurity = value;
    }
    if (key === 'audit_seguridad') {
      nextData.dataReqAuditoria1581 = value;
    }
    if (key === 'b2_azure') {
      nextData.dataReqDisenoDRP = value;
    }
    if (key === 'b3_api') {
      nextData.dataReqPlanIntegracion = value;
    }
    if (key === 'b8_capacitacion') {
      nextData.dataReqAuditoriasCalidad = value;
    }

    // Recalcular decisiones
    nextDecs.audit_servidores = nextScores.servidores <= 3;
    nextDecs.audit_seguridad = nextScores.responsabilidad <= 3 || nextScores.conformidad <= 3 || nextScores.seguridad_datos <= 3;
    nextDecs.audit_procesos = nextScores.apropiacion_digital <= 3 || nextScores.mesa_ayuda <= 3;

    // Auditorías requeridas automáticas de Datos e IA cuando el promedio sea < 3
    const averageDataGov = (nextScores.roles_datos + nextScores.datos_maestros + nextScores.calidad_datos + nextScores.seguridad_datos) / 4;
    nextDecs.audit_datos = averageDataGov < 3.0;

    const averageAIGov = (nextScores.comite_inventario_ia + nextScores.transparencia_explicabilidad_ia + nextScores.equidad_monitoreo_sesgos + nextScores.supervision_humana_ia) / 4;
    nextDecs.audit_ia = averageAIGov < 3.0;

    // Recalcular madurez en D2
    nextData.dataMaturity = parseFloat(computeDataMaturity(
      nextData.dataQuality,
      nextData.dataCatalogedAssets,
      nextData.dataPrivacyCompliance,
      nextData.dataReqCommittee,
      nextData.dataReqAuditoria1581,
      nextData.dataReqDisenoDRP,
      nextData.dataReqInventarioCriticidad,
      nextData.dataReqPlanIntegracion,
      nextData.dataReqGlosarioNegocio,
      nextData.dataReqControlesDuplicidad,
      nextData.dataReqAuditoriasCalidad
    ));
    nextData.dataMaturityLevel = getMaturityLevelName(nextData.dataMaturity);

    nextAI.aiMaturity = parseFloat(computeAIMaturity(
      nextAI.aiExplainability,
      nextAI.aiBiasAudit,
      nextAI.aiDriftStatus,
      nextAI.aiReqRiskManagement,
      nextAI.aiReqDataQuality,
      nextAI.aiReqTechnicalDoc,
      nextAI.aiReqLogging,
      nextAI.aiReqTransparency,
      nextAI.aiReqHumanOversight,
      nextAI.aiReqCybersecurity,
      nextAI.aiReqConformity
    ));
    nextAI.aiMaturityLevel = getMaturityLevelName(nextAI.aiMaturity);

    const derived = computeDerivedState(nextDecs, nextScores, nextData.dataMaturity, nextAI.aiMaturity);

    set({
      decisions: nextDecs,
      diagnosticScores: nextScores,
      dataGov: nextData,
      aiGov: nextAI,
      ...derived,
    });
  },

  updateDataGov: (data: Partial<DataGovernanceState>) => {
    const { dataGov, diagnosticScores, decisions } = get();
    const nextDataGov = { ...dataGov, ...data };
    const nextScores = { ...diagnosticScores };
    const nextDecs = { ...decisions };

    // Sincronizar de forma directa D2 -> D1 checkboxes
    if (data.dataReqAuditoria1581 !== undefined) {
      nextDecs.audit_seguridad = data.dataReqAuditoria1581;
    }
    if (data.dataReqDisenoDRP !== undefined) {
      nextDecs.b2_azure = data.dataReqDisenoDRP;
      if (data.dataReqDisenoDRP) {
        nextScores.servidores = 5;
        nextScores.backups = Math.max(3, nextScores.backups);
      }
    }
    if (data.dataReqPlanIntegracion !== undefined) {
      nextDecs.b3_api = data.dataReqPlanIntegracion;
      if (data.dataReqPlanIntegracion) {
        nextScores.interoperabilidad = Math.max(3, nextScores.interoperabilidad);
      }
    }
    if (data.dataReqAuditoriasCalidad !== undefined) {
      nextDecs.b8_capacitacion = data.dataReqAuditoriasCalidad;
    }

    // Sincronizar de forma directa D2 -> D1 sliders y checkboxes
    if (data.dataQuality !== undefined) {
      nextScores.interoperabilidad = Math.max(1, Math.min(5, Math.round(data.dataQuality / 20)));
      nextScores.calidad_datos = Math.max(1, Math.min(5, Math.round(data.dataQuality / 20)));
    }
    if (data.dataPrivacyCompliance !== undefined) {
      nextScores.conformidad = Math.max(1, Math.min(5, Math.round(data.dataPrivacyCompliance / 20)));
      nextScores.seguridad_datos = Math.max(1, Math.min(5, Math.round(data.dataPrivacyCompliance / 20)));
    }
    if (data.dataReqCommittee !== undefined) {
      nextScores.roles_datos = data.dataReqCommittee ? 5 : 2;
    }
    if (data.dataReqGlosarioNegocio !== undefined) {
      nextScores.datos_maestros = data.dataReqGlosarioNegocio ? 5 : 2;
    }

    // Recalcular decisiones
    nextDecs.audit_servidores = nextScores.servidores <= 3;
    nextDecs.audit_seguridad = nextScores.responsabilidad <= 3 || nextScores.conformidad <= 3 || nextScores.seguridad_datos <= 3;
    nextDecs.audit_procesos = nextScores.apropiacion_digital <= 3 || nextScores.mesa_ayuda <= 3;

    // Auditorías requeridas automáticas de Datos e IA cuando el promedio sea < 3
    const averageDataGov = (nextScores.roles_datos + nextScores.datos_maestros + nextScores.calidad_datos + nextScores.seguridad_datos) / 4;
    nextDecs.audit_datos = averageDataGov < 3.0;

    const averageAIGov = (nextScores.comite_inventario_ia + nextScores.transparencia_explicabilidad_ia + nextScores.equidad_monitoreo_sesgos + nextScores.supervision_humana_ia) / 4;
    nextDecs.audit_ia = averageAIGov < 3.0;

    nextDecs.b1_ciso = nextScores.responsabilidad >= 3 && nextScores.conformidad >= 3 && nextScores.seguridad_datos >= 3;
    nextDecs.b2_azure = nextScores.servidores >= 3 && nextScores.backups >= 3;
    nextDecs.b3_api = nextScores.interoperabilidad >= 3 || nextScores.datos_maestros >= 3;
    nextDecs.b5_portal = nextScores.canales_donantes >= 3 && nextScores.portal_educativo >= 3;
    nextDecs.b7_datos = nextScores.interoperabilidad >= 4 || nextScores.roles_datos >= 3;
    nextDecs.b8_capacitacion = nextScores.apropiacion_digital >= 3 || nextScores.supervision_humana_ia >= 3;

    // Recalcular madurez de datos
    nextDataGov.dataMaturity = parseFloat(computeDataMaturity(
      nextDataGov.dataQuality,
      nextDataGov.dataCatalogedAssets,
      nextDataGov.dataPrivacyCompliance,
      nextDataGov.dataReqCommittee,
      nextDataGov.dataReqAuditoria1581,
      nextDataGov.dataReqDisenoDRP,
      nextDataGov.dataReqInventarioCriticidad,
      nextDataGov.dataReqPlanIntegracion,
      nextDataGov.dataReqGlosarioNegocio,
      nextDataGov.dataReqControlesDuplicidad,
      nextDataGov.dataReqAuditoriasCalidad
    ));
    nextDataGov.dataMaturityLevel = getMaturityLevelName(nextDataGov.dataMaturity);

    const derived = computeDerivedState(nextDecs, nextScores, nextDataGov.dataMaturity, get().aiGov.aiMaturity);

    set({ 
      dataGov: nextDataGov,
      diagnosticScores: nextScores,
      decisions: nextDecs,
      ...derived
    });
  },

  updateAIGov: (ai: Partial<AIGovernanceState>) => {
    const { aiGov, diagnosticScores, decisions, dataGov } = get();
    const nextAIGov = { ...aiGov, ...ai };
    const nextScores = { ...diagnosticScores };
    const nextDecs = { ...decisions };
    const nextData = { ...dataGov };

    // Direct bi-directional checklist overrides to D1 decisions
    if (ai.aiReqDataQuality !== undefined) {
      nextDecs.b7_datos = ai.aiReqDataQuality;
      if (ai.aiReqDataQuality) {
        nextData.dataQuality = Math.max(nextData.dataQuality, 92);
        nextData.dataCatalogedAssets = Math.max(nextData.dataCatalogedAssets, 95);
        nextScores.interoperabilidad = 5;
        nextScores.roles_datos = 5;
        nextScores.calidad_datos = 5;
      } else {
        nextData.dataQuality = Math.min(nextData.dataQuality, 60);
        nextScores.interoperabilidad = 3;
        nextScores.roles_datos = 2;
        nextScores.calidad_datos = 2;
      }
    }

    if (ai.aiReqCybersecurity !== undefined) {
      nextDecs.b1_ciso = ai.aiReqCybersecurity;
      if (ai.aiReqCybersecurity) {
        nextData.dataPrivacyCompliance = Math.max(nextData.dataPrivacyCompliance, 90);
        nextScores.conformidad = 5;
        nextScores.seguridad_datos = 5;
      } else {
        nextData.dataPrivacyCompliance = Math.min(nextData.dataPrivacyCompliance, 40);
        nextScores.conformidad = 2;
        nextScores.seguridad_datos = 2;
      }
    }

    // Direct synchronization D2 -> D1 sliders y checkboxes
    if (ai.aiExplainability !== undefined) {
      nextScores.apropiacion_digital = Math.max(1, Math.min(5, Math.round(ai.aiExplainability / 20)));
      nextScores.transparencia_explicabilidad_ia = Math.max(1, Math.min(5, Math.round(ai.aiExplainability / 20)));
    }
    if (ai.aiBiasAudit !== undefined) {
      nextScores.responsabilidad = Math.max(1, Math.min(5, Math.round(ai.aiBiasAudit / 20)));
      nextScores.equidad_monitoreo_sesgos = Math.max(1, Math.min(5, Math.round(ai.aiBiasAudit / 20)));
    }
    if (ai.aiDriftStatus !== undefined) {
      nextScores.servidores = ai.aiDriftStatus === 'Normal' ? 5 : ai.aiDriftStatus === 'Alerta' ? 3 : 1;
    }
    if (ai.aiReqHumanOversight !== undefined) {
      nextScores.supervision_humana_ia = ai.aiReqHumanOversight ? 5 : 2;
    }
    if (ai.aiInventoryCount !== undefined) {
      nextScores.comite_inventario_ia = ai.aiInventoryCount;
    }

    // Recalcular decisiones
    nextDecs.audit_servidores = nextScores.servidores <= 3;
    nextDecs.audit_seguridad = nextScores.responsabilidad <= 3 || nextScores.conformidad <= 3 || nextScores.seguridad_datos <= 3;
    nextDecs.audit_procesos = nextScores.apropiacion_digital <= 3 || nextScores.mesa_ayuda <= 3;

    // Auditorías requeridas automáticas de Datos e IA cuando el promedio sea < 3
    const averageDataGov = (nextScores.roles_datos + nextScores.datos_maestros + nextScores.calidad_datos + nextScores.seguridad_datos) / 4;
    nextDecs.audit_datos = averageDataGov < 3.0;

    const averageAIGov = (nextScores.comite_inventario_ia + nextScores.transparencia_explicabilidad_ia + nextScores.equidad_monitoreo_sesgos + nextScores.supervision_humana_ia) / 4;
    nextDecs.audit_ia = averageAIGov < 3.0;

    nextDecs.b1_ciso = nextScores.responsabilidad >= 3 && nextScores.conformidad >= 3 && nextScores.seguridad_datos >= 3;
    nextDecs.b2_azure = nextScores.servidores >= 3 && nextScores.backups >= 3;
    nextDecs.b3_api = nextScores.interoperabilidad >= 3 || nextScores.datos_maestros >= 3;
    nextDecs.b5_portal = nextScores.canales_donantes >= 3 && nextScores.portal_educativo >= 3;
    nextDecs.b7_datos = nextScores.interoperabilidad >= 4 || nextScores.roles_datos >= 3;
    nextDecs.b8_capacitacion = nextScores.apropiacion_digital >= 3 || nextScores.supervision_humana_ia >= 3;

    // Recalcular madurez de datos
    nextData.dataMaturity = parseFloat(computeDataMaturity(
      nextData.dataQuality,
      nextData.dataCatalogedAssets,
      nextData.dataPrivacyCompliance,
      nextData.dataReqCommittee,
      nextData.dataReqAuditoria1581,
      nextData.dataReqDisenoDRP,
      nextData.dataReqInventarioCriticidad,
      nextData.dataReqPlanIntegracion,
      nextData.dataReqGlosarioNegocio,
      nextData.dataReqControlesDuplicidad,
      nextData.dataReqAuditoriasCalidad
    ));
    nextData.dataMaturityLevel = getMaturityLevelName(nextData.dataMaturity);

    // Recalcular madurez de IA
    nextAIGov.aiMaturity = parseFloat(computeAIMaturity(
      nextAIGov.aiExplainability,
      nextAIGov.aiBiasAudit,
      nextAIGov.aiDriftStatus,
      nextAIGov.aiReqRiskManagement,
      nextAIGov.aiReqDataQuality,
      nextAIGov.aiReqTechnicalDoc,
      nextAIGov.aiReqLogging,
      nextAIGov.aiReqTransparency,
      nextAIGov.aiReqHumanOversight,
      nextAIGov.aiReqCybersecurity,
      nextAIGov.aiReqConformity
    ));
    nextAIGov.aiMaturityLevel = getMaturityLevelName(nextAIGov.aiMaturity);

    const derived = computeDerivedState(nextDecs, nextScores, nextData.dataMaturity, nextAIGov.aiMaturity);

    set({ 
      aiGov: nextAIGov,
      dataGov: nextData,
      diagnosticScores: nextScores,
      decisions: nextDecs,
      ...derived
    });
  },

  saveCheckpoint: () => {
    const { decisions, diagnosticScores, dataGov, aiGov, aiResponses, lastAIRequestTime } = get();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_decisions', JSON.stringify(decisions));
      localStorage.setItem('cruz_roja_diagnostic', JSON.stringify(diagnosticScores));
      localStorage.setItem('cruz_roja_datagov', JSON.stringify(dataGov));
      localStorage.setItem('cruz_roja_aigov', JSON.stringify(aiGov));
      localStorage.setItem('cruz_roja_ai_responses', JSON.stringify(aiResponses));
      localStorage.setItem('cruz_roja_last_ai_request_time', String(lastAIRequestTime));
    }
  },

  restoreCheckpoint: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedDecs = localStorage.getItem('cruz_roja_decisions');
      const savedDiag = localStorage.getItem('cruz_roja_diagnostic');
      const savedData = localStorage.getItem('cruz_roja_datagov');
      const savedAI = localStorage.getItem('cruz_roja_aigov');
      const savedAIResponses = localStorage.getItem('cruz_roja_ai_responses');
      const savedLastAIRequestTime = localStorage.getItem('cruz_roja_last_ai_request_time');

      const loadedDecs = savedDecs ? JSON.parse(savedDecs) : defaultDecisions;
      const loadedDiag = savedDiag ? JSON.parse(savedDiag) : defaultDiagnosticScores;
      const loadedData = savedData ? JSON.parse(savedData) : defaultDataGov;
      const loadedAI = savedAI ? JSON.parse(savedAI) : defaultAIGov;
      const loadedAIResponses = savedAIResponses ? JSON.parse(savedAIResponses) : defaultAIResponses;
      const loadedLastAIRequestTime = savedLastAIRequestTime ? Number(savedLastAIRequestTime) : null;

      const { nextData, nextAI } = syncGobernanzaWithDecisions(loadedDecs, loadedData, loadedAI);
      const derived = computeDerivedState(loadedDecs, loadedDiag, nextData.dataMaturity, nextAI.aiMaturity);

      set({
        decisions: loadedDecs,
        diagnosticScores: loadedDiag,
        dataGov: nextData,
        aiGov: nextAI,
        aiResponses: loadedAIResponses,
        lastAIRequestTime: loadedLastAIRequestTime,
        ...derived,
      });
    } catch (e) {
      console.error('Error restoring localStorage checkpoint in Zustand store:', e);
    }
  },

  resetState: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cruz_roja_decisions');
      localStorage.removeItem('cruz_roja_diagnostic');
      localStorage.removeItem('cruz_roja_active_dashboard');
      localStorage.removeItem('cruz_roja_datagov');
      localStorage.removeItem('cruz_roja_aigov');
      localStorage.removeItem('cruz_roja_ai_responses');
      localStorage.removeItem('cruz_roja_last_ai_request_time');
    }

    const derived = computeDerivedState(defaultDecisions, defaultDiagnosticScores, defaultDataGov.dataMaturity, defaultAIGov.aiMaturity);

    set({
      activeDashboard: 'strategic_ti',
      decisions: defaultDecisions,
      diagnosticScores: defaultDiagnosticScores,
      dataGov: defaultDataGov,
      aiGov: defaultAIGov,
      aiResponses: defaultAIResponses,
      lastAIRequestTime: null,
      ...derived,
    });
  },

  triggerToast: (message: string, title = 'Notificación') => {
    set({ toast: { message, title } });
  },

  closeToast: () => set({ toast: null }),

  setAIResponse: (focus: 'general' | 'seguridad' | 'datos' | 'ia', response: string | null) => {
    const nextResponses = { ...get().aiResponses, [focus]: response };
    set({ aiResponses: nextResponses });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_ai_responses', JSON.stringify(nextResponses));
    }
  },

  setLastAIRequestTime: (time: number) => {
    set({ lastAIRequestTime: time });
    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_last_ai_request_time', String(time));
    }
  },
}));


