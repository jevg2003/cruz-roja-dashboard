# Dashboard Estratégico CIO - Cruz Roja Seccional Valle

¡Bienvenido a la documentación oficial del **Dashboard Estratégico CIO** de la **Cruz Roja Colombiana - Seccional Valle del Cauca**. 

Este espacio centraliza toda la información técnica, arquitectónica y metodológica referente al Cuadro de Mando Integral (Balanced Scorecard - BSC) y al Diagnóstico Prescriptivo de Gobierno de TI de la Seccional Valle, diseñado bajo los lineamientos del **PETI 2026-2030 (Plan Estratégico de Tecnologías de la Información)** y alineado con la norma internacional de Gobernanza de TI **ISO/IEC 38500**.

---

## 📌 Propósito de esta Documentación

Esta documentación sirve como la **única fuente de verdad** (Single Source of Truth) para la directiva institucional, el equipo de soporte de TI y los auditores externos. Proporciona:

1. **Alineación Estratégica**: Cómo se vinculan los habilitadores tecnológicos con los objetivos de misión humanitaria y sostenibilidad financiera de la Cruz Roja Valle (especialmente el Hemocentro y el Instituto de Educación).
2. **Resiliencia Operativa**: Las bases de gobernanza técnica orientadas a mitigar riesgos críticos, como caídas de infraestructura y ataques de Ransomware.
3. **Decisiones de Arquitectura y Trade-offs**: Justificaciones detalladas detrás de las elecciones tecnológicas de la plataforma, incluyendo el porqué **se excluyó n8n en el entorno de producción** a favor de integraciones más seguras y robustas.

---

## 🗺️ Mapa de Navegación de la Documentación

Esta guía interactiva está estructurada en las siguientes secciones principales para facilitar tu consulta:

* [**1. Introducción y Contexto**](introduccion.md)  
  *Contexto estratégico de la Cruz Roja Seccional Valle, su modelo de sostenibilidad financiado por el Hemocentro y los retos para el periodo PETI 2026-2030.*
  
* [**2. Arquitectura de Software**](arquitectura.md)  
  *El stack tecnológico moderno (Astro, React, Tailwind CSS y Zustand) que soporta el funcionamiento inmediato y autónomo del cuadro de mando sin dependencias de red masivas.*

* [**3. Autodiagnóstico de Gobernanza (ISO/IEC 38500)**](diagnostico-madurez.md)  
  *Detalle metodológico de las 10 dimensiones clave de gobierno que el CIO evalúa para balancear el riesgo de cumplimiento y la inversión.*

* [**4. Cuadro de Mando Integral (Balanced Scorecard)**](cuadro-mando.md)  
  *Análisis exhaustivo de las métricas clave de rendimiento organizadas en las perspectivas de Finanzas, Clientes/Hemocentro, Procesos Internos y Aprendizaje.*

* [**5. Análisis de n8n y Justificación de Exclusión**](analisis-n8n.md)  
  *Estudio riguroso sobre las ventajas y desventajas de n8n, y las razones por las cuales se decidió usar una simulación en cliente (Zustand) y un API Gateway directo en producción.*

* [**6. Motor Prescriptivo e Iniciativas FODA**](proyectos-prescriptivos.md)  
  *Funcionamiento del motor de recomendaciones dinámicas causa-raíz y la lista de proyectos P1 (corto plazo) y P2 (largo plazo).*

---

## 🏛️ Sobre la Cruz Roja Seccional Valle del Cauca

La **Cruz Roja Colombiana - Seccional Valle del Cauca** es una institución humanitaria líder en la región suroccidental de Colombia. Su sostenibilidad operativa y financiera depende de la eficiencia de sus unidades de negocio social, destacando:
* **El Hemocentro Seccional**: Proveedor crítico de hemocomponentes para más de 40 clínicas y hospitales del departamento. Funciona las 24 horas del día, los 365 días del año.
* **El Instituto de Educación**: Plataforma de capacitación técnica y formación en salud que genera ingresos esenciales para subsidiar misiones humanitarias de emergencia.

El aseguramiento de la continuidad tecnológica en estas áreas es, por lo tanto, un asunto de **salvaguarda de vidas humanas**.
