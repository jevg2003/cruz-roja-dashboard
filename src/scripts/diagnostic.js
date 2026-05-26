// diagnostic.js - Cuestionario Autodiagnóstico ISO 38500 e Integrador n8n (PETI Valle)

// Definición de las 10 Preguntas Hiper-Específicas
window.diagnosticQuestions = [
  {
    key: "responsabilidad",
    category: "Responsabilidad (ISO 38500)",
    title: "Gobernanza de Ciberseguridad (CISO Valle)",
    desc: "¿Cuenta la seccional con un oficial CISO formal y SOC de monitoreo activo?",
    impact: "Impacta la protección de datos médicos del Hemocentro y previene ataques de Ransomware.",
    minDesc: "Sin CISO ni SOC (0)",
    maxDesc: "CISO liderando SOC humanitario (5)"
  },
  {
    key: "conformidad",
    category: "Conformidad (ISO 38500)",
    title: "Protección de Datos de Pacientes y Alumnos (Ley 1581)",
    desc: "¿Se audita y protege activamente el acceso y consentimiento de datos de pacientes, donantes y alumnos?",
    impact: "Previene multas de la SIC (Superintendencia) de hasta 2,000 SMMLV bajo la Ley 1581.",
    minDesc: "Controles inexistentes (0)",
    maxDesc: "MSPI integrado y certificado con ISO 27001 (5)"
  },
  {
    key: "servidores",
    category: "Adquisición (ISO 38500)",
    title: "Obsolescencia Servidores Físicos del Hemocentro",
    desc: "¿Cuál es el estado y antigüedad de los servidores físicos locales que hospedan la base de datos de HeVa?",
    impact: "El fallo físico paraliza el 60% de los ingresos ($771M) al detener la captación de sangre.",
    minDesc: "Hardware > 5 años obsoleto (0)",
    maxDesc: "Migración Azure híbrida redundante (5)"
  },
  {
    key: "backups",
    category: "Rendimiento (ISO 38500)",
    title: "Continuidad del Negocio (DRP y Backups)",
    desc: "¿Existen respaldos inmutables en la nube frente a Ransomware y se realizan simulacros semestrales de DRP?",
    impact: "Garantiza un tiempo de recuperación RTO menor a 4 horas en caso de caída mayor.",
    minDesc: "Backups locales en disco físico simple (0)",
    maxDesc: "DRP en Azure con pruebas semestrales 100% exitosas (5)"
  },
  {
    key: "interoperabilidad",
    category: "Estrategia (ISO 38500)",
    title: "Integración API Gateway B2B Hospitales",
    desc: "¿Están integrados HeVa, Siesa y Q-Symphony mediante un API Gateway con estándar HL7/FHIR?",
    impact: "Habilita la trazabilidad total del hemocomponente y reduce errores manuales de despacho.",
    minDesc: "Islas de información sin comunicación (0)",
    maxDesc: "API Gateway con 100% interoperabilidad hospitalaria (5)"
  },
  {
    key: "canales_donantes",
    category: "Estrategia (ISO 38500)",
    title: "Canales Donantes Digitales (App Móvil Valle)",
    desc: "¿El donante de la seccional cuenta con App móvil propia y agendamiento 100% online automatizado?",
    impact: "Moderniza el Hemocentro eliminando registros en papel y llamadas manuales.",
    minDesc: "Agendamiento solo telefónico/presencial (0)",
    maxDesc: "App con agendamiento y trazabilidad en vivo de sangre (5)"
  },
  {
    key: "portal_educativo",
    category: "Estrategia (ISO 38500)",
    title: "Portal Educativo del Instituto (Pasarela PSE)",
    desc: "¿El Instituto posee un portal transaccional con matrícula en línea y pasarela de pagos PSE integrada?",
    impact: "Previene la desintermediación por plataformas de EdTech (SENA, Coursera) reteniendo $61M de ingresos.",
    minDesc: "Matrícula manual en ventanilla e informes Excel (0)",
    maxDesc: "Portal autoservicio 100% digital integrado a Siesa (5)"
  },
  {
    key: "apropiacion_digital",
    category: "Comportamiento Humano (ISO 38500)",
    title: "Madurez y Adopción en Voluntariado",
    desc: "¿Los médicos, enfermeros y voluntarios están entrenados en herramientas corporativas y ciberseguridad?",
    impact: "Elimina la brecha de apropiación digital y mitiga el vector de ataque del Phishing.",
    minDesc: "Sin capacitación, resistencia al cambio (0)",
    maxDesc: "Programa de microaprendizaje activo y evaluado vía Teams (5)"
  },
  {
    key: "mesa_ayuda",
    category: "Rendimiento (ISO 38500)",
    title: "Mesa de Ayuda TI y Soporte SLAs",
    desc: "¿Los reportes de incidencias del personal se registran en una mesa de ayuda con asignación automática?",
    impact: "Eleva el índice CSAT general y asegura tiempos de solución garantizados al personal clínico.",
    minDesc: "Soporte informal por llamadas o chat personal (0)",
    maxDesc: "Mesa formal con catálogos y automatizada mediante n8n (5)"
  },
  {
    key: "convenios_makaia",
    category: "Adquisición (ISO 38500)",
    title: "Ahorros por Convenio Makaia (Microsoft 365)",
    desc: "¿Se gestiona al 100% el convenio sin fines de lucro con Makaia para el licenciamiento del personal Valle?",
    impact: "Ahorro de miles de dólares anuales liberando fondos operativos para ayuda humanitaria.",
    minDesc: "Licenciamiento comercial a precio regular (0)",
    maxDesc: "100% licencias en convenio Makaia Nonprofit (5)"
  }
];

