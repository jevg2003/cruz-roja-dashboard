// src/features/bsc-map/components/BscMap.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import { BscDetails } from './BscDetails';

interface ConnectionPath {
  d: string;
  stroke: string;
  opacity: string;
  strokeWidth: string;
  className: string;
}

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
  "a3": { title: "Fomentar cultura de innovación y pilotos tecnológicos", perspective: "Aprendizaje y Crecimiento", value: "1 Iniciativa", target: "Meta: 5 / año", impact: "Permite probar soluciones de automatización de bajo costo (como y no-code) antes de inversiones masivas.", action: "Evaluar brecha y coordinar pilotos de automatización de procesos mediante personal capacitado.", path: "R1 - Hemocentro" },
  "f1": { title: "Asegurar disponibilidad TI crítica del Hemocentro", perspective: "Financiero", value: "99.1% disp.", target: "Meta 2030: 99.8%", impact: "Es la base que habilita el 60% de los ingresos de la seccional. Sin disponibilidad TI, la captación y distribución de sangre se paraliza.", action: "Garantizar redundancia de conectividad a internet local aprobando el proyecto de migración Azure (B2).", path: "R1 - Hemocentro" },
  "f2": { title: "Optimizar ejecución presupuestal TI (desviación < 10%)", perspective: "Financiero", value: "67% ejec.", target: "Meta: ≤10% desv.", impact: "Garantiza que la asignación del PETI se gaste eficientemente y no se pierdan recursos por retrasos en compras o despliegues.", action: "Evaluar desviaciones contables y aprobar convenios estratégicos que optimicen costos operativos.", path: "R2 - Ciberseguridad" },
  "f3": { title: "Reducir costo operativo TI con Cloud", perspective: "Financiero", value: "50% ahorro", target: "Meta: 100% conv.", impact: "El licenciamiento en ONGs mediante MAKAIA y Microsoft permite liberar presupuesto administrativo para misiones humanitarias.", action: "Migrar el 100% de licencias al convenio Makaia y automatizar reportes para reducir horas de personal administrativo.", path: "R3 - Educación" }
};

