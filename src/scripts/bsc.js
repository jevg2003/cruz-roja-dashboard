// bsc.js - Mapa Balance Scorecard e Interacciones Láser SVG (ISO 38500)

// MAPEO NODO BSC → PRINCIPIOS ISO 38500
const bscISOMapping = {
  "f1":  ["actuacion", "conformidad"],
  "f2":  ["adquisicion", "actuacion"],
  "f3":  ["adquisicion"],
  "a1":  ["comportamiento_humano", "estrategia"],
  "a2":  ["responsabilidad", "conformidad"],
  "a3":  ["estrategia", "comportamiento_humano"],
  "p1":  ["adquisicion", "actuacion"],
  "p2":  ["conformidad", "responsabilidad"],
  "p3":  ["estrategia", "actuacion"],
  "p4":  ["estrategia", "adquisicion"],
  "c1":  ["actuacion", "conformidad"],
  "c2":  ["conformidad", "responsabilidad"],
  "c3":  ["estrategia", "comportamiento_humano"]
};

// Nombres y colores de principios para el tooltip
const isoPrincipioMeta = {
  responsabilidad:       { nombre: "Responsabilidad",       color: "text-cyan-400",   icon: "fa-user-shield" },
  estrategia:            { nombre: "Estrategia",            color: "text-blue-400",   icon: "fa-chess" },
  adquisicion:           { nombre: "Adquisición",           color: "text-purple-400", icon: "fa-cart-shopping" },
  actuacion:             { nombre: "Actuación",             color: "text-emerald-400",icon: "fa-gauge-high" },
  conformidad:           { nombre: "Conformidad",           color: "text-red-400",    icon: "fa-file-shield" },
  comportamiento_humano: { nombre: "Comport. Humano",       color: "text-amber-400",  icon: "fa-people-group" }
};

