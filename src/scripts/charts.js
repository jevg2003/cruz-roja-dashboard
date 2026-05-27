// charts.js - Controlador de Gráficos Chart.js Reactivos (PETI 2026-2030)

window.charts = {
  income: null,
  radar: null,
  isoRadar: null
};

// ============================================================
// DEFINICIÓN DE LOS 6 PRINCIPIOS ISO/IEC 38500:2024
// ============================================================
const principiosISO38500Def = [
  {
    id: "responsabilidad",
    nombre: "Responsabilidad",
    icono: "fa-user-shield",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-500/50",
    bgColor: "bg-cyan-950/10",
    barColor: "bg-cyan-500",
    descripcion: "Roles y responsabilidades claras para TI en la organización.",
    aplicacion_cr: "Designación formal del CISO, definición de roles en el PETI y gobernanza del Comité de TI de la Cruz Roja Valle.",
    score_key: "responsabilidad",
    kpi_key: "ciso_designado",
    meta: "CISO designado + SOC activo Q2 2026",
    principio_cr: "Independencia · Unidad",
    valor_cr: "Justicia"
  },
  {
    id: "estrategia",
    nombre: "Estrategia",
    icono: "fa-chess",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/50",
    bgColor: "bg-blue-950/10",
    barColor: "bg-blue-500",
    descripcion: "Estrategia de TI alineada con la estrategia empresarial.",
    aplicacion_cr: "El PETI 2026–2030 alinea los 8 proyectos con la misión humanitaria. BSC con 3 rutas causales (Hemocentro, Ciberseguridad, Educación).",
    score_key: "interoperabilidad",
    kpi_key: "ejecucion_presupuesto",
    meta: "Madurez digital 4.2/5.0 al 2030",
    principio_cr: "Humanidad · Universalidad",
    valor_cr: "Dignidad · Solidaridad"
  },
  {
    id: "adquisicion",
    nombre: "Adquisición",
    icono: "fa-cart-shopping",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/50",
    bgColor: "bg-purple-950/10",
    barColor: "bg-purple-500",
    descripcion: "Decisiones de adquisición de TI válidas y transparentes.",
    aplicacion_cr: "Convenio MAKAIA (ahorro 50–100% licencias), priorización de proyectos B1–B8 con criterios de ROI humanitario y presupuesto de $330M.",
    score_key: "convenios_makaia",
    kpi_key: "ejecucion_presupuesto",
    meta: "Desviación presupuestal ≤ 10% en PETI",
    principio_cr: "Independencia · Voluntariado",
    valor_cr: "Justicia"
  },
  {
    id: "actuacion",
    nombre: "Actuación",
    icono: "fa-gauge-high",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/50",
    bgColor: "bg-emerald-950/10",
    barColor: "bg-emerald-500",
    descripcion: "Idoneidad de TI para el propósito y soporte del negocio.",
    aplicacion_cr: "Disponibilidad 24/7 del Hemocentro ($771M), SLA de servicios TI y nivel de satisfacción del personal médico y administrativo.",
    score_key: "backups",
    kpi_key: "disponibilidad_hemocentro",
    meta: "Disponibilidad 99.8% y SLA 95%",
    principio_cr: "Humanidad · Unidad · Voluntariado",
    valor_cr: "Solidaridad · Igualdad"
  },
  {
    id: "conformidad",
    nombre: "Conformidad",
    icono: "fa-file-shield",
    textColor: "text-red-400",
    borderColor: "border-red-500/50",
    bgColor: "bg-red-950/10",
    barColor: "bg-red-500",
    descripcion: "Cumplimiento de leyes, reglamentos y políticas internas.",
    aplicacion_cr: "Ley 1581 (protección datos pacientes/donantes), ISO 27001 (actualmente 45%), Decreto 767/2022 de Transformación Digital.",
    score_key: "conformidad",
    kpi_key: "iso_27001",
    meta: "ISO 27001 al 90% en 2027",
    principio_cr: "Imparcialidad · Neutralidad",
    valor_cr: "Dignidad"
  },
  {
    id: "comportamiento_humano",
    nombre: "Comportamiento Humano",
    icono: "fa-people-group",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/50",
    bgColor: "bg-amber-950/10",
    barColor: "bg-amber-500",
    descripcion: "Respeto por el comportamiento humano en las decisiones de TI.",
    aplicacion_cr: "Programa de capacitación digital B8 ($15M), microaprendizaje con Teams para médicos y voluntarios, gestión del cambio.",
    score_key: "apropiacion_digital",
    kpi_key: "madurez_digital",
    meta: "Madurez digital 4.2/5.0 y cero Shadow IT",
    principio_cr: "Voluntariado · Humanidad",
    valor_cr: "Igualdad · Solidaridad"
  }
];

// ============================================================
// HELPER: Calcular scores por principio (0-5)
// ============================================================
window.calcPrincipioScores = function() {
  const ds = window.diagnosticScores || {};
  const kpis = window.appState ? window.appState.top_kpis : null;

  const cisoVal = kpis && kpis.ciso_designado.value === "SÍ" ? 5 : 0;
  const isoVal  = kpis ? Math.min(5, (kpis.iso_27001.value / 100) * 5) : 0;
  const uptimeVal = kpis ? Math.min(5, Math.max(0, (kpis.disponibilidad_hemocentro.value - 95) * (5 / 5))) : 0;
  const presupVal = kpis ? Math.min(5, (kpis.ejecucion_presupuesto.value / 100) * 5) : 0;
  const madurezVal = kpis ? Math.min(5, kpis.madurez_digital.value) : 0;

  return {
    responsabilidad:      parseFloat(((ds.responsabilidad || 0) * 0.7 + cisoVal * 0.3).toFixed(2)),
    estrategia:           parseFloat((((ds.interoperabilidad || 0) + (ds.canales_donantes || 0) + (ds.portal_educativo || 0)) / 3 * 0.7 + presupVal * 0.3).toFixed(2)),
    adquisicion:          parseFloat((((ds.servidores || 0) + (ds.convenios_makaia || 0)) / 2 * 0.7 + presupVal * 0.3).toFixed(2)),
    actuacion:            parseFloat((((ds.backups || 0) + (ds.mesa_ayuda || 0)) / 2 * 0.7 + uptimeVal * 0.3).toFixed(2)),
    conformidad:          parseFloat(((ds.conformidad || 0) * 0.7 + isoVal * 0.3).toFixed(2)),
    comportamiento_humano: parseFloat(((ds.apropiacion_digital || 0) * 0.7 + madurezVal * 0.3).toFixed(2))
  };
};

