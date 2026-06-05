// src/features/procesos/components/ProcesosView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';

export const ProcesosView: React.FC = () => {
  const {
    iso27001Final,
    decisions,
    systemIntegration,
    diagnosticScores,
  } = useDashboard();

  // Helper for status classes
  const getStatusClasses = (status: 'success' | 'warning' | 'danger') => {
    if (status === 'success') return { text: 'text-emerald-450 text-emerald-450', border: 'border-emerald-500/50', bg: 'bg-emerald-950/60' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' };
    return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/60' };
  };

  // KPIs list
  const kpis = [
    {
      name: "Cumplimiento ISO 27001",
      value: `${iso27001Final}%`,
      target: "Meta 2026: 70%",
      status: iso27001Final >= 90 ? 'success' as const : iso27001Final >= 70 ? 'warning' as const : 'danger' as const,
      statusText: iso27001Final >= 90 ? 'Excelente' : iso27001Final >= 70 ? 'Aceptable' : 'Crítico',
      action: "Nombrar CISO, implementar política de escritorio limpio y DRP probado antes de Q2 2026."
    },
    {
      name: "% Cumplimiento RTO/RPO Servicios Críticos",
      value: decisions.b2_azure ? "99.8%" : "40%",
      target: "Meta 90%",
      status: decisions.b2_azure ? 'success' as const : 'danger' as const,
      statusText: decisions.b2_azure ? 'Alineado' : 'Sin DRP',
      action: "Backups inmutables en Azure con retención 90 días. Prueba DRP semestral obligatoria."
    },
    {
      name: "% Integración Sistemas (API Gateway)",
      value: `${systemIntegration}%`,
      target: "Meta 100% en Q4 2027",
      status: systemIntegration >= 100 ? 'success' as const : systemIntegration >= 50 ? 'warning' as const : 'danger' as const,
      statusText: systemIntegration >= 100 ? 'Estable' : systemIntegration >= 20 ? 'Islas' : 'Inexistente',
      action: "Proyecto B3: API Gateway con HL7/FHIR conecta Siesa ↔ HeVa ↔ Q-Symphony. Presupuesto: $55M."
    },
    {
      name: "Cumplimiento SLA Servicios TI",
      value: diagnosticScores.mesa_ayuda >= 4 ? "95%" : diagnosticScores.mesa_ayuda >= 2 ? "75%" : "45%",
      target: "Meta 95%",
      status: diagnosticScores.mesa_ayuda >= 4 ? 'success' as const : diagnosticScores.mesa_ayuda >= 2 ? 'warning' as const : 'danger' as const,
      statusText: diagnosticScores.mesa_ayuda >= 4 ? 'Excelente' : diagnosticScores.mesa_ayuda >= 2 ? 'Parcial' : 'Bajo',
      action: "Mesa de ayuda con catálogo formal de servicios y asignación automática mediante triggers automatizados."
    }
  ];

  // Threat Radar active lists
  const threats = [
    {
      id: "A1",
      name: "Ransomware – Amenaza Crítica",
      weight: "25% importancia",
      description: "Sin CISO ni SOC, un ataque podría paralizar el Hemocentro y el Laboratorio. Sectores salud son el objetivo #1 a nivel global.",
      prescription: "Backups inmutables Azure + SOC + MFA como prioridad absoluta antes de cualquier digitalización nueva. Plazo: Q2 2026.",
      status: "danger",
      mitigated: decisions.b1_ciso
    },
    {
      id: "D2",
      name: "Servidores físicos obsoletos (>5 años)",
      weight: "20% importancia",
      description: "Si falla un servidor local del Hemocentro o del Laboratorio, los servicios críticos de salud se detienen sin tiempo de recuperación definido.",
      prescription: "Migración progresiva Cloud First (Azure híbrido) – Proyecto B2, $80M. Plazo: Q2 2027.",
      status: "danger",
      mitigated: decisions.b2_azure
    },
    {
      id: "A2",
      name: "Sanciones Ley 1581 – Riesgo Legal",
      weight: "15% importancia",
      description: "Datos de pacientes, donantes y estudiantes sin protección adecuada expone a sanciones de la SIC y daño reputacional.",
      prescription: "Completar controles de acceso, enmascaramiento de datos clínicos y auditoría de seguridad. Plazo: Q4 2026.",
      status: "warning",
      mitigated: decisions.audit_seguridad && decisions.b1_ciso && (diagnosticScores.seguridad_datos ?? 2) >= 3
    },
    {
      id: "A5",
      name: "Incumplimiento del AI Act (Regulación de IA)",
      weight: "10% importancia",
      description: "Operar HemoAI Analytics sin supervisión humana, comité ético o registro de riesgos infringe las regulaciones del AI Act (Anexo III).",
      prescription: "Aprobar auditoría de IA, formalizar el Comité de Gobernanza y habilitar protocolo de validación humana. Plazo: Q1 2027.",
      status: "danger",
      mitigated: decisions.audit_ia && decisions.b8_capacitacion && (diagnosticScores.supervision_humana_ia ?? 2) >= 3 && (diagnosticScores.comite_inventario_ia ?? 1) >= 3
    },
    {
      id: "A4",
      name: "Desintermediación EdTech (SENA, Coursera)",
      weight: "15% importancia",
      description: "Sin portal educativo, los ingresos de $61M del Instituto están en riesgo de migrar a plataformas gratuitas.",
      prescription: "Portal educativo con PSE como Quick Win Q2 2028. Diferenciador: certificaciones Cruz Roja con validez internacional.",
      status: "warning",
      mitigated: decisions.b5_portal
    },
    {
      id: "A3",
      name: "Dependencia tecnológica de HeVa y Siesa",
      weight: "15% importancia",
      description: "Alto costo de cambio. Si el proveedor sube precios o descontinúa el producto, la operación queda en riesgo.",
      prescription: "Evaluar OpenMRS como alternativa open-source. API Gateway reduce el lock-in al crear capa neutral.",
      status: "warning",
      mitigated: decisions.b3_api
    },
    {
      id: "D4",
      name: "Sin CISO formal ni modelo de ciberseguridad",
      weight: "10% importancia",
      description: "La ausencia de un responsable de seguridad deja sin gobernanza la protección de datos clínicos y financieros.",
      prescription: "Designar CISO es el primer paso del PETI 2026-2030, antes de cualquier otro proyecto de digitalización.",
      status: "danger",
      mitigated: decisions.b1_ciso
    }
  ];

  const activeThreatsCount = threats.filter(t => !t.mitigated).length;

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Process Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {kpis.map((k, idx) => {
          const c = getStatusClasses(k.status);
          return (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl border-t-2 ${
                k.status === 'success'
                  ? 'border-emerald-500'
                  : k.status === 'warning'
                  ? 'border-amber-500'
                  : 'border-red-500'
              }`}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  {k.name}
                </span>
                <span className={`border ${c.text} border-current text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono`}>
                  {k.statusText}
                </span>
              </div>
              <span className={`cyber-value text-3xl font-black ${c.text} block mt-2.5`}>
                {k.value}
              </span>
              <span className="text-[10px] text-slate-500 font-mono block mt-1">
                Objetivo: {k.target}
              </span>
              <p className="text-[11px] text-slate-300 mt-3 leading-relaxed border-t border-slate-850 pt-2 font-semibold">
                {k.action}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Threat Radar */}
      <div className="glass-panel p-6 rounded-2xl shadow-xl w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Gestión de Riesgos TI – Radar de Amenazas Activas
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Monitorea y mitiga las amenazas de la Seccional aprobando directivas en el panel de Gobernanza
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-red-500 bg-red-950/40 border border-red-900/60 px-3 py-1 rounded-full cyber-title">
            {activeThreatsCount} Amenazas Activas
          </span>
        </div>

        {/* Risk Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {threats.map((t) => {
            const statusColor = t.mitigated
              ? 'text-emerald-450 text-emerald-450'
              : t.status === 'danger'
              ? 'text-red-500'
              : 'text-amber-400';
            const statusBg = t.mitigated
              ? 'bg-emerald-950/15 border-emerald-900/40'
              : t.status === 'danger'
              ? 'bg-red-950/15 border-red-900/40'
              : 'bg-amber-950/15 border-amber-900/40';
            const statusText = t.mitigated
              ? '⚡ Mitigado'
              : t.status === 'danger'
              ? '🚨 Activa'
              : '⚠️ Latente';
            const textStrikethrough = t.mitigated ? 'line-through opacity-60' : '';

            return (
              <div
                key={t.id}
                className={`border p-4.5 rounded-2xl ${statusBg} flex flex-col justify-between shadow-md transition-all`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">
                      {t.id} • {t.weight}
                    </span>
                    <span className={`font-mono text-[9px] font-bold border px-2 py-0.5 rounded uppercase tracking-wider ${statusColor} border-current`}>
                      {statusText}
                    </span>
                  </div>
                  <h5 className={`text-sm font-extrabold mt-2 text-slate-200 ${textStrikethrough}`}>
                    {t.name}
                  </h5>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {t.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/30">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block cyber-title">
                    Acción Recomendada:
                  </span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-semibold">
                    {t.prescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProcesosView;
