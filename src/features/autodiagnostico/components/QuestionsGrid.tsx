// src/features/autodiagnostico/components/QuestionsGrid.tsx
import React from 'react';
import type { Question, DiagnosticScores, DiagnosticScoreKey } from '../../diagnostic/types';

export const diagnosticQuestions: Question[] = [
  {
    key: "responsabilidad",
    category: "Responsabilidad (ISO 38500)",
    title: "Gobernanza de Ciberseguridad (CISO Valle)",
    desc: "¿Cuenta la seccional con un oficial CISO formal y SOC de monitoreo activo?",
    impact: "Impacta la protección de datos médicos del Hemocentro y previene ataques de Ransomware.",
    minDesc: "Sin CISO ni SOC (0)",
    maxDesc: "CISO liderando SOC humanitario (5)",
    tab: "ti"
  },
  {
    key: "conformidad",
    category: "Conformidad (ISO 38500)",
    title: "Protección de Datos de Pacientes y Alumnos (Ley 1581)",
    desc: "¿Se audita y protege activamente el acceso y consentimiento de datos de pacientes, donantes y alumnos?",
    impact: "Previene multas de la SIC (Superintendencia) de hasta 2,000 SMMLV bajo la Ley 1581.",
    minDesc: "Controles inexistentes (0)",
    maxDesc: "MSPI integrado y certificado con ISO 27001 (5)",
    tab: "ti"
  },
  {
    key: "servidores",
    category: "Adquisición (ISO 38500)",
    title: "Obsolescencia Servidores Físicos del Hemocentro",
    desc: "¿Cuál es el estado y antigüedad de los servidores físicos locales que hospedan la base de datos de HeVa?",
    impact: "El fallo físico paraliza el 60% de los ingresos ($771M) al detener la captación de sangre.",
    minDesc: "Hardware > 5 años obsoleto (0)",
    maxDesc: "Migración Azure híbrida redundante (5)",
    tab: "ti"
  },
  {
    key: "backups",
    category: "Rendimiento (ISO 38500)",
    title: "Continuidad del Negocio (DRP y Backups)",
    desc: "¿Existen respaldos inmutables en la nube frente a Ransomware y se realizan simulacros semestrales de DRP?",
    impact: "Garantiza un tiempo de recuperación RTO menor a 4 horas en caso de caída mayor.",
    minDesc: "Backups locales en disco físico simple (0)",
    maxDesc: "DRP en Azure con pruebas semestrales 100% exitosas (5)",
    tab: "ti"
  },
  {
    key: "interoperabilidad",
    category: "Estrategia (ISO 38500)",
    title: "Integración API Gateway B2B Hospitales",
    desc: "¿Están integrados HeVa, Siesa y Q-Symphony mediante un API Gateway con estándar HL7/FHIR?",
    impact: "Habilita la trazabilidad total del hemocomponente y reduce errores manuales de despacho.",
    minDesc: "Islas de información sin comunicación (0)",
    maxDesc: "API Gateway con 100% interoperabilidad hospitalaria (5)",
    tab: "ti"
  },
  {
    key: "canales_donantes",
    category: "Estrategia (ISO 38500)",
    title: "Canales Donantes Digitales (App Móvil Valle)",
    desc: "¿El donante de la seccional cuenta con App móvil propia y agendamiento 100% online automatizado?",
    impact: "Moderniza el Hemocentro eliminando registros en papel y llamadas manuales.",
    minDesc: "Agendamiento solo telefónico/presencial (0)",
    maxDesc: "App con agendamiento y trazabilidad en vivo de sangre (5)",
    tab: "ti"
  },
  {
    key: "portal_educativo",
    category: "Estrategia (ISO 38500)",
    title: "Portal Educativo del Instituto (Pasarela PSE)",
    desc: "¿El Instituto posee un portal transaccional con matrícula en línea y pasarela de pagos PSE integrada?",
    impact: "Previene la desintermediación por plataformas de EdTech (SENA, Coursera) reteniendo $61M de ingresos.",
    minDesc: "Matrícula manual en ventanilla e informes Excel (0)",
    maxDesc: "Portal autoservicio 100% digital integrado a Siesa (5)",
    tab: "ti"
  },
  {
    key: "apropiacion_digital",
    category: "Comportamiento Humano (ISO 38500)",
    title: "Madurez y Adopción en Voluntariado",
    desc: "¿Los médicos, enfermeros y voluntarios están entrenados en herramientas corporativas y ciberseguridad?",
    impact: "Elimina la brecha de apropiación digital y mitiga el vector de ataque del Phishing.",
    minDesc: "Sin capacitación, resistencia al cambio (0)",
    maxDesc: "Programa de microaprendizaje activo y evaluado vía Teams (5)",
    tab: "ti"
  },
  {
    key: "mesa_ayuda",
    category: "Rendimiento (ISO 38500)",
    title: "Mesa de Ayuda TI y Soporte SLAs",
    desc: "¿Los reportes de incidencias del personal se registran en una mesa de ayuda con asignación automática?",
    impact: "Eleva el índice CSAT general y asegura tiempos de solución garantizados al personal clínico.",
    minDesc: "Soporte informal por llamadas o chat personal (0)",
    maxDesc: "Mesa formal con catálogos y automatizada mediante n8n (5)",
    tab: "ti"
  },
  {
    key: "convenios_makaia",
    category: "Adquisición (ISO 38500)",
    title: "Ahorros por Convenio Makaia (Microsoft 365)",
    desc: "¿Se gestiona al 100% el convenio sin fines de lucro con Makaia para el licenciamiento del personal Valle?",
    impact: "Ahorro de miles de dólares anuales liberando fondos operativos para ayuda humanitaria.",
    minDesc: "Licenciamiento comercial a precio regular (0)",
    maxDesc: "100% licencias en convenio Makaia Nonprofit (5)",
    tab: "ti"
  },
  {
    key: "soporte_ejecutivo",
    category: "Soporte Ejecutivo (ISO 38500)",
    title: "Soporte Ejecutivo y Liderazgo (ROI e Inversiones)",
    desc: "¿La Alta Dirección comprende los costos de TI y basa las decisiones de inversión en análisis de costo-beneficio y medición del ROI posterior?",
    impact: "Garantiza la alineación financiera del PETI y justifica los presupuestos ante la junta directiva.",
    minDesc: "Inversiones sin análisis de costo-beneficio (0)",
    maxDesc: "ROI medido formalmente y aprobado por junta (5)",
    tab: "ti"
  },
  {
    key: "entrega_servicios",
    category: "Entrega de Servicios (ISO 38500)",
    title: "Ciclo de Vida de Aplicaciones de Misión Crítica",
    desc: "¿Cuentan las aplicaciones de misión crítica (HeVa, Siesa, Q-Symphony) con un plan de ciclo de vida formal y documentado?",
    impact: "Evita la obsolescencia de software y planifica el soporte a largo plazo de la operación.",
    minDesc: "Sin documentación de ciclo de vida (0)",
    maxDesc: "Planes formales de obsolescencia y soporte (5)",
    tab: "ti"
  },
  {
    key: "planificacion_estrategica",
    category: "Planificación Estratégica (ISO 38500)",
    title: "Planes Tácticos y Lecciones Aprendidas",
    desc: "¿Existen planes tácticos operativos que integren TI y se documentan las lecciones aprendidas al finalizar los proyectos?",
    impact: "Fomenta la mejora continua y evita repetir fallos históricos en proyectos del PETI.",
    minDesc: "Sin planes tácticos ni lecciones (0)",
    maxDesc: "Procesos estandarizados y base de lecciones activa (5)",
    tab: "ti"
  },
  {
    key: "roles_datos",
    category: "Roles de Datos (DAMA)",
    title: "Estructura de Roles de Datos",
    desc: "¿Se han designado formalmente los roles de Data Owners (Directores de área), Business Data Stewards y Technical Data Stewards?",
    impact: "Establece la responsabilidad directa sobre la calidad y el cumplimiento de las políticas de información.",
    minDesc: "Sin roles de datos definidos (0)",
    maxDesc: "Roles formalizados por resolución y activos (5)",
    tab: "datos"
  },
  {
    key: "datos_maestros",
    category: "Datos Maestros (DAMA)",
    title: "Gestión de Datos Maestros (Registro Único)",
    desc: "¿Existe un 'registro único de la verdad' transversal para Donantes (Hemocentro), Pacientes (HeVa) y Estudiantes (Educación)?",
    impact: "Elimina silos operativos y previene la duplicidad de registros en la seccional Valle.",
    minDesc: "Silos de datos desconectados (0)",
    maxDesc: "Registro único consolidado e integrado (5)",
    tab: "datos"
  },
  {
    key: "calidad_datos",
    category: "Calidad de Datos (DAMA)",
    title: "Calidad de Datos y Reglas de Negocio",
    desc: "¿Existen reglas de negocio automatizadas y métricas activas para medir exactitud, completitud y consistencia en HeVa, Siesa y Q-Symphony?",
    impact: "Evita descuadres en facturación y garantiza la integridad de la información clínica.",
    minDesc: "Sin reglas ni medición de calidad (0)",
    maxDesc: "Reglas automatizadas con alertas en tiempo real (5)",
    tab: "datos"
  },
  {
    key: "seguridad_datos",
    category: "Seguridad de Datos (DAMA)",
    title: "Seguridad de Datos Sensibles (Ley 1581)",
    desc: "¿Cuál es el nivel de controles de acceso, enmascaramiento de datos clínicos y cumplimiento estricto con la Ley 1581 de 2012?",
    impact: "Evita sanciones millonarias de la SIC y mitiga riesgos de ransomware o fugas de información.",
    minDesc: "Sin controles de acceso ni cumplimiento (0)",
    maxDesc: "Cumplimiento 100% verificado y datos cifrados (5)",
    tab: "datos"
  },
  {
    key: "comite_inventario_ia",
    category: "Comité e Inventario (IA Governance)",
    title: "Comité e Inventario de Sistemas de IA",
    desc: "¿Existe un Comité de Gobernanza de IA activo y un inventario que clasifique los sistemas (como HemoAI) según su nivel de riesgo?",
    impact: "Garantiza la supervisión ética de los modelos y cumple con las regulaciones de la Ley de IA de la UE.",
    minDesc: "Sin inventario ni comité (0)",
    maxDesc: "Comité activo y clasificación de riesgo formal (5)",
    tab: "ia"
  },
  {
    key: "transparencia_explicabilidad_ia",
    category: "Explicabilidad (IA Governance)",
    title: "Transparencia y Explicabilidad (ISO 23894)",
    desc: "¿Los resultados de los algoritmos de HemoAI son explicables para usuarios no técnicos (personal médico) mediante SHAP o LIME?",
    impact: "Brinda confianza en las decisiones clínicas automatizadas de priorización de donantes.",
    minDesc: "Algoritmos opacos de caja negra (0)",
    maxDesc: "Modelos 100% interpretables con reporte visual (5)",
    tab: "ia"
  },
  {
    key: "equidad_monitoreo_sesgos",
    category: "Equidad y Drift (IA Governance)",
    title: "Equidad y Monitoreo de Sesgos / Drift",
    desc: "¿Se evalúan trimestralmente los modelos para detectar sesgos demográficos o degradación ('Model Drift')?",
    impact: "Previene decisiones sesgadas en la distribución de sangre y asegura la vigencia del modelo.",
    minDesc: "Sin monitoreo ni control de sesgo (0)",
    maxDesc: "Monitoreo continuo automatizado en MLOps (5)",
    tab: "ia"
  },
  {
    key: "supervision_humana_ia",
    category: "Supervisión Humana (IA Governance)",
    title: "Protocolo de Supervisión Humana",
    desc: "¿Existe un protocolo obligatorio y documentado de validación humana antes de aplicar predicciones críticas de la IA?",
    impact: "Asegura el control médico sobre la IA y mitiga la responsabilidad civil en fallos algorítmicos.",
    minDesc: "Decisiones 100% automatizadas sin control (0)",
    maxDesc: "Protocolo formal obligatorio con registro (5)",
    tab: "ia"
  }
];