// INICIALIZAR EL PANEL DE AUTODIAGNÓSTICO EN LA UI
window.initDiagnosticConsole = function() {
  const container = document.getElementById('diagnostic-questions-grid');
  if (!container) return;

  // Renderizar las 10 preguntas
  container.innerHTML = "";
  window.diagnosticQuestions.forEach(q => {
    const score = window.diagnosticScores[q.key] !== undefined ? window.diagnosticScores[q.key] : 2;
    
    // Crear el set de 6 botones (0 a 5) con estilo Likert circular
    const scoreButtonsHtml = [0, 1, 2, 3, 4, 5].map(scoreOption => {
      const isSelected = score === scoreOption;
      const activeClass = isSelected 
        ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/40 border-cyan-400 scale-110 z-10' 
        : 'border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/20';
      return `
        <button type="button" 
          onclick="window.updateQuestionScore('${q.key}', ${scoreOption})"
          class="w-10 h-10 rounded-full border text-sm font-mono font-bold flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 ${activeClass}">
          ${scoreOption}
        </button>
      `;
    }).join('');

    container.innerHTML += `
      <div class="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 flex flex-col justify-between space-y-5 shadow-lg">
        <div>
          <div class="flex justify-between items-start gap-2">
            <span class="text-xs text-cyan-400 font-bold uppercase tracking-wider block cyber-title">${q.category}</span>
            <span class="font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-900/50 text-xs font-bold">
              Madurez: ${score}/5
            </span>
          </div>
          <h4 class="text-base font-extrabold text-white mt-2 leading-snug">${q.title}</h4>
          <p class="text-sm text-slate-300 mt-2 leading-relaxed">${q.desc}</p>
          <div class="text-xs text-slate-300 bg-red-950/15 border border-brand-red-neon/20 px-3 py-2 rounded-xl mt-3.5 leading-relaxed">
            <strong class="text-brand-red-neon uppercase tracking-wider text-[10px] cyber-title block mb-0.5">Impacto en la Cruz Roja:</strong>
            ${q.impact}
          </div>
        </div>

        <div class="space-y-3.5 pt-3 border-t border-slate-900/60">
          <div class="flex justify-between items-center gap-1">
            ${scoreButtonsHtml}
          </div>
          <div class="flex justify-between text-xs text-slate-400 font-semibold tracking-wide px-1">
            <span>${q.minDesc}</span>
            <span>${q.maxDesc}</span>
          </div>
        </div>
      </div>
    `;
  });

  // Cargar las recomendaciones iniciales
  window.updateDiagnosticRecommendations();
};