// DETALLES Y AUDITORÍA DE OBJETIVOS ESTRATÉGICOS DEL BSC
const bscObjectives = {
  "c1": { title: "Elevar experiencia del donante y disponibilidad Hemocentro 24/7", perspective: "Clientes y Beneficiarios", value: "99.1% disp.", target: "Meta: 99.8%", impact: "El Hemocentro representa el 60% de los ingresos totales de la organización ($771M COP). Su disponibilidad 24/7 es crítica para el abastecimiento hospitalario en el Valle.", action: "Aprobar Proyecto B2 (Azure) para garantizar migración, elevando la disponibilidad al 99.8% en la consola de dirección.", path: "R1 - Hemocentro" },
  "c2": { title: "Fortalecer confianza de hospitales y EPS aliados", perspective: "Clientes y Beneficiarios", value: "70%", target: "Meta: 85%", impact: "Los clientes B2B de hemocomponentes exigen garantías máximas de disponibilidad, ciberseguridad e ISO 27001.", action: "La acreditación ISO 27001 (hoy en 45%) es el principal habilitador de esta confianza estratégica.", path: "R2 - Ciberseguridad" },
  "c3": { title: "Retener y escalar mercado educativo con oferta digital", perspective: "Clientes y Beneficiarios", value: "0%", target: "Meta: 90% (2030)", impact: "El Instituto de Educación es una fuente clave de ingresos no asistenciales ($61M COP) en riesgo debido a la competencia digital gratuita.", action: "Lanzar el portal transaccional con PSE (Aprobar B5) para evitar desintermediación y capturar mercados B2B.", path: "R3 - Educación" },
  "p1": { title: "Migrar infraestructura crítica a Cloud Azure híbrido", perspective: "Procesos Internos", value: "En progreso", target: "Meta: Q2 2027", impact: "Elimina el riesgo físico de servidores obsoletos mayores a 5 años del Hemocentro. Elimina costos de mantenimiento físico.", action: "Dirigir la aprobación del Proyecto B2 (Azure) en la Consola ISO 38500 para migrar servidores y subir Uptime.", path: "R1 - Hemocentro" },
  "p2": { title: "Implementar ciberseguridad integral (SOC, DRP, ISO 27001)", perspective: "Procesos Internos", value: "45% ISO", target: "Meta 2026: 70%", impact: "El ransomware es la amenaza #1 del sector salud a nivel mundial. Sin CISO ni SOC, un incidente podría deparar por completo al Hemocentro.", action: "Aprobar B1 (CISO & SOC) para elevar cumplimiento normativo de ciberseguridad al 90% y mitigar ransomware.", path: "R2 - Ciberseguridad" },
  "p3": { title: "API Gateway: eliminar islas de información", perspective: "Procesos Internos", value: "0% integr.", target: "Meta: 100% (2027)", impact: "Siesa, HeVa y Q-Symphony operan aislados, impidiendo la trazabilidad del paciente y bloqueando la analítica de datos.", action: "Aprobar Proyecto B3 (API Gateway) para integrar bases de datos institucionales con estándares HL7/FHIR.", path: "R1 ↔ R3" },
  "p4": { title: "Digitalizar procesos educativos y soporte al estudiante", perspective: "Procesos Internos", value: "30%", target: "Meta: 95%", impact: "Facilita la retención estudiantil reduciendo fricciones administrativas y automatizando la matrícula del Instituto.", action: "Integrar pasarelas de pago y matrículas en línea aprobando el Proyecto B5 (Hemocentro 4.0).", path: "R3 - Educación" },
  "a1": { title: "Elevar madurez digital del personal de 2.8 a 4.2", perspective: "Aprendizaje y Crecimiento", value: "2.8 / 5.0", target: "Meta: 4.2 / 5.0", impact: "Las herramientas avanzadas no aportarán valor si los voluntarios y el personal no se apropian digitalmente de ellas.", action: "Evaluar competencias de voluntarios y dirigir la aprobación del Proyecto B8 (Capacitación digital de personal).", path: "R1 ↔ R3" },
  "a2": { title: "Establecer gobierno TI formal (CISO, COBIT, ITIL)", perspective: "Aprendizaje y Crecimiento", value: "40% COBIT", target: "Meta: 80%", impact: "La gobernanza formal previene incidentes, reduce rotación de personal técnico clave y alinea TI con la misión humanitaria.", action: "Dirigir el nombramiento del CISO (B1) y formalizar la documentación de procesos en SharePoint (Auditoría C).", path: "R2 - Ciberseguridad" },
  "a3": { title: "Fomentar cultura de innovación y pilotos tecnológicos", perspective: "Aprendizaje y Crecimiento", value: "1 Iniciativa", target: "Meta: 5 / año", impact: "Permite probar soluciones de automatización de bajo costo (como n8n y no-code) antes de inversiones masivas.", action: "Evaluar brecha y coordinar pilotos de automatización de procesos mediante personal capacitado.", path: "R1 - Hemocentro" },
  "f1": { title: "Asegurar disponibilidad TI crítica del Hemocentro", perspective: "Financiero", value: "99.1% disp.", target: "Meta 2030: 99.8%", impact: "Es la base que habilita el 60% de los ingresos de la seccional. Sin disponibilidad TI, la captación y distribución de sangre se paraliza.", action: "Garantizar redundancia de conectividad a internet local aprobando el proyecto de migración Azure (B2).", path: "R1 - Hemocentro" },
  "f2": { title: "Optimizar ejecución presupuestal TI (desviación < 10%)", perspective: "Financiero", value: "67% ejec.", target: "Meta: ≤10% desv.", impact: "Garantiza que la asignación del PETI se gaste eficientemente y no se pierdan recursos por retrasos en compras o despliegues.", action: "Evaluar desviaciones contables y aprobar convenios estratégicos que optimicen costos operativos.", path: "R2 - Ciberseguridad" },
  "f3": { title: "Reducir costo operativo TI con Cloud y n8n", perspective: "Financiero", value: "50% ahorro", target: "Meta: 100% conv.", impact: "El licenciamiento en ONGs mediante MAKAIA y Microsoft permite liberar presupuesto administrativo para misiones humanitarias.", action: "Migrar el 100% de licencias al convenio Makaia y automatizar reportes con n8n para reducir horas de personal administrativo.", path: "R3 - Educación" }
};

