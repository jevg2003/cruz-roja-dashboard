// src/features/bsc-map/components/BscDetails.tsx
import React from 'react';

interface BscObjectiveDetails {
  perspective: string;
  title: string;
  impact: string;
  action: string;
  path: string;
  value: string;
  target: string;
}

interface BscDetailsProps {
  details: BscObjectiveDetails | null;
  onClose: () => void;
}

export const BscDetails: React.FC<BscDetailsProps> = ({ details, onClose }) => {
  if (!details) return null;

  return (
    <div
      id="bsc-details-box"
      className="glass-panel rounded-2xl p-6 border-l-4 border-cyan-500 shadow-2xl relative overflow-hidden transition-all duration-300 w-full animate-fadeIn"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        type="button"
      >
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>
      <div className="relative z-10">
        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest cyber-title block">
          {details.perspective}
        </span>
        <h3 className="text-lg font-black text-white mt-1">
          {details.title}
        </h3>
        <hr className="border-slate-800 my-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest cyber-title">Estado del KPI</h5>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black font-mono text-cyan-400">
                {details.value}
              </span>
              <span className="text-xs text-slate-400">
                {details.target}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2 italic">
              {details.impact}
            </p>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest cyber-title">Prescripción y Acción Inmediata</h5>
            <div className="bg-slate-900/55 border border-slate-800 p-4 rounded-xl mt-2">
              <div className="flex gap-3">
                <i className="fa-solid fa-circle-info text-cyan-400 text-lg mt-0.5"></i>
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  {details.action}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 items-center text-[10px] text-slate-400 uppercase tracking-wider cyber-title">
              <span>Cadena Causal:</span>
              <span className="bg-slate-850 px-2 py-0.5 rounded text-slate-200">
                Cadena: {details.path}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-20 -bottom-20 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};