export const BscMap: React.FC = () => {
  const {
    uptimeFinal,
    budgetFinal,
    iso27001Final,
    digitalMaturityFinal,
    digitalTramites,
    systemIntegration,
    eduPortalProgress,
    decisions,
    diagnosticScores,
  } = useDashboard();

  const [activeRoute, setActiveRoute] = useState<string>('all');
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [paths, setPaths] = useState<ConnectionPath[]>([]);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Get dynamic reactively computed value for a node card
  const getNodeValue = (objId: string) => {
    switch (objId) {
      case 'c1':
      case 'f1':
        return `${uptimeFinal}% disp.`;
      case 'f2':
        return `${budgetFinal}% ejec.`;
      case 'c2':
        return `Confianza ${iso27001Final}%`;
      case 'p2':
        return `ISO ${iso27001Final}%`;
      case 'a1':
        return `Madurez ${digitalMaturityFinal}`;
      case 'c4':
      case 'p4':
        return `Trámites ${digitalTramites}%`;
      case 'p3':
        return `Integración ${systemIntegration}%`;
      case 'c3':
        return `Portal ${eduPortalProgress}`;
      case 'p1':
        return `Migración ${decisions.b2_azure ? '100%' : '0%'}`;
      case 'a2':
        return decisions.b1_ciso ? 'CISO Activo' : 'Sin CISO';
      case 'a3':
        return `Iniciativas ${diagnosticScores.apropiacion_digital >= 4 ? '5' : '1'}`;
      case 'f3':
        return `Makaia ${diagnosticScores.convenios_makaia >= 4 ? '100%' : '50%'}`;
      default:
        return bscObjectives[objId as keyof typeof bscObjectives]?.value || '';
    }
  };

  const getDetailsObject = () => {
    if (!selectedObjective) return null;
    const staticData = bscObjectives[selectedObjective as keyof typeof bscObjectives];
    if (!staticData) return null;

    return {
      ...staticData,
      value: getNodeValue(selectedObjective)
    };
  };

  const handleCardClick = (objId: string) => {
    setSelectedObjective(objId);
  };

  // Re-draw SVG laser paths based on layouts
  const drawLaserPaths = () => {
    const svg = svgRef.current;
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const connectionsList = [
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

    const computedPaths: ConnectionPath[] = connectionsList.map((conn) => {
      const fromEl = document.getElementById(conn.from);
      const toEl = document.getElementById(conn.to);

      if (!fromEl || !toEl) {
        return { d: '', stroke: '', opacity: '0', strokeWidth: '0', className: '' };
      }

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
      const y1 = fromRect.top - svgRect.top;
      let x2 = toRect.left + toRect.width / 2 - svgRect.left;
      const y2 = toRect.top + toRect.height - svgRect.top;

      // Prevent perfectly vertical lines from breaking SVG linear gradient rendering (zero-width bounding box)
      if (Math.abs(x1 - x2) < 1) {
        x2 += 1;
      }

      const isActive = activeRoute === 'all' || conn.route === activeRoute;
      const opacity = isActive ? '0.85' : '0.07';
      const strokeWidth = isActive ? '3.5' : '1.5';
      const className = isActive ? 'laser-path' : '';

      const controlDist = Math.abs(y2 - y1) * 0.45;
      const d = `M ${x1} ${y1} C ${x1} ${y1 - controlDist}, ${x2} ${y2 + controlDist}, ${x2} ${y2}`;

      return { d, stroke: conn.stroke, opacity, strokeWidth, className };
    });

    setPaths(computedPaths.filter((p) => p.d !== ''));
  };

  useEffect(() => {
    // Initial draw with a tiny delay to ensure nodes are fully painted
    const timer = setTimeout(drawLaserPaths, 250);

    window.addEventListener('resize', drawLaserPaths);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', drawLaserPaths);
    };
  }, [activeRoute, uptimeFinal, digitalMaturityFinal, systemIntegration, decisions]);

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* Route Filtration Console */}
      <div className="glass-panel p-4 rounded-xl flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block cyber-title">
            Filtrar Ruta Causal:
          </span>
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto justify-start lg:justify-end">
          <button
            onClick={() => setActiveRoute('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
              activeRoute === 'all'
                ? 'border-slate-600 bg-slate-800 text-white active'
                : 'border-slate-700 bg-slate-800/80 text-white'
            }`}
          >
            Todas las rutas
          </button>
          <button
            onClick={() => setActiveRoute('r1')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
              activeRoute === 'r1'
                ? 'border-emerald-700 bg-emerald-950/60 text-emerald-400'
                : 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40'
            }`}
          >
            🔴 Ruta 1 - Hemocentro
          </button>
          <button
            onClick={() => setActiveRoute('r2')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
              activeRoute === 'r2'
                ? 'border-red-500 bg-red-950/60 text-brand-red-neon'
                : 'border-red-900/60 bg-red-950/20 text-brand-red-neon hover:bg-red-950/40'
            }`}
          >
            🔵 Ruta 2 - Ciberseguridad
          </button>
          <button
            onClick={() => setActiveRoute('r3')}
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition-all cursor-pointer ${
              activeRoute === 'r3'
                ? 'border-amber-700 bg-amber-950/60 text-amber-400'
                : 'border-amber-900/60 bg-amber-950/20 text-amber-400 hover:bg-amber-950/40'
            }`}
          >
            🟡 Ruta 3 - Educación
          </button>
        </div>
        <span className="text-[10px] text-slate-500 hidden xl:block italic">
          Haz clic en un objetivo para auditar su cadena causal
        </span>
      </div>

      {/* BSC Strategy Map Container */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-800/50 shadow-2xl">
        <div className="relative glass-panel p-6 min-w-[950px] w-full">
          {/* SVG Overlay for Connecting Laser Paths */}
          <svg
            ref={svgRef}
            id="svg-paths"
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            <defs>
              <linearGradient id="laser-grad-r1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00e676" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ff3344" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="laser-grad-r2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff9100" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#2979ff" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="laser-grad-r3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2979ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ffab00" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {paths.map((p, idx) => (
              <path
                key={idx}
                d={p.d}
                stroke={p.stroke}
                strokeWidth={p.strokeWidth}
                fill="none"
                strokeLinecap="round"
                opacity={p.opacity}
                className={p.className}
              />
            ))}
          </svg>

          {/* Grid Rows (4 Perspectives) */}
          <div className="relative z-10 space-y-8">
            {/* PERSPECTIVA 1: CLIENTES Y BENEFICIARIOS */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2 bg-red-950/40 border border-brand-red-neon/30 p-4 rounded-xl text-center self-stretch flex flex-col justify-center shadow-md">
                <span className="text-xs font-bold text-brand-red-neon uppercase tracking-widest cyber-title block">
                  Clientes & Beneficiarios
                </span>
                <span className="text-[9px] text-slate-500 mt-1 italic block">El para quién</span>
              </div>
              <div className="col-span-10 grid grid-cols-3 gap-4">
                {/* C1 */}
                <div
                  onClick={() => handleCardClick('c1')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-emerald-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-c1"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Elevar experiencia del donante y disponibilidad Hemocentro 24/7
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Disponibilidad</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {getNodeValue('c1')}
                    </span>
                  </div>
                </div>
                {/* C2 */}
                <div
                  onClick={() => handleCardClick('c2')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-amber-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-c2"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Fortalecer confianza de hospitales y EPS aliados
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Confiabilidad TI</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {getNodeValue('c2')}
                    </span>
                  </div>
                </div>
                {/* C3 */}
                <div
                  onClick={() => handleCardClick('c3')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-red-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-c3"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Retener y escalar mercado educativo con oferta digital
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Portal Educativo</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {getNodeValue('c3')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSPECTIVA 2: PROCESOS INTERNOS */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2 bg-blue-950/40 border border-blue-500/30 p-4 rounded-xl text-center self-stretch flex flex-col justify-center shadow-md">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest cyber-title block">
                  Procesos Internos
                </span>
                <span className="text-[9px] text-slate-500 mt-1 italic block">Excelencia operativa</span>
              </div>
              <div className="col-span-10 grid grid-cols-4 gap-4">
                {/* P1 */}
                <div
                  onClick={() => handleCardClick('p1')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-slate-600 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-p1"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Migrar infraestructura crítica a Cloud Azure híbrido
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Migración</span>
                    <span className="text-xs font-mono font-bold text-slate-450">
                      {getNodeValue('p1')}
                    </span>
                  </div>
                </div>
                {/* P2 */}
                <div
                  onClick={() => handleCardClick('p2')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-red-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-p2"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Implementar ciberseguridad integral (SOC, DRP, ISO)
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: ISO 27001</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {getNodeValue('p2')}
                    </span>
                  </div>
                </div>
                {/* P3 */}
                <div
                  onClick={() => handleCardClick('p3')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-red-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-p3"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    API Gateway: eliminar islas de información
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Integración</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {getNodeValue('p3')}
                    </span>
                  </div>
                </div>
                {/* P4 */}
                <div
                  onClick={() => handleCardClick('p4')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-amber-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-p4"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Digitalizar procesos educativos y soporte
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Trámites en línea</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {getNodeValue('p4')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSPECTIVA 3: APRENDIZAJE Y CRECIMIENTO */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl text-center self-stretch flex flex-col justify-center shadow-md">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest cyber-title block">
                  Aprendizaje & Crecimiento
                </span>
                <span className="text-[9px] text-slate-500 mt-1 italic block">Talento e innovación</span>
              </div>
              <div className="col-span-10 grid grid-cols-3 gap-4">
                {/* A1 */}
                <div
                  onClick={() => handleCardClick('a1')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-red-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-a1"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Elevar madurez digital del personal de 2.8 a 4.2
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Madurez</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {getNodeValue('a1')}
                    </span>
                  </div>
                </div>
                {/* A2 */}
                <div
                  onClick={() => handleCardClick('a2')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-red-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-a2"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Establecer gobierno TI formal (CISO, COBIT)
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: CISO/COBIT</span>
                    <span className="text-xs font-mono font-bold text-red-500">
                      {getNodeValue('a2')}
                    </span>
                  </div>
                </div>
                {/* A3 */}
                <div
                  onClick={() => handleCardClick('a3')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-amber-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-a3"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Fomentar cultura de innovación y pilotos
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Pilotos Anuales</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {getNodeValue('a3')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PERSPECTIVA 4: FINANCIERO / BASE HABILITADORA */}
            <div className="grid grid-cols-12 items-center gap-4">
              <div className="col-span-2 bg-amber-950/40 border border-amber-500/30 p-4 rounded-xl text-center self-stretch flex flex-col justify-center shadow-md">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest cyber-title block">
                  Financiero (ONG)
                </span>
                <span className="text-[9px] text-slate-500 mt-1 italic block">Base habilitadora</span>
              </div>
              <div className="col-span-10 grid grid-cols-3 gap-4">
                {/* F1 */}
                <div
                  onClick={() => handleCardClick('f1')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-emerald-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-f1"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Asegurar disponibilidad TI crítica del Hemocentro
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Disponibilidad</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {getNodeValue('f1')}
                    </span>
                  </div>
                </div>
                {/* F2 */}
                <div
                  onClick={() => handleCardClick('f2')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-amber-500 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-f2"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Optimizar ejecución presupuestal TI (desviación &lt; 10%)
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Ejecución</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {getNodeValue('f2')}
                    </span>
                  </div>
                </div>
                {/* F3 */}
                <div
                  onClick={() => handleCardClick('f3')}
                  className="bsc-card glass-panel p-4 rounded-xl border-l-4 border-slate-600 cursor-pointer shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all"
                  id="node-f3"
                >
                  <h4 className="text-xs font-bold text-white leading-tight">
                    Reducir costo operativo TI con Cloud
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[9px] text-slate-400">KPI: Ahorro Makaia</span>
                    <span className="text-xs font-mono font-bold text-slate-450">
                      {getNodeValue('f3')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BSC Dynamic Detail Panel */}
      <BscDetails
        details={getDetailsObject()}
        onClose={() => setSelectedObjective(null)}
      />
    </div>
  );
};
export default BscMap;
