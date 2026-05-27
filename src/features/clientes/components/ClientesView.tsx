// src/features/clientes/components/ClientesView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';

export const ClientesView: React.FC = () => {
  const {
    incomeFinal,
    uptimeFinal,
    decisions,
    digitalTramites,
    appProgress,
    eduPortalProgress,
    eduStatusText,
    eduStatus,
    iso27001Final,
    csatVal,
    ticketsVal,
    confianzaVal,
    diagnosticScores,
  } = useDashboard();

  // Helper for status classes
  const getStatusClasses = (status: 'success' | 'warning' | 'danger') => {
    if (status === 'success') return { text: 'text-emerald-450 text-emerald-450', border: 'border-emerald-500/50', bg: 'bg-emerald-950/60' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' };
    return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/60' };
  };

  const eduClasses = getStatusClasses(eduStatus);
  const hospStatus: 'success' | 'warning' | 'danger' = iso27001Final >= 90 ? 'success' : iso27001Final >= 70 ? 'warning' : 'danger';
  const hospClasses = getStatusClasses(hospStatus);

  // Dynamic recommendation text
  const getRecommendation = () => {
    if (!decisions.b5_portal) {
      return "📢 **EVALUAR Y DIRIGIR:** El portal educativo de matrículas y la App de donaciones del Hemocentro se encuentran inactivos. Se recomienda coordinar la aprobación del **Proyecto B5 (Hemocentro 4.0)** en la consola de dirección para mitigar la desintermediación del Instituto y modernizar los trámites.";
    } else if (decisions.b5_portal && (!decisions.b2_azure || !decisions.b1_ciso)) {
      return "⚠️ **INCUMPLIMIENTO GRAVE ISO 38500:** El portal y la app móvil de donación se han lanzado al público, pero la infraestructura física está obsoleta (sin servidores en Azure) y se carece de gobernanza de seguridad (sin CISO). **Riesgo crítico de caída de servicio y brecha de datos de pacientes**. Directiva del CIO Valle: suspender de inmediato el portal PSE hasta garantizar infraestructura segura.";
    } else {
      return "✅ **MONITOREAR - ALINEACIÓN TI-NEGOCIO COMPLETA:** Se ha consolidado el lanzamiento seguro de la App Móvil y el portal transaccional PSE del Hemocentro en la nube de Azure y bajo el monitoreo activo del SOC del CISO Valle. Satisfacción del donante al 99.8% certificada por auditoría. La interoperabilidad digital con hospitales funciona exitosamente.";
    }
  };

  // Dimension-specific actions for Hemocentro
  const hemocentroKpis = [
    {
      id: "c1",
      name: "Disponibilidad Servicios",
      value: `${uptimeFinal}%`,
      target: "Meta 99.8%",
      status: uptimeFinal >= 99.5 ? 'success' as const : 'danger' as const,
      action: "Migrar HeVa a Azure para alcanzar el 99.8% y eliminar riesgo de servidor físico obsoleto."
    },
    {
      id: "c2",
      name: "App Móvil Donantes",
      value: appProgress,
      target: "Meta: Lanzar Q4 2028",
      status: decisions.b5_portal && decisions.b2_azure && decisions.b1_ciso ? 'success' as const : 'danger' as const,
      action: "Proyecto Hemocentro 4.0 debe iniciarse en Q2 2027 usando Azure (F2) + datos donantes (F6)."
    },
    {
      id: "c3",
      name: "Trazabilidad Hemocomponentes",
      value: diagnosticScores.interoperabilidad >= 4 ? '95%' : diagnosticScores.interoperabilidad >= 2 ? '72%' : '40%',
      target: "Meta 100%",
      status: diagnosticScores.interoperabilidad >= 4 ? 'success' as const : diagnosticScores.interoperabilidad >= 2 ? 'warning' as const : 'danger' as const,
      action: "API Gateway con estándar HL7/FHIR integra HeVa con hospitales aliados para trazabilidad total."
    },
    {
      id: "c4",
      name: "% Trámites Digitalizados",
      value: `${digitalTramites}%`,
      target: "Meta 90% en 2030",
      status: digitalTramites >= 80 ? 'success' as const : digitalTramites >= 50 ? 'warning' as const : 'danger' as const,
      action: "Portal transaccional PSE + agendamiento online reduce carga manual y mejora experiencia donante."
    }
  ];

  const csatKpis = [
    {
      name: "Satisfacción Usuarios (CSAT)",
      value: `${csatVal} / 10`,
      target: "9.0",
      status: csatVal >= 8.5 ? 'success' as const : csatVal >= 7.0 ? 'warning' as const : 'danger' as const,
      action: "Mesa de ayuda con SLA formal + portal de autoservicio reduce tiempos de respuesta y mejora percepción."
    },
    {
      name: "Tickets Resueltos a Tiempo",
      value: `${ticketsVal}%`,
      target: "90%",
      status: ticketsVal >= 85 ? 'success' as const : ticketsVal >= 75 ? 'warning' as const : 'danger' as const,
      action: "Reforzar capacitaciones de soporte de primer nivel y automatizar las encuestas en n8n."
    },
    {
      name: "Confianza Digital",
      value: `${confianzaVal}%`,
      target: "90%",
      status: confianzaVal >= 85 ? 'success' as const : confianzaVal >= 70 ? 'warning' as const : 'danger' as const,
      action: "SOC + ISO 27001 + comunicación institucional sobre ciberseguridad elevan percepción de confianza."
    }
  ];

  // Helper to format bold text: **text** -> <strong>text</strong>
  const formatText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Hemocentro Main Panel */}
      <div className="glass-panel p-6 rounded-2xl border-l-4 border-brand-red shadow-lg w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="bg-red-950/60 border border-brand-red-neon/30 text-brand-red-neon text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider cyber-title">
              Motor Crítico
            </span>
            <h3 className="text-lg font-black text-white mt-2">
              Hemocentro — Motor Crítico de la Organización
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Mayor generador de ingresos - 60% de los ingresos totales - Servicio 24/7
            </p>
          </div>
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest cyber-title block">
              Ingresos Estimados
            </span>
            <span className="cyber-value text-2xl font-black text-emerald-400">
              ${incomeFinal}M COP
            </span>
          </div>
        </div>

        {/* Hemocentro Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {hemocentroKpis.map((k) => {
            const c = getStatusClasses(k.status);
            return (
              <div
                key={k.id}
                className={`glass-panel p-4 rounded-xl border-l-4 ${
                  k.status === 'success'
                    ? 'border-emerald-500'
                    : k.status === 'warning'
                    ? 'border-amber-500'
                    : 'border-red-500'
                }`}
              >
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {k.name}
                </span>
                <span className={`cyber-value text-2xl font-black ${c.text} block mt-2`}>
                  {k.value}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block mt-1">
                  {k.target}
                </span>
                <p className="text-[11px] text-slate-300 mt-2 leading-relaxed border-t border-slate-850 pt-2 font-semibold">
                  {k.action}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Recommendation Console */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-amber-500 shadow-md">
        <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider cyber-title flex items-center gap-1.5">
          <i className="fa-solid fa-triangle-exclamation"></i> Diagnóstico e Indicaciones para Clientes y Usuarios (ISO 38500)
        </h4>
        <p className="text-xs text-slate-350 mt-2 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-850">
          {formatText(getRecommendation())}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Educational Institute */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-red-500 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                Instituto de Educación
              </span>
              <span className={`border ${eduClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
                {eduStatusText}
              </span>
            </div>
            <div className="flex items-baseline gap-4 mt-3">
              <span className="cyber-value text-2xl font-black text-slate-100">$61M COP</span>
              <div className="text-xs text-slate-400">
                Avance Portal:{' '}
                <span className={`font-bold ${eduStatus === 'success' ? 'text-emerald-450' : 'text-red-500'}`}>
                  {eduPortalProgress}
                </span>
              </div>
            </div>
            <hr className="border-slate-800 my-4" />
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Prescripción de Emergencia:
            </h5>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              SENA y plataformas gratuitas (Coursera, YouTube) son sustitutos directos. El portal educativo con PSE es un Quick Win que debe lanzarse en Q2 2028 para retener estudiantes y abrir nuevos mercados B2B sin requerir infraestructura adicional.
            </p>
          </div>
        </div>

        {/* B2B Hospitals */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-amber-500 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
                Pacientes y Hospitales Aliados (B2B)
              </span>
              <span className={`border ${hospClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
                {iso27001Final >= 90 ? 'Excelente' : iso27001Final >= 70 ? 'En desarrollo' : 'Riesgo alto'}
              </span>
            </div>
            <div className="flex items-baseline gap-4 mt-3">
              <span className={`cyber-value text-2xl font-black ${hospClasses.text}`}>
                {iso27001Final}%
              </span>
              <span className="text-xs text-slate-400">Percepción de Confiabilidad TI (Meta: 85%)</span>
            </div>
            <hr className="border-slate-800 my-4" />
            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Prescripción Estratégica:
            </h5>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              La certificación ISO 27001 (hoy en {iso27001Final}%) es el principal factor que hospitales y EPS evalúan para confiar servicios críticos de hemocomponentes a la Cruz Roja. Elevarla al 90% en 2027 genera ventaja competitiva directa.
            </p>
          </div>
        </div>
      </div>

      {/* User Desk CSAT Panel */}
      <div className="glass-panel p-5 rounded-2xl w-full">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
          KPI de Satisfacción de Usuarios TI
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {csatKpis.map((c, idx) => {
            const classes = getStatusClasses(c.status);
            return (
              <div
                key={idx}
                className="bg-slate-900/35 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {c.name}
                  </span>
                  <span className={`cyber-value text-2xl font-black ${classes.text} block mt-1.5`}>
                    {c.value}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    Meta: {c.target}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-3 leading-relaxed border-t border-slate-850/50 pt-2 font-semibold">
                  {c.action}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ClientesView;
