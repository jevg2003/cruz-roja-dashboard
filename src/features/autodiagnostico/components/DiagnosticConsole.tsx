// src/features/autodiagnostico/components/DiagnosticConsole.tsx
import React, { useState } from 'react';
import { QuestionsGrid } from './QuestionsGrid';
import { AiResultsPanel } from './AiResultsPanel';
import { N8nModal } from './N8nModal';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import type { N8nWebhookPayload, DiagnosticScoreKey, GeminiAiAnalysisResponse } from '../../diagnostic/types';

export const DiagnosticConsole: React.FC = () => {
  const {
    diagnosticScores,
    aiAnalysis,
    updateScore,
    resetState,
    computedMaturity,
    directiveRating,
    totalCost,
    setAiResponse,
  } = useDashboard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [n8nExecutionId, setN8nExecutionId] = useState<string>(
    aiAnalysis ? 'EX_COMPLETED' : 'pendiente'
  );

  const handleScoreChange = (key: DiagnosticScoreKey, score: number) => {
    updateScore(key, score);
  };

  const handleReset = () => {
    resetState();
    setN8nExecutionId('pendiente');
  };

  const getPayload = (): N8nWebhookPayload => {
    const recommendedProjects: string[] = [];

    if (diagnosticScores.responsabilidad <= 2 || diagnosticScores.conformidad <= 2) {
      recommendedProjects.push("B1 CISO");
    }
    if (diagnosticScores.servidores <= 2 || diagnosticScores.backups <= 2) {
      recommendedProjects.push("B2 Azure Cloud");
    }
    if (diagnosticScores.interoperabilidad <= 2) {
      recommendedProjects.push("B3 API Gateway");
    }
    if (diagnosticScores.canales_donantes <= 2 || diagnosticScores.portal_educativo <= 2) {
      recommendedProjects.push("B5 Hemocentro 4.0");
    }
    if (diagnosticScores.interoperabilidad <= 2) {
      recommendedProjects.push("B7 Gob. Datos");
    }
    if (diagnosticScores.apropiacion_digital <= 2) {
      recommendedProjects.push("B8 Cap. Teams");
    }

    return {
      timestamp: new Date().toISOString(),
      empresa: "Cruz Roja Colombiana - Seccional Valle del Cauca",
      assessment_version: "ISO/IEC 38500 TI - 2026",
      iso_38500_scores: diagnosticScores,
      computed_maturity: computedMaturity,
      conformance_status: directiveRating === 'GOBERNANZA COMPLETA' ? 'GOBERNANZA COMPLETA' : directiveRating === 'GOBIERNO PARCIAL' ? 'GOBIERNO PARCIAL' : 'RIESGO CRÍTICO',
      recommended_directives_peti: recommendedProjects,
      estimated_investment_required: `$${totalCost}M COP`
    };
  };

  const handleWebhookSuccess = (responseData: GeminiAiAnalysisResponse, execId: string) => {
    setAiResponse(responseData);
    setN8nExecutionId(execId);
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Explanatory Box */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-cyan-400 shadow-md w-full relative overflow-hidden bg-slate-900/10">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-brain text-cyan-400 animate-pulse text-lg"></i>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider cyber-title">Autodiagnóstico de Gobernanza TI</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 bg-slate-800/80 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
          >
            <i className="fa-solid fa-rotate-left"></i> Restablecer
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          Evalúa las 10 dimensiones de la norma <strong>ISO 38500</strong>. Selecciona una calificación del <strong>0 al 5</strong>. Tus respuestas inyectarán de forma automática los proyectos aprobados, auditorías activas y modificarán todas las variables del PETI de inmediato.
        </p>
      </div>

      {/* 10 Questions Grid */}
      <QuestionsGrid scores={diagnosticScores} onScoreChange={handleScoreChange} />

      {/* Action Bar at the bottom */}
      <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block cyber-title">
            <i className="fa-solid fa-robot text-brand-red"></i> Análisis IA Gemini + Envío de Correo Real
          </span>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Gemini evalúa tus 10 respuestas, detecta brechas críticas, genera un plan priorizado y te lo envía por correo.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider border border-brand-red/40 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red shadow-md hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-robot"></i> Evaluar con IA Gemini y Enviar
        </button>
      </div>

      {/* AI Analysis Results Panel */}
      <AiResultsPanel analysis={aiAnalysis} executionId={n8nExecutionId} />

      {/* n8n Webhook Modal */}
      <N8nModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scores={diagnosticScores}
        payload={getPayload()}
        onSuccess={handleWebhookSuccess}
      />
    </div>
  );
};
export default DiagnosticConsole;
