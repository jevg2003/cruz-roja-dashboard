# Instrucciones para Cursor — Mejoras Dashboard CIO Cruz Roja Valle del Cauca

## Contexto del proyecto

Repositorio: https://github.com/jevg2003/cruz-roja-dashboard  
Deploy en Vercel: https://cruz-roja-dashboard.vercel.app  
Stack: Astro + Tailwind CSS + Chart.js + n8n (automatización) + data.json (fuente de datos)

---

## ¿Qué hace el dashboard actualmente?

El dashboard ya tiene estas partes funcionando:

1. **data.json** en `/public/data.json` — fuente única de verdad con todos los KPIs del PETI 2026–2030. Los scripts leen este archivo al cargar.
2. **n8n_workflow.json** — workflow automatizado que corre cada lunes a las 8AM: lee datos de Google Sheets, calcula KPIs, escribe el `data.json` actualizado y envía alerta por Gmail si la disponibilidad del Hemocentro baja del 99.5%.
3. **n8n_ai_workflow.json** — workflow activado por webhook desde el dashboard: recibe las respuestas del autodiagnóstico ISO 38500, construye un prompt para Gemini AI, obtiene el análisis y lo envía por email HTML al CIO además de responder al dashboard con el JSON de recomendaciones.
4. **n8n_webhook_workflow.json** — workflow de diagnóstico real: recibe el webhook del botón "Evaluar con IA Gemini", envía email de reporte y responde al dashboard.
5. **Tab "Autodiagnóstico"** — cuestionario de 10 preguntas Likert (0–5) alineadas a los 6 principios de ISO 38500. Al completarlo y presionar el botón "Evaluar e Inyectar Directivas", los scores modifican automáticamente todos los KPIs, badges y proyectos del PETI en el resto del dashboard.
6. **Tab "Directivas ISO 38500"** — muestra las 3 actividades del modelo (Evaluar → Dirigir → Monitorear) con badges que se activan según el diagnóstico.
7. **Mapa BSC** con rutas causales (R1 Hemocentro, R2 Ciberseguridad, R3 Educación) y líneas de conexión en canvas.

---

## Análisis: qué falta y qué hay que mejorar

### Problema 1 — La ISO 38500 está incompleta en el dashboard

El tab "Directivas ISO 38500" solo muestra las 3 actividades (Evaluar, Dirigir, Monitorear) con badges de estado. **Falta mostrar los 6 principios de la norma** y su alineación explícita con los objetivos estratégicos de la Cruz Roja.

Los 6 principios de ISO/IEC 38500:2024 son:
| Principio | Descripción | Enfoque clave |
|---|---|---|
| Responsabilidad | Roles y responsabilidades claras para TI | Responsabilidad y propiedad |
| Estrategia | Estrategia de TI alineada con la estrategia empresarial | Integración estratégica |
| Adquisición | Decisiones de adquisición de TI válidas y transparentes | Gobernanza de inversiones |
| Actuación | Idoneidad de TI para el propósito y soporte empresarial | Entrega de valor |
| Conformidad | Cumplimiento de las leyes, reglamentos y políticas | Riesgo y cumplimiento |
| Comportamiento Humano | Respeto por el comportamiento humano en las decisiones de TI | Enfoque centrado en las personas |

### Problema 2 — Los principios no están conectados a los KPIs del data.json

Cada principio debe mostrar su **nivel de cumplimiento real** calculado desde los datos del diagnóstico y del `data.json`. Por ejemplo:
- Principio "Conformidad" → se alimenta del KPI `iso_27001` (45%) y del score de `conformidad` del diagnóstico
- Principio "Responsabilidad" → se alimenta del KPI `ciso_designado` (NO) y del score de `responsabilidad`
- Principio "Actuación" → se alimenta de `disponibilidad_hemocentro` (99.1%) y `ejecucion_presupuesto` (67%)

### Problema 3 — El modelo Evaluar → Dirigir → Monitorear no es interactivo

Actualmente los badges cambian de estado pero no explican **qué significa cada actividad en el contexto de la Cruz Roja**. Falta un panel expandible que muestre:
- Qué preguntas del diagnóstico alimentan cada actividad
- Qué proyectos del PETI responde a cada actividad
- El estado actual de ejecución

### Problema 4 — El autodiagnóstico no muestra radar visual de los 6 principios

El cuestionario tiene 10 preguntas mapeadas a los 6 principios pero no hay una visualización tipo radar que muestre el nivel de madurez por principio después de responder.

---

