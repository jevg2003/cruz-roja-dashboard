// src/features/aprendizaje/components/AprendizajeView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import RadarKpiChart from './RadarKpiChart';

export const AprendizajeView: React.FC = () => {
  const {
    digitalMaturityFinal,
    computedMaturity,
    personalCertified,
    practicasCobitValue,
    practicasCobitStatusText,
    practicasCobitStatus,
    uptimeFinal,
    digitalTramites,
    iso27001Final,
    csatVal,
    systemIntegration,
    decisions,
  } = useDashboard();

  // Helper for status classes
  const getStatusClasses = (status: 'success' | 'warning' | 'danger') => {
    if (status === 'success') return { text: 'text-emerald-450 text-emerald-450', border: 'border-emerald-500/50', bg: 'bg-emerald-950/60' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' };
    return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/60' };
  };

  const maturityStatus: 'success' | 'warning' | 'danger' =
    digitalMaturityFinal >= 4.0 ? 'success' : digitalMaturityFinal >= 3.0 ? 'warning' : 'danger';
  const maturityClasses = getStatusClasses(maturityStatus);

  const certStatus: 'success' | 'warning' | 'danger' = decisions.b8_capacitacion ? 'success' : 'warning';
  const certClasses = getStatusClasses(certStatus);

  const cobitClasses = getStatusClasses(practicasCobitStatus);

  // Strategic roadmap timeline projects list
  const roadmapProjects = [
    { id: 'B7', name: 'Gobierno de Datos Institucional', cronograma: 'Q1 2026', monto: '$12M', description: 'Políticas, roles, catálogo de datos y modelo formal de gestión.', status: decisions.b7_datos ? 'COMPLETADO' : 'EN ESPERA', colorClass: decisions.b7_datos ? 'bg-emerald-500' : 'bg-slate-600', badgeClass: decisions.b7_datos ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-slate-900/60 border border-slate-800 text-slate-400' },
    { id: 'B1', name: 'Ciberseguridad Humanitaria (SOC + DRP)', cronograma: 'Q2 2026', monto: '$45M', description: 'Centro de Operaciones de Seguridad + autenticación multifactor + DRP semestral.', status: decisions.b1_ciso ? 'COMPLETADO' : 'PRIORIDAD #1', colorClass: decisions.b1_ciso ? 'bg-emerald-500' : 'bg-red-500', badgeClass: decisions.b1_ciso ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-red-950/60 border border-red-500/40 text-red-500' },
    { id: 'B8', name: 'Capacitación Digital del Personal', cronograma: 'Q1 2027', monto: '$15M', description: 'Microaprendizaje con Teams. Elevar madurez de 2.8 a 4.2/5.0.', status: decisions.b8_capacitacion ? 'COMPLETADO' : 'PLANIFICADO', colorClass: decisions.b8_capacitacion ? 'bg-emerald-500' : 'bg-slate-600', badgeClass: decisions.b8_capacitacion ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-slate-900/60 border border-slate-800 text-slate-400' },
    { id: 'B2', name: 'Migración Cloud (Infraestructura Azure)', cronograma: 'Q2 2027', monto: '$80M', description: 'Migración de servidores locales obsoletos a nube híbrida de Azure.', status: decisions.b2_azure ? 'COMPLETADO' : 'PLANIFICADO', colorClass: decisions.b2_azure ? 'bg-emerald-500' : 'bg-slate-600', badgeClass: decisions.b2_azure ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400' : 'bg-slate-900/60 border border-slate-800 text-slate-400' }
  ];

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Learning KPIs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Madurez Digital Card */}
          <div className="glass-panel p-5 rounded-2xl border-t-2 border-red-500 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                  Índice de Madurez Digital
                </span>
                <span className={`border ${maturityClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
                  {digitalMaturityFinal >= 4.0 ? 'Optimizado' : digitalMaturityFinal >= 3.0 ? 'Aceptable' : 'Brecha Crítica'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-3">
                <span className={`cyber-value text-3xl font-black ${maturityClasses.text}`}>
                  {digitalMaturityFinal}
                </span>
                <span className="text-xs text-slate-500">/5.0 actual (Meta 2030: 4.2)</span>
              </div>
              {/* Mini Bar Chart */}
              <div className="mt-4 h-16 flex items-end gap-6 justify-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`${
                      digitalMaturityFinal >= 4.0
                        ? 'bg-emerald-500'
                        : digitalMaturityFinal >= 3.0
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    } w-8 rounded-t transition-all`}
                    style={{ height: `${(digitalMaturityFinal / 5.0) * 56}px` }}
                  ></div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">Actual</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-emerald-500/45 w-8 rounded-t" style={{ height: '47px' }}></div>
                  <span className="text-[9px] text-slate-500 font-mono mt-1 font-bold">Meta (4.2)</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-850">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block cyber-title">
                Acción Prescriptiva:
              </span>
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                {decisions.b8_capacitacion
                  ? '✓ Plan de capacitación en marcha vía Teams. El personal ya reporta mayor confianza tecnológica.'
                  : 'Plan de microaprendizaje con Teams (B8) – capacitar personal de campo en apps institucionales sin salones presenciales.'}
              </p>
            </div>
          </div>

          {/* IT Certifications */}
          <div className="glass-panel p-5 rounded-2xl border-t-2 border-amber-500 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                % Personal TI Certificado
              </span>
              <span className={`border ${certClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
                {decisions.b8_capacitacion ? 'Optimizado' : 'Base'}
              </span>
            </div>
            <span className={`cyber-value text-3xl font-black ${certClasses.text} block mt-2`}>
              {personalCertified}
            </span>
            <p className="text-xs text-slate-400 mt-1">
              Certificaciones básicas: {personalCertified} | ITIL 4 avanzado: {decisions.b8_capacitacion ? '70%' : '20%'}
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${decisions.b8_capacitacion ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}
                style={{ width: personalCertified }}
              ></div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-850">
              <p className="text-xs text-slate-350 leading-relaxed">
                {decisions.b8_capacitacion
                  ? '✓ Personal capacitado en ciberseguridad y herramientas corporativas Microsoft 365 con éxito.'
                  : 'Presupuesto de $15M para ITIL 4 + COBIT en Q1 2027. Aprobar B8 en la consola de dirección.'}
              </p>
            </div>
          </div>

          {/* COBIT / ITIL Implementado */}
          <div className="glass-panel p-5 rounded-2xl border-t-2 border-red-500 shadow-md">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                Prácticas COBIT/ITIL
              </span>
              <span className={`border ${cobitClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
                {practicasCobitStatusText}
              </span>
            </div>
            <span className={`cyber-value text-3xl font-black ${cobitClasses.text} block mt-2`}>
              {practicasCobitValue}
            </span>
            <p className="text-xs text-slate-400 mt-1">Avance de madurez en procesos (Meta: 80%)</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full ${decisions.b8_capacitacion ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
                style={{ width: practicasCobitValue }}
              ></div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-850">
              <p className="text-xs text-slate-350 leading-relaxed">
                {decisions.b8_capacitacion
                  ? '✓ Prácticas COBIT 2019 de gobernanza e ITIL 4 de servicios formalizadas en SharePoint.'
                  : 'Documentar en SharePoint + rutas de carrera TI para retener talento estratégico.'}
              </p>
            </div>
          </div>
        </div>

        {/* Radar chart and Roadmap */}
        <div className="lg:col-span-7 space-y-6">
          {/* Radar Chart Card */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                KPIs Meta 2030 – Estado Actual vs Objetivo
              </h4>
              <p className="text-[10px] text-slate-500 mt-1">
                Comparativa multivariada entre el estado del PETI 2026 y la meta de madurez 2030
              </p>
            </div>
            <div className="h-64 mt-4 flex items-center justify-center relative">
              <RadarKpiChart
                currentUptime={uptimeFinal}
                digitalMaturity={computedMaturity}
                digitalTramites={digitalTramites}
                iso27001={iso27001Final}
                csat={csatVal}
                systemIntegration={systemIntegration}
              />
            </div>
          </div>

          {/* Roadmap timeline */}
          <div className="glass-panel p-5 rounded-2xl w-full">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Línea de Tiempo Estratégica PETI 2026-2030
            </h4>
            <div className="space-y-3.5 mt-4">
              {roadmapProjects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-900/10 border border-transparent hover:border-slate-850/50 transition-all"
                >
                  <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${p.colorClass} flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <h5 className="text-xs font-bold text-slate-100">
                        {p.id} - {p.name}
                      </h5>
                      <span className={`font-mono text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase flex-shrink-0 ${p.badgeClass}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{p.description}</p>
                    <div className="flex gap-4 text-[10px] text-slate-500 font-mono mt-1.5">
                      <span>
                        Cronograma: <strong className="text-slate-350">{p.cronograma}</strong>
                      </span>
                      <span>
                        Inversión: <strong className="text-slate-355">{p.monto}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AprendizajeView;
