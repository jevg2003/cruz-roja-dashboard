// state.js - Estado Centralizado, Persistencia y Lógica Reactiva (ISO 38500)

// Fallback base de datos oficial PETI 2026-2030 Cruz Roja Seccional Valle
window.localFallbackData = {
  "last_updated": "2026-05-26T13:25:00-05:00",
  "top_kpis": {
    "madurez_digital": { "value": 2.8, "target": 5.0, "status": "critical" },
    "iso_27001": { "value": 45, "target": 90, "status": "critical" },
    "disponibilidad_hemocentro": { "value": 99.1, "target": 99.8, "status": "success" },
    "ejecucion_presupuesto": { "value": 67, "target": 100, "status": "warning" },
    "ciso_designado": { "value": "NO", "status": "danger" },
    "ingresos_hemocentro": { "value": "$771M COP", "status": "success" }
  },
  "perspectiva_financiera": {
    "ingresos_totales": { "amount": "$1.240M COP", "subtitle": "Ingresos Totales 2024", "description": "Hemocentro 62% - Educación 5% - Lotería/Otros 33%", "progress": 100 },
    "presupuesto_ti": { "amount": "67%", "subtitle": "Presupuesto TI Ejecutado", "description": "Meta: desviación ≤ 10% | PETI 2026-2030", "status_text": "En seguimiento", "status": "warning" },
    "ahorro_makaia": { "amount": "50-100%", "subtitle": "Ahorro Makaia (Licencias)", "description": "646 licencias Microsoft 365 - Programa Nonprofit", "status_text": "Activo y renovado", "status": "success" },
    "activos_tecnologicos": { "amount": "$321M COP", "subtitle": "Activos Tecnológicos (Valor Hist.)", "description": "Servidores obsoletos > 5 años - Riesgo operativo", "status_text": "Infraestructura en riesgo", "status": "danger" },
    "fuentes_ingreso": [
      { "name": "Hemocentro", "value": 62, "color": "#ff3344" },
      { "name": "Lotería y Otros", "value": 33, "color": "#4b5563" },
      { "name": "Educación", "value": 5, "color": "#ffab00" }
    ],
    "inversiones_peti": [
      { "proyecto": "Infraestructura Cloud (B2)", "monto": "$80M", "prioridad": "Alta" },
      { "proyecto": "API Gateway / Integración (B3)", "monto": "$55M", "prioridad": "Media" },
      { "proyecto": "Analítica Institucional (B4)", "monto": "$60M", "prioridad": "Alta" },
      { "proyecto": "Ciberseguridad / SOC (B1)", "monto": "$45M", "prioridad": "Crítica" },
      { "proyecto": "Hemocentro 4.0 + Portal (B5)", "monto": "$75M", "prioridad": "Crítica" },
      { "proyecto": "Capacitación Digital (B8)", "monto": "$15M", "prioridad": "Media" }
    ],
    "total_inversion_peti": "$330M"
  },
  "perspectiva_clientes": {
    "hemocentro": {
      "titulo": "Hemocentro — Motor Crítico de la Organización",
      "descripcion": "Mayor generador de ingresos - 60% de los ingresos totales - Servicio 24/7",
      "ingresos": "$771M COP",
      "kpis": [
        { "id": "c1", "name": "Disponibilidad Servicios", "value": "99.1%", "target": "Meta 99.8%", "status": "success", "action": "Migrar HeVa a Azure para alcanzar el 99.8% y eliminar riesgo de servidor físico obsoleto." },
        { "id": "c2", "name": "App Móvil Donantes", "value": "0%", "target": "Meta: Lanzar Q4 2028", "status": "danger", "action": "Proyecto Hemocentro 4.0 debe iniciarse en Q2 2027 usando Azure (F2) + datos donantes (F6)." },
        { "id": "c3", "name": "Trazabilidad Hemocomponentes", "value": "72%", "target": "Meta 100%", "status": "warning", "action": "API Gateway con estándar HL7/FHIR integra HeVa con hospitales aliados para trazabilidad total." },
        { "id": "c4", "name": "% Trámites Digitalizados", "value": "30%", "target": "Meta 90% en 2030", "status": "danger", "action": "Portal transaccional PSE + agendamiento online reduce carga manual y mejora experiencia donante." }
      ]
    },
    "educacion": {
      "titulo": "Instituto de Educación y Estudiantes",
      "ingresos": "$61M COP",
      "portal_avance": "0%",
      "status": "danger",
      "status_text": "Riesgo alto",
      "action": "SENA y plataformas gratuitas (Coursera, YouTube) son sustitutos directos. El portal educativo con PSE es un Quick Win que debe lanzarse en Q2 2028 para retener estudiantes y abrir nuevos mercados B2B sin requerir infraestructura adicional."
    },
    "hospitales_b2b": {
      "titulo": "Pacientes y Hospitales Aliados (B2B)",
      "confiabilidad": "70%",
      "target": "Meta: 85% en 2028",
      "status": "warning",
      "status_text": "En desarrollo",
      "action": "La certificación ISO 27001 (hoy en 45%) es el principal factor que hospitales y EPS evalúan para confiar servicios críticos de hemocomponentes a la Cruz Roja. Elevarla al 90% en 2027 genera ventaja competitiva directa."
    },
    "satisfaccion_soporte": {
      "titulo": "KPI de Satisfacción de Usuarios TI",
      "global_csat": { "titulo": "Satisfacción Usuarios (CSAT)", "value": 7.5, "max": 10, "target": 9.0, "status": "warning", "status_text": "En seguimiento", "action": "Mesa de ayuda con SLA formal + portal de autoservicio reduce tiempos de respuesta y mejora percepción." },
      "tickets_positivos": { "titulo": "Tickets Resueltos a Tiempo", "value": 80, "target": 90, "status": "success", "status_text": "Estable", "action": "Reforzar capacitaciones de soporte de primer nivel y automatizar las encuestas en n8n." },
      "confianza_digital": { "titulo": "Confianza Digital", "value": 70, "target": 90, "status": "warning", "status_text": "Construyendo", "action": "SOC + ISO 27001 + comunicación institucional sobre ciberseguridad elevan percepción de confianza." }
    }
  },
  "perspectiva_procesos": {
    "kpis": [
      { "name": "Cumplimiento ISO 27001", "value": "45%", "target": "Meta 2026: 70%", "status": "danger", "status_text": "Crítico", "action": "Nombrar CISO, implementar política de escritorio limpio y DRP probado antes de Q2 2026." },
      { "name": "% Cumplimiento RTO/RPO Servicios Críticos", "value": "40%", "target": "Meta 90%", "status": "danger", "status_text": "Sin DRP", "action": "Backups inmutables en Azure con retención 90 días. Prueba DRP semestral obligatoria." },
      { "name": "% Integración Sistemas (API Gateway)", "value": "0%", "target": "Meta 100% en Q4 2027", "status": "danger", "status_text": "Islas", "action": "Proyecto B3: API Gateway con HL7/FHIR conecta Siesa ↔ HeVa ↔ Q-Symphony. Presupuesto: $55M." },
      { "name": "Cumplimiento SLA Servicios TI", "value": "75%", "target": "Meta 95%", "status": "warning", "status_text": "Parcial", "action": "Mesa de ayuda con catálogo formal de servicios y asignación automática mediante triggers de n8n." }
    ],
    "radar_amenazas": [
      { "id": "A1", "name": "Ransomware – Amenaza Crítica", "weight": "25% importancia", "description": "Sin CISO ni SOC, un ataque podría paralizar el Hemocentro y el Laboratorio. Sectores salud son el objetivo #1 a nivel global.", "prescription": "Backups inmutables Azure + SOC + MFA como prioridad absoluta antes de cualquier digitalización nueva. Plazo: Q2 2026.", "status": "danger" },
      { "id": "D2", "name": "Servidores físicos obsoletos (>5 años)", "weight": "20% importancia", "description": "Si falla un servidor local del Hemocentro o del Laboratorio, los servicios críticos de salud se detienen sin tiempo de recuperación definido.", "prescription": "Migración progresiva Cloud First (Azure híbrido) – Proyecto B2, $80M. Plazo: Q2 2027.", "status": "danger" },
      { "id": "A2", "name": "Sanciones Ley 1581 – Riesgo Legal", "weight": "15% importancia", "description": "Datos de pacientes, donantes y estudiantes sin protección adecuada (solo 45% ISO 27001) expone a sanciones millonarias y daño reputacional.", "prescription": "Auditoría de datos personales + implementar MSPI + completar controles ISO 27001. Plazo: Q4 2026.", "status": "warning" },
      { "id": "A4", "name": "Desintermediación EdTech (SENA, Coursera)", "weight": "15% importancia", "description": "Sin portal educativo, los ingresos de $61M del Instituto están en riesgo de migrar a plataformas gratuitas.", "prescription": "Portal educativo con PSE como Quick Win Q2 2028. Diferenciador: certificaciones Cruz Roja con validez internacional.", "status": "warning" },
      { "id": "A3", "name": "Dependencia tecnológica de HeVa y Siesa", "weight": "15% importancia", "description": "Alto costo de cambio. Si el proveedor sube precios o descontinúa el producto, la operación queda en riesgo.", "prescription": "Evaluar OpenMRS como alternativa open-source. API Gateway reduce el lock-in al crear capa neutral.", "status": "warning" },
      { "id": "D4", "name": "Sin CISO formal ni modelo de ciberseguridad", "weight": "10% importancia", "description": "La ausencia de un responsable de seguridad deja sin gobernanza la protección de datos clínicos y financieros.", "prescription": "Designar CISO es el primer paso del PETI 2026-2030, antes de cualquier otro proyecto de digitalización.", "status": "danger" }
    ]
  },
  "perspectiva_aprendizaje": {
    "madurez_digital": { "value": 2.8, "target": 4.2, "max": 5.0, "status_text": "Brecha crítica", "status": "danger", "action": "Plan de microaprendizaje con Teams (B8) – capacitar personal de campo en apps institucionales sin salones presenciales." },
    "personal_certificado": { "value": "70%", "target": "95% ITIL/COBIT", "description": "Certificaciones básicas: 70% | ITIL 4 avanzado: 20%", "status_text": "Base", "status": "warning", "action": "Programa de recertificación ITIL 4 + COBIT 2019 con presupuesto $15M del PETI. Plazo Q1 2027." },
    "practicas_cobit": { "value": "40%", "target": "Meta: 80%", "status_text": "Inicial", "status": "danger", "action": "Documentación en SharePoint + rutas de carrera TI para retener talento y reducir riesgo de rotación." },
    "roadmap_proyectos": [
      { "id": "B7", "name": "Gobierno de Datos Institucional", "cronograma": "Q1 2026", "status": "EN EJECUCIÓN", "monto": "$12M", "color": "#ffab00", "description": "Políticas, roles, catálogo de datos y modelo formal de gestión." },
      { "id": "B1", "name": "Ciberseguridad Humanitaria (SOC + DRP)", "cronograma": "Q2 2026", "status": "PRIORIDAD #1", "monto": "$45M", "color": "#ff3344", "description": "Centro de Operaciones de Seguridad + autenticación multifactor + DRP semestral." },
      { "id": "B8", "name": "Capacitación Digital del Personal", "cronograma": "Q1 2027", "status": "PLANIFICADO", "monto": "$15M", "color": "#4b5563", "description": "Microaprendizaje con Teams. Elevar madurez de 2.8 a 4.2/5.0." },
      { "id": "B2", "name": "Migración Cloud (Infraestructura Azure)", "cronograma": "Q2 2027", "status": "PLANIFICADO", "monto": "$80M", "color": "#4b5563", "description": "Migración de servidores locales obsoletos a nube híbrida de Azure." }
    ],
    "radar_chart": {
      "labels": ["Disponibilidad Servicios", "Madurez Digital", "Trámites Digitales", "Integración Sistemas", "Cumplimiento ISO 27001", "Satisfacción Usuarios"],
      "actual": [99.1, 56, 30, 0, 45, 75],
      "target": [99.8, 84, 90, 100, 90, 90]
    }
  },
  "prescripciones": {
    "acciones_inmediatas": [
      { "id": "01", "title": "Designar CISO y activar el SOC", "badge": "P1", "description": "Con solo 45% de cumplimiento ISO 27001 y ransomware como amenaza #1 (25% importancia), cualquier ataque detendría el Hemocentro. El CISO debe nombrarse antes de cualquier otro proyecto. Presupuesto: incluido en $45M de ciberseguridad." },
      { "id": "02", "title": "Implementar backups inmutables en Azure (DRP)", "badge": "P1", "description": "Los servidores físicos tienen más de 5 años y no existe DRP probado. Un fallo en el servidor del Hemocentro paraliza $771M de ingresos. Azure ya está operativo (B2) – solo se necesita activar retención inmutable a 90 días. Tiempo de implementación: 4-6 semanas." },
      { "id": "03", "title": "Establecer el Gobierno de Datos Institucional", "badge": "P1", "description": "Sin gobierno de datos no hay analítica, ni cumplimiento Ley 1581, ni integración posible. Es la base que habilita todos los demás proyectos del PETI. Costo: $12M. Plazo: Q1 2026." }
    ],
    "acciones_estrategicas": [
      { "id": "04", "title": "Migrar infraestructura a Azure (Cloud First)", "badge": "P2", "description": "Los servidores físicos obsoletos son el cuello de botella que impide alcanzar el 99.8% de disponibilidad que exige el Hemocentro. La migración progresiva con modelo pay-as-you-go elimina el riesgo sin CAPEX masivo inicial. Presupuesto: $80M." },
      { "id": "05", "title": "Construir el API Gateway con HL7/FHIR", "badge": "P2", "description": "Siesa, HeVa y Q-Symphony operan como islas. La integración es la palanca que habilita el dato único del paciente, la analítica institucional y la interoperabilidad con hospitales aliados. Sin este paso, los proyectos de IA y Analítica son inviables. Presupuesto: $55M." },
      { "id": "06", "title": "Programa de capacitación digital (madurez 2.8 → 4.2)", "badge": "P2", "description": "Sin apropiación tecnológica del personal, ningún sistema nuevo se usa correctamente. Microaprendizaje con Teams, sin salones presenciales, usando los smartphones que ya tienen. Presupuesto: $15M – la mejor relación costo/impacto del PETI." }
    ],
    "foda": {
      "diagnostico": "Los factores internos son débiles (score 0.8) mientras los externos son favorables (score 1.2). Esto ubica a la organización en el cuadrante DO: las oportunidades del entorno existen pero las debilidades internas impiden aprovecharlas.",
      "debilidades": ["Sin CISO", "45% ISO 27001", "Servidores obsoletos", "Islas de datos", "Madurez 2.8"],
      "oportunidades": ["Azure activo", "MAKAIA", "Alta demanda cursos", "HL7/FHIR", "Decreto 767"]
    }
  }
};

