// src/features/dashboard/components/MetricStrip.tsx
import React from 'react';
import { useDashboard } from '../context/DashboardContext';

export const MetricStrip: React.FC = () => {
  const {
    digitalMaturityFinal,
    iso27001Final,
    uptimeFinal,
    budgetFinal,
    decisions,
    incomeFinal,
    totalCost,
  } = useDashboard();

  // Helper for severity border classes
  const getStatusClasses = (status: 'success' | 'warning' | 'danger') => {
    if (status === 'success') return { text: 'text-emerald-450', border: 'border-emerald-500/50' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50' };
    return { text: 'text-red-500', border: 'border-red-500/50' };
  };

  // 1. Digital Maturity severity
  const mStatus = digitalMaturityFinal >= 4.0 ? 'success' as const : digitalMaturityFinal >= 3.0 ? 'warning' as const : 'danger' as const;
  const mClasses = getStatusClasses(mStatus);

  // 2. ISO 27001 severity
  const isoStatus = iso27001Final >= 90 ? 'success' as const : iso27001Final >= 70 ? 'warning' as const : 'danger' as const;
  const isoClasses = getStatusClasses(isoStatus);

  // 3. Uptime availability severity
  const uptimeStatus = uptimeFinal >= 99.5 ? 'success' as const : 'danger' as const;
  const uptimeClasses = getStatusClasses(uptimeStatus);

  // 4. Budget execution severity
  const budgetStatus = totalCost > 330 ? 'danger' as const : budgetFinal >= 90 ? 'success' as const : 'warning' as const;
  const budgetClasses = getStatusClasses(budgetStatus);

  // 5. CISO Designated severity
  const cisoStatus = decisions.b1_ciso ? 'success' as const : 'danger' as const;
  const cisoClasses = getStatusClasses(cisoStatus);

  // 6. Hemocentro income severity
  const incomeStatus = incomeFinal >= 750 ? 'success' as const : incomeFinal >= 700 ? 'warning' as const : 'danger' as const;
  const incomeClasses = getStatusClasses(incomeStatus);

  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full animate-fadeIn">
      {/* Madurez Digital */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${mClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Madurez Digital</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${mClasses.text}`}>
            {digitalMaturityFinal.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">/5.0</span>
        </div>
      </div>

      {/* ISO 27001 */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${isoClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Cumpl. ISO 27001</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${isoClasses.text}`}>
            {iso27001Final}%
          </span>
        </div>
      </div>

      {/* Disp. Hemocentro */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${uptimeClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Disp. Hemocentro</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${uptimeClasses.text} ${uptimeStatus === 'success' ? 'animate-pulse' : ''}`}>
            {uptimeFinal}%
          </span>
        </div>
      </div>

      {/* Ejec. Presupuesto */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${budgetClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Ejec. Presupuestal TI</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${budgetClasses.text}`}>
            {budgetFinal}%
          </span>
        </div>
      </div>

      {/* CISO */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${cisoClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">CISO Designado</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${cisoClasses.text}`}>
            {decisions.b1_ciso ? 'SÍ' : 'NO'}
          </span>
        </div>
      </div>

      {/* Ingresos */}
      <div className={`glass-panel p-4.5 rounded-xl border-b-2 ${incomeClasses.border} flex flex-col justify-between`}>
        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Ingresos Hemocentro</span>
        <div className="flex items-baseline gap-1 mt-1.5">
          <span className={`cyber-value text-3xl font-black ${incomeClasses.text}`}>
            ${incomeFinal}M
          </span>
          <span className="text-xs text-slate-500">COP</span>
        </div>
      </div>
    </section>
  );
};
export default MetricStrip;