interface QuestionsGridProps {
  scores: DiagnosticScores;
  onScoreChange: (key: DiagnosticScoreKey, score: number) => void;
  activeTab?: 'ti' | 'datos' | 'ia';
}

export const QuestionsGrid: React.FC<QuestionsGridProps> = ({ scores, onScoreChange, activeTab = 'ti' }) => {
  const scoreOptions = [0, 1, 2, 3, 4, 5];
  const filteredQuestions = diagnosticQuestions.filter((q) => q.tab === activeTab);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredQuestions.map((q) => {
        const currentScore = scores[q.key] !== undefined ? scores[q.key] : 2;

        return (
          <div
            key={q.key}
            className="glass-panel p-6 rounded-2xl border border-slate-800/80 bg-slate-900/10 flex flex-col justify-between space-y-5 shadow-lg animate-fadeIn"
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider block cyber-title">
                  {q.category}
                </span>
                <span className="font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-900/50 text-xs font-bold text-nowrap">
                  Madurez: {currentScore}/5
                </span>
              </div>
              <h4 className="text-base font-extrabold text-white mt-2 leading-snug">{q.title}</h4>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{q.desc}</p>
              <div className="text-xs text-slate-350 bg-red-950/15 border border-brand-red-neon/20 px-3 py-2 rounded-xl mt-3.5 leading-relaxed">
                <strong className="text-brand-red-neon uppercase tracking-wider text-[10px] cyber-title block mb-0.5">
                  Impacto en la Cruz Roja:
                </strong>
                {q.impact}
              </div>
            </div>

            <div className="space-y-3.5 pt-3 border-t border-slate-900/60">
              <div className="flex justify-between items-center gap-1">
                {scoreOptions.map((scoreOption) => {
                  const isSelected = currentScore === scoreOption;
                  const activeClass = isSelected
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/40 border-cyan-400 scale-110 z-10'
                    : 'border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-950/20';

                  return (
                    <button
                      key={scoreOption}
                      type="button"
                      onClick={() => onScoreChange(q.key, scoreOption)}
                      className={`w-10 h-10 rounded-full border text-sm font-mono font-bold flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 ${activeClass}`}
                    >
                      {scoreOption}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-400 font-semibold tracking-wide px-1">
                <span>{q.minDesc}</span>
                <span>{q.maxDesc}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
