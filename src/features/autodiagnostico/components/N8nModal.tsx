// src/features/autodiagnostico/components/N8nModal.tsx
import React, { useState, useEffect } from 'react';
import type { N8nWebhookPayload, DiagnosticScores, GeminiAiAnalysisResponse, EmailPayload } from '../../diagnostic/types';
import { N8nWebhookPayloadSchema, GeminiAiAnalysisResponseSchema, EmailPayloadSchema } from '../../diagnostic/schema';
import { useDashboard } from '../../dashboard/context/DashboardContext';

interface N8nModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: DiagnosticScores;
  payload: N8nWebhookPayload;
  onSuccess: (responseData: GeminiAiAnalysisResponse, executionId: string) => void;
}

type TabType = 'executive' | 'technical';
type StepStatus = 'pending' | 'loading' | 'success' | 'error';

interface Step {
  id: number;
  text: string;
  loadingText: string;
  successText: string;
}

const stepsConfig: Step[] = [
  { id: 1, text: "Conectando al Webhook Real n8n...", loadingText: "Conectando al Webhook Real n8n...", successText: "Conectando al Webhook Real n8n..." },
  { id: 2, text: "Enviando respuestas del Cuestionario de Madurez...", loadingText: "Enviando respuestas del Cuestionario de Madurez...", successText: "Enviando respuestas del Cuestionario de Madurez..." },
  { id: 3, text: "n8n Procesando. Evaluando Gobernanza ISO 38500 con IA Gemini...", loadingText: "n8n Procesando. Evaluando Gobernanza ISO 38500 con IA Gemini...", successText: "n8n Procesando. Evaluando Gobernanza ISO 38500 con IA Gemini..." },
  { id: 4, text: "Retornando JSON de impacto y actualizando el Dashboard...", loadingText: "Retornando JSON de impacto y actualizando el Dashboard...", successText: "Retornando JSON de impacto y actualizando el Dashboard..." }
];

