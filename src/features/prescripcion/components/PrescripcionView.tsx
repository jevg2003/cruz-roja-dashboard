// src/features/prescripcion/components/PrescripcionView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';

export const PrescripcionView: React.FC = () => {
  const {
    digitalMaturityFinal,
    uptimeFinal,
    budgetFinal,
    decisions,
    iso27001Final,
    directiveRating,
  } = useDashboard();

  const average = digitalMaturityFinal;

  // Immediate P1 Actions (90 Days)
  const getImmediateActions = () => {
    const list = [];
    if (!decisions.b1_ciso) {
      list.push({
        title: "Designar CISO Valle y activar SOC Humanitario",
        desc: `Con solo 45% de cumplimiento ISO 27001, un incidente de Ransomware paralizaría el 60% de los ingresos de la seccional ($771M COP). Asignar presupuesto de $45M de forma inmediata.`
      });
    }
    if (!decisions.b2_azure) {
      list.push({
        title: "Migrar HeVa Base de Datos a Azure (DRP Cloud)",
        desc: "Los servidores físicos tienen más de 5 años. Un fallo de disco detendrá la captación de sangre de inmediato. Activar DRP híbrido automatizado en la nube."
      });
    }
    if (!decisions.b7_datos) {
      list.push({
        title: "Establecer Políticas de Gobierno de Datos",
        desc: "Sin un gobierno de datos formal no hay interoperabilidad posible ni cumplimiento de la Ley 1581 (MSPI). Costo de consultoría: $12M."
      });
    }

    if (list.length === 0) {
      return [
        {
          title: "Acciones inmediatas completadas con éxito",
          desc: "Todas las directivas P1 han sido aprobadas e implementadas. El Gobierno de TI está blindado en infraestructura y seguridad."
        }
      ];
    }
    return list;
  };

  // Strategic P2 Actions (2027)
  const getStrategicActions = () => {
    const list = [];
    if (!decisions.b3_api) {
      list.push({
        title: "Implementar API Gateway FHIR/HL7",
        desc: "Siesa, HeVa y Q-Symphony operan aislados, impidiendo la trazabilidad del hemocomponente B2B con clínicas. Integrar mediante API Gateway. Inversión: $55M."
      });
    }
    if (!decisions.b5_portal) {
      list.push({
        title: "Portal transaccional PSE & App Hemocentro 4.0",
        desc: "Evitar la desintermediación del Instituto ($61M) por EdTech gratuitas y capturar mercados corporativos lanzando pasarelas de pago y agendamiento 100% online."
      });
    }
    if (!decisions.b8_capacitacion) {
      list.push({
        title: "Cerrar Brecha Digital en Voluntarios vía Teams",
        desc: "Aprobar plan de microaprendizaje móvil de $15M para entrenar a 300+ voluntarios en apps corporativas y mitigar el phishing, elevando madurez de 2.8 a 4.2."
      });
    }

    if (list.length === 0) {
      return [
        {
          title: "Acciones estratégicas completadas con éxito",
          desc: "El PETI 2026-2030 opera en su nivel óptimo de madurez. Se ha cumplido con la alineación total de procesos de la Cruz Roja Valle."
        }
      ];
    }
    return list;
  };

  // SWOT Dynamic Weaknesses
  const getWeaknesses = () => {
    const list = [];
    if (!decisions.b1_ciso) list.push("Sin CISO designado");
    if (iso27001Final < 70) list.push(`Cumplimiento ISO 27001 bajo (${iso27001Final}%)`);
    if (!decisions.b2_azure) list.push("Servidores locales obsoletos");
    if (!decisions.b3_api) list.push("Islas de datos Siesa ↔ HeVa");
    if (average < 3.5) list.push(`Baja apropiación digital (${average})`);

    if (list.length === 0) {
      return ["¡Sin debilidades críticas activas!"];
    }
    return list;
  };

  const opportunities = [
    "Azure activo en Seccional",
    "Convenio Makaia Nonprofit",
    "Alta demanda en cursos Instituto",
    "Interoperabilidad HL7/FHIR",
    "Alineación Decreto 767 MinTIC"
  ];

  const getSwotDiag = () => {
    if (average < 2.5) {
      return "🚨 **ZONA DE SUPERVIVENCIA CRÍTICA:** Los factores internos se encuentran en un nivel alarmante (madurez " + average + "/5.0). La Cruz Roja Seccional Valle se encuentra expuesta a ciberataques inminentes y caídas físicas que paralizarían el Hemocentro. **La ciberseguridad (CISO/SOC) y la resiliencia Cloud deben ser prioritarias de inmediato.**";
    } else if (average < 4.0) {
      return "⚠️ **ZONA DE GOBERNANZA PARCIAL:** Se ha mejorado la resiliencia y mitigado riesgos críticos. No obstante, las debilidades de integración (matrículas del Instituto y App) limitan la captación de valor del entorno. **Se recomienda completar la interoperabilidad HL7/FHIR y canales transaccionales.**";
    } else {
      return "✅ **EXCELENCIA ESTRATÉGICA:** Posicionamiento sólido en el cuadrante de crecimiento. La Cruz Roja posee una gobernanza al 100% segura, infraestructura escalable y procesos integrales de capacitación, lo que maximiza la eficiencia y la seguridad institucional.";
    }
  };

  const formatText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  const isSuccess = average >= 4.0;
  const isWarning = average >= 2.5 && average < 4.0;

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Explanatory Box */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-cyan-400 shadow-md w-full">
        <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider cyber-title">
          ¿Qué es un Dashboard Prescriptivo? (ISO 38500)
        </h4>
        <p className="text-xs text-slate-350 mt-2 leading-relaxed">
          A diferencia del <strong className="text-white">descriptivo</strong> (¿qué pasó?) y el <strong className="text-white">predictivo</strong> (¿qué pasará?), el <strong className="text-cyan-400">prescriptivo</strong> responde a <strong className="text-cyan-400">¿qué debe hacer el CIO ahora?</strong> Combina los datos de las métricas del BSC con un motor automático de análisis causa-raíz para generar planes de acción concretos, ordenados por prioridad de impacto estratégico (P1 y P2) para cumplir con el Gobierno de TI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Immediate Actions 90 days */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-red-500 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider cyber-title">
                Acciones Inmediatas – Próximos 90 Días
              </h4>
            </div>
            <div className="space-y-4">
              {getImmediateActions().map((act, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className={`w-6 h-6 rounded-full border text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    act.title.includes('completadas')
                      ? 'bg-emerald-500/10 text-emerald-450 border-emerald-950'
                      : 'bg-red-500/10 text-red-500 border-red-950'
                  }`}>
                    {act.title.includes('completadas') ? '✓' : `0${idx + 1}`}
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-200 block">{act.title}</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic Actions 2027 */}
        <div className="glass-panel p-5 rounded-2xl border-l-4 border-amber-500 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider cyber-title">
                Acciones Estratégicas – 2027
              </h4>
            </div>
            <div className="space-y-4">
              {getStrategicActions().map((act, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className={`w-6 h-6 rounded-full border text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    act.title.includes('completadas')
                      ? 'bg-emerald-500/10 text-emerald-450 border-emerald-950'
                      : 'bg-amber-500/10 text-amber-500 border-amber-950'
                  }`}>
                    {act.title.includes('completadas') ? '✓' : `0${idx + 4}`}
                  </span>
                  <div>
                    <span className="text-xs font-black text-slate-200 block">{act.title}</span>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Weighted Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* SWOT Status */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Análisis FODA Ponderado – Posición Actual
            </h4>
            <div className="bg-red-950/30 border border-brand-red-neon/30 p-4 rounded-xl mt-4">
              <div className="flex gap-3">
                <i className="fa-solid fa-triangle-exclamation text-brand-red-neon text-lg mt-0.5"></i>
                <div>
                  <span className="text-xs font-bold text-brand-red-neon uppercase tracking-wider block cyber-title">
                    ⚠️ EVALUACIÓN DE MATRIZ FODA
                  </span>
                  <p className="text-xs text-slate-350 mt-1.5 leading-relaxed">
                    {formatText(getSwotDiag())}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SWOT Matrix Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {/* Weaknesses */}
            <div className="bg-red-950/15 border border-red-900/40 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest cyber-title block">
                Debilidades Críticas
              </span>
              <ul className="text-xs text-slate-350 mt-2 space-y-1">
                {getWeaknesses().map((d, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 rounded-full ${d.includes('¡') ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Opportunities */}
            <div className="bg-emerald-950/15 border border-emerald-900/40 p-4 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest cyber-title block">
                Oportunidades a Capturar
              </span>
              <ul className="text-xs text-slate-350 mt-2 space-y-1">
                {opportunities.map((o, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Executive Indicators Summary */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Indicadores KPI Meta 2030 – Resumen Ejecutivo
            </h4>
            <div className="space-y-4 mt-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-400 font-bold font-mono">ESTADO DE GOBERNANZA:</span>
                <span className={`font-mono text-xs font-black ${
                  isSuccess ? 'text-emerald-450' : isWarning ? 'text-amber-400' : 'text-red-500'
                }`}>
                  {directiveRating}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-400 font-bold font-mono">MADUREZ PROMEDIO:</span>
                <span className="font-mono text-xs font-black text-slate-200">
                  {average.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-400 font-bold font-mono">UPTIME HEMOCENTRO:</span>
                <span className="font-mono text-xs font-black text-slate-200">
                  {uptimeFinal}%
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="text-xs text-slate-400 font-bold font-mono">PRESUPUESTO TI EROGADO:</span>
                <span className="font-mono text-xs font-black text-slate-200">
                  {budgetFinal}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold font-mono">ALERTA SLA DE RANSOMWARE:</span>
                <span className={`font-mono text-xs font-black ${
                  decisions.b1_ciso ? 'text-emerald-450' : 'text-red-500 animate-pulse'
                }`}>
                  {decisions.b1_ciso ? 'DESACTIVADA' : 'ACTIVA EN ALERTA'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PrescripcionView;