## Mejoras a implementar — instrucciones exactas para Cursor

### MEJORA 1 — Agregar sección de 6 Principios ISO 38500 al tab de Gobernanza

En el archivo `src/pages/index.astro`, dentro de `<section id="view-gobernanza">`, ANTES del grid de 3 columnas (Evaluar/Dirigir/Monitorear), agregar una nueva subsección con 6 tarjetas, una por principio.

Cada tarjeta debe tener:
- Nombre del principio con ícono de Font Awesome
- Descripción de lo que exige la norma
- Cómo se aplica específicamente en la Cruz Roja Valle del Cauca
- Barra de progreso con el nivel de cumplimiento actual (calculado dinámicamente desde `diagnosticScores` y `data.json`)
- Badge de estado: CUMPLE / EN PROCESO / BRECHA

El mapeo de principio → KPI → score de diagnóstico es:

```javascript
const principiosISO = [
  {
    id: "responsabilidad",
    nombre: "Responsabilidad",
    icono: "fa-user-shield",
    color: "cyan",
    descripcion: "Roles y responsabilidades claras para TI en la organización.",
    aplicacion_cr: "Designación formal del CISO, definición de roles en el PETI y gobernanza del Comité de TI de la Cruz Roja Valle.",
    kpi_data: "ciso_designado",           // viene de data.json top_kpis
    score_diagnostico: "responsabilidad", // viene de diagnosticScores
    meta: "CISO designado + SOC activo Q2 2026"
  },
  {
    id: "estrategia",
    nombre: "Estrategia",
    icono: "fa-chess",
    color: "blue",
    descripcion: "Estrategia de TI alineada con la estrategia empresarial.",
    aplicacion_cr: "El PETI 2026–2030 alinea los 8 proyectos con la misión humanitaria. BSC con 3 rutas causales (Hemocentro, Ciberseguridad, Educación).",
    kpi_data: "ejecucion_presupuesto",
    score_diagnostico: "interoperabilidad",
    meta: "Madurez digital 4.2/5.0 al 2030"
  },
  {
    id: "adquisicion",
    nombre: "Adquisición",
    icono: "fa-cart-shopping",
    color: "purple",
    descripcion: "Decisiones de adquisición de TI válidas y transparentes.",
    aplicacion_cr: "Convenio MAKAIA (ahorro 50–100% licencias), priorización de proyectos B1–B8 con criterios de ROI humanitario y presupuesto de $330M.",
    kpi_data: "ejecucion_presupuesto",
    score_diagnostico: "convenios_makaia",
    meta: "Desviación presupuestal ≤ 10% en PETI"
  },
  {
    id: "actuacion",
    nombre: "Actuación",
    icono: "fa-gauge-high",
    color: "green",
    descripcion: "Idoneidad de TI para el propósito y soporte del negocio.",
    aplicacion_cr: "Disponibilidad 24/7 del Hemocentro ($771M), SLA de servicios TI y nivel de satisfacción del personal médico y administrativo.",
    kpi_data: "disponibilidad_hemocentro",
    score_diagnostico: "backups",
    meta: "Disponibilidad 99.8% y SLA 95%"
  },
  {
    id: "conformidad",
    nombre: "Conformidad",
    icono: "fa-file-shield",
    color: "red",
    descripcion: "Cumplimiento de leyes, reglamentos y políticas internas.",
    aplicacion_cr: "Ley 1581 (protección datos pacientes/donantes), ISO 27001 (actualmente 45%), Decreto 767/2022 de Transformación Digital y Res. 1995/1999 de Historia Clínica.",
    kpi_data: "iso_27001",
    score_diagnostico: "conformidad",
    meta: "ISO 27001 al 90% en 2027"
  },
  {
    id: "comportamiento_humano",
    nombre: "Comportamiento Humano",
    icono: "fa-people-group",
    color: "amber",
    descripcion: "Respeto por el comportamiento humano en las decisiones de TI.",
    aplicacion_cr: "Programa de capacitación digital B8 ($15M), microaprendizaje con Teams para médicos y voluntarios, gestión del cambio en la adopción de HeVa y Q-Symphony.",
    kpi_data: "madurez_digital",
    score_diagnostico: "apropiacion_digital",
    meta: "Madurez digital 4.2/5.0 y cero Shadow IT"
  }
];
```

### MEJORA 2 — Agregar gráfico radar de los 6 principios ISO 38500