// INICIALIZADOR DE ESCUCHAS DE EVENTOS ESTÁTICOS DE AUTODIAGNÓSTICO (SE EJECUTA UNA SOLA VEZ AL CARGAR)
window.initStaticDiagnosticListeners = function() {
  // Botón: Evaluar e Inyectar Directivas
  const injectBtn = document.getElementById('btn-inject-diagnostic');
  if (injectBtn) {
    injectBtn.onclick = () => {
      window.injectDirectivesFromDiagnostic();
      window.showToast("Directivas y proyectos PETI configurados en la barra lateral según los puntos débiles de tu autodiagnóstico.", "IA de Gobierno TI");
    };
  }

  // Botón: Enviar a n8n
  const sendBtn = document.getElementById('btn-send-n8n-webhook');
  if (sendBtn) {
    sendBtn.onclick = () => {
      window.simulateN8nWebhook();
    };
  }

  // Botón: Restablecer Diagnóstico
  const resetBtn = document.getElementById('btn-reset-data');
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (typeof window.resetState === 'function') {
        window.resetState();
        window.initDiagnosticConsole();
        
        // Cerrar modal de n8n si estuviera abierto
        const modal = document.getElementById('n8n-webhook-modal');
        if (modal) modal.classList.add('hidden');
        
        window.showToast("Diagnóstico e indicadores de la Cruz Roja restablecidos al estado inicial (Madurez 2.8).", "Estado Inicial");
      }
    };
  }
};

// VINCULADOR DE VALORES Y RE-RENDERIZACIÓN EN TIEMPO REAL
window.updateQuestionScore = function(key, score) {
  window.diagnosticScores[key] = score;
  
  // Guardar estado en caché
  if (typeof window.saveState === 'function') {
    window.saveState();
  }

  // Recargar la visualización de la cuadrícula de autodiagnóstico
  window.initDiagnosticConsole();

  // Inyectar de forma reactiva e instantánea las directivas de proyectos y auditorías
  window.injectDirectivesFromDiagnostic();

  // Calcular recomendaciones dinámicas
  window.updateDiagnosticRecommendations();
};

// CÁLCULO DE RECOMENDACIONES DICTADAS POR LA IA EN CALIENTE
window.updateDiagnosticRecommendations = function() {
  const recsBox = document.getElementById('diagnostic-ai-recommendations');
  if (!recsBox) return;

  let score = 0;
  const keys = Object.keys(window.diagnosticScores);
  keys.forEach(k => score += window.diagnosticScores[k]);
  const average = parseFloat((score / keys.length).toFixed(1));

  let alertText = "";
  let severity = "danger";
  let recsList = [];

  // Categorizar según promedio
  if (average < 2.5) {
    alertText = `🚨 **ESTADO CRÍTICO DE GOBIERNO TI (Madurez ${average}/5.0):** La Cruz Roja Valle se encuentra en zona de supervivencia operativa. La carencia de gobierno formal de seguridad (CISO) y la obsolescencia física ponen en alto riesgo de secuestro de datos clínicos e ingresos. **Se requiere dirigir directivas PETI urgentes en los próximos 90 días.**`;
    severity = "danger";
  } else if (average < 4.0) {
    alertText = `⚠️ **GOBERNANZA PARCIAL (Madurez ${average}/5.0):** Existen procesos de TI bien definidos (como convenios de ahorro y mesa de soporte básica), pero la digitalización de trámites no está integrada de manera segura. Hay debilidades en interoperabilidad de bases de datos. **Recomendación: migrar y proteger.**`;
    severity = "warning";
  } else {
    alertText = `✅ **EXCELENCIA EN GOBIERNO TI (Madurez ${average}/5.0):** La Cruz Roja Seccional Valle se encuentra al día con el estándar ISO 38500 y mejores prácticas de COBIT. El Hemocentro está protegido, automatizado con n8n y posee convenios de ahorro Makaia renovados. **Gobernanza ejemplar y en mejora continua.**`;
    severity = "success";
  }

  // Recomendaciones específicas causa-raíz
  if (window.diagnosticScores.responsabilidad <= 2 || window.diagnosticScores.conformidad <= 2) {
    recsList.push("🛡️ **Ciberseguridad:** Contratar de inmediato al Oficial CISO y activar el SOC Valle (Proyecto B1) para blindarse contra ataques de Ransomware y evitar multas millonarias de Ley 1581.");
  }
  if (window.diagnosticScores.servidores <= 2 || window.diagnosticScores.backups <= 2) {
    recsList.push("☁️ **Resiliencia Cloud:** Migrar HeVa de servidor físico obsoleto a Azure Cloud híbrido (Proyecto B2) y configurar backups inmutables DRP.");
  }
  if (window.diagnosticScores.interoperabilidad <= 2) {
    recsList.push("🔗 **Interoperabilidad:** Desarrollar el API Gateway HL7/FHIR (Proyecto B3) para terminar con las islas de datos Siesa ↔ HeVa.");
  }
  if (window.diagnosticScores.canales_donantes <= 2 || window.diagnosticScores.portal_educativo <= 2) {
    recsList.push("📱 **Digitalización de Canales:** Ejecutar el plan transaccional PSE e inaugurar la App del Hemocentro (Proyecto B5) para retener alumnos del Instituto y captar donantes.");
  }
  if (window.diagnosticScores.apropiacion_digital <= 2) {
    recsList.push("🎓 **Adopción Digital:** Diseñar planes de microaprendizaje vía Teams (Proyecto B8) para capacitar en ciberseguridad al voluntariado de primera respuesta.");
  }

  if (recsList.length === 0) {
    recsList.push("🚀 Todas las dimensiones del Gobierno TI operan con un excelente nivel de madurez. Continúe con auditorías periódicas y monitoreando SLA con triggers de n8n.");
  }

  // Generar HTML de la alerta
  let bgCol = "bg-red-950/20 border-red-900/40 text-red-450";
  if (severity === "warning") bgCol = "bg-amber-950/20 border-amber-900/40 text-amber-405";
  if (severity === "success") bgCol = "bg-emerald-950/20 border-emerald-900/40 text-emerald-405";

  // Parsear negritas de Markdown a HTML strong
  const formatText = text => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  recsBox.innerHTML = `
    <div class="border p-5 rounded-2xl ${bgCol} shadow-inner bg-slate-950/25">
      <p class="text-sm md:text-base leading-relaxed font-semibold">${formatText(alertText)}</p>
    </div>
    <div class="space-y-4">
      <h5 class="text-xs font-bold text-slate-300 uppercase tracking-wider cyber-title block mt-6">Plano de Acción IA Sugerido:</h5>
      <ul class="text-sm text-slate-200 space-y-3">
        ${recsList.map(li => `
          <li class="bg-slate-950/40 border border-slate-850 p-4.5 rounded-xl shadow-sm leading-relaxed">
            ${formatText(li)}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
};