// Estados Base por defecto
const defaultDecisions = {
  audit_servidores: false,
  audit_seguridad: false,
  audit_procesos: false,
  b1_ciso: false,
  b2_azure: false,
  b3_api: false,
  b5_portal: false,
  b7_datos: false,
  b8_capacitacion: false
};

const defaultDiagnosticScores = {
  responsabilidad: 0,
  conformidad: 4,
  servidores: 2,
  backups: 2,
  interoperabilidad: 1,
  canales_donantes: 3,
  portal_educativo: 3,
  apropiacion_digital: 3,
  mesa_ayuda: 5,
  convenios_makaia: 5
};

// Cargar o inicializar variables globales en window
window.decisions = JSON.parse(JSON.stringify(defaultDecisions));
window.diagnosticScores = JSON.parse(JSON.stringify(defaultDiagnosticScores));
window.appState = JSON.parse(JSON.stringify(window.localFallbackData));

// PERSISTENCIA LOCAL STORAGE
window.saveState = function() {
  localStorage.setItem('cruz_roja_decisions', JSON.stringify(window.decisions));
  localStorage.setItem('cruz_roja_diagnostic', JSON.stringify(window.diagnosticScores));
};

window.loadState = function() {
  try {
    const savedDecs = localStorage.getItem('cruz_roja_decisions');
    const savedDiag = localStorage.getItem('cruz_roja_diagnostic');
    
    if (savedDecs) window.decisions = JSON.parse(savedDecs);
    if (savedDiag) window.diagnosticScores = JSON.parse(savedDiag);
  } catch (e) {
    console.error("Error al cargar localStorage:", e);
  }
};