export const N8nModal: React.FC<N8nModalProps> = ({ isOpen, onClose, scores, payload, onSuccess }) => {
  if (!isOpen) return null;

  const { triggerToast } = useDashboard();
  const [activeTab, setActiveTab] = useState<TabType>('executive');
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [responseJson, setResponseJson] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<GeminiAiAnalysisResponse | null>(null);
  
  // Email states
  const [emailInput, setEmailInput] = useState('');
  const [emailStatus, setEmailStatus] = useState<string>('');
  const [emailStatusClass, setEmailStatusClass] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    let active = true;
    
    // Reset states on mount/open
    setIsLoading(true);
    setResponseJson('');
    setAiAnalysis(null);
    setEmailInput('');
    setEmailStatus('');
    setEmailStatusClass('');
    setIsSendingEmail(false);
    setStepStatuses({
      1: 'loading',
      2: 'pending',
      3: 'pending',
      4: 'pending'
    });

    const runSimulation = async () => {
      try {
        // Step 1 delay
        await new Promise((resolve) => setTimeout(resolve, 600));
        if (!active) return;
        setStepStatuses(prev => ({ ...prev, 1: 'success', 2: 'loading' }));

        // Validate Payload request before sending
        N8nWebhookPayloadSchema.parse(payload);

        // Fetch to webhook
        const response = await fetch("https://jevg2003.app.n8n.cloud/webhook/cruz-roja-ia", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!active) return;

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          throw new Error(`HTTP ${response.status}: ${errText.slice(0, 200) || 'Sin cuerpo'}`);
        }

        setStepStatuses(prev => ({ ...prev, 2: 'success', 3: 'loading' }));

        const rawText = await response.text();
        if (!rawText || rawText.trim() === '') {
          throw new Error('n8n respondió con cuerpo vacío. Asegúrate de que el nodo "Responder al Webhook" esté activo.');
        }

        let parsedData: unknown;
        try {
          parsedData = JSON.parse(rawText);
        } catch (e) {
          throw new Error('n8n no devolvió JSON válido: ' + rawText.slice(0, 200));
        }

        // We typecast to extract the core fields, then validate `data` with Zod
        const resultObj = parsedData as { status?: string; n8n_execution_id?: string; data?: unknown };
        
        if (!resultObj.data) {
          throw new Error('El JSON de n8n no contiene la propiedad "data" con el análisis de la IA.');
        }

        // Zod validation of the AI analysis response (Strict schemas, zero anys!)
        const validatedAiResponse = GeminiAiAnalysisResponseSchema.parse(resultObj.data);
        const execId = resultObj.n8n_execution_id || ("EX_" + Math.floor(Math.random() * 900000 + 100000));

        setStepStatuses(prev => ({ ...prev, 3: 'success', 4: 'loading' }));
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (!active) return;
        setStepStatuses(prev => ({ ...prev, 4: 'success' }));
        setIsLoading(false);
        setAiAnalysis(validatedAiResponse);
        setResponseJson(JSON.stringify(parsedData, null, 2));

        // Trigger central callback to sync everything else
        onSuccess(validatedAiResponse, execId);

      } catch (err: unknown) {
        console.error("Simulation error:", err);
        if (!active) return;

        const errorMsg = err instanceof Error ? err.message : String(err);
        
        setStepStatuses(prev => ({
          1: prev[1] === 'success' ? 'success' : 'error',
          2: prev[2] === 'success' ? 'success' : 'error',
          3: prev[3] === 'success' ? 'success' : 'error',
          4: 'error'
        }));

        setIsLoading(false);
        const errPayload = {
          status: "error_connection",
          message: "No se pudo establecer comunicación con tu servidor de n8n.",
          error_details: errorMsg,
          solucion: "Asegúrate de que el flujo de n8n esté publicado y activo antes de lanzar la evaluación."
        };
        setResponseJson(JSON.stringify(errPayload, null, 2));
      }
    };

    runSimulation();

    return () => {
      active = false;
    };
  }, [isOpen, payload, scores, onSuccess]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailVal = emailInput.trim();

    if (!emailVal || !emailVal.includes('@')) {
      setEmailStatus("❌ Correo electrónico no válido");
      setEmailStatusClass("text-[9.5px] font-bold block text-red-600 mt-1 text-center");
      triggerToast("Por favor ingresa un correo electrónico válido.", "Correo Inválido");
      return;
    }

    if (!aiAnalysis) {
      setEmailStatus("❌ Por favor primero espera a que finalice el análisis de la IA.");
      setEmailStatusClass("text-[9.5px] font-bold block text-red-600 mt-1 text-center");
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus("Enviando reporte a n8n...");
    setEmailStatusClass("text-[9.5px] font-bold block text-cyan-600 mt-1 text-center animate-pulse");

    try {
      const emailPayload: EmailPayload = {
        action: "send_email",
        email: emailVal,
        aiAnalysis: aiAnalysis,
        computed_maturity: payload.computed_maturity,
        conformance_status: payload.conformance_status,
        iso_38500_scores: scores
      };

      // Zod validation of EmailPayload
      EmailPayloadSchema.parse(emailPayload);

      const response = await fetch("https://jevg2003.app.n8n.cloud/webhook/cruz-roja-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload)
      });

      if (!response.ok) {
        const errTxt = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${errTxt}`);
      }

      setEmailStatus("✓ ¡Reporte enviado con éxito!");
      setEmailStatusClass("text-[9.5px] font-bold block text-emerald-600 mt-1 text-center");
      triggerToast("¡Reporte enviado exitosamente a tu correo!", "Correo Enviado");

    } catch (err: unknown) {
      console.error("Error al enviar email:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setEmailStatus(`❌ Error de envío: ${errMsg.slice(0, 50)}`);
      setEmailStatusClass("text-[9.5px] font-bold block text-red-600 mt-1 text-center");
      triggerToast("No se pudo enviar el correo. Revisa el estado de n8n.", "Error de Envío");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const isCompleted = stepStatuses[4] === 'success';
  const hasError = Object.values(stepStatuses).includes('error');

  return (
    <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-4xl rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl relative bg-slate-950">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer z-20">
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Header */}
        <div className="bg-cyan-950/30 border-b border-slate-900 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/40 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-network-wired text-cyan-400 animate-pulse text-lg"></i>
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest cyber-title">n8n Live Webhook Simulator</h3>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Enrutando Diagnóstico ISO 38500 al API Gateway local</p>
            </div>
          </div>
          
          {/* Tab Toggle */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 mr-8 shadow-inner">
            <button
              onClick={() => setActiveTab('executive')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'executive'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-gauge-high"></i> Resumen Ejecutivo
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 ${
                activeTab === 'technical'
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <i className="fa-solid fa-code"></i> Código (JSON)
            </button>
          </div>
        </div>

        {/* Body Container */}
        <div className="relative bg-slate-950 min-h-[460px] flex flex-col justify-between">

          {/* 1. EXECUTIVE VIEW */}
          {activeTab === 'executive' && (
            <div className="p-6 space-y-6 flex flex-col justify-between h-[460px] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Left side: Simulation Status Steps */}
                <div className="space-y-4">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block cyber-title flex items-center gap-1.5">
                    {isLoading ? (
                      <i className="fa-solid fa-circle-notch animate-spin text-[10px]"></i>
                    ) : isCompleted ? (
                      <i className="fa-solid fa-circle-check text-emerald-400 text-[10px]"></i>
                    ) : (
                      <i className="fa-solid fa-triangle-exclamation text-red-500 text-[10px]"></i>
                    )}
                    Estado del Envío n8n
                  </span>
                  
                  <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-5 space-y-3">
                    {stepsConfig.map((s) => {
                      const status = stepStatuses[s.id];
                      let itemClass = "flex items-center gap-3 text-xs text-slate-500 font-bold py-1";
                      let iconClass = "fa-regular fa-circle text-[10px]";
                      let text = s.text;

                      if (status === 'loading') {
                        itemClass = "flex items-center gap-3 text-xs text-cyan-400 font-bold py-1 animate-pulse";
                        iconClass = "fa-solid fa-spinner animate-spin text-[10px]";
                        text = s.loadingText;
                      } else if (status === 'success') {
                        itemClass = "flex items-center gap-3 text-xs text-emerald-400 font-bold py-1";
                        iconClass = "fa-solid fa-circle-check text-[10px]";
                        text = s.successText;
                      } else if (status === 'error') {
                        itemClass = "flex items-center gap-3 text-xs text-red-500 font-bold py-1";
                        iconClass = "fa-solid fa-triangle-exclamation text-[10px]";
                        text = s.id === 2 ? "Error al transferir respuestas" : s.id === 3 ? "n8n inaccesible o bloqueado" : "Error en proceso";
                      }

                      return (
                        <div key={s.id} className={itemClass}>
                          <i className={`n8n-exec-icon ${iconClass}`}></i>
                          <span>{text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Right side: Visual progress */}
                <div className="flex flex-col items-center justify-center bg-slate-900/20 border border-slate-850/60 p-6 rounded-2xl shadow-inner text-center">
                  {isLoading && !hasError && (
                    <div className="flex flex-col items-center py-4">
                      <i className="fa-solid fa-spinner animate-spin text-cyan-400 text-4xl"></i>
                      <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest cyber-title mt-4 animate-pulse">
                        Automatización n8n en marcha...
                      </span>
                    </div>
                  )}

                  {hasError && (
                    <div className="flex flex-col items-center space-y-3 py-4">
                      <div className="w-16 h-16 bg-red-500/10 border border-red-500/40 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20 animate-bounce">
                        <i className="fa-solid fa-triangle-exclamation text-red-400 text-3xl"></i>
                      </div>
                      <span className="text-base font-black text-red-500 uppercase tracking-wider block cyber-title">
                        ¡Error de Comunicación!
                      </span>
                      <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-semibold">
                        No se pudo establecer comunicación con el webhook de n8n Cloud. Revisa el flujo e inténtalo de nuevo.
                      </p>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="hidden flex flex-col items-center space-y-3" style={{ display: 'flex' }}>
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 animate-bounce">
                        <i className="fa-solid fa-check text-emerald-400 text-3xl"></i>
                      </div>
                      <span className="text-base font-black text-emerald-400 uppercase tracking-wider block cyber-title">
                        ¡Diagnóstico Procesado!
                      </span>
                      <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-semibold">
                        El flujo de automatización en n8n finalizó exitosamente. El reporte ejecutivo PDF ha sido depositado en el almacenamiento del CIO.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Executive Summary Section */}
              {isCompleted && aiAnalysis && (
                <div className="bg-slate-950/45 border border-slate-850/80 p-5 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
                    <div className="py-2 md:py-0">
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Madurez Digital Calculada</span>
                      <span className="text-3xl font-black text-red-500 font-mono block mt-1">
                        {aiAnalysis.madurez_digital_evaluada}
                      </span>
                      <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase mt-1 ${
                        aiAnalysis.madurez_digital_evaluada >= 4.0 
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' 
                          : aiAnalysis.madurez_digital_evaluada >= 2.5 
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40' 
                          : 'bg-red-950/60 text-red-400 border border-red-900/40'
                      }`}>
                        {payload.conformance_status}
                      </span>
                    </div>
                    <div className="py-2 md:py-0">
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Inversión Sugerida PETI</span>
                      <span className="text-3xl font-black text-cyan-400 font-mono block mt-1">
                        {payload.estimated_investment_required}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold block mt-1 uppercase">Aprobación Directa Requerida</span>
                    </div>
                    <div className="py-2 md:py-0 flex flex-col justify-between items-center text-center">
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Enviar Reporte a tu Correo</span>
                      
                      <form onSubmit={handleSendEmail} className="mt-2.5 w-full max-w-[240px] space-y-2">
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="tu-email@gmail.com" 
                          className="w-full bg-white border border-slate-300 text-slate-800 text-xs px-3 py-2 rounded-xl focus:border-cyan-500 focus:outline-none placeholder-slate-400 transition-all font-semibold shadow-inner"
                        />
                        
                        <button
                          type="submit"
                          disabled={isSendingEmail}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-xl text-[10.5px] uppercase tracking-wider transition-all hover:scale-[1.01] shadow cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          {isSendingEmail ? (
                            <>
                              <i className="fa-solid fa-spinner animate-spin"></i> Enviando...
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-paper-plane"></i> Enviar Reporte por Email
                            </>
                          )}
                        </button>
                        
                        {emailStatus && (
                          <span className={emailStatusClass}>{emailStatus}</span>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom bar */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-900/50">
                {isLoading ? (
                  <span className="text-xs text-slate-500 italic font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-ping"></span> Esperando que finalice la sincronización con el servidor...
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={onClose}
                    className="ml-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-circle-check"></i> ✓ Entendido - Cerrar Simulador
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="ml-auto px-6 py-3 bg-red-650 hover:bg-red-500 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Cerrar con Error
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 2. TECHNICAL VIEW */}
          {activeTab === 'technical' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-900 h-[460px] bg-slate-950/20">
              {/* Left side: JSON Request */}
              <div className="p-5 flex flex-col justify-between h-full overflow-hidden">
                <div className="overflow-hidden flex flex-col h-full">
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest cyber-title block mb-2">HTTP POST REQUEST PAYLOAD</span>
                  <div className="bg-slate-950/85 border border-slate-900 rounded-xl p-4 font-mono text-[9.5px] text-cyan-300 leading-normal overflow-y-auto flex-1 h-full shadow-inner scrollbar-thin">
                    <pre className="whitespace-pre-wrap break-all select-all">{JSON.stringify(payload, null, 2)}</pre>
                  </div>
                </div>
              </div>

              {/* Right side: JSON Response */}
              <div className="p-5 flex flex-col justify-between h-full overflow-hidden">
                <div className="overflow-hidden flex flex-col h-full">
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest cyber-title block mb-2">HTTP RESPONSE (data.json)</span>
                  
                  <div className="flex-1 flex flex-col justify-center min-h-[160px] h-full overflow-hidden">
                    {isLoading && !hasError && (
                      <div className="flex flex-col items-center justify-center py-4">
                        <i className="fa-solid fa-spinner animate-spin text-cyan-400 text-3xl"></i>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest cyber-title mt-3 animate-pulse">Procesando en n8n...</span>
                      </div>
                    )}

                    {(!isLoading || hasError) && (
                      <div className="flex flex-col h-full overflow-hidden">
                        <div className="bg-slate-950/85 border border-slate-900 rounded-xl p-4 font-mono text-[9.5px] text-emerald-400 leading-normal overflow-y-auto flex-1 h-full shadow-inner scrollbar-thin">
                           <pre className="whitespace-pre-wrap select-all">{responseJson}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
