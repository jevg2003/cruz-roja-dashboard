// src/features/dashboard/store/useDashboardStore.ts
import { create } from 'zustand';
import type { TabType, Decisions } from '../types';
import type { DiagnosticScores, GeminiAiAnalysisResponse } from '../../diagnostic/types';

export interface DashboardStoreState {
  // Primary State
  activeTab: TabType;
  decisions: Decisions;
  diagnosticScores: DiagnosticScores;
  aiAnalysis: GeminiAiAnalysisResponse | null;
  toast: { message: string; title: string } | null;

  // Derived/Computed State
  computedMaturity: number;
  digitalMaturityFinal: number;
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
  setActiveTab: (tab: TabType) => void;
  updateScore: (key: keyof DiagnosticScores, score: number) => void;
  updateDecision: (key: keyof Decisions, value: boolean) => void;
  setAiResponse: (response: GeminiAiAnalysisResponse | null) => void;
  resetState: () => void;
  triggerToast: (message: string, title?: string) => void;
  closeToast: () => void;
}

const defaultDecisions: Decisions = {
  audit_servidores: false,
  audit_seguridad: false,
  audit_procesos: false,
  b1_ciso: false,
  b2_azure: false,
  b3_api: false,
  b5_portal: false,
  b7_datos: false,
  b8_capacitacion: false,
};

const defaultDiagnosticScores: DiagnosticScores = {
  responsabilidad: 2,
  conformidad: 2,
  servidores: 2,
  backups: 2,
  interoperabilidad: 2,
  canales_donantes: 2,
  portal_educativo: 2,
  apropiacion_digital: 2,
  mesa_ayuda: 2,
  convenios_makaia: 2,
};