// ============================================================
// HELPER: Score ISO 38500 Global (promedio de 6 principios)
// ============================================================
window.calcISO38500GlobalScore = function() {
  const scores = window.calcPrincipioScores();
  const vals = Object.values(scores);
  return parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2));
};

// ============================================================
// MEJORA 1: Renderizar tarjetas de 6 Principios ISO 38500
// ============================================================
window.renderPrincipiosISO = function() {
  const grid = document.getElementById('principios-iso-grid');
  if (!grid) return;

  const scores = window.calcPrincipioScores();

  grid.innerHTML = principiosISO38500Def.map(p => {
    const rawScore = scores[p.id] || 0;
    const pct = Math.min(100, Math.round((rawScore / 5) * 100));

    let badgeText, badgeCls;
    if (pct >= 70) {
      badgeText = 'CUMPLE';
      badgeCls = 'bg-emerald-950/60 text-emerald-400 border-emerald-900/40';
    } else if (pct >= 40) {
      badgeText = 'EN PROCESO';
      badgeCls = 'bg-amber-950/60 text-amber-400 border-amber-900/40';
    } else {
      badgeText = 'BRECHA';
      badgeCls = 'bg-red-950/60 text-red-500 border-red-900/40';
    }

    const barColorClass = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';

    return `
      <div class="glass-panel p-4 rounded-xl ${p.bgColor} border ${p.borderColor} flex flex-col justify-between space-y-3 hover:scale-[1.01] transition-all duration-200">
        <div>
          <div class="flex justify-between items-start gap-2 mb-2">
            <div class="flex items-center gap-2">
              <i class="fa-solid ${p.icono} ${p.textColor} text-sm"></i>
              <span class="text-xs font-black ${p.textColor} uppercase tracking-wider cyber-title">${p.nombre}</span>
            </div>
            <span class="text-[8.5px] font-bold px-1.5 py-0.5 rounded border ${badgeCls} uppercase flex-shrink-0">${badgeText}</span>
          </div>
          <p class="text-[10.5px] text-slate-400 leading-relaxed">${p.descripcion}</p>
          <p class="text-[10px] text-slate-500 mt-1.5 leading-relaxed italic">${p.aplicacion_cr}</p>
          <div class="mt-2 flex flex-wrap gap-1">
            <span class="text-[8.5px] font-bold bg-red-950/40 border border-red-900/30 text-red-400 px-1.5 py-0.5 rounded">🔴 ${p.principio_cr}</span>
            <span class="text-[8.5px] font-bold bg-slate-900/60 border border-slate-800 text-slate-400 px-1.5 py-0.5 rounded">${p.valor_cr}</span>
          </div>
        </div>
        <div class="space-y-1.5">
          <div class="flex justify-between text-[9px] font-bold font-mono">
            <span class="text-slate-400">Cumplimiento</span>
            <span class="${p.textColor}">${rawScore.toFixed(1)} / 5.0 (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700 ${barColorClass}" style="width: ${pct}%"></div>
          </div>
          <span class="text-[9px] text-slate-500 font-mono block">Meta: ${p.meta}</span>
        </div>
      </div>
    `;
  }).join('');
};

// ============================================================
// MEJORA 2: Radar de los 6 Principios ISO 38500
// ============================================================
window.renderISO38500RadarChart = function() {
  const canvas = document.getElementById('chart-iso-radar');
  if (!canvas) return;
  if (!window.diagnosticScores) return;

  const scores = window.calcPrincipioScores();
  const labels = ['Responsabilidad', 'Estrategia', 'Adquisición', 'Actuación', 'Conformidad', 'Comport. Humano'];
  const dataValues = [
    Math.round((scores.responsabilidad / 5) * 100),
    Math.round((scores.estrategia / 5) * 100),
    Math.round((scores.adquisicion / 5) * 100),
    Math.round((scores.actuacion / 5) * 100),
    Math.round((scores.conformidad / 5) * 100),
    Math.round((scores.comportamiento_humano / 5) * 100)
  ];

  // Destruir chart anterior para evitar "Canvas already in use"
  const existingChart = Chart.getChart(canvas);
  if (existingChart) {
    existingChart.destroy();
  }

  const ctx = canvas.getContext('2d');
  window.charts.isoRadar = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Madurez Actual 2026',
          data: dataValues,
          fill: true,
          backgroundColor: 'rgba(200, 16, 46, 0.15)',
          borderColor: 'rgba(200, 16, 46, 0.85)',
          pointBackgroundColor: '#C8102E',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#C8102E',
          pointRadius: 4,
          borderWidth: 2
        },
        {
          label: 'Meta ISO 38500 (100%)',
          data: [100, 100, 100, 100, 100, 100],
          fill: true,
          backgroundColor: 'rgba(0, 230, 118, 0.04)',
          borderColor: 'rgba(0, 230, 118, 0.45)',
          pointBackgroundColor: '#00e676',
          pointBorderColor: '#fff',
          borderDash: [5, 4],
          pointRadius: 3,
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#475569',
            font: { family: 'Outfit', size: 10, weight: 'bold' },
            padding: 16
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        r: {
          grid: { color: 'rgba(15, 23, 42, 0.09)' },
          angleLines: { color: 'rgba(15, 23, 42, 0.09)' },
          pointLabels: {
            color: '#334155',
            font: { family: 'Outfit', size: 9, weight: 'bold' }
          },
          ticks: { display: false },
          min: 0,
          max: 100
        }
      }
    }
  });
};