// INYECCIÓN AUTOMÁTICA DE PROYECTOS PETI EN EL CONTROL PANEL LATERAL (AHORA READ-ONLY RE-CALCULADO AL INSTANTE)
window.injectDirectivesFromDiagnostic = function() {
  // Lógica de inyección de Auditorías (Evaluaciones) en base al autodiagnóstico
  window.decisions.audit_servidores = window.diagnosticScores.servidores <= 3;
  window.decisions.audit_seguridad = (window.diagnosticScores.responsabilidad <= 3 || window.diagnosticScores.conformidad <= 3);
  window.decisions.audit_procesos = (window.diagnosticScores.apropiacion_digital <= 3 || window.diagnosticScores.mesa_ayuda <= 3);

  // Lógica de inyección causa-raíz de Proyectos PETI (Dirección)
  window.decisions.b1_ciso = (window.diagnosticScores.responsabilidad >= 3 && window.diagnosticScores.conformidad >= 3);
  window.decisions.b2_azure = (window.diagnosticScores.servidores >= 3 && window.diagnosticScores.backups >= 3);
  window.decisions.b3_api = window.diagnosticScores.interoperabilidad >= 3;
  window.decisions.b5_portal = (window.diagnosticScores.canales_donantes >= 3 && window.diagnosticScores.portal_educativo >= 3);
  window.decisions.b7_datos = window.diagnosticScores.interoperabilidad >= 4; // El API Gateway requiere gobierno de datos
  window.decisions.b8_capacitacion = window.diagnosticScores.apropiacion_digital >= 3;

  // Recalcular y actualizar UI en tiempo real
  if (typeof window.recalculateAndRender === 'function') {
    window.recalculateAndRender();
  }
};