window.resetState = function() {
  localStorage.removeItem('cruz_roja_decisions');
  localStorage.removeItem('cruz_roja_diagnostic');
  window.decisions = JSON.parse(JSON.stringify(defaultDecisions));
  window.diagnosticScores = JSON.parse(JSON.stringify(defaultDiagnosticScores));
  window.recalculateAndRender();
};

// RECALCULADOR MATEMÁTICO CENTRAL REACTIVO
window.recalculateAndRender = function() {
  if (!window.appState) return;

  // Guardar estado actual
  window.saveState();

  // Resetear estado de trabajo a la plantilla base
  window.appState = JSON.parse(JSON.stringify(window.localFallbackData));

  // A. PROCESAR MADUREZ DIGITAL DESDE EL AUTODIAGNOSTICO IA
  const scoreKeys = Object.keys(window.diagnosticScores);
  const totalScoresSum = scoreKeys.reduce((acc, key) => acc + window.diagnosticScores[key], 0);
  const computedMaturity = totalScoresSum / scoreKeys.length;
  
  // Guardamos el promedio calculado
  window.appState.top_kpis.madurez_digital.value = parseFloat(computedMaturity.toFixed(1));
  window.appState.perspectiva_aprendizaje.madurez_digital.value = parseFloat(computedMaturity.toFixed(1));
  window.appState.top_kpis.madurez_digital.status = computedMaturity >= 4.0 ? 'success' : computedMaturity >= 3.0 ? 'warning' : 'danger';
  window.appState.perspectiva_aprendizaje.madurez_digital.status = window.appState.top_kpis.madurez_digital.status;

  // 1. CALCULATE BUDGET INVERSION (PETI Project allocation)
  // Base spent budget is $60M (contratos vigentes)
  let totalCost = 60;
  if (window.decisions.b1_ciso) totalCost += 45;
  if (window.decisions.b2_azure) totalCost += 80;
  if (window.decisions.b3_api) totalCost += 55;
  if (window.decisions.b5_portal) totalCost += 75;
  if (window.decisions.b7_datos) totalCost += 12;
  if (window.decisions.b8_capacitacion) totalCost += 15;

  const budgetPercent = Math.round((totalCost / 330) * 100);
  window.appState.top_kpis.ejecucion_presupuesto.value = budgetPercent;
  window.appState.perspectiva_financiera.presupuesto_ti.amount = `${budgetPercent}%`;
  
  // Budget warning
  const budgetWarning = document.getElementById('sim-budget-warning');
  if (totalCost > 330) {
    window.appState.top_kpis.ejecucion_presupuesto.status = 'danger';
    if (budgetWarning) budgetWarning.classList.remove('hidden');
  } else {
    window.appState.top_kpis.ejecucion_presupuesto.status = budgetPercent >= 90 ? 'success' : 'warning';
    if (budgetWarning) budgetWarning.classList.add('hidden');
  }

  // Sync Sidebar budget strip
  const budgetCostEl = document.getElementById('sim-budget-cost');
  if (budgetCostEl) budgetCostEl.textContent = `$${totalCost}M / $330M`;
  const budgetProgressEl = document.getElementById('sim-budget-progress');
  if (budgetProgressEl) {
    const barWidth = Math.min((totalCost / 330) * 100, 100);
    budgetProgressEl.style.width = `${barWidth}%`;
    if (totalCost > 330) {
      budgetProgressEl.className = "h-full bg-red-650";
    } else {
      budgetProgressEl.className = "h-full bg-neon-green";
    }
  }

  // 2. RECALCULATE LEARNING (Apropiación y Capacitación Teams)
  let digitalMaturity = computedMaturity;
  digitalMaturity = Math.min(5.0, parseFloat(digitalMaturity.toFixed(1)));
  
  window.appState.top_kpis.madurez_digital.value = digitalMaturity;
  window.appState.perspectiva_aprendizaje.madurez_digital.value = digitalMaturity;
  window.appState.top_kpis.madurez_digital.status = digitalMaturity >= 4.0 ? 'success' : digitalMaturity >= 3.0 ? 'warning' : 'danger';
  window.appState.perspectiva_aprendizaje.madurez_digital.status = window.appState.top_kpis.madurez_digital.status;
  
  if (window.decisions.b8_capacitacion) {
    window.appState.perspectiva_aprendizaje.personal_certified = "95%";
    window.appState.perspectiva_aprendizaje.practicas_cobit.value = "80%";
    window.appState.perspectiva_aprendizaje.practicas_cobit.status_text = "Optimizado";
    window.appState.perspectiva_aprendizaje.practicas_cobit.status = "success";
  }

  // 3. RECALCULATE UPTIME (Azure Cloud hybrid migration impact)
  let currentUptime = 98.0;
  if (window.diagnosticScores.servidores >= 1) currentUptime += 0.4;
  if (window.diagnosticScores.servidores >= 3) currentUptime += 0.4;
  if (window.diagnosticScores.backups >= 2) currentUptime += 0.7;
  if (window.decisions.b2_azure) currentUptime = 99.8; 
  currentUptime = Math.min(99.8, parseFloat(currentUptime.toFixed(2)));
  window.appState.top_kpis.disponibilidad_hemocentro.value = currentUptime;
  window.appState.top_kpis.disponibilidad_hemocentro.status = currentUptime >= 99.5 ? 'success' : 'danger';

  // Recalcular Ingresos del Hemocentro en base a la Disponibilidad (Uptime)
  let baseIncome = 771; // $771M COP base
  let incomeLoss = 0;
  if (currentUptime < 99.8) {
    // Cada 0.1% de caída por debajo de 99.8% representa una pérdida de $3M COP por retrasos y cancelaciones
    incomeLoss = Math.round((99.8 - currentUptime) * 10 * 3);
  }
  let finalIncome = Math.max(600, baseIncome - incomeLoss);
  window.appState.top_kpis.ingresos_hemocentro.value = `$${finalIncome}M COP`;
  window.appState.top_kpis.ingresos_hemocentro.status = finalIncome >= 750 ? 'success' : finalIncome >= 700 ? 'warning' : 'danger';
  window.appState.perspectiva_clientes.hemocentro.ingresos = `$${finalIncome}M COP`;

  // 4. RECALCULATE SECURITY & COMPLIANCE (CISO designación & SOC)
  let currentISO = 25;
  currentISO += window.diagnosticScores.conformidad * 5;
  currentISO += window.diagnosticScores.responsabilidad * 5;
  if (window.decisions.b1_ciso) currentISO = 90;
  currentISO = Math.min(90, currentISO);
  window.appState.top_kpis.iso_27001.value = currentISO;
  window.appState.top_kpis.iso_27001.status = currentISO >= 90 ? 'success' : currentISO >= 70 ? 'warning' : 'danger';
  window.appState.top_kpis.ciso_designado.value = window.decisions.b1_ciso ? "SÍ" : "NO";
  window.appState.top_kpis.ciso_designado.status = window.decisions.b1_ciso ? "success" : "danger";

  // Percepción hospitales B2B ligada a ISO 27001
  window.appState.perspectiva_clientes.hospitales_b2b.confiabilidad = `${currentISO}%`;
  window.appState.perspectiva_clientes.hospitales_b2b.status = currentISO >= 90 ? 'success' : currentISO >= 70 ? 'warning' : 'danger';
  window.appState.perspectiva_clientes.hospitales_b2b.status_text = currentISO >= 90 ? 'Excelente' : currentISO >= 70 ? 'En desarrollo' : 'Riesgo alto';

  // 5. RECALCULATE INTEGRATIONS (API Gateway & Data Governance)
  let systemIntegration = 0;
  if (window.diagnosticScores.interoperabilidad >= 2) systemIntegration = window.diagnosticScores.interoperabilidad * 10;
  if (window.decisions.b3_api) systemIntegration += 70;
  if (window.decisions.b7_datos) systemIntegration += 10;
  systemIntegration = Math.min(100, systemIntegration);
  window.appState.perspectiva_procesos.kpis[2].value = `${systemIntegration}%`;
  window.appState.perspectiva_procesos.kpis[2].status = systemIntegration >= 100 ? 'success' : systemIntegration >= 50 ? 'warning' : 'danger';
  window.appState.perspectiva_procesos.kpis[2].status_text = systemIntegration >= 100 ? 'Estable' : systemIntegration >= 20 ? 'Islas' : 'Inexistente';

  // Recalcular CSAT y Satisfacción de Soporte Dinámicamente
  let csatVal = parseFloat((4.0 + window.diagnosticScores.mesa_ayuda * 1.1).toFixed(1));
  csatVal = Math.min(9.5, csatVal);
  window.appState.perspectiva_clientes.satisfaccion_soporte.global_csat.value = csatVal;
  window.appState.perspectiva_clientes.satisfaccion_soporte.global_csat.status = csatVal >= 8.5 ? 'success' : csatVal >= 7.0 ? 'warning' : 'danger';

  let ticketsVal = 40 + window.diagnosticScores.mesa_ayuda * 11;
  ticketsVal = Math.min(95, ticketsVal);
  window.appState.perspectiva_clientes.satisfaccion_soporte.tickets_positivos.value = ticketsVal;
  window.appState.perspectiva_clientes.satisfaccion_soporte.tickets_positivos.status = ticketsVal >= 85 ? 'success' : ticketsVal >= 75 ? 'warning' : 'danger';

  let confianzaVal = 30 + (window.diagnosticScores.responsabilidad + window.diagnosticScores.apropiacion_digital) * 6.5;
  confianzaVal = Math.min(95, Math.round(confianzaVal));
  window.appState.perspectiva_clientes.satisfaccion_soporte.confianza_digital.value = confianzaVal;
  window.appState.perspectiva_clientes.satisfaccion_soporte.confianza_digital.status = confianzaVal >= 85 ? 'success' : confianzaVal >= 70 ? 'warning' : 'danger';

  // 6. RECALCULATE CLIENTS & PORTAL B5 (Adoption & App)
  let digitalTramites = 30;
  if (window.diagnosticScores.portal_educativo >= 4) digitalTramites = 50;
  let appProgress = "0%";
  if (window.decisions.b5_portal) {
    // Principio de Adquisición/Estrategia ISO 38500: el portal B5 requiere seguridad (B1) e infraestructura (B2) para ser seguro
    if (window.decisions.b2_azure && window.decisions.b1_ciso) {
      digitalTramites = 90;
      appProgress = "100%";
      window.appState.perspectiva_clientes.hemocentro.kpis[1].status = 'success';
      window.appState.perspectiva_clientes.hemocentro.kpis[3].status = 'success';
      window.appState.perspectiva_clientes.educacion.portal_avance = '100%';
      window.appState.perspectiva_clientes.educacion.status = 'success';
      window.appState.perspectiva_clientes.educacion.status_text = 'Estable';
    } else {
      digitalTramites = 50; // Portal lanzado sin seguridad / Azure
      appProgress = "0% (Bloqueado)";
      window.appState.perspectiva_clientes.hemocentro.kpis[1].status = 'danger';
      window.appState.perspectiva_clientes.hemocentro.kpis[3].status = 'warning';
      window.appState.perspectiva_clientes.educacion.portal_avance = '0% (Falla)';
      window.appState.perspectiva_clientes.educacion.status = 'danger';
      window.appState.perspectiva_clientes.educacion.status_text = 'Falla de seguridad';
    }
  }
  window.appState.perspectiva_clientes.hemocentro.kpis[1].value = appProgress;
  window.appState.perspectiva_clientes.hemocentro.kpis[3].value = `${digitalTramites}%`;
  window.appState.perspectiva_procesos.kpis[3].value = `${digitalTramites}%`;
  window.appState.perspectiva_procesos.kpis[3].status = digitalTramites >= 80 ? 'success' : 'warning';

  // 7. CLIENT DYNAMIC RECOMMENDATIONS CONSOLE (Under ISO 38500)
  let clientRecText = "";
  if (!window.decisions.b5_portal) {
    clientRecText = "📢 **EVALUAR Y DIRIGIR:** El portal educativo de matrículas y la App de donaciones del Hemocentro se encuentran inactivos. Se recomienda coordinar la aprobación del **Proyecto B5 (Hemocentro 4.0)** en la consola de dirección para mitigar la desintermediación del Instituto y modernizar los trámites.";
  } else if (window.decisions.b5_portal && (!window.decisions.b2_azure || !window.decisions.b1_ciso)) {
    clientRecText = "⚠️ **INCUMPLIMIENTO GRAVE ISO 38500:** El portal y la app móvil de donación se han lanzado al público, pero la infraestructura física está obsoleta (sin servidores en Azure) y se carece de gobernanza de seguridad (sin CISO). **Riesgo crítico de caída de servicio y brecha de datos de pacientes**. Directiva del CIO Valle: suspender de inmediato el portal PSE hasta garantizar infraestructura segura.";
  } else {
    clientRecText = "✅ **MONITOREAR - ALINEACIÓN TI-NEGOCIO COMPLETA:** Se ha consolidado el lanzamiento seguro de la App Móvil y el portal transaccional PSE del Hemocentro en la nube de Azure y bajo el monitoreo activo del SOC del CISO Valle. Satisfacción del donante al 99.8% certificada por auditoría. La interoperabilidad digital con hospitales funciona exitosamente.";
  }
  
  const cliRecEl = document.getElementById('client-dynamic-recommendation');
  if (cliRecEl) cliRecEl.innerHTML = clientRecText;

  // 8. ISO 38500 DIRECTIVE RATING RATER
  let totalEvaluations = (window.decisions.audit_servidores ? 1 : 0) + (window.decisions.audit_seguridad ? 1 : 0) + (window.decisions.audit_procesos ? 1 : 0);
  let totalDirections = (window.decisions.b1_ciso ? 1 : 0) + (window.decisions.b2_azure ? 1 : 0) + (window.decisions.b3_api ? 1 : 0) + (window.decisions.b5_portal ? 1 : 0) + (window.decisions.b7_datos ? 1 : 0) + (window.decisions.b8_capacitacion ? 1 : 0);

  const ratingEl = document.getElementById('iso-38500-rating');
  if (ratingEl) {
    if (totalEvaluations === 0) {
      ratingEl.textContent = "EVALUANDO";
      ratingEl.className = "font-mono font-bold text-red-500 bg-red-950/45 px-2 py-0.5 rounded border border-red-900/60 uppercase tracking-widest text-[9px]";
    } else if (totalCost > 330) {
      ratingEl.textContent = "SOBRE-PRESUPUESTO";
      ratingEl.className = "font-mono font-bold text-red-500 bg-red-950/45 px-2 py-0.5 rounded border border-red-900/60 uppercase tracking-widest text-[9px]";
    } else if (window.decisions.b5_portal && (!window.decisions.b2_azure || !window.decisions.b1_ciso)) {
      ratingEl.textContent = "INCUMPLIMIENTO RIESGO";
      ratingEl.className = "font-mono font-bold text-red-500 bg-red-950/45 px-2 py-0.5 rounded border border-red-900/60 uppercase tracking-widest text-[9px]";
    } else if (totalEvaluations >= 2 && totalDirections >= 5) {
      ratingEl.textContent = "GOBERNANZA COMPLETA";
      ratingEl.className = "font-mono font-bold text-emerald-400 bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-900/60 uppercase tracking-widest text-[9px]";
    } else {
      ratingEl.textContent = "GOBIERNO PARCIAL";
      ratingEl.className = "font-mono font-bold text-amber-400 bg-amber-950/45 px-2 py-0.5 rounded border border-amber-900/60 uppercase tracking-widest text-[9px]";
    }
  }

  // Refrescar entradas de la interfaz
  window.syncInputsWithState();

  // Llamar al motor de renderizado de la UI
  if (typeof window.renderDashboard === 'function') {
    window.renderDashboard();
  }
};

