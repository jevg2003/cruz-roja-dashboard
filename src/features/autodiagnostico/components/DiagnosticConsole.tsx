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

  const [activeSubTab, setActiveSubTab] = React.useState<'ti' | 'datos' | 'ia'>('ti');

  const handleScoreChange = (key: DiagnosticScoreKey, score: number) => {
    updateScore(key, score);
  };

  const handleSaveJson = () => {
    const dataToSave = {
      timestamp: new Date().toISOString(),
      empresa: "Cruz Roja Colombiana - Seccional Valle del Cauca",
      assessment_version: "Gobernanza Institucional Integral (TI, Datos, IA) - 2026",
      computed_maturity: computedMaturity,
      conformance_status: directiveRating,
      scores: diagnosticScores,
    };
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cruz-roja-gobernanza-integral-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getExplanatoryText = () => {
    switch (activeSubTab) {
      case 'datos':
        return (
          <>
            Evalúa la madurez en la gestión de datos basándote en el estándar global <strong>DAMA-DMBOK2</strong>. Mide la eliminación de silos, roles de datos, calidad y blindaje regulatorio para proteger la información clínica de donantes en HeVa, Q-Symphony y Siesa.
          </>
        );
      case 'ia':
        return (
          <>
            Evalúa el cumplimiento ético y regulatorio de tus sistemas de IA (HemoAI Analytics) bajo los marcos <strong>ISO 42001, EU AI Act y NIST AI RMF</strong>. Regula riesgos algorítmicos, sesgos demográficos, explicabilidad y supervisión humana clínica obligatoria.
          </>
        );
      case 'ti':
      default:
        return (
          <>
            Evalúa las 13 dimensiones tácticas y ejecutivas del estándar de Gobierno Corporativo de TI <strong>ISO 38500</strong>. Tus respuestas inyectarán de forma automática los proyectos aprobados, auditorías requeridas y modificarán el presupuesto del PETI 2026-2030 de inmediato.
          </>
        );
    }
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Explanatory Box */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-cyan-400 shadow-md w-full relative overflow-hidden bg-slate-900/10">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-brain text-cyan-400 animate-pulse text-lg"></i>
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider cyber-title">Autodiagnóstico Integral de Gobernanza Institucional</h3>
          </div>
          <button
            onClick={resetState}
            className="text-xs font-bold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 bg-slate-800/80 px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1 flex-shrink-0"
          >
            <i className="fa-solid fa-rotate-left"></i> Restablecer Todo
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {getExplanatoryText()}
        </p>
      </div>

      {/* Sub-tabs Navigator */}
      <div className="flex flex-col sm:flex-row gap-2 p-1.5 bg-slate-950/20 border border-slate-800/60 rounded-2xl w-full">
        <button
          onClick={() => setActiveSubTab('ti')}
          type="button"
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 ${
            activeSubTab === 'ti'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
          }`}
        >
          <i className="fa-solid fa-scale-balanced"></i>
          Gobierno de TI (ISO 38500)
        </button>
        <button
          onClick={() => setActiveSubTab('datos')}
          type="button"
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 ${
            activeSubTab === 'datos'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
          }`}
          style={activeSubTab === 'datos' ? { background: 'linear-gradient(to right, #06b6d4, #0891b2)', color: '#ffffff' } : {}}
        >
          <i className="fa-solid fa-database"></i>
          Gobierno de Datos (DAMA-DMBOK2)
        </button>
        <button
          onClick={() => setActiveSubTab('ia')}
          type="button"
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 ${
            activeSubTab === 'ia'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
          }`}
          style={activeSubTab === 'ia' ? { background: 'linear-gradient(to right, #8b5cf6, #7c3aed)', color: '#ffffff' } : {}}
        >
          <i className="fa-solid fa-robot"></i>
          Gobierno de IA (ISO 42001)
        </button>
      </div>

      {/* 21 Questions Grid filtered by sub-tab */}
      <QuestionsGrid scores={diagnosticScores} onScoreChange={handleScoreChange} activeTab={activeSubTab} />

      {/* Action Bar at the bottom */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 w-full bg-slate-950/20 border border-slate-800/60">
        <div>
          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider block cyber-title flex items-center gap-1.5">
            <i className="fa-solid fa-clipboard-check"></i> Resumen de Evaluación Activa
          </span>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Calificaciones persistidas localmente en tu navegador. Puedes exportar los resultados.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Madurez Promedio TI</span>
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
