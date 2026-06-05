// src/features/gobernanza/components/GobernanzaView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import DynamicRecommendations from './DynamicRecommendations';
import type { Decisions } from '../../dashboard/types';

export const GobernanzaView: React.FC = () => {
  const {
    decisions,
    totalCost,
    directiveRating,
    directiveStatus,
    updateDecision,
  } = useDashboard();

  const handleCheckboxChange = (key: keyof Decisions) => {
    updateDecision(key, !decisions[key]);
  };

  const getBadgeClass = (active: boolean) => {
    if (active) {
      return "font-mono text-[9.5px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400 bg-emerald-950/40 flex-shrink-0";
    } else {
      return "font-mono text-[9.5px] font-bold px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-900/40 flex-shrink-0";
    }
  };

  const ratingClass =
    directiveStatus === 'success'
      ? 'font-mono font-bold text-emerald-400 bg-emerald-950/45 px-2.5 py-1 rounded border border-emerald-900/60 uppercase tracking-widest text-[10px] block text-center'
      : directiveStatus === 'warning'
      ? 'font-mono font-bold text-amber-400 bg-amber-950/45 px-2.5 py-1 rounded border border-amber-900/60 uppercase tracking-widest text-[10px] block text-center'
      : 'font-mono font-bold text-red-500 bg-red-950/45 px-2.5 py-1 rounded border border-red-900/60 uppercase tracking-widest text-[10px] block text-center';

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Explanatory Box */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-cyan-400 shadow-md w-full relative overflow-hidden bg-slate-900/10">
        <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider cyber-title flex items-center gap-2">
          <i className="fa-solid fa-scale-balanced text-cyan-400 animate-pulse"></i> Directivas y Proyectos de Gobierno TI (ISO 38500)
        </h4>
        <p className="text-sm text-slate-200 mt-2 leading-relaxed">
          Las auditorías, aprobaciones presupuestarias y monitoreo del PETI de la Cruz Roja Valle se configuran de forma <strong>100% automática</strong>. Al modificar las calificaciones del <strong>Autodiagnóstico</strong>, la IA inyecta las directivas y evalúa el cumplimiento en tiempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        {/* Left Sub-column: Directives checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* STEP 1: EVALUAR (Auditorías) */}
            <div className="glass-panel p-5 rounded-2xl border-t-2 border-cyan-400 shadow-lg space-y-4 bg-slate-950/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-cyan-400 uppercase tracking-widest cyber-title block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span> 1. EVALUAR
                </span>
                
                <div className="space-y-4 text-xs mt-4">
                  {/* Question A */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 text-slate-350">
                    <div>
                      <span className="font-bold block text-[13px]">Auditar Servidores</span>
                      <span className="text-[11px] text-slate-400 block leading-normal mt-0.5">Detecta riesgos en el Hemocentro.</span>
                    </div>
                    <span className={getBadgeClass(decisions.audit_servidores)}>
                      {decisions.audit_servidores ? "REQUERIDO" : "NO REQUERIDO"}
                    </span>
                  </div>
                  
                  {/* Question B */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 text-slate-350">
                    <div>
                      <span className="font-bold block text-[13px]">Auditar Ciberseguridad</span>
                      <span className="text-[11px] text-slate-400 block leading-normal mt-0.5">Evidencia fallos y multas de Ley 1581.</span>
                    </div>
                    <span className={getBadgeClass(decisions.audit_seguridad)}>
                      {decisions.audit_seguridad ? "REQUERIDO" : "NO REQUERIDO"}
                    </span>
                  </div>

                  {/* Question C */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 text-slate-350">
                    <div>
                      <span className="font-bold block text-[13px]">Auditar Voluntarios</span>
                      <span className="text-[11px] text-slate-400 block leading-normal mt-0.5">Mide brechas de apropiación digital.</span>
                    </div>
                    <span className={getBadgeClass(decisions.audit_procesos)}>
                      {decisions.audit_procesos ? "REQUERIDO" : "NO REQUERIDO"}
                    </span>
                  </div>

                  {/* Question D */}
                  <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 text-slate-350">
                    <div>
                      <span className="font-bold block text-[13px]">Auditar Gobierno de Datos</span>
                      <span className="text-[11px] text-slate-400 block leading-normal mt-0.5">Requerido si madurez DAMA es &lt; 3.</span>
                    </div>
                    <span className={getBadgeClass(decisions.audit_datos)}>
                      {decisions.audit_datos ? "REQUERIDO" : "NO REQUERIDO"}
                    </span>
                  </div>

                  {/* Question E */}
                  <div className="flex items-center justify-between text-slate-350">
                    <div>
                      <span className="font-bold block text-[13px]">Auditar Gobierno de IA</span>
                      <span className="text-[11px] text-slate-400 block leading-normal mt-0.5">Requerido si madurez de IA es &lt; 3.</span>
                    </div>
                    <span className={getBadgeClass(decisions.audit_ia)}>
                      {decisions.audit_ia ? "REQUERIDO" : "NO REQUERIDO"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: DIRIGIR (Aprobaciones) */}
            <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-red-neon shadow-lg space-y-4 bg-slate-950/20">
              <span className="text-xs font-black text-brand-red-neon uppercase tracking-widest cyber-title block flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-red-neon rounded-full"></span> 2. DIRIGIR (PETI)
              </span>
              
              <div className="space-y-3.5 mt-4">
                {/* Project B1 */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 cursor-pointer" onClick={() => handleCheckboxChange('b1_ciso')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B1: CISO & SOC</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$45M COP | Mitiga ciberriesgos</span>
                  </div>
                  <span className={getBadgeClass(decisions.b1_ciso)}>
                    {decisions.b1_ciso ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>

                {/* Project B2 */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 cursor-pointer" onClick={() => handleCheckboxChange('b2_azure')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B2: Azure Cloud Hybrid</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$80M COP | Resiliencia y Uptime</span>
                  </div>
                  <span className={getBadgeClass(decisions.b2_azure)}>
                    {decisions.b2_azure ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>

                {/* Project B3 */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 cursor-pointer" onClick={() => handleCheckboxChange('b3_api')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B3: API Gateway</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$55M COP | Integra HeVa/Siesa</span>
                  </div>
                  <span className={getBadgeClass(decisions.b3_api)}>
                    {decisions.b3_api ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>

                {/* Project B7 */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 cursor-pointer" onClick={() => handleCheckboxChange('b7_datos')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B7: Gob. Datos</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$12M COP | Catálogo y roles</span>
                  </div>
                  <span className={getBadgeClass(decisions.b7_datos)}>
                    {decisions.b7_datos ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>

                {/* Project B8 */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 cursor-pointer" onClick={() => handleCheckboxChange('b8_capacitacion')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B8: Cap. Teams</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$15M COP | Eleva madurez digital</span>
                  </div>
                  <span className={getBadgeClass(decisions.b8_capacitacion)}>
                    {decisions.b8_capacitacion ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>

                {/* Project B5 */}
                <div className="flex items-center justify-between cursor-pointer" onClick={() => handleCheckboxChange('b5_portal')}>
                  <div>
                    <span className="font-bold text-slate-200 text-xs block">Aprobar B5: Hemocentro 4.0</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">$75M COP | Portal Donación + App</span>
                  </div>
                  <span className={getBadgeClass(decisions.b5_portal)}>
                    {decisions.b5_portal ? "APROBADO" : "PENDIENTE"}
                  </span>
                </div>
              </div>
            </div>

            {/* STEP 3: MONITOREAR */}
            <div className="glass-panel p-5 rounded-2xl border-t-2 border-neon-green shadow-lg space-y-4 bg-slate-950/20 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black text-neon-green uppercase tracking-widest cyber-title block flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-neon-green rounded-full"></span> 3. MONITOREAR
                </span>
                
                <div className="space-y-4 mt-4 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Inversión Ejecutada:</span>
                      <span className="font-mono text-slate-250 font-bold">
                        ${totalCost}M / $330M
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full animate-pulse transition-all ${
                          totalCost > 330 ? 'bg-red-500' : 'bg-neon-green'
                        }`}
                        style={{ width: `${Math.min((totalCost / 330) * 100, 100)}%` }}
                      ></div>
                    </div>
                    {totalCost > 330 && (
                      <div className="text-[10px] font-bold text-red-500 bg-red-950/20 border border-red-900/30 p-2 rounded leading-relaxed animate-pulse">
                        ⚠️ SOBRE-EJECUCIÓN: Excedió el límite presupuestal de $330M.
                      </div>
                    )}
                  </div>

                  <hr className="border-slate-800 my-2" />
                  
                  <div className="space-y-1.5">
                    <span className="text-slate-350 font-bold text-[10px] uppercase tracking-wider block cyber-title">
                      Cumplimiento ISO 38500
                    </span>
                    <span className={ratingClass}>
                      {directiveRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sub-column: Recommendations (Hot Evaluation) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border-t-2 border-cyan-400 shadow-lg flex flex-col justify-between min-h-[360px] bg-slate-950/20">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <i className="fa-solid fa-magnifying-glass-chart text-cyan-400"></i> Diagnóstico en Caliente
              </h4>
              
              <div className="space-y-4 mt-4">
                <DynamicRecommendations />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default GobernanzaView;