window.initBscInteractions = function() {
  const cards = document.querySelectorAll('.bsc-card');
  const detailsBox = document.getElementById('bsc-details-box');
  
  if (!cards || !detailsBox) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const objId = card.getAttribute('data-obj');
      const data = bscObjectives[objId];
      
      if (data) {
        document.getElementById('details-perspective').textContent = data.perspective;
        document.getElementById('details-title').textContent = data.title;
        document.getElementById('details-impact').textContent = data.impact;
        document.getElementById('details-action').textContent = data.action;
        document.getElementById('details-path').textContent = `Cadena: ${data.path}`;
        
        // Carga de valor dinámico reactivo en el popup
        let activeVal = data.value;
        if (objId === 'c1' || objId === 'f1') {
          activeVal = window.appState.top_kpis.disponibilidad_hemocentro.value + '%';
        } else if (objId === 'f2') {
          activeVal = window.appState.top_kpis.ejecucion_presupuesto.value + '%';
        } else if (objId === 'c2') {
          activeVal = window.appState.perspectiva_clientes.hospitales_b2b.confiabilidad;
        } else if (objId === 'p2') {
          activeVal = window.appState.top_kpis.iso_27001.value + '%';
        } else if (objId === 'a1') {
          activeVal = window.appState.top_kpis.madurez_digital.value + '';
        } else if (objId === 'c4' || objId === 'p4') {
          activeVal = window.appState.perspectiva_clientes.hemocentro.kpis[3].value;
        } else if (objId === 'p3') {
          activeVal = window.appState.perspectiva_procesos.kpis[2].value;
        }
        document.getElementById('details-value').textContent = activeVal;

        // MEJORA 3: Mostrar principios ISO 38500 que respaldan este nodo
        const isoPrincs = bscISOMapping[objId] || [];
        const isoPrincEl = document.getElementById('details-iso-principles');
        if (isoPrincEl) {
          if (isoPrincs.length > 0) {
            const scores = typeof window.calcPrincipioScores === 'function' ? window.calcPrincipioScores() : {};
            isoPrincEl.innerHTML = `
              <div class="mt-3 pt-2.5 border-t border-slate-800">
                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2 cyber-title">
                  <i class="fa-solid fa-scale-balanced text-brand-red-neon mr-1"></i> Principios ISO 38500 que respaldan este objetivo:
                </span>
                <div class="flex flex-wrap gap-1.5">
                  ${isoPrincs.map(pid => {
                    const meta = isoPrincipioMeta[pid];
                    if (!meta) return '';
                    const sc = scores[pid] || 0;
                    const pct = Math.round((sc / 5) * 100);
                    const barCol = pct >= 70 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-500';
                    return `
                      <div class="bg-slate-900/60 border border-slate-800 px-2 py-1.5 rounded-lg flex items-center gap-1.5 min-w-[120px]">
                        <i class="fa-solid ${meta.icon} ${meta.color} text-[10px]"></i>
                        <div class="flex-1 min-w-0">
                          <span class="text-[9px] font-bold ${meta.color} block">${meta.nombre}</span>
                          <div class="w-full bg-slate-800 h-1 rounded-full mt-0.5">
                            <div class="${barCol} h-full rounded-full" style="width:${pct}%"></div>
                          </div>
                        </div>
                        <span class="text-[8.5px] font-mono font-bold text-slate-400">${pct}%</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
            isoPrincEl.classList.remove('hidden');
          } else {
            isoPrincEl.classList.add('hidden');
          }
        }

        detailsBox.classList.remove('hidden');
        detailsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Cerrar caja de detalles
  const closeBtn = document.getElementById('close-bsc-details');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      detailsBox.classList.add('hidden');
    });
  }

  // Filtrado de Rutas en el Mapa BSC
  const filters = document.querySelectorAll('.route-filter');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => {
        f.className = "route-filter px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-slate-700 bg-slate-800/80 text-white cursor-pointer";
      });

      const route = filter.getAttribute('data-route');
      if (route === 'all') {
        filter.className = "route-filter px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-slate-700 bg-slate-800/80 text-white cursor-pointer active";
      } else if (route === 'r1') {
        filter.className = "route-filter px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-emerald-900/60 bg-emerald-950/60 text-emerald-400 cursor-pointer";
      } else if (route === 'r2') {
        filter.className = "route-filter px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-red-900/60 bg-red-950/60 text-brand-red-neon cursor-pointer";
      } else if (route === 'r3') {
        filter.className = "route-filter px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-amber-900/60 bg-amber-950/60 text-amber-400 cursor-pointer";
      }

      window.drawLaserPaths(route);
    });
  });

  // Escuchar redimensionamiento de pantalla para ajustar coordenadas de las líneas SVG
  window.addEventListener('resize', () => {
    const activeFilter = document.querySelector('.route-filter.active') || document.querySelector('.route-filter[class*="bg-"]');
    const route = activeFilter ? activeFilter.getAttribute('data-route') : 'all';
    window.drawLaserPaths(route);
  });

  // Trazado inicial
  setTimeout(() => window.drawLaserPaths('all'), 400);
};

