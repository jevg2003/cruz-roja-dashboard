// src/features/autodiagnostico/components/AiResultsPanel.tsx
import React from 'react';
import type { GeminiAiAnalysisResponse } from '../../diagnostic/types';

interface AiResultsPanelProps {
  analysis: GeminiAiAnalysisResponse | null;
  executionId: string;
}

export const AiResultsPanel: React.FC<AiResultsPanelProps> = ({ analysis, executionId }) => {
  if (!analysis) return null;

  const colorMap = {
    red: 'bg-red-950/60 text-red-400 border-red-700',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-700',
    green: 'bg-emerald-950/60 text-emerald-400 border-emerald-700',
  };

  const riskColorClass = colorMap[analysis.color_riesgo] || colorMap.red;

  return (
    <div className="space-y-4 w-full animate-fadeIn">
      {/* AI Header Badge */}
      <div className="glass-panel p-4 rounded-2xl border-l-4 border-brand-red flex items-center justify-between gap-4 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red/10 border border-brand-red/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fa-solid fa-robot text-brand-red text-lg"></i>
          </div>
          <div>
            <span className="text-xs font-black text-slate-100 uppercase tracking-wider cyber-title block">
              Análisis IA Gemini — Resultado en Vivo
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">
              Exec ID: {executionId} • Analizado por Gemini AI
            </span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${riskColorClass}`}>
          {analysis.nivel_riesgo}
        </div>
      </div>

      {/* Resumen Ejecutivo IA */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800/60 bg-slate-950/30 space-y-2">
        <h4 className="text-xs font-black text-brand-red-neon uppercase tracking-wider cyber-title flex items-center gap-1.5">
          <i className="fa-solid fa-brain"></i> Resumen Ejecutivo (Gemini)
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed font-semibold">
          {analysis.resumen_ejecutivo}
        </p>
        <div className="mt-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider block mb-1">
            <i className="fa-solid fa-bolt"></i> Siguiente Paso Urgente (Esta Semana)
          </span>
          <p className="text-xs text-slate-200 font-bold">{analysis.siguiente_paso}</p>
        </div>
      </div>

      {/* Grid: Brechas + Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Brechas Críticas */}
        <div className="glass-panel p-4 rounded-2xl border border-red-900/30 bg-slate-950/30">
          <h4 className="text-xs font-black text-red-400 uppercase tracking-wider cyber-title flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-triangle-exclamation"></i> Brechas Críticas
          </h4>
          <div className="space-y-2.5">
            {analysis.brechas_criticas && analysis.brechas_criticas.length > 0 ? (
              analysis.brechas_criticas.map((b, idx) => (
                <div key={idx} className="bg-red-950/20 border border-red-900/40 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-red-400">{b.dimension}</span>
                    <span className="font-mono text-xs font-black text-red-500 bg-red-950/60 px-2 py-0.5 rounded border border-red-900/40">
                      {b.score}/5
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed">{b.impacto_negocio}</p>
                  <p className="text-[10.5px] text-amber-400 font-bold">⚠️ {b.accion_inmediata}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No se detectaron brechas críticas.</p>
            )}
          </div>
        </div>

        {/* Plan Priorizado */}
        <div className="glass-panel p-4 rounded-2xl border border-cyan-900/30 bg-slate-950/30">
          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-wider cyber-title flex items-center gap-1.5 mb-3 border-b border-slate-800 pb-2">
            <i className="fa-solid fa-list-check"></i> Plan de Inversión Priorizado
          </h4>
          <div className="space-y-2.5">
            {analysis.plan_priorizado && analysis.plan_priorizado.length > 0 ? (
              analysis.plan_priorizado.slice(0, 5).map((p, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-cyan-950/15 border border-cyan-900/30 p-3 rounded-xl">
                  <span className="w-6 h-6 bg-brand-red text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                    {p.prioridad}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-black text-slate-200 block">{p.proyecto}</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[9.5px] font-bold text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40">
                        {p.inversion_estimada}
                      </span>
                      <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
                        {p.plazo}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{p.roi_esperado}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No se definió ningún plan de inversión.</p>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje Junta Directiva */}
      <div className="glass-panel p-4 rounded-2xl bg-slate-950/60 border border-slate-700/40">
        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-2 cyber-title">
          <i className="fa-solid fa-users"></i> Mensaje para la Junta Directiva
        </span>
        <p className="text-sm text-slate-300 leading-relaxed italic font-semibold">
          {analysis.mensaje_junta}
        </p>
      </div>
    </div>
  );
};