window.renderCharts = function() {
  if (!window.appState) return;

  // 1. Gráfico de Dona de Fuentes de Ingresos
  const donutCanvas = document.getElementById('incomeDonutChart');
  if (donutCanvas) {
    const labels = window.appState.perspectiva_financiera.fuentes_ingreso.map(x => x.name);
    const dataValues = window.appState.perspectiva_financiera.fuentes_ingreso.map(x => x.value);

    if (window.charts.income) {
      window.charts.income.data.labels = labels;
      window.charts.income.data.datasets[0].data = dataValues;
      window.charts.income.update();
    } else {
      const ctx = donutCanvas.getContext('2d');
      window.charts.income = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: dataValues,
            backgroundColor: ['#d32f2f', '#475569', '#f59e0b'],
            borderWidth: 2.5,
            borderColor: '#ffffff',
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#475569',
                font: { family: 'Outfit', size: 11, weight: 'bold' }
              }
            }
          },
          cutout: '65%'
        }
      });
    }
  }

  // 2. Gráfico de Radar Multivariado de Metas 2030
  const radarCanvas = document.getElementById('radarKpiChart');
  if (radarCanvas) {
    // Datos Dinámicos recalculados según el estado actual
    let currentRadar = [...window.appState.perspectiva_aprendizaje.radar_chart.actual];
    let targetRadar = [...window.appState.perspectiva_aprendizaje.radar_chart.target];
    
    // Ajustar valores del radar en vivo según estado de decisiones y autodiagnóstico
    currentRadar[0] = (window.appState.top_kpis.disponibilidad_hemocentro.value - 95) * 20; // escalar disponibilidad 95-100 a 0-100
    currentRadar[1] = (window.appState.top_kpis.madurez_digital.value / 5.0) * 100;
    currentRadar[2] = parseInt(window.appState.perspectiva_clientes.hemocentro.kpis[3].value);
    currentRadar[4] = window.appState.top_kpis.iso_27001.value;
    currentRadar[5] = window.appState.perspectiva_clientes.satisfaccion_soporte.global_csat.value * 10;
    
    if (window.appState.top_kpis.ciso_designado.value === 'SÍ') {
      currentRadar[3] = 100; // Integración
      currentRadar[4] = 90;  // ISO 27001
    } else {
      currentRadar[3] = (window.decisions.b3_api ? 80 : 0) + (window.decisions.b7_datos ? 20 : 0);
    }
    
    // Si las preguntas individuales del autodiagnóstico son cambiadas, el radar responde al instante
    if (window.diagnosticScores) {
      currentRadar[1] = (window.appState.top_kpis.madurez_digital.value / 5.0) * 100; // Madurez Digital Promedio
      currentRadar[3] = Math.min(100, (window.diagnosticScores.interoperabilidad / 5.0) * 100 + (window.decisions.b3_api ? 50 : 0));
    }

    if (window.charts.radar) {
      window.charts.radar.data.datasets[0].data = currentRadar;
      window.charts.radar.data.datasets[1].data = targetRadar;
      window.charts.radar.update();
    } else {
      const ctx = radarCanvas.getContext('2d');
      window.charts.radar = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: window.appState.perspectiva_aprendizaje.radar_chart.labels,
          datasets: [
            {
              label: 'Estado Actual 2026',
              data: currentRadar,
              fill: true,
              backgroundColor: 'rgba(211, 47, 47, 0.15)',
              borderColor: 'rgba(211, 47, 47, 0.85)',
              pointBackgroundColor: '#ff3344',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(211, 47, 47, 1)'
            },
            {
              label: 'Meta PETI 2030',
              data: targetRadar,
              fill: true,
              backgroundColor: 'rgba(0, 230, 118, 0.05)',
              borderColor: 'rgba(0, 230, 118, 0.75)',
              pointBackgroundColor: '#00e676',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(0, 230, 118, 1)'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#475569',
                font: { family: 'Outfit', size: 11, weight: 'bold' }
              }
            }
          },
          scales: {
            r: {
              grid: { color: 'rgba(15, 23, 42, 0.07)' },
              angleLines: { color: 'rgba(15, 23, 42, 0.07)' },
              pointLabels: {
                color: '#334155',
                font: { family: 'Outfit', size: 9.5, weight: 'bold' }
              },
              ticks: { display: false },
              min: 0,
              max: 100
            }
          }
        }
      });
    }
  }
};

