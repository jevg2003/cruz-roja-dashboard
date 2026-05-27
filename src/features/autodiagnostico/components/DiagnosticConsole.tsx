// src/features/autodiagnostico/components/DiagnosticConsole.tsx
import React from 'react';
import { QuestionsGrid } from './QuestionsGrid';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import type { DiagnosticScoreKey } from '../../diagnostic/types';

export const DiagnosticConsole: React.FC = () => {
  const {
    diagnosticScores,
    updateScore,
    resetState,
    computedMaturity,
    directiveRating,
  } = useDashboard();

  const handleScoreChange = (key: DiagnosticScoreKey, score: number) => {
    updateScore(key, score);
  };

  const handleSaveJson = () => {
    const dataToSave = {
      timestamp: new Date().toISOString(),
      empresa: "Cruz Roja Colombiana - Seccional Valle del Cauca",
      assessment_version: "ISO/IEC 38500 TI - 2026",
      computed_maturity: computedMaturity,
      conformance_status: directiveRating,
      scores: diagnosticScores,
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cruz-roja-diagnostico-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            onClick={resetState}
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
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 w-full bg-slate-950/20 border border-slate-800/60">
        <div>
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block cyber-title flex items-center gap-1.5">
            <i className="fa-solid fa-clipboard-check"></i> Resumen de Evaluación Activa
          </span>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Calificaciones persistidas localmente. Puedes guardar los resultados.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Madurez Promedio</span>
            <span className="text-xs font-black text-slate-200">{computedMaturity} / 5.0</span>
          </div>
          <div className="text-right hidden sm:block border-l border-slate-800 pl-3">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Estado Directiva</span>
            <span className={`text-xs font-black uppercase ${
              directiveRating === 'GOBERNANZA COMPLETA' ? 'text-emerald-400' :
              directiveRating === 'GOBIERNO PARCIAL' ? 'text-amber-400' :
              'text-red-400'
            }`}>{directiveRating}</span>
          </div>
          <button
            onClick={handleSaveJson}
            className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider border border-cyan-500/50 bg-cyan-950/40 hover:bg-cyan-900/50 hover:text-white text-cyan-300 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-md shadow-cyan-950/20"
          >
            <i className="fa-solid fa-floppy-disk"></i> Guardar en JSON
          </button>
        </div>
      </div>
    </div>
  );
};
export default DiagnosticConsole;