En `src/scripts/charts.js`, agregar una nueva función `renderISO38500RadarChart()` que:
1. Tome los valores de `window.diagnosticScores` para los 6 principios
2. Normalice los scores (0–5) a porcentaje (0–100)
3. Renderice un gráfico radar con Chart.js con 6 ejes, uno por principio
4. Use colores corporativos: rojo Cruz Roja (`#ff3344`), fondo oscuro

El canvas para el radar debe agregarse en el tab de Gobernanza con `id="chart-iso-radar"`.

La función debe llamarse automáticamente cuando cambien los `diagnosticScores` (ya existe el sistema de listeners en `state.js`).

### MEJORA 3 — Conectar principios ISO con el mapa BSC

En `src/scripts/bsc.js`, agregar la capacidad de que al hacer clic en cualquier nodo del mapa BSC, aparezca un tooltip/panel que muestre:
- El objetivo estratégico del nodo
- **Qué principio(s) de ISO 38500 respaldan ese nodo**
- El KPI real vs meta
- La acción prescriptiva

El mapeo nodo BSC → principio ISO es:
```javascript
const bscISOMapping = {
  "fin-hemo":   ["actuacion", "conformidad"],
  "presup":     ["adquisicion", "actuacion"],
  "costo":      ["adquisicion"],
  "madurex":    ["comportamiento_humano", "estrategia"],
  "ciso":       ["responsabilidad", "conformidad"],
  "innov":      ["estrategia", "comportamiento_humano"],
  "cloud":      ["adquisicion", "actuacion"],
  "iso":        ["conformidad", "responsabilidad"],
  "api":        ["estrategia", "actuacion"],
  "portal-p":   ["estrategia", "adquisicion"],
  "hemo":       ["actuacion", "conformidad"],
  "conf":       ["conformidad", "responsabilidad"],
  "edu-cli":    ["estrategia", "comportamiento_humano"]
};
```

### MEJORA 4 — Mejorar el panel "Diagnóstico en Caliente"

El div `id="diagnostic-ai-recommendations"` en el tab de Gobernanza actualmente carga recomendaciones genéricas. Mejorar para que muestre:

1. **Puntuación global ISO 38500** calculada como promedio ponderado de los 6 principios (en lugar de los 10 scores individuales).
2. **El principio más débil** identificado automáticamente con su recomendación específica.
3. **Estado del ciclo Evaluar → Dirigir → Monitorear** resumido en 3 líneas con el % de completitud de cada fase.

La lógica de cálculo va en `src/scripts/diagnostic.js` en la función `window.updateDiagnosticRecommendations()`.

### MEJORA 5 — Agregar indicador de cumplimiento ISO 38500 en la barra superior de KPIs

En `src/pages/index.astro`, en la sección `#strip-` de los 6 KPIs superiores, reemplazar uno de los indicadores menos críticos (sugerido: reemplazar el espacio o agregar un 7mo tile) con el **Score ISO 38500 Global** calculado dinámicamente.

El tile debe mostrar:
- Etiqueta: "Gobierno ISO 38500"
- Valor: promedio de los 6 principios en formato X.X/5
- Color: rojo si < 2.0, amarillo si 2.0–3.5, verde si > 3.5
- Se actualiza en tiempo real cuando cambia el diagnóstico

---

## Reglas de implementación — NO romper lo que ya funciona

1. **NO modificar** la estructura de `data.json` — solo leerlo, nunca reescribirlo desde el frontend.
2. **NO tocar** los 3 archivos de workflows n8n (`.json`) — son solo configuración para importar en n8n.
3. **Mantener** el sistema de `window.diagnosticScores` en `state.js` — es el estado global que conecta todo.
4. **Mantener** el sistema de tabs con `data-tab` y `tab-view` — la navegación ya funciona.
5. **Mantener** el `id="sync-status"` del header — n8n lo actualiza con la hora de la última sincronización.
6. **Los nuevos charts** de Chart.js deben destruirse y recrearse con `Chart.getChart()` antes de renderizar para evitar el error "Canvas already in use".
7. **Todos los textos** deben estar en español, usar `cyber-title` para titles y `glass-panel` para tarjetas — mantener el estilo visual existente.