window.renderDashboard = function() {
  if (!window.appState) return;

  const kpis = window.appState.top_kpis;
  
  // Helper for status classes
  const getStatusClasses = (status) => {
    if (status === 'success') return { text: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-950/60' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' };
    return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/60' };
  };

  // 1. TOP KPIS STRIP REACTIVITY
  const mClasses = getStatusClasses(kpis.madurez_digital.status);
  const mValEl = document.getElementById('strip-madurez-val');
  const mEl = document.getElementById('strip-madurez');
  if (mValEl) {
    mValEl.textContent = kpis.madurez_digital.value.toFixed(1);
    mValEl.className = `cyber-value text-3xl font-black ${mClasses.text}`;
  }
  if (mEl) {
    mEl.className = `glass-panel p-4.5 rounded-xl border-b-2 ${mClasses.border} flex flex-col justify-between`;
  }

  const isoClasses = getStatusClasses(kpis.iso_27001.status);
  const isoValEl = document.getElementById('strip-iso-val');
  const isoEl = document.getElementById('strip-iso');
  if (isoValEl) {
    isoValEl.textContent = kpis.iso_27001.value + '%';
    isoValEl.className = `cyber-value text-3xl font-black ${isoClasses.text}`;
  }
  if (isoEl) {
    isoEl.className = `glass-panel p-4.5 rounded-xl border-b-2 ${isoClasses.border} flex flex-col justify-between`;
  }

  const uptimeClasses = getStatusClasses(kpis.disponibilidad_hemocentro.status);
  const uptimeValEl = document.getElementById('strip-uptime-val');
  const uptimeEl = document.getElementById('strip-uptime');
  if (uptimeValEl) {
    uptimeValEl.textContent = kpis.disponibilidad_hemocentro.value + '%';
    uptimeValEl.className = `cyber-value text-3xl font-black ${uptimeClasses.text}`;
  }
  if (uptimeEl) {
    uptimeEl.className = `glass-panel p-4.5 rounded-xl border-b-2 ${uptimeClasses.border} flex flex-col justify-between`;
  }

  const presClasses = getStatusClasses(kpis.ejecucion_presupuesto.status);
  const presValEl = document.getElementById('strip-presupuesto-val');
  const presEl = document.getElementById('strip-presupuesto');
  if (presValEl) {
    presValEl.textContent = kpis.ejecucion_presupuesto.value + '%';
    presValEl.className = `cyber-value text-3xl font-black ${presClasses.text}`;
  }
  if (presEl) {
    presEl.className = `glass-panel p-4.5 rounded-xl border-b-2 ${presClasses.border} flex flex-col justify-between`;
  }

  const cisoClasses = getStatusClasses(kpis.ciso_designado.status);
  const cisoValEl = document.getElementById('strip-ciso-val');
  const cisoEl = document.getElementById('strip-ciso');
  if (cisoValEl) {
    cisoValEl.textContent = kpis.ciso_designado.value;
    cisoValEl.className = `cyber-value text-3xl font-black ${cisoClasses.text}`;
  }
  if (cisoEl) {
    cisoEl.className = `glass-panel p-4.5 rounded-xl border-b-2 ${cisoClasses.border} flex flex-col justify-between`;
  }

  const ingValEl = document.getElementById('strip-ingresos-val');
  if (ingValEl) {
    ingValEl.textContent = kpis.ingresos_hemocentro.value.replace(' COP', '');
  }

  // 2. BSC STRATEGY MAP DYNAMIC BADGES
  const c1Kpi = document.getElementById('card-c1-kpi');
  if (c1Kpi) c1Kpi.textContent = window.appState.top_kpis.disponibilidad_hemocentro.value + '% disp.';
  
  const c2Kpi = document.getElementById('card-c2-kpi');
  if (c2Kpi) c2Kpi.textContent = 'Confianza ' + window.appState.perspectiva_clientes.hospitales_b2b.confiabilidad;

  const c3Kpi = document.getElementById('card-c3-kpi');
  if (c3Kpi) c3Kpi.textContent = 'Portal ' + window.appState.perspectiva_clientes.educacion.portal_avance;

  const p1Kpi = document.getElementById('card-p1-kpi');
  if (p1Kpi) p1Kpi.textContent = 'Migración ' + (window.decisions.b2_azure ? '100%' : '0%');

  const p2Kpi = document.getElementById('card-p2-kpi');
  if (p2Kpi) p2Kpi.textContent = 'ISO ' + window.appState.top_kpis.iso_27001.value + '%';

  const p3Kpi = document.getElementById('card-p3-kpi');
  if (p3Kpi) p3Kpi.textContent = 'Integración ' + window.appState.perspectiva_procesos.kpis[2].value;

  const p4Kpi = document.getElementById('card-p4-kpi');
  if (p4Kpi) p4Kpi.textContent = 'Trámites ' + window.appState.perspectiva_clientes.hemocentro.kpis[3].value;

  const a1Kpi = document.getElementById('card-a1-kpi');
  if (a1Kpi) a1Kpi.textContent = 'Madurez ' + window.appState.top_kpis.madurez_digital.value;

  const a2Kpi = document.getElementById('card-a2-kpi');
  if (a2Kpi) a2Kpi.textContent = window.decisions.b1_ciso ? 'CISO Activo' : 'Sin CISO';

  const a3Kpi = document.getElementById('card-a3-kpi');
  if (a3Kpi) a3Kpi.textContent = 'Iniciativas ' + (window.diagnosticScores.apropiacion_digital >= 4 ? '5' : '1');

  const f1Kpi = document.getElementById('card-f1-kpi');
  if (f1Kpi) f1Kpi.textContent = 'Disp. ' + window.appState.top_kpis.disponibilidad_hemocentro.value + '%';

  const f2Kpi = document.getElementById('card-f2-kpi');
  if (f2Kpi) f2Kpi.textContent = 'Ejecuc. ' + window.appState.top_kpis.ejecucion_presupuesto.value + '%';

  const f3Kpi = document.getElementById('card-f3-kpi');
  if (f3Kpi) f3Kpi.textContent = 'Makaia ' + (window.diagnosticScores.convenios_makaia >= 4 ? '100%' : '50%');

  // 3. FINANCIAL VIEW REACTIVITY
  const fin = window.appState.perspectiva_financiera;
  
  const finIng = document.getElementById('fin-ingresos');
  if (finIng) finIng.textContent = fin.ingresos_totales.amount.replace(' COP', '');
  const finIngDesc = document.getElementById('fin-ingresos-desc');
  if (finIngDesc) finIngDesc.textContent = fin.ingresos_totales.description;

  const finPres = document.getElementById('fin-presupuesto');
  if (finPres) finPres.textContent = fin.presupuesto_ti.amount;
  
  const finPresBadge = document.getElementById('fin-presupuesto-badge');
  if (finPresBadge) {
    finPresBadge.textContent = fin.presupuesto_ti.status_text;
    const pClasses = getStatusClasses(fin.presupuesto_ti.status);
    finPresBadge.className = `border ${pClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`;
  }
  
  const finPresBar = document.getElementById('fin-presupuesto-bar');
  if (finPresBar) {
    finPresBar.style.width = fin.presupuesto_ti.amount;
    if (window.appState.top_kpis.ejecucion_presupuesto.status === 'danger') {
      finPresBar.className = "bg-red-500 h-full";
    } else {
      finPresBar.className = "bg-neon-amber h-full";
    }
  }

  const finAct = document.getElementById('fin-activos');
  if (finAct) finAct.textContent = fin.activos_tecnologicos.amount.replace(' COP', '');
  
  const finActBadge = document.getElementById('fin-activos-badge');
  if (finActBadge) {
    const actStatus = window.decisions.b2_azure ? 'success' : 'danger';
    const actClasses = getStatusClasses(actStatus);
    finActBadge.textContent = window.decisions.b2_azure ? 'Infraestructura Migrada' : fin.activos_tecnologicos.status_text;
    finActBadge.className = `border ${actClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`;
    
    const finActDesc = document.querySelector('#card-fin-activos p');
    if (finActDesc) {
      finActDesc.textContent = window.decisions.b2_azure 
        ? 'Servidores migrados a la nube híbrida de Azure - Resiliencia garantizada' 
        : 'Servidores obsoletos > 5 años - Riesgo operativo';
    }
    const finActBar = document.getElementById('fin-activos-bar');
    if (finActBar) {
      finActBar.style.width = window.decisions.b2_azure ? '100%' : '66%';
      finActBar.className = window.decisions.b2_azure ? 'bg-emerald-500 h-full' : 'bg-red-500 h-full';
    }
  }

  const finTable = document.getElementById('fin-investment-rows');
  if (finTable) {
    finTable.innerHTML = fin.inversiones_peti.map(inv => {
      let aprobado = false;
      if (inv.proyecto.includes("B1")) aprobado = window.decisions.b1_ciso;
      else if (inv.proyecto.includes("B2")) aprobado = window.decisions.b2_azure;
      else if (inv.proyecto.includes("B3")) aprobado = window.decisions.b3_api;
      else if (inv.proyecto.includes("B5")) aprobado = window.decisions.b5_portal;
      else if (inv.proyecto.includes("B7")) aprobado = window.decisions.b7_datos;
      else if (inv.proyecto.includes("B8")) aprobado = window.decisions.b8_capacitacion;
      else aprobado = true;

      const badgeColor = inv.prioridad === 'Crítica' ? 'bg-red-950/60 text-red-500 border-red-900/40' : inv.prioridad === 'Alta' ? 'bg-amber-950/60 text-amber-500 border-amber-900/40' : 'bg-slate-900/60 text-slate-400 border-slate-800';
      const statusText = aprobado ? '✓ Aprobado' : '⚡ Requerido';
      const statusColor = aprobado ? 'text-emerald-400 font-extrabold' : 'text-slate-500 font-semibold';
      
      return `
        <tr class="border-b border-slate-850 hover:bg-slate-900/20">
          <td class="py-3 font-medium text-slate-200">
            <span class="block">${inv.proyecto}</span>
            <span class="text-[10px] ${statusColor} block mt-0.5">${statusText}</span>
          </td>
          <td class="py-3 text-center">
            <span class="border px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}">
              ${inv.prioridad}
            </span>
          </td>
          <td class="py-3 text-right font-mono font-bold text-slate-100">${inv.monto}</td>
        </tr>
      `;
    }).join('');
  }

  const finTotal = document.getElementById('fin-total-investment');
  if (finTotal) {
    let computedCost = 60;
    if (window.decisions.b1_ciso) computedCost += 45;
    if (window.decisions.b2_azure) computedCost += 80;
    if (window.decisions.b3_api) computedCost += 55;
    if (window.decisions.b5_portal) computedCost += 75;
    if (window.decisions.b7_datos) computedCost += 12;
    if (window.decisions.b8_capacitacion) computedCost += 15;
    finTotal.textContent = `$${computedCost}.0M COP`;
    finTotal.className = computedCost > 330 ? "text-xl font-mono font-black text-red-500 animate-pulse" : "text-xl font-mono font-black text-emerald-400 animate-pulse";
  }

  // 4. CLIENTS VIEW REACTIVITY
  const cl = window.appState.perspectiva_clientes;

  const clHemoIncome = document.getElementById('client-hemo-income');
  if (clHemoIncome) clHemoIncome.textContent = cl.hemocentro.ingresos;

  const clHemoGrid = document.getElementById('client-hemo-kpis');
  if (clHemoGrid) {
    clHemoGrid.innerHTML = cl.hemocentro.kpis.map(k => {
      const c = getStatusClasses(k.status);
      return `
        <div class="glass-panel p-4 rounded-xl border-l-4 ${k.status === 'success' ? 'border-emerald-500' : k.status === 'warning' ? 'border-amber-500' : 'border-red-500'}">
          <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">${k.name}</span>
          <span class="cyber-value text-2xl font-black ${c.text} block mt-2">${k.value}</span>
          <span class="text-[10px] text-slate-500 font-mono block mt-1">${k.target}</span>
          <p class="text-[11px] text-slate-350 mt-2 leading-relaxed border-t border-slate-850 pt-2 font-semibold">
            ${k.action}
          </p>
        </div>
      `;
    }).join('');
  }

  const clEduIncome = document.getElementById('client-edu-income');
  if (clEduIncome) clEduIncome.textContent = cl.educacion.ingresos;
  
  const clEduProgress = document.getElementById('client-edu-progress');
  if (clEduProgress) {
    clEduProgress.textContent = cl.educacion.portal_avance;
    clEduProgress.className = cl.educacion.status === 'success' ? 'font-bold text-emerald-400' : 'font-bold text-red-500';
  }

  const clEduBadge = document.getElementById('client-edu-badge');
  if (clEduBadge) {
    clEduBadge.textContent = cl.educacion.status_text;
    const clEduClasses = getStatusClasses(cl.educacion.status);
    clEduBadge.className = `border ${clEduClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`;
  }
  
  const clEduAction = document.getElementById('client-edu-action');
  if (clEduAction) clEduAction.textContent = cl.educacion.action;

  const clHospConf = document.getElementById('client-hosp-conf');
  if (clHospConf) {
    clHospConf.textContent = cl.hospitales_b2b.confiabilidad;
    const clHospClasses = getStatusClasses(cl.hospitales_b2b.status);
    clHospConf.className = `cyber-value text-2xl font-black ${clHospClasses.text}`;
  }

  const clHospBadge = document.getElementById('client-hosp-badge');
  if (clHospBadge) {
    clHospBadge.textContent = cl.hospitales_b2b.status_text;
    const clHospClasses = getStatusClasses(cl.hospitales_b2b.status);
    clHospBadge.className = `border ${clHospClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`;
  }
  
  const clHospAction = document.getElementById('client-hosp-action');
  if (clHospAction) clHospAction.textContent = cl.hospitales_b2b.action;

  const clCsatGrid = document.getElementById('client-csat-kpis');
  if (clCsatGrid) {
    const cs = cl.satisfaccion_soporte;
    const cardsCsat = [
      { name: cs.global_csat.titulo, value: cs.global_csat.value + ' / ' + cs.global_csat.max, target: cs.global_csat.target, status: cs.global_csat.status, action: cs.global_csat.action },
      { name: cs.tickets_positivos.titulo, value: cs.tickets_positivos.value + '%', target: cs.tickets_positivos.target + '%', status: cs.tickets_positivos.status, action: cs.tickets_positivos.action },
      { name: cs.confianza_digital.titulo, value: cs.confianza_digital.value + '%', target: cs.confianza_digital.target + '%', status: cs.confianza_digital.status, action: cs.confianza_digital.action }
    ];
    
    clCsatGrid.innerHTML = cardsCsat.map(c => {
      const classes = getStatusClasses(c.status);
      return `
        <div class="bg-slate-900/35 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between min-h-[160px]">
          <div>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">${c.name}</span>
            <span class="cyber-value text-2xl font-black ${classes.text} block mt-1.5">${c.value}</span>
            <span class="text-[10px] text-slate-500 font-mono block mt-0.5">Meta: ${c.target}</span>
          </div>
          <p class="text-[11px] text-slate-300 mt-3 leading-relaxed border-t border-slate-850/50 pt-2 font-semibold">
            ${c.action}
          </p>
        </div>
      `;
    }).join('');
  }

  // 5. PROCESSES VIEW REACTIVITY
  const pr = window.appState.perspectiva_procesos;

  const prStrip = document.getElementById('process-strip-kpis');
  if (prStrip) {
    prStrip.innerHTML = pr.kpis.map(k => {
      const c = getStatusClasses(k.status);
      return `
        <div class="glass-panel p-5 rounded-2xl border-t-2 ${k.status === 'success' ? 'border-emerald-500' : k.status === 'warning' ? 'border-amber-500' : 'border-red-500'}">
          <div class="flex justify-between items-start">
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">${k.name}</span>
            <span class="border ${c.text} border-current text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">${k.status_text}</span>
          </div>
          <span class="cyber-value text-3xl font-black ${c.text} block mt-2.5">${k.value}</span>
          <span class="text-[10px] text-slate-500 font-mono block mt-1">Objetivo: ${k.target}</span>
          <p class="text-[11px] text-slate-300 mt-3 leading-relaxed border-t border-slate-850 pt-2 font-semibold">${k.action}</p>
        </div>
      `;
    }).join('');
  }

  const prThreats = document.getElementById('process-threats-grid');
  if (prThreats) {
    prThreats.innerHTML = pr.radar_amenazas.map(t => {
      let mitigated = false;
      if (t.id === 'A1') mitigated = window.decisions.b1_ciso;
      else if (t.id === 'D2') mitigated = window.decisions.b2_azure;
      else if (t.id === 'A2') mitigated = window.decisions.audit_seguridad && window.decisions.b1_ciso;
      else if (t.id === 'A4') mitigated = window.decisions.b5_portal;
      else if (t.id === 'A3') mitigated = window.decisions.b3_api;
      else if (t.id === 'D4') mitigated = window.decisions.b1_ciso;

      const statusColor = mitigated ? 'text-emerald-450 text-emerald-450' : (t.status === 'danger' ? 'text-red-500' : 'text-amber-500');
      const statusBg = mitigated ? 'bg-emerald-950/20 border-emerald-900/30' : (t.status === 'danger' ? 'bg-red-950/20 border-red-900/30' : 'bg-amber-950/20 border-amber-900/30');
      const statusText = mitigated ? '⚡ Mitigado' : (t.status === 'danger' ? '🚨 Activa' : '⚠️ Latente');
      const textStrikethrough = mitigated ? 'line-through opacity-60' : '';

      return `
        <div class="border p-4.5 rounded-2xl ${statusBg} flex flex-col justify-between shadow-md">
          <div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-mono text-slate-400 font-bold">${t.id} • ${t.weight}</span>
              <span class="font-mono text-[9px] font-bold ${statusColor} border border-current px-2 py-0.5 rounded uppercase tracking-wider">${statusText}</span>
            </div>
            <h5 class="text-sm font-extrabold mt-2 text-slate-200 ${textStrikethrough}">${t.name}</h5>
            <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">${t.description}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-900/30">
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block cyber-title">Acción Recomendada:</span>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed font-semibold">${t.prescription}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  // 6. LEARNING VIEW REACTIVITY
  const ap = window.appState.perspectiva_aprendizaje;

  const learnMVal = document.getElementById('learn-madurez-val');
  if (learnMVal) {
    learnMVal.textContent = ap.madurez_digital.value.toFixed(1);
    const mClasses = getStatusClasses(ap.madurez_digital.status);
    learnMVal.className = `cyber-value text-3xl font-black ${mClasses.text}`;
  }
  
  const learnMBadge = document.getElementById('learn-madurez-badge');
  if (learnMBadge) {
    learnMBadge.textContent = ap.madurez_digital.status_text;
    const mClasses = getStatusClasses(ap.madurez_digital.status);
    learnMBadge.className = `border ${mClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`;
  }

  const learnMBar = document.getElementById('learn-madurez-bar-actual');
  if (learnMBar) {
    const scaleHeight = (ap.madurez_digital.value / 5.0) * 84;
    learnMBar.style.height = `${scaleHeight}px`;
    if (ap.madurez_digital.value >= 4.0) {
      learnMBar.className = "bg-emerald-500 w-8 rounded-t";
    } else if (ap.madurez_digital.value >= 3.0) {
      learnMBar.className = "bg-amber-500 w-8 rounded-t";
    } else {
      learnMBar.className = "bg-red-500 w-8 rounded-t";
    }
  }

  const learnMAction = document.getElementById('learn-madurez-action');
  if (learnMAction) learnMAction.textContent = ap.madurez_digital.action;

  const learnCertVal = document.getElementById('learn-cert-val');
  if (learnCertVal) {
    const certVal = window.decisions.b8_capacitacion ? "95%" : "70%";
    learnCertVal.textContent = certVal;
    const certBar = document.getElementById('learn-cert-bar');
    if (certBar) {
      certBar.style.width = certVal;
      certBar.className = window.decisions.b8_capacitacion ? "bg-emerald-500 h-full animate-pulse" : "bg-neon-amber h-full";
    }
    const certAction = document.getElementById('learn-cert-action');
    if (certAction) {
      certAction.textContent = window.decisions.b8_capacitacion 
        ? "✓ Personal capacitado en ciberseguridad y herramientas de Microsoft 365 exitosamente." 
        : "Presupuesto de $15M para ITIL 4 + COBIT en Q1 2027. Aprobar B8 en el autodiagnóstico.";
    }
    const certBadge = document.querySelector('#card-learn-cert span.bg-amber-950\\/60');
    if (certBadge) {
      certBadge.textContent = window.decisions.b8_capacitacion ? "Optimizado" : "Base";
      certBadge.className = window.decisions.b8_capacitacion 
        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase" 
        : "bg-amber-950/60 border border-amber-500/40 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase";
    }
  }

  const learnCobitVal = document.getElementById('learn-cobit-val');
  if (learnCobitVal) {
    const cobitVal = window.decisions.b8_capacitacion ? "80%" : "40%";
    learnCobitVal.textContent = cobitVal;
    const cobitBar = document.getElementById('learn-cobit-bar');
    if (cobitBar) {
      cobitBar.style.width = cobitVal;
      cobitBar.className = window.decisions.b8_capacitacion ? "bg-emerald-500 h-full animate-pulse" : "bg-red-500 h-full";
    }
    const cobitAction = document.getElementById('learn-cobit-action');
    if (cobitAction) {
      cobitAction.textContent = window.decisions.b8_capacitacion 
        ? "✓ Prácticas COBIT 2019 de gobernanza e ITIL 4 de servicios formalizadas en SharePoint." 
        : "Documentar en SharePoint + rutas de carrera TI para retener talento estratégico.";
    }
    const cobitBadge = document.querySelector('#card-learn-cobit span.bg-red-950\\/60');
    if (cobitBadge) {
      cobitBadge.textContent = window.decisions.b8_capacitacion ? "Alineado" : "Inicial";
      cobitBadge.className = window.decisions.b8_capacitacion 
        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase" 
        : "bg-red-950/60 border border-red-500/40 text-red-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase";
    }
  }

  const learnTimeline = document.getElementById('learn-roadmap-timeline');
  if (learnTimeline) {
    const activeProjects = [
      { id: 'B7', name: 'Gobierno de Datos Institucional', cronograma: 'Q1 2026', monto: '$12M', color: window.decisions.b7_datos ? '#10b981' : '#f59e0b', description: 'Políticas, roles, catálogo de datos y modelo formal de gestión.', status: window.decisions.b7_datos ? 'COMPLETADO' : 'EN ESPERA' },
      { id: 'B1', name: 'Ciberseguridad Humanitaria (SOC + DRP)', cronograma: 'Q2 2026', monto: '$45M', color: window.decisions.b1_ciso ? '#10b981' : '#ef4444', description: 'Centro de Operaciones de Seguridad + autenticación multifactor + DRP semestral.', status: window.decisions.b1_ciso ? 'COMPLETADO' : 'PRIORIDAD #1' },
      { id: 'B8', name: 'Capacitación Digital del Personal', cronograma: 'Q1 2027', monto: '$15M', color: window.decisions.b8_capacitacion ? '#10b981' : '#6b7280', description: 'Microaprendizaje con Teams. Elevar madurez de 2.8 a 4.2/5.0.', status: window.decisions.b8_capacitacion ? 'COMPLETADO' : 'PLANIFICADO' },
      { id: 'B2', name: 'Migración Cloud (Infraestructura Azure)', cronograma: 'Q2 2027', monto: '$80M', color: window.decisions.b2_azure ? '#10b981' : '#6b7280', description: 'Migración de servidores locales obsoletos a nube híbrida de Azure.', status: window.decisions.b2_azure ? 'COMPLETADO' : 'PLANIFICADO' }
    ];

    learnTimeline.innerHTML = activeProjects.map(p => {
      const isCompleted = p.status === 'COMPLETADO';
      const indicatorColor = isCompleted ? 'bg-emerald-500' : (p.status.includes('PRIORIDAD') ? 'bg-red-500' : 'bg-slate-600');
      const badgeStyle = isCompleted ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' : (p.status.includes('PRIORIDAD') ? 'bg-red-950/60 border-red-500/40 text-red-500' : 'bg-slate-900/60 border-slate-800 text-slate-400');
      
      return `
        <div class="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-900/10 border border-transparent hover:border-slate-850/50">
          <div class="mt-1 w-2.5 h-2.5 rounded-full ${indicatorColor} flex-shrink-0"></div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-center gap-2">
              <h5 class="text-xs font-bold text-slate-100">${p.id} - ${p.name}</h5>
              <span class="font-mono text-[9px] font-bold border px-1.5 py-0.5 rounded uppercase ${badgeStyle} flex-shrink-0">${p.status}</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">${p.description}</p>
            <div class="flex gap-4 text-[10px] text-slate-500 font-mono mt-1.5">
              <span>Cronograma: <strong class="text-slate-300">${p.cronograma}</strong></span>
              <span>Inversión: <strong class="text-slate-300">${p.monto}</strong></span>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 7. PRESCRIPTION VIEW REACTIVITY
  const pres = window.appState.prescripciones;

  const presFodaDiag = document.getElementById('pres-foda-diag');
  if (presFodaDiag) {
    const average = window.appState.top_kpis.madurez_digital.value;
    if (average < 2.5) {
      presFodaDiag.innerHTML = "<strong>🚨 ZONA DE SUPERVIVENCIA CRÍTICA:</strong> Los factores internos se encuentran en un nivel alarmante (madurez " + average + "/5.0). La Cruz Roja Seccional Valle se encuentra expuesta a ciberataques inminentes y caídas físicas que paralizarían el Hemocentro. <strong>La ciberseguridad (CISO/SOC) y la resiliencia Cloud deben ser prioritarias de inmediato.</strong>";
    } else if (average < 4.0) {
      presFodaDiag.innerHTML = "<strong>⚠️ ZONA DE GOBERNANZA PARCIAL:</strong> Se ha mejorado la resiliencia y mitigado riesgos críticos. No obstante, las debilidades de integración (matrículas del Instituto y App) limitan la captación de valor del entorno. <strong>Se recomienda completar la interoperabilidad HL7/FHIR y canales transaccionales.</strong>";
    } else {
      presFodaDiag.innerHTML = "<strong>✅ EXCELENCIA ESTRATÉGICA:</strong> Posicionamiento sólido en el cuadrante de crecimiento. La Cruz Roja posee una gobernanza al 100% segura, infraestructura escalable y procesos integrales de capacitación, lo que maximiza la eficiencia y la seguridad institucional.";
    }
  }

  const presFodaDeb = document.getElementById('pres-foda-debilidades');
  if (presFodaDeb) {
    const debList = [];
    if (!window.decisions.b1_ciso) debList.push("Sin CISO designado");
    if (window.appState.top_kpis.iso_27001.value < 70) debList.push("Cumplimiento ISO 27001 bajo (" + window.appState.top_kpis.iso_27001.value + "%)");
    if (!window.decisions.b2_azure) debList.push("Servidores locales obsoletos");
    if (!window.decisions.b3_api) debList.push("Islas de datos");
    if (window.appState.top_kpis.madurez_digital.value < 3.5) debList.push("Baja apropiación digital (" + window.appState.top_kpis.madurez_digital.value + ")");
    
    if (debList.length === 0) {
      debList.push("¡Sin debilidades críticas activas!");
    }
    
    presFodaDeb.innerHTML = debList.map(d => `
      <li class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full ${d.includes('¡') ? 'bg-emerald-500' : 'bg-red-500'}"></span>
        <span>${d}</span>
      </li>
    `).join('');
  }

  const presFodaOport = document.getElementById('pres-foda-oportunidades');
  if (presFodaOport) {
    presFodaOport.innerHTML = pres.foda.oportunidades.map(o => `
      <li class="flex items-center gap-1.5">
        <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
        <span>${o}</span>
      </li>
    `).join('');
  }

  const presSummary = document.getElementById('pres-executive-summary');
  if (presSummary) {
    const maturity = window.appState.top_kpis.madurez_digital.value;
    const isSuccess = maturity >= 4.0;
    const isWarning = maturity >= 2.5 && maturity < 4.0;
    
    presSummary.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <span class="text-xs text-slate-400 font-bold font-mono">ESTADO DE MADUREZ:</span>
          <span class="font-mono text-xs font-black ${isSuccess ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-red-500'}">
            ${isSuccess ? 'GOBERNANZA COMPLETA' : isWarning ? 'GOBIERNO PARCIAL' : 'RIESGO CRÍTICO'}
          </span>
        </div>
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <span class="text-xs text-slate-400 font-bold font-mono">MADUREZ PROMEDIO:</span>
          <span class="font-mono text-xs font-black text-slate-200">${maturity.toFixed(1)} / 5.0</span>
        </div>
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <span class="text-xs text-slate-400 font-bold font-mono">UPTIME HEMOCENTRO:</span>
          <span class="font-mono text-xs font-black text-slate-200">${window.appState.top_kpis.disponibilidad_hemocentro.value}%</span>
        </div>
        <div class="flex items-center justify-between border-b border-slate-900 pb-2">
          <span class="text-xs text-slate-400 font-bold font-mono">PRESUPUESTO TI EROGADO:</span>
          <span class="font-mono text-xs font-black text-slate-200">${window.appState.top_kpis.ejecucion_presupuesto.value}%</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-slate-400 font-bold font-mono">ALERTA SLA DE RANSOMWARE:</span>
          <span class="font-mono text-xs font-black ${window.decisions.b1_ciso ? 'text-emerald-400' : 'text-red-500 animate-pulse'}">
            ${window.decisions.b1_ciso ? 'DESACTIVADA' : 'ACTIVA EN ALERTA'}
          </span>
        </div>
      </div>
    `;
  }

  const presImmediate = document.getElementById('pres-immediate-actions');
  if (presImmediate) {
    const listP1 = [];
    if (!window.decisions.b1_ciso) {
      listP1.push({
        title: "Designar CISO Valle y activar SOC Humanitario",
        desc: "Con solo 45% de cumplimiento ISO 27001, un incidente de Ransomware paralizaría el 60% de los ingresos de la seccional ($771M COP). Asignar presupuesto de $45M de forma inmediata."
      });
    }
    if (!window.decisions.b2_azure) {
      listP1.push({
        title: "Migrar HeVa Base de Datos a Azure (DRP Cloud)",
        desc: "Los servidores físicos tienen más de 5 años. Un fallo de disco detendrá la captación de sangre de inmediato. Activar DRP híbrido automatizado en la nube."
      });
    }
    if (!window.decisions.b7_datos) {
      listP1.push({
        title: "Establecer Políticas de Gobierno de Datos",
        desc: "Sin un gobierno de datos formal no hay interoperabilidad posible ni cumplimiento de la Ley 1581 (MSPI). Costo de consultoría: $12M."
      });
    }
    
    if (listP1.length === 0) {
      listP1.push({
        title: "Acciones inmediatas completadas con éxito",
        desc: "Todas las directivas P1 han sido aprobadas e implementadas. El Gobierno de TI está blindado en infraestructura y seguridad."
      });
    }
    
    presImmediate.innerHTML = listP1.map((act, idx) => `
      <div class="flex gap-3">
        <span class="w-6 h-6 rounded-full ${act.title.includes('completadas') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-950' : 'bg-red-500/10 text-red-500 border-red-950'} border text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
          ${act.title.includes('completadas') ? '✓' : '0' + (idx + 1)}
        </span>
        <div>
          <span class="text-xs font-black text-slate-200 block">${act.title}</span>
          <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${act.desc}</p>
        </div>
      </div>
    `).join('');
  }

  const presStrategic = document.getElementById('pres-strategic-actions');
  if (presStrategic) {
    const listP2 = [];
    if (!window.decisions.b3_api) {
      listP2.push({
        title: "Implementar API Gateway FHIR/HL7",
        desc: "Siesa, HeVa y Q-Symphony operan aislados, impidiendo la trazabilidad del hemocomponente B2B con clínicas. Integrar mediante API Gateway. Inversión: $55M."
      });
    }
    if (!window.decisions.b5_portal) {
      listP2.push({
        title: "Portal transaccional PSE & App Hemocentro 4.0",
        desc: "Evitar la desintermediación del Instituto ($61M) por EdTech gratuitas y capturar mercados corporativos lanzando pasarelas de pago y agendamiento 100% online."
      });
    }
    if (!window.decisions.b8_capacitacion) {
      listP2.push({
        title: "Cerrar Brecha Digital en Voluntarios vía Teams",
        desc: "Aprobar plan de microaprendizaje móvil de $15M para entrenar a 300+ voluntarios en apps corporativas y mitigar el phishing, elevando madurez de 2.8 a 4.2."
      });
    }
    
    if (listP2.length === 0) {
      listP2.push({
        title: "Acciones estratégicas completadas con éxito",
        desc: "El PETI 2026-2030 opera en su nivel óptimo de madurez. Se ha cumplido con la alineación total de procesos de la Cruz Roja Valle."
      });
    }
    
    presStrategic.innerHTML = listP2.map((act, idx) => `
      <div class="flex gap-3">
        <span class="w-6 h-6 rounded-full ${act.title.includes('completadas') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-950' : 'bg-amber-500/10 text-amber-500 border-amber-950'} border text-[10px] font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
          ${act.title.includes('completadas') ? '✓' : '0' + (idx + 4)}
        </span>
        <div>
          <span class="text-xs font-black text-slate-200 block">${act.title}</span>
          <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${act.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // 8. UPDATE DIRECTIVAS BADGES IN THE GOBERNANZA VIEW
  const updateGobernanzaBadge = (badgeId, isApproved, approvedText = "ACTIVO", pendingText = "INACTIVO") => {
    const badge = document.getElementById(badgeId);
    if (badge) {
      if (isApproved) {
        badge.textContent = approvedText;
        badge.className = "font-mono text-[9.5px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-400 bg-emerald-950/40 flex-shrink-0";
      } else {
        badge.textContent = pendingText;
        badge.className = "font-mono text-[9.5px] font-bold px-2 py-0.5 rounded border border-slate-700 text-slate-400 bg-slate-900/40 flex-shrink-0";
      }
    }
  };

  updateGobernanzaBadge('badge-audit-servidores', window.decisions.audit_servidores, "REQUERIDO", "NO REQUERIDO");
  updateGobernanzaBadge('badge-audit-seguridad', window.decisions.audit_seguridad, "REQUERIDO", "NO REQUERIDO");
  updateGobernanzaBadge('badge-audit-procesos', window.decisions.audit_procesos, "REQUERIDO", "NO REQUERIDO");

  updateGobernanzaBadge('badge-dirigir-b1', window.decisions.b1_ciso, "APROBADO", "PENDIENTE");
  updateGobernanzaBadge('badge-dirigir-b2', window.decisions.b2_azure, "APROBADO", "PENDIENTE");
  updateGobernanzaBadge('badge-dirigir-b3', window.decisions.b3_api, "APROBADO", "PENDIENTE");
  updateGobernanzaBadge('badge-dirigir-b7', window.decisions.b7_datos, "APROBADO", "PENDIENTE");
  updateGobernanzaBadge('badge-dirigir-b8', window.decisions.b8_capacitacion, "APROBADO", "PENDIENTE");
  updateGobernanzaBadge('badge-dirigir-b5', window.decisions.b5_portal, "APROBADO", "PENDIENTE");

  // 9. RE-RENDER CHARTS
  if (typeof window.renderCharts === 'function') {
    window.renderCharts();
  }
};