// Sincronizador de la interfaz con las variables de estado
window.syncInputsWithState = function() {
  // Checkboxes del panel lateral
  const sideChecks = {
    'audit-servidores': window.decisions.audit_servidores,
    'audit-seguridad': window.decisions.audit_seguridad,
    'audit-procesos': window.decisions.audit_procesos,
    'dirigir-b1': window.decisions.b1_ciso,
    'dirigir-b2': window.decisions.b2_azure,
    'dirigir-b3': window.decisions.b3_api,
    'dirigir-b5': window.decisions.b5_portal,
    'dirigir-b7': window.decisions.b7_datos,
    'dirigir-b8': window.decisions.b8_capacitacion
  };

  Object.keys(sideChecks).forEach(htmlId => {
    const el = document.getElementById(htmlId);
    if (el) el.checked = sideChecks[htmlId];
  });

  // Sincronizar selectores del autodiagnóstico en la UI (si existen en el DOM)
  const diagKeys = Object.keys(window.diagnosticScores);
  diagKeys.forEach(key => {
    // Sincronizar el slider o burbujas
    const valSpan = document.getElementById(`diag-val-${key}`);
    if (valSpan) valSpan.textContent = window.diagnosticScores[key];
    
    const slider = document.getElementById(`diag-slider-${key}`);
    if (slider) slider.value = window.diagnosticScores[key];
  });
};