// SIMULADOR VISUAL DE WEBHOOK DE n8n (Live API Gateway)
window.simulateN8nWebhook = function() {
  const modal = document.getElementById('n8n-webhook-modal');
  if (!modal) return;

  // 1. Mostrar modal
  modal.classList.remove('hidden');

  // Calcular variables del payload actual
  let totalCostVal = 60;
  let recommendedProjects = [];
  if (window.diagnosticScores.responsabilidad <= 2 || window.diagnosticScores.conformidad <= 2) { recommendedProjects.push("B1 CISO"); totalCostVal += 45; }
  if (window.diagnosticScores.servidores <= 2 || window.diagnosticScores.backups <= 2) { recommendedProjects.push("B2 Azure Cloud"); totalCostVal += 80; }
  if (window.diagnosticScores.interoperabilidad <= 2) { recommendedProjects.push("B3 API Gateway"); totalCostVal += 55; }
  if (window.diagnosticScores.canales_donantes <= 2 || window.diagnosticScores.portal_educativo <= 2) { recommendedProjects.push("B5 Hemocentro 4.0"); totalCostVal += 75; }
  if (window.diagnosticScores.interoperabilidad <= 2) { recommendedProjects.push("B7 Gob. Datos"); totalCostVal += 12; }
  if (window.diagnosticScores.apropiacion_digital <= 2) { recommendedProjects.push("B8 Cap. Teams"); totalCostVal += 15; }

  let score = 0;
  const keys = Object.keys(window.diagnosticScores);
  keys.forEach(k => score += window.diagnosticScores[k]);
  const average = parseFloat((score / keys.length).toFixed(2));

  // Crear objeto JSON
  const payloadObj = {
    "timestamp": new Date().toISOString(),
    "empresa": "Cruz Roja Colombiana - Seccional Valle del Cauca",
    "assessment_version": "ISO/IEC 38500 TI - 2026",
    "iso_38500_scores": window.diagnosticScores,
    "computed_maturity": average,
    "conformance_status": average >= 4.0 ? "GOBERNANZA COMPLETA" : average >= 2.5 ? "GOBIERNO PARCIAL" : "RIESGO CRÍTICO",
    "recommended_directives_peti": recommendedProjects,
    "estimated_investment_required": `$${totalCostVal}M COP`
  };

  // Mostrar Payload en modal
  const codeEl = document.getElementById('n8n-payload-code');
  if (codeEl) {
    codeEl.textContent = JSON.stringify(payloadObj, null, 2);
  }

  // TAB SWITCHING WIRING
  const btnExec = document.getElementById('n8n-toggle-executive');
  const btnTech = document.getElementById('n8n-toggle-technical');
  const viewExec = document.getElementById('n8n-view-executive');
  const viewTech = document.getElementById('n8n-view-technical');

  if (btnExec && btnTech && viewExec && viewTech) {
    // Restaurar a la vista ejecutiva por defecto
    viewExec.classList.remove('hidden');
    viewTech.classList.add('hidden');
    btnExec.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all bg-cyan-500 text-slate-950 flex items-center gap-1.5 shadow-md";
    btnTech.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5";

    btnExec.onclick = () => {
      viewExec.classList.remove('hidden');
      viewTech.classList.add('hidden');
      btnExec.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all bg-cyan-500 text-slate-950 flex items-center gap-1.5 shadow-md";
      btnTech.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5";
    };

    btnTech.onclick = () => {
      viewExec.classList.add('hidden');
      viewTech.classList.remove('hidden');
      btnTech.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all bg-cyan-500 text-slate-950 flex items-center gap-1.5 shadow-md";
      btnExec.className = "px-4 py-1.5 text-xs font-bold rounded-lg cursor-pointer text-slate-400 hover:text-slate-200 transition-all flex items-center gap-1.5";
    };
  }

  // Inicializar estadísticas ejecutivas dinámicas
  const maturityEl = document.getElementById('n8n-exec-maturity');
  const statusBadge = document.getElementById('n8n-exec-status-badge');
  const costEl = document.getElementById('n8n-exec-cost');

  if (maturityEl) maturityEl.textContent = average.toFixed(1);
  if (costEl) costEl.textContent = `$${totalCostVal}M COP`;
  if (statusBadge) {
    statusBadge.textContent = average >= 4.0 ? "Gobernanza Completa" : average >= 2.5 ? "Gobierno Parcial" : "Riesgo Crítico";
    if (average < 2.5) {
      statusBadge.className = "inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-900/40 uppercase mt-1";
    } else if (average < 4.0) {
      statusBadge.className = "inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-900/40 uppercase mt-1";
    } else {
      statusBadge.className = "inline-block text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 uppercase mt-1";
    }
  }

  // Resetear estados visuales
  const steps = [
    { id: 'n8n-exec-step-1', text: "Conectando con el Servidor local n8n Valle..." },
    { id: 'n8n-exec-step-2', text: "Enviando respuestas del Cuestionario de Madurez..." },
    { id: 'n8n-exec-step-3', text: "Flujo de n8n activo. Generando Reporte de Brechas..." },
    { id: 'n8n-exec-step-4', text: "Escribiendo data.json local y enviando alertas de SLA..." }
  ];

  steps.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) {
      el.className = "flex items-center gap-3 text-xs text-slate-500 font-bold py-1";
      el.querySelector('.n8n-exec-icon').className = "n8n-exec-icon fa-regular fa-circle text-[10px]";
    }
  });

  const spinner = document.getElementById('n8n-spinner');
  const responseBox = document.getElementById('n8n-response-box');
  const spinnerIcon = document.getElementById('n8n-spinner-icon');
  const execSpinner = document.getElementById('n8n-exec-spinner');
  const execCompleted = document.getElementById('n8n-exec-completed');
  const execSummary = document.getElementById('n8n-exec-summary');
  const waitingMsg = document.getElementById('n8n-exec-waiting-msg');
  const btnCloseFinish = document.getElementById('n8n-btn-finish-close');

  if (spinner) spinner.classList.remove('hidden');
  if (responseBox) responseBox.classList.add('hidden');
  if (spinnerIcon) spinnerIcon.classList.add('fa-spin', 'fa-circle-notch');
  if (spinnerIcon) spinnerIcon.classList.remove('fa-check-double', 'text-emerald-400');
  if (execSpinner) execSpinner.classList.remove('hidden');
  if (execCompleted) execCompleted.classList.add('hidden');
  if (execSummary) execSummary.classList.add('hidden');
  if (waitingMsg) waitingMsg.classList.remove('hidden');
  if (btnCloseFinish) {
    btnCloseFinish.classList.add('hidden');
    btnCloseFinish.classList.remove('flex');
  }

  // Ejecución encadenada de animaciones
  let delay = 300;
  steps.forEach((step, idx) => {
    setTimeout(() => {
      const el = document.getElementById(step.id);
      if (el) {
        el.className = "flex items-center gap-3 text-xs text-cyan-400 font-bold py-1 animate-pulse";
        el.querySelector('.n8n-exec-icon').className = "n8n-exec-icon fa-solid fa-spinner animate-spin text-[10px]";
      }
    }, delay);
    delay += 900;
  });

  // Finalizar e inyectar el response exitoso
  setTimeout(() => {
    steps.forEach(step => {
      const el = document.getElementById(step.id);
      if (el) {
        el.className = "flex items-center gap-3 text-xs text-emerald-400 font-bold py-1";
        el.querySelector('.n8n-exec-icon').className = "n8n-exec-icon fa-solid fa-circle-check text-[10px]";
      }
    });

    if (spinner) spinner.classList.add('hidden');
    if (spinnerIcon) spinnerIcon.classList.remove('fa-spin', 'fa-circle-notch');
    if (spinnerIcon) spinnerIcon.classList.add('fa-check-double', 'text-emerald-400');
    if (execSpinner) execSpinner.classList.add('hidden');
    if (execCompleted) execCompleted.classList.remove('hidden');
    if (execSummary) execSummary.classList.remove('hidden');
    if (waitingMsg) waitingMsg.classList.add('hidden');
    if (btnCloseFinish) {
      btnCloseFinish.classList.remove('hidden');
      btnCloseFinish.classList.add('flex');
    }

    if (responseBox) {
      responseBox.classList.remove('hidden');
      
      const n8nRespPayload = {
        "status": "success",
        "statusCode": 200,
        "n8n_execution_id": "EX_" + Math.floor(Math.random() * 900000 + 100000),
        "data": {
          "alert_dispatched": average < 2.5 ? "SÍ (SLA Alerta Roja)" : "NO",
          "email_report_sent_to": "jevgdg@gmail.com",
          "data_json_updated": true,
          "pdf_report_url": "drive://cruz-roja/peti/reporte_brechas_valle.pdf"
        }
      };
      
      document.getElementById('n8n-response-payload').textContent = JSON.stringify(n8nRespPayload, null, 2);
    }

    // Efecto de Toast de Éxito
    window.showToast(`n8n procesó autodiagnóstico con éxito (Madurez ${average}). Reporte PDF enviado al CIO Valle.`, "Éxito Webhook n8n");
  }, delay);

  // Cerrar modal al pulsar botones
  const closeModalFunc = () => {
    modal.classList.add('hidden');
  };

  const closeBtn = document.getElementById('close-n8n-webhook-modal');
  if (closeBtn) {
    closeBtn.onclick = closeModalFunc;
  }

  if (btnCloseFinish) {
    btnCloseFinish.onclick = closeModalFunc;
  }
};

