// src/features/dashboard/components/DashboardHeader.tsx
import React from 'react';

const getSpanishDate = () => {
  const months = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  const date = new Date();
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const DashboardHeader: React.FC = () => {
  const syncTimeText = "Evaluación TI local: Activo";
  const [currentDateText, setCurrentDateText] = React.useState(getSpanishDate);

  React.useEffect(() => {
    setCurrentDateText(getSpanishDate());
  }, []);

  return (
    <header className="glass-panel rounded-2xl p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-brand-red-neon shadow-lg w-full">
      <div className="flex items-center gap-4">
        {/* Institutional Shield (Red Cross SVG Shield) */}
        <div className="relative w-14 h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-lg shadow-slate-300/40 hover:scale-105 transition-all duration-300 cursor-pointer group">
          <svg className="w-9 h-9 text-brand-red group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z"/>
          </svg>
          <div className="absolute -inset-1 border border-white rounded-xl pointer-events-none shadow-[0_0_10px_rgba(15,23,42,0.03)]"></div>
        </div>
        <div>
          <h1 className="cyber-title text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600">
            Dashboard Estratégico CIO
          </h1>
          <p className="text-xs md:text-sm font-semibold text-brand-red tracking-widest cyber-title mt-0.5">
            CRUZ ROJA COLOMBIA • SECCIONAL VALLE DEL CAUCA • PETI 2026-2030
          </p>
        </div>
      </div>

      {/* Executive Date & Prescriptive Tag */}
      <div className="flex flex-col items-end text-right">
        <div className="flex items-center gap-2 bg-red-50 px-3.5 py-1.5 rounded-full border border-red-200 shadow-sm">
          <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-ping"></span>
          <span 
            className="text-xs font-mono font-bold tracking-widest text-brand-red cyber-title"
            suppressHydrationWarning={true}
          >
            {currentDateText}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-2" id="sync-status">
          {syncTimeText}
        </span>
      </div>
    </header>
  );
};
export default DashboardHeader;