// Calculations Engine
const computeDerivedState = (
  decisions: Decisions,
  diagnosticScores: DiagnosticScores,
  aiAnalysis: GeminiAiAnalysisResponse | null
) => {
  // A. Computed digital maturity from diagnostics
  const scoreKeys = Object.keys(diagnosticScores) as (keyof DiagnosticScores)[];
  const totalScoresSum = scoreKeys.reduce((acc, key) => acc + ((diagnosticScores[key] as number) ?? 2), 0);
  let computedMaturity = parseFloat((totalScoresSum / scoreKeys.length).toFixed(1));

  // B. Budget execution spent calculation
  let totalCost = 60; // vigentes
  if (decisions.b1_ciso) totalCost += 45;
  if (decisions.b2_azure) totalCost += 80;
  if (decisions.b3_api) totalCost += 55;
  if (decisions.b5_portal) totalCost += 75;
  if (decisions.b7_datos) totalCost += 12;
  if (decisions.b8_capacitacion) totalCost += 15;

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
  const totalEvaluations = (decisions.audit_servidores ? 1 : 0) + (decisions.audit_seguridad ? 1 : 0) + (decisions.audit_procesos ? 1 : 0);
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

  // K. AI OVERRIDES APPLY (Gemini AI overrides from webhook)
  let digitalMaturityFinal = computedMaturity;
  let iso27001Final = currentISO;
  let uptimeFinal = currentUptime;
  let budgetFinal = budgetPercent;
  let incomeFinal = finalIncome;

  if (aiAnalysis) {
    if (aiAnalysis.madurez_digital_evaluada !== undefined && aiAnalysis.madurez_digital_evaluada !== null) {
      digitalMaturityFinal = parseFloat(aiAnalysis.madurez_digital_evaluada.toFixed(1));
    }
    if (aiAnalysis.iso_27001_evaluado !== undefined && aiAnalysis.iso_27001_evaluado !== null) {
      iso27001Final = aiAnalysis.iso_27001_evaluado;
    }
    if (aiAnalysis.disponibilidad_hemocentro_evaluado !== undefined && aiAnalysis.disponibilidad_hemocentro_evaluado !== null) {
      uptimeFinal = parseFloat(aiAnalysis.disponibilidad_hemocentro_evaluado.toFixed(2));
    }
    if (aiAnalysis.ejecucion_presupuesto_evaluado !== undefined && aiAnalysis.ejecucion_presupuesto_evaluado !== null) {
      budgetFinal = aiAnalysis.ejecucion_presupuesto_evaluado;
    }
    if (aiAnalysis.ingresos_hemocentro_evaluado !== undefined && aiAnalysis.ingresos_hemocentro_evaluado !== null) {
      const cleanedStr = aiAnalysis.ingresos_hemocentro_evaluado.replace(/[^0-9]/g, '');
      const valNum = parseInt(cleanedStr);
      if (!isNaN(valNum)) incomeFinal = valNum;
    }
  }

  return {
    computedMaturity,
    digitalMaturityFinal,
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

const initialDerived = computeDerivedState(defaultDecisions, defaultDiagnosticScores, null);

export const useDashboardStore = create<DashboardStoreState>((set, get) => ({
  // Primary state
  activeTab: 'autodiagnostico',
  decisions: defaultDecisions,
  diagnosticScores: defaultDiagnosticScores,
  aiAnalysis: null,
  toast: null,

  // Derived state
  ...initialDerived,

  // Actions
  initialize: () => {
    if (typeof window === 'undefined') return;
    try {
      const savedDecs = localStorage.getItem('cruz_roja_decisions');
      const savedDiag = localStorage.getItem('cruz_roja_diagnostic');
      const savedAI = localStorage.getItem('cruz_roja_ai_evaluated_data');

      const loadedDecs = savedDecs ? JSON.parse(savedDecs) : defaultDecisions;
      const loadedDiag = savedDiag ? JSON.parse(savedDiag) : defaultDiagnosticScores;
      const loadedAI = savedAI ? JSON.parse(savedAI) : null;

      const derived = computeDerivedState(loadedDecs, loadedDiag, loadedAI);

      set({
        decisions: loadedDecs,
        diagnosticScores: loadedDiag,
        aiAnalysis: loadedAI,
        ...derived,
      });
    } catch (e) {
      console.error('Error loading localStorage in Zustand store:', e);
    }
  },

  setActiveTab: (tab: TabType) => set({ activeTab: tab }),

  updateScore: (key: keyof DiagnosticScores, score: number) => {
    const { diagnosticScores, decisions, aiAnalysis } = get();
    const nextScores = { ...diagnosticScores, [key]: score };

    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_diagnostic', JSON.stringify(nextScores));
    }

    // Auto-directives checklist updates based on score
    const nextDecs = { ...decisions };
    
    // Evaluar step 1 checklists
    nextDecs.audit_servidores = nextScores.servidores <= 3;
    nextDecs.audit_seguridad = nextScores.responsabilidad <= 3 || nextScores.conformidad <= 3;
    nextDecs.audit_procesos = nextScores.apropiacion_digital <= 3 || nextScores.mesa_ayuda <= 3;

    // Dirigir step 2 project checklists
    nextDecs.b1_ciso = nextScores.responsabilidad >= 3 && nextScores.conformidad >= 3;
    nextDecs.b2_azure = nextScores.servidores >= 3 && nextScores.backups >= 3;
    nextDecs.b3_api = nextScores.interoperabilidad >= 3;
    nextDecs.b5_portal = nextScores.canales_donantes >= 3 && nextScores.portal_educativo >= 3;
    nextDecs.b7_datos = nextScores.interoperabilidad >= 4;
    nextDecs.b8_capacitacion = nextScores.apropiacion_digital >= 3;

    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_decisions', JSON.stringify(nextDecs));
    }

    const derived = computeDerivedState(nextDecs, nextScores, aiAnalysis);

    set({
      diagnosticScores: nextScores,
      decisions: nextDecs,
      ...derived,
    });
  },

  updateDecision: (key: keyof Decisions, value: boolean) => {
    const { decisions, diagnosticScores, aiAnalysis } = get();
    const nextDecs = { ...decisions, [key]: value };

    if (typeof window !== 'undefined') {
      localStorage.setItem('cruz_roja_decisions', JSON.stringify(nextDecs));
    }

    const derived = computeDerivedState(nextDecs, diagnosticScores, aiAnalysis);

    set({
      decisions: nextDecs,
      ...derived,
    });
  },

  setAiResponse: (response: GeminiAiAnalysisResponse | null) => {
    const { decisions, diagnosticScores } = get();

    if (typeof window !== 'undefined') {
      if (response) {
        localStorage.setItem('cruz_roja_ai_evaluated_data', JSON.stringify(response));
      } else {
        localStorage.removeItem('cruz_roja_ai_evaluated_data');
      }
    }

    const derived = computeDerivedState(decisions, diagnosticScores, response);

    set({
      aiAnalysis: response,
      ...derived,
    });
  },

  resetState: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cruz_roja_decisions');
      localStorage.removeItem('cruz_roja_diagnostic');
      localStorage.removeItem('cruz_roja_ai_evaluated_data');
      localStorage.removeItem('n8n_real_mode');
      localStorage.removeItem('n8n_webhook_url');
      localStorage.removeItem('n8n_recipient_email');
    }

    const derived = computeDerivedState(defaultDecisions, defaultDiagnosticScores, null);

    set({
      decisions: defaultDecisions,
      diagnosticScores: defaultDiagnosticScores,
      aiAnalysis: null,
      ...derived,
    });

    get().triggerToast('Diagnóstico, Consola n8n e indicadores de la Cruz Roja restablecidos.', 'Restablecer');
  },

  triggerToast: (message: string, title = 'Notificación') => {
    set({ toast: { message, title } });
  },

  closeToast: () => set({ toast: null }),
}));
