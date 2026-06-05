import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useDashboardStore } from '../../dashboard/store/useDashboardStore';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Wrap the main exported component inside the QueryClientProvider
export function AIResponseCard() {
  return (
    <QueryClientProvider client={queryClient}>
      <AIResponseCardContent />
    </QueryClientProvider>
  );
}

function AIResponseCardContent() {
  const state = useDashboardStore();
  const [activeFocus, setActiveFocus] = useState<'general' | 'seguridad' | 'datos' | 'ia'>('general');
  const [showContext, setShowContext] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const loadingMessages = [
    'Escaneando métricas de gobierno de TI (ISO 38500)...',
    'Evaluando riesgos de ciberseguridad, DRP y Ley 1581...',
    'Analizando silos e integración HeVa-Q-Symphony-Siesa (DAMA)...',
    'Verificando cumplimiento de HemoAI frente al EU AI Act...',
    'Estructurando informe ejecutivo y recomendaciones...'
  ];

  // Cooldown countdown timer effect
  useEffect(() => {
    if (state.lastAIRequestTime) {
      const updateCooldown = () => {
        const elapsed = Math.floor((Date.now() - state.lastAIRequestTime!) / 1000);
        const remaining = Math.max(0, 30 - elapsed);
        setCooldownRemaining(remaining);
        return remaining;
      };

      const initialRemaining = updateCooldown();
      if (initialRemaining > 0) {
        const interval = setInterval(() => {
          const rem = updateCooldown();
          if (rem <= 0) {
            clearInterval(interval);
          }
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [state.lastAIRequestTime]);

  // Loading indicator status rotator
  const mutation = useMutation({
    mutationFn: async ({ focus, context }: { focus: string; context: any }) => {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focus, context })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al generar la respuesta');
      }
      return data;
    },
    onSuccess: (data, variables) => {
      setModelUsed(data.model);
      state.setAIResponse(variables.focus as any, data.text);
      state.setLastAIRequestTime(Date.now());
      setLocalError(null);
    },
    onError: (err: any) => {
      setLocalError(err.message || 'Error desconocido');
    }
  });

  const loading = mutation.isPending;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = () => {
    if (cooldownRemaining > 0) return;
    
    setLocalError(null);

    mutation.mutate({
      focus: activeFocus,
      context: {
        evaluacionGobernanzaTI: {
          madurezPromedio: state.computedMaturity,
          estadoDirectiva: state.directiveRating,
          calificacionesDetalladas: state.diagnosticScores,
        },
        gobiernoDatos: {
          madurez: state.dataGov.dataMaturity,
          nivelMadurez: state.dataGov.dataMaturityLevel,
          calidadDatos: state.dataGov.dataQuality,
          activosCatalogados: state.dataGov.dataCatalogedAssets,
          cumplimientoPrivacidad: state.dataGov.dataPrivacyCompliance,
        },
        gobiernoIA: {
          madurez: state.aiGov.aiMaturity,
          nivelMadurez: state.aiGov.aiMaturityLevel,
          explicabilidad: state.aiGov.aiExplainability,
          auditoriaSesgos: state.aiGov.aiBiasAudit,
          tasaDeriva: state.aiGov.aiDriftStatus,
          conteoInventarioIA: state.aiGov.aiInventoryCount,
        },
        decisionesAprobadas: state.decisions,
        indicadoresClave: {
          uptimeSistemas: state.uptimeFinal,
          costoTotalProyectos: state.totalCost,
          presupuestoConsumidoPorcentaje: state.budgetFinal,
          cumplimientoIso27001: state.iso27001Final,
          integracionSistemas: state.systemIntegration,
          satisfaccionUsuarioCSAT: state.csatVal,
          confianzaCiudadana: state.confianzaVal,
          tramitesDigitalizados: state.digitalTramites,
        }
      }
    });
  };

  const currentResponse = state.aiResponses ? state.aiResponses[activeFocus] : null;
  const error = localError || (mutation.error ? mutation.error.message : null);

  return (
    <div className="w-full mt-8 rounded-2xl glass-panel relative overflow-hidden transition-all duration-300 shadow-md border-t-4 border-t-brand-red bg-white/95">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>
      
      <div className="p-6 flex flex-col gap-5 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-wand-magic-sparkles text-red-600 animate-pulse"></i>
              Consultor de IA Cruz Roja
            </h3>
            <p className="text-xs font-semibold text-slate-400">Análisis estratégico inteligente y recomendaciones a la medida</p>
          </div>
          {(modelUsed || currentResponse) && (
            <span className="px-3 py-1 bg-red-50 border border-red-200/60 rounded-full text-[11px] text-red-700 font-bold font-mono self-start sm:self-center">
              <i className="fa-solid fa-microchip mr-1"></i> {modelUsed || 'gemini-3.5-flash'}
            </span>
          )}
        </div>

        {/* Focus Selector */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selecciona el Enfoque del Análisis</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setActiveFocus('general')}
              disabled={loading}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                activeFocus === 'general'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/10'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-briefcase"></i> General
            </button>
            <button
              onClick={() => setActiveFocus('seguridad')}
              disabled={loading}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                activeFocus === 'seguridad'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/10'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-shield-halved"></i> Ciberseguridad
            </button>
            <button
              onClick={() => setActiveFocus('datos')}
              disabled={loading}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                activeFocus === 'datos'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/10'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-database"></i> Gobierno Datos
            </button>
            <button
              onClick={() => setActiveFocus('ia')}
              disabled={loading}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 cursor-pointer ${
                activeFocus === 'ia'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/10'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-robot"></i> Gobierno IA
            </button>
          </div>
        </div>

        {/* Collapsible Context Overview */}
        <div className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
          <button
            onClick={() => setShowContext(!showContext)}
            className="w-full px-4 py-3 flex justify-between items-center text-xs font-bold text-slate-600 hover:bg-slate-100/50 transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-circle-info text-slate-400"></i>
              Ver parámetros del autodiagnóstico enviados a la IA
            </span>
            <i className={`fa-solid ${showContext ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
          </button>
          
          {showContext && (
            <div className="p-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Madurez TI</span>
                <span className="text-xs font-black text-slate-700">{state.computedMaturity} / 5.0</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Madurez Datos</span>
                <span className="text-xs font-black text-slate-700">{state.dataGov.dataMaturity} / 5.0</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Madurez IA</span>
                <span className="text-xs font-black text-slate-700">{state.aiGov.aiMaturity} / 5.0</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Presupuesto</span>
                <span className="text-xs font-black text-slate-700">${state.totalCost}M COP ({state.budgetFinal}%)</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Uptime HeVa</span>
                <span className="text-xs font-black text-slate-700">{state.uptimeFinal}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Calidad Datos</span>
                <span className="text-xs font-black text-slate-700">{state.dataGov.dataQuality}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Ley 1581</span>
                <span className="text-xs font-black text-slate-700">{state.dataGov.dataPrivacyCompliance}%</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/50 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Directiva</span>
                <span className="text-xs font-black text-slate-700 truncate">{state.directiveRating}</span>
              </div>
            </div>
          )}
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fadeIn">
            <i className="fa-solid fa-circle-exclamation text-red-600 mt-0.5 flex-shrink-0"></i>
            <div>
              <span className="text-xs font-bold text-red-800 block">Error en la generación</span>
              <p className="text-[11px] text-red-700 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* AI response content */}
        {currentResponse ? (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 overflow-y-auto max-h-[500px] shadow-inner select-text">
            <div className="text-slate-800 text-[13px] leading-relaxed
              [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-slate-700
              [&_h1]:text-xl [&_h1]:font-black [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-slate-900 [&_h1]:border-b [&_h1]:border-slate-200 [&_h1]:pb-1
              [&_h2]:text-base [&_h2]:font-extrabold [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:text-slate-900
              [&_h3]:text-sm [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-1 [&_h3]:text-slate-800
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1.5 [&_li]:text-slate-700
              [&_strong]:text-red-700 [&_strong]:font-bold
              [&_blockquote]:border-l-4 [&_blockquote]:border-red-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:text-slate-600
              [&_table]:w-full [&_table]:my-4 [&_table]:border-collapse [&_th]:border-b-2 [&_th]:border-slate-300 [&_th]:pb-2 [&_th]:text-left [&_th]:font-bold [&_th]:text-slate-800 [&_td]:border-b [&_td]:border-slate-200 [&_td]:py-2 [&_td]:text-slate-700"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentResponse}
              </ReactMarkdown>
            </div>
          </div>
        ) : !loading && (
          <div className="p-8 rounded-xl bg-slate-50 border border-slate-200/40 text-center flex flex-col items-center justify-center gap-2">
            <i className="fa-solid fa-lightbulb text-slate-300 text-3xl"></i>
            <p className="text-xs font-semibold text-slate-400">Aún no hay un informe generado para el enfoque de {activeFocus.toUpperCase()}.</p>
            <p className="text-[11px] text-slate-400">Presiona el botón de abajo para generar recomendaciones con Inteligencia Artificial.</p>
          </div>
        )}

        {/* Dynamic Loading Shimmer Screen */}
        {loading && (
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-spinner fa-spin text-red-600 text-lg"></i>
              <span className="text-xs font-bold text-red-700">{loadingMessages[loadingStep]}</span>
            </div>
            <div className="h-3.5 bg-slate-200 rounded w-3/4"></div>
            <div className="h-3.5 bg-slate-200 rounded w-5/6"></div>
            <div className="h-3.5 bg-slate-200 rounded w-2/3"></div>
            <div className="h-3.5 bg-slate-200 rounded w-4/5"></div>
            <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
          </div>
        )}

        {/* Submit / Trigger Button */}
        <button
          onClick={handleGenerate}
          disabled={loading || cooldownRemaining > 0}
          className="w-full sm:w-auto self-end mt-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/10 hover:shadow-red-600/20 active:shadow-none hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 justify-center cursor-pointer"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin w-4 h-4"></i>
              Generando análisis...
            </>
          ) : cooldownRemaining > 0 ? (
            <>
              <i className="fa-solid fa-hourglass-half w-4 h-4 animate-bounce"></i>
              Cooldown: Esperar {cooldownRemaining}s
            </>
          ) : (
            <>
              <i className="fa-solid fa-paper-plane w-4 h-4"></i>
              Generar Análisis con IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}
