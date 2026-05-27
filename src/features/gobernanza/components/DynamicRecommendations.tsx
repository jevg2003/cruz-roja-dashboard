// src/features/gobernanza/components/DynamicRecommendations.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';

export const DynamicRecommendations: React.FC = () => {
  const { diagnosticScores, computedMaturity } = useDashboard();

  const average = computedMaturity;

  let alertText = "";
  let severity: 'danger' | 'warning' | 'success' = "danger";
  const recsList: string[] = [];

  // Categorize severity based on average score
  if (average < 2.5) {
    alertText = `🚨 **ESTADO CRÍTICO DE GOBIERNO TI (Madurez ${average}/5.0):** La Cruz Roja Valle se encuentra en zona de supervivencia operativa. La carencia de gobierno formal de seguridad (CISO) y la obsolescencia física ponen en alto riesgo de secuestro de datos clínicos e ingresos. **Se requiere dirigir directivas PETI urgentes en los próximos 90 días.**`;
    severity = "danger";
  } else if (average < 4.0) {
    alertText = `⚠️ **GOBERNANZA PARCIAL (Madurez ${average}/5.0):** Existen procesos de TI bien definidos (como convenios de ahorro y mesa de soporte básica), pero la digitalización de trámites no está integrada de manera segura. Hay debilidades en interoperabilidad de bases de datos. **Recomendación: migrar y proteger.**`;
    severity = "warning";
  } else {
    alertText = `✅ **EXCELENCIA EN GOBIERNO TI (Madurez ${average}/5.0):** La Cruz Roja Seccional Valle se encuentra al día con el estándar ISO 38500 y mejores prácticas de COBIT. El Hemocentro está protegido, altamente automatizado y posee convenios de ahorro Makaia renovados. **Gobernanza ejemplar y en mejora continua.**`;
    severity = "success";
  }

  // Dimension-specific recommendations based on failure points (score <= 2)
  if (diagnosticScores.responsabilidad <= 2 || diagnosticScores.conformidad <= 2) {
    recsList.push("🛡️ **Ciberseguridad:** Contratar de inmediato al Oficial CISO y activar el SOC Valle (Proyecto B1) para blindarse contra ataques de Ransomware y evitar multas millonarias de Ley 1581.");
  }
  if (diagnosticScores.servidores <= 2 || diagnosticScores.backups <= 2) {
    recsList.push("☁️ **Resiliencia Cloud:** Migrar HeVa de servidor físico obsoleto a Azure Cloud híbrido (Proyecto B2) y configurar backups inmutables DRP.");
  }
  if (diagnosticScores.interoperabilidad <= 2) {
    recsList.push("🔗 **Interoperabilidad:** Desarrollar el API Gateway HL7/FHIR (Proyecto B3) para terminar con las islas de datos Siesa ↔ HeVa.");
  }
  if (diagnosticScores.canales_donantes <= 2 || diagnosticScores.portal_educativo <= 2) {
    recsList.push("📱 **Digitalización de Canales:** Ejecutar el plan transaccional PSE e inaugurar la App del Hemocentro (Proyecto B5) para retener alumnos del Instituto y captar donantes.");
  }
  if (diagnosticScores.apropiacion_digital <= 2) {
    recsList.push("🎓 **Adopción Digital:** Diseñar planes de microaprendizaje vía Teams (Proyecto B8) para capacitar en ciberseguridad al voluntariado de primera respuesta.");
  }

  if (recsList.length === 0) {
    recsList.push("🚀 Todas las dimensiones del Gobierno TI operan con un excelente nivel de madurez. Continúe con auditorías periódicas y monitoreando SLA con triggers automatizados.");
  }

  // Theme alert backgrounds
  let bgCol = "bg-red-950/20 border-red-900/40 text-red-400";
  if (severity === "warning") bgCol = "bg-amber-950/20 border-amber-900/40 text-amber-400";
  if (severity === "success") bgCol = "bg-emerald-950/20 border-emerald-900/40 text-emerald-450";

  // Simple Markdown helper to format bold text: **bold** -> <strong>bold</strong>
  const formatText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      <div className={`border p-5 rounded-2xl ${bgCol} shadow-inner bg-slate-950/25`}>
        <p className="text-sm md:text-base leading-relaxed font-semibold">
          {formatText(alertText)}
        </p>
      </div>
      <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider cyber-title block mt-6">
          Plano de Acción IA Sugerido:
        </h5>
        <ul className="text-sm text-slate-200 space-y-3">
          {recsList.map((li, idx) => (
            <li
              key={idx}
              className="bg-slate-950/40 border border-slate-850 p-4.5 rounded-xl shadow-sm leading-relaxed"
            >
              {formatText(li)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default DynamicRecommendations;