// DIBUJADO DE LAS LÍNEAS LÁSER EN LA CAPA SVG
window.drawLaserPaths = function(activeRoute = 'all') {
  const svg = document.getElementById('svg-paths');
  if (!svg) return;

  // Limpiar paths existentes
  svg.querySelectorAll('path').forEach(p => p.remove());

  // Definición de conexiones causales
  const connections = [
    // R1: Hemocentro Causal Path (Esmeralda)
    { from: 'node-f1', to: 'node-a1', route: 'r1', stroke: 'url(#laser-grad-r1)' },
    { from: 'node-a1', to: 'node-a3', route: 'r1', stroke: 'url(#laser-grad-r1)' },
    { from: 'node-a3', to: 'node-p1', route: 'r1', stroke: 'url(#laser-grad-r1)' },
    { from: 'node-p1', to: 'node-p3', route: 'r1', stroke: 'url(#laser-grad-r1)' },
    { from: 'node-p3', to: 'node-c1', route: 'r1', stroke: 'url(#laser-grad-r1)' },

    // R2: Ciberseguridad Path (Azul neón)
    { from: 'node-f2', to: 'node-a2', route: 'r2', stroke: 'url(#laser-grad-r2)' },
    { from: 'node-a2', to: 'node-p2', route: 'r2', stroke: 'url(#laser-grad-r2)' },
    { from: 'node-p2', to: 'node-c2', route: 'r2', stroke: 'url(#laser-grad-r2)' },

    // R3: Educación Path (Ámbar neón)
    { from: 'node-f3', to: 'node-a1', route: 'r3', stroke: 'url(#laser-grad-r3)' },
    { from: 'node-a1', to: 'node-p4', route: 'r3', stroke: 'url(#laser-grad-r3)' },
    { from: 'node-p4', to: 'node-c3', route: 'r3', stroke: 'url(#laser-grad-r3)' }
  ];

  const svgRect = svg.getBoundingClientRect();

  connections.forEach(conn => {
    const fromEl = document.getElementById(conn.from);
    const toEl = document.getElementById(conn.to);

    if (!fromEl || !toEl) return;

    // Calcular centros relativos al contenedor SVG
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const x1 = (fromRect.left + fromRect.width / 2) - svgRect.left;
    const y1 = fromRect.top - svgRect.top; 
    const x2 = (toRect.left + toRect.width / 2) - svgRect.left;
    const y2 = (toRect.top + toRect.height) - svgRect.top;

    // Validar estado de activación
    const isActive = (activeRoute === 'all' || conn.route === activeRoute);
    const opacity = isActive ? '0.85' : '0.07';
    const strokeWidth = isActive ? '3.5' : '1.5';
    const animClass = isActive ? 'laser-path' : '';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Curva Bezier suave
    const controlDist = Math.abs(y2 - y1) * 0.45;
    const d = `M ${x1} ${y1} C ${x1} ${y1 - controlDist}, ${x2} ${y2 + controlDist}, ${x2} ${y2}`;
    
    path.setAttribute('d', d);
    path.setAttribute('stroke', conn.stroke);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', opacity);
    
    if (animClass) {
      path.setAttribute('class', animClass);
    }

    svg.appendChild(path);
  });
};