---

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/pages/index.astro` | Agregar sección 6 principios + canvas radar en tab gobernanza. Agregar 7mo tile ISO en barra superior. |
| `src/scripts/diagnostic.js` | Mejorar `updateDiagnosticRecommendations()` con score ponderado por principio. |
| `src/scripts/charts.js` | Agregar `renderISO38500RadarChart()` con los 6 principios. |
| `src/scripts/bsc.js` | Agregar tooltip con principio ISO al hacer clic en nodos del mapa. |
| `src/scripts/state.js` | Agregar a `updateAllUI()` la llamada a `renderISO38500RadarChart()`. |

---

## Resultado esperado

Al abrir el tab "Directivas ISO 38500" el CIO debe ver:

1. **6 tarjetas de principios** con estado real calculado desde el diagnóstico y `data.json`
2. **Radar chart** de los 6 principios mostrando madurez actual vs meta
3. **Las 3 actividades** (Evaluar → Dirigir → Monitorear) con badges que reflejan el diagnóstico
4. **Panel "Diagnóstico en Caliente"** con score global ISO 38500 y el principio más débil identificado

Al hacer clic en cualquier nodo del **mapa BSC** aparece el principio ISO que lo respalda.

La **barra superior de KPIs** muestra el score ISO 38500 global que se actualiza en tiempo real al cambiar el autodiagnóstico.

---

## Referencia de la norma (diapositivas del docente)

La ISO/IEC 38500:2024 (Tercera edición, febrero 2024) opera con 3 actividades:
- **Evaluar**: analizar el uso actual y futuro de las TI
- **Dirigir**: asignar responsabilidades y establecer la dirección mediante planes y proyectos
- **Monitorear**: revisar el desempeño en función de los planes y objetivos (rendimiento y conformidad)

El modelo de gobernanza recibe presiones del negocio y necesidades del negocio desde el exterior, procesa mediante el ciclo Evaluar → Dirigir → Monitorear, y ejecuta a través de Proyectos TIC y Operaciones TIC en los procesos del negocio.

Los principios aplican a la Cruz Roja como organización sin fines de lucro del sector salud y educación, donde el fin no es la rentabilidad sino el impacto humanitario, y la conformidad con Ley 1581 e ISO 27001 es obligatoria por manejar datos clínicos de pacientes y donantes de sangre.

---

## Principios y Valores de la Cruz Roja Colombiana

### 7 Principios Fundamentales del Movimiento Internacional
Proclamados en Viena en 1965. Rigen la Cruz Roja Colombiana Seccional Valle del Cauca en todas sus decisiones operativas, administrativas y tecnológicas.

| # | Principio | Definición aplicada a la organización |
|---|---|---|
| 1 | **Humanidad** | Prevenir y aliviar el sufrimiento humano en todas las circunstancias. Proteger la vida, la salud y la dignidad de la persona. Es el norte estratégico que da sentido a cada proyecto del PETI. |
| 2 | **Imparcialidad** | No discriminar por nacionalidad, raza, religión, condición social ni opinión política. Solo prioriza según la gravedad de la necesidad. Los sistemas de información (HeVa, Q-Symphony) deben garantizar atención equitativa. |
| 3 | **Neutralidad** | No tomar partido en conflictos armados ni controversias políticas, raciales o ideológicas. Los datos clínicos y de donantes no pueden usarse con fines ajenos a la misión humanitaria. |
| 4 | **Independencia** | El Movimiento es autónomo. La Dirección de TI debe mantener independencia tecnológica (evitar lock-in con HeVa/Siesa) para actuar siempre según los principios. |
| 5 | **Voluntariado** | Movimiento de socorro voluntario y desinteresado. Las herramientas TI deben facilitar la labor del voluntariado, no burocratizarla. El Portal Educativo y la App Hemocentro 4.0 sirven a este principio. |
| 6 | **Unidad** | En cada país solo existe una Sociedad de la Cruz Roja. Todos los sistemas institucionales (Siesa, HeVa, Q-Symphony) deben integrarse en un Dato Único del Paciente — razón de ser del Proyecto B3 API Gateway. |
| 7 | **Universalidad** | El Movimiento es mundial. La interoperabilidad HL7/FHIR con hospitales y EPS permite que los datos clínicos fluyan con estándares internacionales reconocidos globalmente. |

### Valores institucionales
Obligatorios para todos los miembros, voluntarios y empleados de la Cruz Roja Colombiana:

| Valor | Descripción | Implicación para TI |
|---|---|---|
| **Dignidad** | Reconocimiento de la dignidad en sí mismo y en los demás, con obligación de salvaguardarla. | Los datos de pacientes y donantes son expresión de dignidad. Su protección bajo ISO 27001 y Ley 1581 no es solo legal — es ética. |
| **Igualdad** | Todas las personas son iguales en dignidad, independientemente de raza, edad, condición social o procedencia. | Los servicios digitales (portal educativo, app donantes) deben ser accesibles para todos los perfiles de usuario, incluyendo personal de campo con baja madurez digital. |
| **Justicia** | Voluntad constante de dar a cada uno lo que le corresponde. | El presupuesto TI ($330M PETI) debe asignarse con criterios de impacto humanitario, no solo técnicos. El BSC garantiza esta alineación. |
| **Solidaridad** | Participación y apoyo hacia las personas en relación con sus problemas, actividades e inquietudes. | El área de TI es un aliado estratégico de las áreas misionales. El SLA del Hemocentro (99.8%) es un acto de solidaridad con los pacientes que dependen de los hemocomponentes. |

---

## Alineación estratégica: ISO 38500 ↔ Principios Cruz Roja

Esta tabla es el argumento central del dashboard: la gobernanza de TI no es un fin técnico sino un instrumento al servicio de la misión humanitaria. Cada principio ISO 38500 se ancla en uno o más principios propios de la Cruz Roja.

| Principio ISO 38500 | Principios Cruz Roja alineados | Valores Cruz Roja | Expresión concreta en el PETI |
|---|---|---|---|
| **Responsabilidad** | Independencia · Unidad | Justicia | Designación del CISO (Q2 2026). Roles claros en el Comité de Gobierno TI. El área de TI reporta directo a la Dirección Ejecutiva. |
| **Estrategia** | Humanidad · Universalidad | Dignidad · Solidaridad | PETI 2026–2030 alineado con la misión humanitaria. BSC con perspectiva de Clientes/Beneficiarios en la cima (no lo financiero). Madurez digital 4.2/5.0 al 2030. |
| **Adquisición** | Independencia · Voluntariado | Justicia | Convenio MAKAIA (ahorro 50–100% licencias). Priorización B1–B8 con ROI humanitario. Evaluación de OpenMRS para reducir dependencia de HeVa. |
| **Actuación** | Humanidad · Unidad · Voluntariado | Solidaridad · Igualdad | Disponibilidad 24/7 del Hemocentro ($771M). SLA 95% para personal médico y voluntarios. API Gateway para eliminar islas de información. |
| **Conformidad** | Imparcialidad · Neutralidad | Dignidad | ISO 27001 al 90% en 2027. Cumplimiento Ley 1581 (datos de pacientes y donantes). Decreto 767/2022 de Transformación Digital. |
| **Comportamiento Humano** | Voluntariado · Humanidad | Igualdad · Solidaridad | Programa de capacitación digital B8 ($15M). Microaprendizaje con Teams para médicos, enfermeros y voluntarios. Cero Shadow IT como meta de cultura digital. |

### Cómo usar esta tabla en el código

En `src/scripts/diagnostic.js`, la función `updateDiagnosticRecommendations()` debe mostrar, para cada principio ISO con score bajo, **cuál principio de la Cruz Roja se está vulnerando** y por qué eso tiene implicaciones humanitarias, no solo técnicas.

Ejemplo de mensaje para el principio "Conformidad" con score 1/5:
> "⚠️ **Conformidad ISO 38500 en riesgo** — Solo el 45% de cumplimiento ISO 27001 vulnera el principio de **Neutralidad e Imparcialidad** de la Cruz Roja: los datos de 646 usuarios, donantes y pacientes podrían ser comprometidos por terceros, poniendo en riesgo la confianza institucional que sustenta la misión humanitaria. Acción inmediata: Proyecto B1 CISO + SOC ($45M, Q2 2026)."

En `src/pages/index.astro`, en las tarjetas de los 6 principios ISO 38500, agregar debajo de cada una un chip con el principio Cruz Roja correspondiente usando el color rojo institucional (`#C8102E`), para que el CIO vea de un vistazo que cada decisión de gobernanza TI tiene raíz en los valores fundacionales del Movimiento.

### Argumento académico para el profesor

El dashboard implementa la ISO 38500:2024 no como una norma técnica importada sino como una herramienta de **gobernanza humanitaria** coherente con la identidad de la Cruz Roja. La norma exige que las decisiones de TI estén orientadas a generar valor para los grupos de interés — en una ONG sin fines de lucro, ese valor no se mide en rentabilidad sino en vidas protegidas, donantes fidelizados, estudiantes capacitados y hospitales atendidos con trazabilidad. El BSC con perspectiva financiera como base (no como fin) y el mapa de rutas causales (R1 Hemocentro, R2 Ciberseguridad, R3 Educación) son la implementación práctica de ese argumento.