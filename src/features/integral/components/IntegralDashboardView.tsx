// src/features/integral/components/IntegralDashboardView.tsx
import React, { useRef } from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import type { DashboardType } from '../../dashboard/types';

export const IntegralDashboardView: React.FC = () => {
  const {
    digitalMaturityFinal,
    totalCost,
    budgetFinal,
    directiveRating,
    directiveStatus,
    dataGov,
    aiGov,
    updateDataGov,
    updateAIGov,
    setActiveDashboard,
    triggerToast
  } = useDashboard();

  // Referencias para Teledirigir (Scroll suave)
  const refSeccionTI = useRef<HTMLDivElement>(null);
  const refSeccionDatos = useRef<HTMLDivElement>(null);
  const refSeccionIA = useRef<HTMLDivElement>(null);

  const ejecutarTeledireccion = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      triggerToast('Teletransporte completado hacia la sección.', 'Teledirigir ⌖');
    }
  };

  // Calcular la Coherencia Global de Gobernanza
  const overallMaturity = parseFloat(((digitalMaturityFinal + dataGov.dataMaturity + aiGov.aiMaturity) / 3).toFixed(1));

  // Determinar nivel de salud global
  let overallStatus: 'success' | 'warning' | 'danger' = 'warning';
  let overallStatusText = 'Gobernanza Parcial';
  if (overallMaturity >= 4.0) {
    overallStatus = 'success';
    overallStatusText = 'Optimizado e Integrado';
  } else if (overallMaturity < 2.5) {
    overallStatus = 'danger';
    overallStatusText = 'Riesgo Crítico';
  }

  // Generador de Respuestas Conectadas por IA (Personalizado con HeVa, Siesa 8.5, HemoAI, Ley 1581)
  // Particionado de forma estricta según el estado de Drift seleccionado por el usuario.
  const getAIConnectedDirective = () => {
    if (aiGov.aiDriftStatus === 'Crítico') {
      return {
        type: 'error',
        icon: 'fa-solid fa-triangle-exclamation text-red-500 animate-pulse',
        title: 'ALERTA MLOPS CRÍTICA: Drift Crítico y Riesgo en HemoAI Analytics',
        content: `Se detecta una desviación severa en las predicciones de donación de HemoAI Analytics (PSI = 0.24, crítico >= 0.15) en producción. La inconsistencia de datos clínicos del sistema HeVa (Calidad actual en ${dataGov.dataQuality}%) está degradando las decisiones médicas del Hemocentro.\n\nDIRECTIVA DE IA (ISO 42001): Suspender de inmediato el pipeline automatizado MLOps en Azure ML. El custodio técnico debe auditar la consistencia del catálogo en Anjana Data y aplicar reglas anti-duplicidad en el registro único de donantes antes de programar el re-entrenamiento trimestral.`,
        initiatives: [
          { name: 'Pausar Pipeline y Auditoría MLOps', status: 'Requerido Crítico', type: 'danger' },
          { name: 'Saneamiento Integración HeVa - Siesa 8.5', status: 'Requerido en P1', type: 'danger' }
        ]
      };
    }

    if (aiGov.aiDriftStatus === 'Alerta') {
      return {
        type: 'warning',
        icon: 'fa-solid fa-circle-exclamation text-amber-500',
        title: 'ESTADO DE ADVERTENCIA: Monitoreo de Drift en Alerta (HemoAI)',
        content: `Se observa una desviación moderada en el comportamiento del modelo (PSI = 0.12, límite es 0.10) debido a variaciones en la distribución geográfica de donantes en Cali.\n\n• Privacidad Ley 1581: ${dataGov.dataPrivacyCompliance}%.\n• Explicabilidad algorítmica: ${aiGov.aiExplainability}%.\n\nDIRECTIVA DE IA: Programar el re-entrenamiento del modelo predictivo en mlflow usando la línea base demográfica actualizada. El equipo de datos debe documentar la trazabilidad de metadatos en Anjana Data para mitigar la brecha de interpretabilidad en las decisiones de priorización del Hemocentro.`,
        initiatives: [
          { name: 'Re-entrenamiento en mlflow', status: 'En Alerta', type: 'warning' },
          { name: 'Constitución del Comité de Datos DAMA', status: 'En Curso', type: 'info' }
        ]
      };
    }

    // Normal Status (aiGov.aiDriftStatus === 'Normal')
    return {
      type: 'success',
      icon: 'fa-solid fa-circle-check text-emerald-500',
      title: 'EXCELENCIA ESTRATÉGICA: Gobernanza Integrada (DAMA + ISO 42001)',
      content: `¡Sinergia optimizada alcanzada! El modelo predictivo HemoAI Analytics opera en perfectas condiciones bajo la norma ISO 42001, con drift controlado (PSI = 0.04) y una precisión superior al 88.5%.\n\n• Calidad de datosHeVa-Siesa: ${dataGov.dataQuality}% (Excelente).\n• Cumplimiento Habeas Data Ley 1581: ${dataGov.dataPrivacyCompliance}%.\n• Catálogo de activos: ${dataGov.dataCatalogedAssets}%.\n\nDIRECTIVA DE IA (Dirección General): Validado el cumplimiento de la Ley 1581. Se autoriza al equipo de TI a expandir el inventario de IA para diseñar el modelo de deserción del Instituto de Educación ($61M de ingresos).`,
      initiatives: [
        { name: 'Mantener Monitoreo y Supervisión Humana', status: 'Completado / Operativo', type: 'success' }
      ]
    };
  };

  const directive = getAIConnectedDirective();

  // Generador de Sugerencias Dinámicas de IA (Positivas / Por mejorar) basado en los indicadores reales
  const getAISuggestions = () => {
    const positives: string[] = [];
    const improvements: string[] = [];

    // Calidad de datos
    if (dataGov.dataQuality >= 80) {
      positives.push(`✓ Calidad HeVa-Siesa al ${dataGov.dataQuality}%: Registros íntegros, evitando duplicidad.`);
    } else {
      improvements.push(`✗ Calidad de datos crítica (${dataGov.dataQuality}%): Duplicados HeVa-Siesa. Integrar validadores.`);
    }

    // Privacidad
    if (dataGov.dataPrivacyCompliance >= 80) {
      positives.push(`✓ Privacidad robusta (${dataGov.dataPrivacyCompliance}%): Excelente cumplimiento Habeas Data Ley 1581.`);
    } else {
      improvements.push(`✗ Ley 1581 en ${dataGov.dataPrivacyCompliance}%: Cifrar la base de datos clínica HeVa y consentimientos.`);
    }

    // Explicabilidad
    if (aiGov.aiExplainability >= 80) {
      positives.push(`✓ Explicabilidad al ${aiGov.aiExplainability}%: Interpretación médica segura de HemoAI.`);
    } else {
      improvements.push(`✗ Explicabilidad del ${aiGov.aiExplainability}%: HemoAI actúa de forma opaca. Integrar SHAP.`);
    }

    // Sesgos
    if (aiGov.aiBiasAudit >= 80) {
      positives.push(`✓ Equidad algorítmica (${aiGov.aiBiasAudit}%): Cero sesgo demográfico de donantes.`);
    } else {
      improvements.push(`✗ Sesgos al ${aiGov.aiBiasAudit}%: Riesgo ético. Correr auditorías con la librería Fairlearn.`);
    }

    return { positives, improvements };
  };

  const aiSuggestions = getAISuggestions();

  const handleDriftChange = (status: 'Normal' | 'Alerta' | 'Crítico') => {
    updateAIGov({ aiDriftStatus: status });
  };

  // Renderizador de controles de barra interactiva (HTML5 Slider + +/- + Caja Editable)
  const renderValueSelector = (
    currentVal: number,
    updateFn: (val: number) => void,
    isPercentage = true,
    min = 0,
    max = 100,
    accentColor = 'cyan'
  ) => {
    const handleIncrement = () => {
      updateFn(Math.min(max, currentVal + 1));
    };

    const handleDecrement = () => {
      updateFn(Math.max(min, currentVal - 1));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseInt(e.target.value);
      updateFn(isNaN(parsed) ? min : Math.max(min, Math.min(max, parsed)));
    };

    const textColor = accentColor === 'cyan' ? 'text-cyan-600' : 'text-purple-600';
    const ringColor = accentColor === 'cyan' ? 'focus:ring-cyan-400 focus:border-cyan-400' : 'focus:ring-purple-400 focus:border-purple-400';
    const accentClass = accentColor === 'cyan' ? 'accent-cyan-500 hover:accent-cyan-600' : 'accent-purple-500 hover:accent-purple-600';

    return (
      <div className="flex gap-2 items-center my-1.5 w-full max-w-sm">
        {/* Decrement Button */}
        <button
          onClick={handleDecrement}
          type="button"
          className="w-7 h-7 rounded-lg border border-slate-350 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-black text-xs cursor-pointer select-none active:scale-90"
        >
          -
        </button>

        {/* Fully Interactive HTML5 Range Slider (Steps of 1) */}
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={currentVal}
          onChange={(e) => updateFn(Number(e.target.value))}
          className={`flex-1 h-1.5 bg-slate-200 rounded-lg cursor-pointer appearance-none ${accentClass}`}
        />

        {/* Increment Button */}
        <button
          onClick={handleIncrement}
          type="button"
          className="w-7 h-7 rounded-lg border border-slate-350 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-black text-xs cursor-pointer select-none active:scale-90"
        >
          +
        </button>

        {/* Editable Value Box */}
        <div className="flex items-center gap-1 min-w-[65px] justify-end">
          <input
            type="number"
            min={min}
            max={max}
            value={currentVal}
            onChange={handleTextChange}
            className={`
              w-12 bg-white text-slate-800 border border-slate-350 rounded-lg py-0.5 px-1 text-center font-bold text-xs focus:ring-1 focus:outline-none
              ${textColor} ${ringColor}
            `}
          />
          <span className={`text-[10px] font-bold ${textColor}`}>
            {isPercentage ? '%' : 'U'}
          </span>
        </div>
      </div>
    );
  };

  // Helper values for dynamic drift styling
  const driftDetails = 
    aiGov.aiDriftStatus === 'Normal' ? { label: 'Normal / Estable', style: 'bg-emerald-50 border-emerald-250 text-emerald-600 glow-green' } :
    aiGov.aiDriftStatus === 'Alerta' ? { label: 'Alerta / Re-entrenar', style: 'bg-amber-50 border-amber-250 text-amber-600 glow-amber' } :
    { label: 'Crítico / Pausado', style: 'bg-red-50 border-red-250 text-brand-red glow-red animate-pulse' };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* ======================= EXECUTIVE SUMMARY GRID ======================= */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main Gauge Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-l-4 border-slate-900 shadow-md md:col-span-1">
          <h4 className="text-xs text-slate-500 tracking-wider font-bold uppercase cyber-title mb-2 text-center">
            Coherencia de Gobernanza
          </h4>
          <div className="relative flex items-center justify-center w-28 h-28 my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="rgba(15,23,42,0.06)" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={overallStatus === 'success' ? '#10b981' : overallStatus === 'warning' ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={263.8}
                strokeDashoffset={263.8 - (263.8 * overallMaturity) / 5}
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black cyber-value text-slate-900">{overallMaturity}</span>
              <span className="text-[10px] text-slate-400 font-bold font-mono">/ 5.0</span>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-2 uppercase tracking-wider text-center
            ${overallStatus === 'success' ? 'bg-emerald-50 border-emerald-250 text-emerald-600 glow-green' : 
              overallStatus === 'warning' ? 'bg-amber-50 border-amber-250 text-amber-600 glow-amber' : 
              'bg-red-50 border-red-250 text-brand-red glow-red'
            }
          `}>
            {overallStatusText}
          </span>
        </div>

        {/* Breakdown TI */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-brand-red shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider cyber-title">GOBIERNO de TI</span>
              <i className="fa-solid fa-scale-balanced text-brand-red text-sm"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 cyber-value">{digitalMaturityFinal}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Capacidad Crítica y Gobierno TI (ISO 38500)</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-200/50">
            <div
              className="bg-brand-red h-full rounded-full transition-all duration-500"
              style={{ width: `${(digitalMaturityFinal / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Breakdown Datos */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-cyan-500 shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider cyber-title">Gobierno de Datos</span>
              <i className="fa-solid fa-database text-cyan-600 text-sm"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 cyber-value">{dataGov.dataMaturity}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Gobernanza de Contenido (DAMA-DMBOK2)</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-200/50">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(dataGov.dataMaturity / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Breakdown IA */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border-l-4 border-purple-500 shadow-md">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-purple-600 font-bold uppercase tracking-wider cyber-title">Gobierno de IA</span>
              <i className="fa-solid fa-robot text-purple-600 text-sm"></i>
            </div>
            <h3 className="text-2xl font-black text-slate-900 cyber-value">{aiGov.aiMaturity}</h3>
            <p className="text-[10px] text-slate-500 mt-1">Gobernanza Ética y Algoritmos (ISO 42001)</p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-200/50">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(aiGov.aiMaturity / 5) * 100}%` }}
            ></div>
          </div>
        </div>

      </section>

      {/* ======================= TWO-COLUMN MAIN VIEWPORT ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE GOVERNANCES PANEL (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* GOBIERNO DE TI SYNC PANEL */}
          <div ref={refSeccionTI} id="seccion-ti" className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center border border-red-200">
                  <i className="fa-solid fa-scale-balanced text-brand-red text-sm"></i>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider cyber-title">Gobernanza de TI (ISO 38500)</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Infraestructura y Procesos Críticos</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveDashboard('strategic_ti');
                }}
                className="text-[10px] font-bold text-brand-red border border-red-250 bg-red-50 hover:bg-brand-red hover:text-white px-3 py-1.5 rounded-full transition-all cursor-pointer animate-pulse"
              >
                <i className="fa-solid fa-pen-to-square mr-1"></i> Ir a Simulador (D1)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Presupuesto PETI 2026</span>
                <span className="text-base font-extrabold text-slate-800 cyber-value">${totalCost}M / $330M</span>
                <div className="text-[9px] text-slate-500 mt-1 font-semibold">{budgetFinal}% Ejecutado</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Capacidad de TI</span>
                <span className="text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full border block w-fit mt-1 bg-cyan-50 border-cyan-200 text-cyan-600">
                  NIVEL 4 (QUANT)
                </span>
                <div className="text-[9px] text-slate-500 mt-1.5 font-semibold">Métricas Cuantitativas</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Rating Directivo</span>
                <span className={`text-xs font-extrabold uppercase px-2 py-0.5 rounded-full border block w-fit mt-1
                  ${directiveStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                    directiveStatus === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                    'bg-red-50 border-red-200 text-brand-red'
                  }
                `}>
                  {directiveRating}
                </span>
                <div className="text-[9px] text-slate-500 mt-1 font-semibold">Directivas ISO 38500</div>
              </div>
            </div>
          </div>

          {/* 2. INTERACTIVE DATA GOVERNANCE PANEL */}
          <div ref={refSeccionDatos} id="seccion-datos" className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center border border-cyan-200">
                <i className="fa-solid fa-database text-cyan-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider cyber-title">Gobierno de Datos (DAMA-DMBOK2)</h4>
                <p className="text-[10px] text-slate-400">Ajusta los valores al 1% preciso con +/- o arrastra el deslizador en tiempo real.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Slider Calidad de Datos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Calidad de Datos HeVa y Donantes</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Exactitud en registros (Afecta Interoperabilidad en D1)</span>
                </div>
                {renderValueSelector(dataGov.dataQuality, (val) => updateDataGov({ dataQuality: val }), true, 10, 100, 'cyan')}
              </div>

              {/* Slider Catalogo de Datos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Activos Catalogados (Anjana Data)</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Inventario centralizado de metadatos de HeVa y Siesa 8.5</span>
                </div>
                {renderValueSelector(dataGov.dataCatalogedAssets, (val) => updateDataGov({ dataCatalogedAssets: val }), true, 10, 100, 'cyan')}
              </div>

              {/* Slider Privacidad */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Cumplimiento Privacidad (Ley 1581)</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Cifrado de datos sensibles (Afecta Conformidad en D1)</span>
                </div>
                {renderValueSelector(dataGov.dataPrivacyCompliance, (val) => updateDataGov({ dataPrivacyCompliance: val }), true, 10, 100, 'cyan')}
              </div>
            </div>

            {/* DYNAMIC DAMA DATA GOVERNANCE TREND ANALYZER SECTION */}
            <div className="mt-4 pt-4 border-t border-slate-200/60 space-y-3">
              <h5 className="text-[10px] font-bold text-cyan-600 uppercase tracking-widest cyber-title flex items-center gap-1.5">
                <i className="fa-solid fa-arrow-trend-up"></i> Analizador de Impacto de Tendencias de Datos (DAMA)
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Trend Card: Quality */}
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Exactitud de Datos</span>
                    {dataGov.dataQuality > 72 ? (
                      <span className="text-[10px] font-black text-emerald-600 animate-pulse bg-emerald-50 px-1.5 py-0.5 rounded">↑ Aumenta</span>
                    ) : dataGov.dataQuality < 72 ? (
                      <span className="text-[10px] font-black text-red-600 animate-pulse bg-red-50 px-1.5 py-0.5 rounded">↓ Baja</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">→ Estable</span>
                    )}
                  </div>
                  <h6 className="text-[11px] font-bold text-slate-800 font-sans mt-1.5 leading-tight">
                    {dataGov.dataQuality > 72 ? 'Sinergia HeVa - Siesa 8.5' : dataGov.dataQuality < 72 ? 'Duplicados en Facturación' : 'Calidad Operativa Base'}
                  </h6>
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                    {dataGov.dataQuality > 72 ? 'Se mitiga la duplicidad de donantes al 0.5%, reduciendo reprocesos en Cali.' : 
                     dataGov.dataQuality < 72 ? 'Riesgo inminente de descuadre financiero por inconsistencia en el registro.' : 
                     'Línea base institucional de calidad. Capacidad estándar de TI.'}
                  </p>
                </div>

                {/* Trend Card: Catalog */}
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Inventario Anjana</span>
                    {dataGov.dataCatalogedAssets > 60 ? (
                      <span className="text-[10px] font-black text-emerald-600 animate-pulse bg-emerald-50 px-1.5 py-0.5 rounded">↑ Aumenta</span>
                    ) : dataGov.dataCatalogedAssets < 60 ? (
                      <span className="text-[10px] font-black text-red-600 animate-pulse bg-red-50 px-1.5 py-0.5 rounded">↓ Baja</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">→ Estable</span>
                    )}
                  </div>
                  <h6 className="text-[11px] font-bold text-slate-800 font-sans mt-1.5 leading-tight">
                    {dataGov.dataCatalogedAssets > 60 ? 'Trazabilidad y Linaje' : dataGov.dataCatalogedAssets < 60 ? 'Metadatos Fragmentados' : 'Inventario Base'}
                  </h6>
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                    {dataGov.dataCatalogedAssets > 60 ? 'Catálogo centralizado. Linaje de datos al 100% auditable.' : 
                     dataGov.dataCatalogedAssets < 60 ? 'Silos operativos impiden el rastreo rápido de la historia clínica.' : 
                     'Inventario básico de metadatos de TI de la seccional Valle.'}
                  </p>
                </div>

                {/* Trend Card: Privacy */}
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Ley 1581 (SIC)</span>
                    {dataGov.dataPrivacyCompliance > 65 ? (
                      <span className="text-[10px] font-black text-emerald-600 animate-pulse bg-emerald-50 px-1.5 py-0.5 rounded">↑ Aumenta</span>
                    ) : dataGov.dataPrivacyCompliance < 65 ? (
                      <span className="text-[10px] font-black text-red-600 animate-pulse bg-red-50 px-1.5 py-0.5 rounded">↓ Baja</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">→ Estable</span>
                    )}
                  </div>
                  <h6 className="text-[11px] font-bold text-slate-800 font-sans mt-1.5 leading-tight">
                    {dataGov.dataPrivacyCompliance > 65 ? 'Habeas Data Blindado' : dataGov.dataPrivacyCompliance < 65 ? 'Brecha y Sanciones' : 'Conformidad Mínima'}
                  </h6>
                  <p className="text-[9px] text-slate-500 mt-1 leading-normal">
                    {dataGov.dataPrivacyCompliance > 65 ? 'Cifrado de datos sensibles clínico inmutable. Libre de sanciones.' : 
                     dataGov.dataPrivacyCompliance < 65 ? 'Consentimientos incompletos en HeVa. Riesgo de multa SIC de 2000 SMMLV.' : 
                     'Cumplimiento base estándar regulado por historias de salud.'}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* 3. INTERACTIVE AI GOVERNANCE PANEL */}
          <div ref={refSeccionIA} id="seccion-ia" className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center border border-purple-200">
                <i className="fa-solid fa-robot text-purple-600 text-sm"></i>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider cyber-title">Gobernanza de IA (HemoAI Analytics)</h4>
                <p className="text-[10px] text-slate-400">Ajusta los controles éticos, explicabilidad e inventario del modelo predictivo.</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Drift Status (Pill buttons selector) */}
              <div className="space-y-2 border-b border-slate-100/50 pb-3">
                <label className="text-xs font-bold text-slate-700 block">Salud de Algoritmos (Monitoreo de Drift PSI & Degradación)</label>
                <div className="flex gap-2">
                  {(['Normal', 'Alerta', 'Crítico'] as const).map((status) => {
                    const isSelected = aiGov.aiDriftStatus === status;
                    const colorClass = 
                      status === 'Normal' ? (isSelected ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-emerald-50 border-emerald-250 text-emerald-700 hover:bg-emerald-100') :
                      status === 'Alerta' ? (isSelected ? 'bg-amber-500 text-white shadow-amber-500/10' : 'bg-amber-50 border-amber-250 text-amber-700 hover:bg-amber-100') :
                      (isSelected ? 'bg-red-500 text-white shadow-red-500/10' : 'bg-red-50 border-red-250 text-brand-red hover:bg-red-100');
                    return (
                      <button
                        key={status}
                        onClick={() => handleDriftChange(status)}
                        className={`flex-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${colorClass}`}
                      >
                        {status === 'Normal' && <i className="fa-solid fa-circle-check mr-1.5"></i>}
                        {status === 'Alerta' && <i className="fa-solid fa-circle-exclamation mr-1.5"></i>}
                        {status === 'Crítico' && <i className="fa-solid fa-triangle-exclamation mr-1.5"></i>}
                        {status}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[9px] text-slate-400 block">Simula el monitoreo con PSI (Afecta el estado de Servidores en D1)</span>
              </div>

              {/* Slider Explicabilidad */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Explicabilidad SHAP y LIME</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Interpretabilidad de HemoAI (Afecta Apropiación Digital en D1)</span>
                </div>
                {renderValueSelector(aiGov.aiExplainability, (val) => updateAIGov({ aiExplainability: val }), true, 10, 100, 'purple')}
              </div>

              {/* Slider Sesgo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100/50 pb-3">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Equidad y Sesgo (Harvard FAccT)</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Auditorías de sesgo demográfico (Afecta Responsabilidad en D1)</span>
                </div>
                {renderValueSelector(aiGov.aiBiasAudit, (val) => updateAIGov({ aiBiasAudit: val }), true, 10, 100, 'purple')}
              </div>

              {/* Inventario de Modelos */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Inventario de Modelos Activos</label>
                  <span className="text-[9px] text-slate-400 block max-w-sm">Modelos de alta criticidad en ejecución (Afecta Proyectos en D1)</span>
                </div>
                {renderValueSelector(aiGov.aiInventoryCount, (val) => updateAIGov({ aiInventoryCount: val }), false, 0, 5, 'purple')}
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI CONNECTED INSIGHT ENGINE (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI BRAIN TERMINAL */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-900 bg-slate-950/95 text-slate-100 shadow-xl space-y-4 relative overflow-hidden">
            
            {/* Top terminal headers */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-slate-400 font-mono ml-2 tracking-widest uppercase">
                  HemoAI-Insights-Engine v1.0
                </span>
              </div>
              <i className="fa-solid fa-brain text-brand-red animate-pulse text-sm"></i>
            </div>

            {/* Generative Analysis */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                <i className={`${directive.icon} text-lg`}></i>
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-100 font-sans leading-tight">
                  {directive.title}
                </h5>
              </div>
              
              <div className="p-3.5 bg-slate-900/60 border border-slate-900 rounded-xl font-mono text-[10px] leading-relaxed text-slate-300 whitespace-pre-line min-h-[100px]">
                {directive.content}
              </div>
            </div>

            {/* EXCLUSIVE, MUTUALLY EXCLUSIVE DRIFT MONITORING SUBPANELS */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cyber-title">
                  Consola de Monitoreo HemoAI Analytics
                </h5>
                <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded border ${driftDetails.style}`}>
                  {driftDetails.label}
                </span>
              </div>

              {/* Render ONLY the normal state logs */}
              {aiGov.aiDriftStatus === 'Normal' && (
                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 text-emerald-300 rounded-xl text-[9.5px] font-mono leading-normal space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span>SYSTEM STATE: STABLE</span>
                  </div>
                  <p>• PSI (Population Stability Index) = 0.04 (Óptimo, &le; 0.10)</p>
                  <p>• Accuracy Promedio = 88.5% (Objetivo &ge; 85%)</p>
                  <p>• Los flujos en HeVa coinciden con la línea base demográfica de Cali.</p>
                  <p className="text-emerald-400 italic">✓ No se detectan anomalías de desviación en producción.</p>
                </div>
              )}

              {/* Render ONLY the alerta state logs */}
              {aiGov.aiDriftStatus === 'Alerta' && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 text-amber-300 rounded-xl text-[9.5px] font-mono leading-normal space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    <span>SYSTEM STATE: WARNING (DRIFT DETECTED)</span>
                  </div>
                  <p>• PSI (Population Stability Index) = 0.12 (Alerta, límite es 0.10)</p>
                  <p>• Accuracy Promedio = 84.1% (Falla objetivo de 85%)</p>
                  <p>• Variaciones detectadas en la distribución geográfica de Cali.</p>
                  <p className="text-amber-400 italic">⚠ Se aconseja programar un re-entrenamiento trimestral en Azure.</p>
                </div>
              )}

              {/* Render ONLY the critico state logs */}
              {aiGov.aiDriftStatus === 'Crítico' && (
                <div className="p-3 bg-red-950/30 border border-red-900/40 text-red-300 rounded-xl text-[9.5px] font-mono leading-normal space-y-1 animate-pulse">
                  <div className="flex items-center gap-1.5 text-red-500 font-bold">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                    <span>SYSTEM STATE: PIPELINE HALTED (CRITICAL)</span>
                  </div>
                  <p>• PSI (Population Stability Index) = 0.24 (Crítico, &ge; 0.15)</p>
                  <p>• Accuracy Promedio = 78.4% (Crítico por debajo del 85%)</p>
                  <p>• Brecha severa entre el stock del Hemocentro e historias HeVa.</p>
                  <p className="text-red-400 font-bold">⚡ DIRECTIVA: Pausar de inmediato el despliegue automático MLOps.</p>
                </div>
              )}
            </div>

            {/* DYNAMIC DATA GOVERNANCE DAMA SUBPANEL (Reacts directly to Data values) */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cyber-title">
                  Consola de Gobierno de Datos (DAMA-DMBOK2)
                </h5>
                <span className="text-[8px] font-bold text-slate-400 font-mono">DAMA-Valle v1.0</span>
              </div>
              
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[9.5px] font-mono leading-normal space-y-1.5">
                {dataGov.dataQuality >= 80 ? (
                  <p className="text-emerald-400 font-medium">✓ Calidad HeVa-Siesa al ${dataGov.dataQuality}%. Operación con duplicidad al 0.5% en Cali.</p>
                ) : (
                  <p className="text-red-400 font-medium">✗ Silos HeVa-Siesa: Pérdida potencial en facturación por duplicados y datos incongruentes (${dataGov.dataQuality}% de calidad).</p>
                )}

                {dataGov.dataPrivacyCompliance >= 80 ? (
                  <p className="text-emerald-400 font-medium">✓ Privacidad robusta (${dataGov.dataPrivacyCompliance}%). Consentimientos clínicos inmutables conformes a Ley 1581.</p>
                ) : (
                  <p className="text-amber-400 font-medium">⚠ Ley 1581: Consentimientos incompletos en historias HeVa. Riesgo de sanciones regulatorias de la SIC.</p>
                )}
              </div>
            </div>

            {/* DYNAMIC AI SUGGESTIONS SUBPANEL (Fortalezas y Debilidades de la Gobernanza) */}
            <div className="space-y-2.5 border-t border-slate-800 pt-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cyber-title">
                Sugerencias del Asistente de IA (Plan de Acción)
              </h5>
              
              <div className="space-y-2 text-[9.5px] font-mono">
                {/* Fortalezas */}
                {aiSuggestions.positives.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[8.5px] font-bold text-emerald-400 block">✓ FORTALEZAS DE LA GOBERNANZA:</span>
                    <ul className="list-none space-y-1 pl-1 text-slate-300">
                      {aiSuggestions.positives.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-emerald-500">▶</span>
                          <span>{item.replace('✓ ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Debilidades / Oportunidades de Mejora */}
                {aiSuggestions.improvements.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <span className="text-[8.5px] font-bold text-amber-400 block">⚠ PUNTOS CRÍTICOS A SOLUCIONAR:</span>
                    <ul className="list-none space-y-1 pl-1 text-slate-300">
                      {aiSuggestions.improvements.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-amber-500">▶</span>
                          <span>{item.replace('✗ ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Initiatives Impact */}
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest cyber-title">
                Hoja de Ruta DAMA / ISO 42001
              </h5>
              
              <div className="space-y-1.5">
                {directive.initiatives.map((init, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900/40 p-2 rounded-lg border border-slate-900/80">
                    <span className="text-[10px] font-medium text-slate-300">{init.name}</span>
                    <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded-full border uppercase
                      ${init.type === 'danger' ? 'bg-red-950/40 border-red-800 text-red-400' :
                        init.type === 'warning' ? 'bg-amber-950/40 border-amber-800 text-amber-400' :
                        init.type === 'success' ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' :
                        'bg-cyan-950/40 border-cyan-800 text-cyan-400'
                      }
                    `}>
                      {init.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-0 pointer-events-none border border-brand-red/10 rounded-2xl"></div>
          </div>

          {/* ANJANA DATA INSPIRED FLOWMAP */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest cyber-title border-b border-slate-100 pb-2">
              Flujo Tecnológico HemoAI Analytics
            </h5>
            
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-2.5">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Capa Organizativa (Roles)</span>
                <span className="text-[9.5px] font-extrabold text-slate-800">Comité de Gobernanza IA</span>
              </div>

              <div className="flex items-center justify-between gap-1.5 py-1">
                
                {/* Core Catalog */}
                <div className="flex flex-col items-center flex-1 p-2 bg-white border border-slate-200/80 rounded-xl text-center">
                  <i className="fa-solid fa-table-list text-cyan-500 text-xs mb-1"></i>
                  <span className="text-[8px] font-bold text-slate-700">DAMA-DMBOK</span>
                  <span className="text-[7.5px] text-slate-400">HeVa + Siesa 8.5</span>
                </div>

                <div className="text-slate-300 text-xs">
                  <i className="fa-solid fa-angle-right animate-pulse"></i>
                </div>

                {/* MLOps Pipeline */}
                <div className="flex flex-col items-center flex-1 p-2 bg-white border border-slate-200/80 rounded-xl text-center">
                  <i className="fa-solid fa-diagram-project text-purple-500 text-xs mb-1"></i>
                  <span className="text-[8px] font-bold text-slate-700">SGAI (42001)</span>
                  <span className="text-[7.5px] text-slate-400">mlflow / DVC</span>
                </div>

                <div className="text-slate-300 text-xs">
                  <i className="fa-solid fa-angle-right animate-pulse"></i>
                </div>

                {/* Audit & Bias */}
                <div className="flex flex-col items-center flex-1 p-2 bg-white border border-slate-200/80 rounded-xl text-center">
                  <i className="fa-solid fa-circle-nodes text-brand-red text-xs mb-1"></i>
                  <span className="text-[8px] font-bold text-slate-700">Monitoreo PSI</span>
                  <span className={`text-[7.5px] font-semibold uppercase mt-0.5
                    \${aiGov.aiDriftStatus === 'Normal' ? 'text-emerald-500' :
                      aiGov.aiDriftStatus === 'Alerta' ? 'text-amber-500' : 'text-brand-red animate-pulse'
                    }
                  `}>
                    {aiGov.aiDriftStatus}
                  </span>
                </div>

              </div>

              <p className="text-[8.5px] text-slate-400 italic text-center">
                Cumple con el marco NIST AI RMF y la clasificación High-Risk del EU AI Act para salud.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* ======================= HOJA DE RUTA DE GOBERNANZA DAMA ======================= */}
      <section className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Title bar with PDF Roadmap shortcut link */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center border border-cyan-200">
              <i className="fa-solid fa-map-location-dot text-cyan-600 text-sm"></i>
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider cyber-title">Hoja de Ruta de Gobernanza DAMA</h4>
              <p className="text-[10px] text-slate-400">Hitos estratégicos clave para la seccional Valle del Cauca.</p>
            </div>
          </div>
          <a
            href="/datosGobernanza/proyecto_gobernanza_datos_cruz_roja.pdf#page=5"
            target="_blank"
            rel="noreferrer"
            className="text-[9.5px] font-black text-cyan-600 border border-cyan-250 bg-cyan-50 hover:bg-cyan-600 hover:text-white px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-95 flex items-center gap-1"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i>
            <span>Ver Documento DAMA (Pág 5) ↗</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Hito 1: Corto Plazo */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  1. Corto Plazo (Seguridad)
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans">Fundaciones y Privacidad</h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Constitución formal del Comité de Datos DAMA y blindaje de historias clínicas HeVa ante ransomware mediante backups inmutables en Azure.
              </p>
            </div>
            <div className="text-[8.5px] text-slate-400 font-semibold italic border-t border-slate-200/50 pt-2 flex justify-between">
              <span>Ley 1581 (SIC)</span>
              <span>Comité de Datos</span>
            </div>
          </div>

          {/* Hito 2: Mediano Plazo */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  2. Mediano Plazo (Integridad)
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans">Integración HeVa - Siesa 8.5</h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Estructuración del Glosario de Términos de Negocio DAMA y controles automatizados anti-duplicidad en Anjana Data.
              </p>
            </div>
            <div className="text-[8.5px] text-slate-400 font-semibold italic border-t border-slate-200/50 pt-2 flex justify-between">
              <span>HeVa - Siesa 8.5</span>
              <span>Anjana Data</span>
            </div>
          </div>

          {/* Hito 3: Largo Plazo */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  3. Largo Plazo (Analítica)
                </span>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans">HemoAI Analytics Optimizado</h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Auditorías de sesgo con Fairlearn y explicabilidad de decisiones clínicas con SHAP/LIME bajo la norma ISO 42001.
              </p>
            </div>
            <div className="text-[8.5px] text-slate-400 font-semibold italic border-t border-slate-200/50 pt-2 flex justify-between">
              <span>ISO 42001 (SGAI)</span>
              <span>Fairlearn + SHAP</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================= DOCUMENT REFERENCE REPOSITORY (Real files from datosGobernanza) ======================= */}
      <section className="glass-panel p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-250">
            <i className="fa-solid fa-folder-open text-emerald-600 text-sm"></i>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider cyber-title">Repositorio de Modelos de Referencia</h4>
            <p className="text-[10px] text-slate-400">Archivos oficiales indexados de /datosGobernanza. ¡Haz clic en abrir para verlos!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Doc 1: Datos */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-cyan-600 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gobernanza de Datos
                </span>
                <i className="fa-solid fa-file-pdf text-red-500 text-lg"></i>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans leading-snug">
                proyecto_gobernanza_datos_cruz_roja.pdf
              </h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Establece el modelo formal de datos bajo el marco **DAMA-DMBOK2** para mitigar la fragmentación HeVa - Siesa 8.5. Define la estructura del Comité de Datos y los roles de Data Owners y Stewards.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] text-slate-400 font-mono flex justify-between border-t border-slate-200/50 pt-2">
                <span>Marco: DAMA-DMBOK2</span>
                <span>35.5 KB</span>
              </div>
              <a
                href="/datosGobernanza/proyecto_gobernanza_datos_cruz_roja.pdf"
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-[9px] text-center uppercase tracking-wider transition-all block"
              >
                <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i> Abrir Documento
              </a>
            </div>
          </div>

          {/* Doc 2: IA */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gobernanza de IA
                </span>
                <i className="fa-solid fa-file-pdf text-red-500 text-lg"></i>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans leading-snug">
                Gobernanza_IA_HemoAI_CruzRoja_Valle (1).pdf
              </h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Regula el modelo predictivo **HemoAI Analytics** bajo la norma **ISO 42001:2023**. Establece el análisis ético (EU AI Act High-Risk) y las métricas de monitoreo de Drift PSI (objetivo &le; 0.10) y equidad algorítmica.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] text-slate-400 font-mono flex justify-between border-t border-slate-200/50 pt-2">
                <span>Marco: ISO 42001 / FAccT</span>
                <span>390.7 KB</span>
              </div>
              <a
                href="/datosGobernanza/Gobernanza_IA_HemoAI_CruzRoja_Valle (1).pdf"
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[9px] text-center uppercase tracking-wider transition-all block"
              >
                <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i> Abrir Documento
              </a>
            </div>
          </div>

          {/* Doc 3: TI */}
          <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl flex flex-col justify-between h-full space-y-3">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span className="text-[9px] font-bold text-brand-red bg-red-50 border border-red-250 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Evaluación de TI
                </span>
                <i className="fa-solid fa-file-excel text-emerald-600 text-lg"></i>
              </div>
              <h5 className="text-xs font-bold text-slate-800 font-sans leading-snug">
                04 - EIS - IT Governance Self-Assessment.xlsx
              </h5>
              <p className="text-[9.5px] text-slate-500 leading-normal">
                Autodiagnóstico cuantitativo de la capacidad de TI alineado con el estándar **Enterprise Information Services**. Evalúa la madurez de la seccional, concluyendo un estado inicial de **Nivel 4 (Quantitative)**.
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-[8px] text-slate-400 font-mono flex justify-between border-t border-slate-200/50 pt-2">
                <span>Marco: EIS Assessment</span>
                <span>59.5 KB</span>
              </div>
              <a
                href="/datosGobernanza/04 - EIS - IT Governance Self-Assessment.xlsx"
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] text-center uppercase tracking-wider transition-all block"
              >
                <i className="fa-solid fa-arrow-up-right-from-square mr-1"></i> Abrir Documento
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IntegralDashboardView;
