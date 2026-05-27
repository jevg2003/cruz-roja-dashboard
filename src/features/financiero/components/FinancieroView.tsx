// src/features/financiero/components/FinancieroView.tsx
import React from 'react';
import { useDashboard } from '../../dashboard/context/DashboardContext';
import IncomeDonutChart from './IncomeDonutChart';

export const FinancieroView: React.FC = () => {
  const {
    budgetFinal,
    incomeFinal,
    decisions,
    totalCost,
    diagnosticScores,
  } = useDashboard();

  // Helper for status styling classes
  const getStatusClasses = (status: 'success' | 'warning' | 'danger') => {
    if (status === 'success') return { text: 'text-emerald-450 text-emerald-450', border: 'border-emerald-500/50', bg: 'bg-emerald-950/60' };
    if (status === 'warning') return { text: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' };
    return { text: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/60' };
  };

  const budgetStatus = totalCost > 330 ? 'danger' : budgetFinal >= 90 ? 'success' : 'warning';
  const budgetClasses = getStatusClasses(budgetStatus);

  const assetsStatus = decisions.b2_azure ? 'success' : 'danger';
  const assetsClasses = getStatusClasses(assetsStatus);

  // PETI Projects Investment List
  const investments = [
    { key: 'B2', proyecto: "Infraestructura Cloud (B2)", monto: "$80M", prioridad: "Alta", aprobado: decisions.b2_azure },
    { key: 'B3', proyecto: "API Gateway / Integración (B3)", monto: "$55M", prioridad: "Media", aprobado: decisions.b3_api },
    { key: 'B4', proyecto: "Analítica Institucional (B4)", monto: "$60M", prioridad: "Alta", aprobado: true }, // Approved by default
    { key: 'B1', proyecto: "Ciberseguridad / SOC (B1)", monto: "$45M", prioridad: "Crítica", aprobado: decisions.b1_ciso },
    { key: 'B5', proyecto: "Hemocentro 4.0 + Portal (B5)", monto: "$75M", prioridad: "Crítica", aprobado: decisions.b5_portal },
    { key: 'B8', proyecto: "Capacitación Digital (B8)", monto: "$15M", prioridad: "Media", aprobado: decisions.b8_capacitacion }
  ];

  // Dynamic distribution of income based on current Hemocentro revenue
  // Hemo base is $771M (out of 1240). We adjust it reactively.
  const hemoIncomePercent = Math.round((incomeFinal / 1240) * 100);
  const eduIncomePercent = 5;
  const loteriaIncomePercent = Math.max(0, 100 - hemoIncomePercent - eduIncomePercent);

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* 4 Financial Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {/* Ingresos Totales */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-brand-red shadow-lg">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Ingresos Totales 2024</span>
          <span className="cyber-value text-3xl font-black text-slate-100 block mt-2">$1.240M</span>
          <p className="text-xs text-slate-400 mt-2">
            Hemocentro {hemoIncomePercent}% - Lotería/Otros {loteriaIncomePercent}% - Educación {eduIncomePercent}%
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-600 h-full w-full"></div>
          </div>
        </div>

        {/* Presupuesto TI Ejecutado */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-amber-500 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Presupuesto TI Ejecutado</span>
            <span className={`border ${budgetClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
              {totalCost > 330 ? 'Excedido' : 'En seguimiento'}
            </span>
          </div>
          <span className={`cyber-value text-3xl font-black ${budgetClasses.text} block mt-2`}>
            {budgetFinal}%
          </span>
          <p className="text-xs text-slate-400 mt-2">Meta: desviación ≤ 10% | PETI 2026-2030</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full ${totalCost > 330 ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(budgetFinal, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Ahorro Makaia */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-emerald-500 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ahorro Makaia (Licencias)</span>
            <span className="border text-emerald-400 border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase">
              Activo y renovado
            </span>
          </div>
          <span className="cyber-value text-3xl font-black text-emerald-400 block mt-2">
            {diagnosticScores.convenios_makaia >= 4 ? '100%' : '50%'}
          </span>
          <p className="text-xs text-slate-400 mt-2">646 licencias Microsoft 365 - Programa Nonprofit</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full w-full"></div>
          </div>
        </div>

        {/* Activos Tecnológicos */}
        <div className="glass-panel p-5 rounded-2xl border-t-2 border-red-500 shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activos Tecnológicos</span>
            <span className={`border ${assetsClasses.text} border-current text-[9px] font-bold px-2 py-0.5 rounded uppercase`}>
              {decisions.b2_azure ? 'Infraestructura Migrada' : 'En riesgo'}
            </span>
          </div>
          <span className={`cyber-value text-3xl font-black ${assetsClasses.text} block mt-2`}>
            $321M
          </span>
          <p className="text-xs text-slate-400 mt-2">
            {decisions.b2_azure
              ? 'Servidores migrados a la nube híbrida de Azure - Resiliencia garantizada'
              : 'Servidores obsoletos > 5 años - Riesgo operativo'}
          </p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full ${decisions.b2_azure ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: decisions.b2_azure ? '100%' : '66%' }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Income Sources Chart */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Fuentes de Ingreso por Unidad
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Participación en el presupuesto operativo general de la Seccional
            </p>
          </div>
          <div className="h-64 mt-4 flex items-center justify-center relative">
            <IncomeDonutChart
              hemoIncome={hemoIncomePercent}
              loteriaIncome={loteriaIncomePercent}
              eduIncome={eduIncomePercent}
            />
          </div>
        </div>

        {/* PETI Project Investment Table */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl flex flex-col justify-between min-h-[300px]">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider cyber-title">
              Inversión PETI 2026-2030 por Proyecto
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Asignación financiera aprobada para la ejecución estratégica de TI
            </p>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5">Proyecto Estratégico</th>
                  <th className="py-2.5 text-center">Prioridad</th>
                  <th className="py-2.5 text-right">Inversión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {investments.map((inv) => {
                  const badgeColor =
                    inv.prioridad === 'Crítica'
                      ? 'bg-red-950/60 text-red-500 border-red-900/40'
                      : inv.prioridad === 'Alta'
                      ? 'bg-amber-950/60 text-amber-500 border-amber-900/40'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800';

                  return (
                    <tr key={inv.key} className="border-b border-slate-850 hover:bg-slate-900/20">
                      <td className="py-3 font-medium text-slate-200">
                        <span className="block">{inv.proyecto}</span>
                        <span
                          className={`text-[10px] block mt-0.5 ${
                            inv.aprobado ? 'text-emerald-450 font-extrabold' : 'text-slate-500 font-semibold'
                          }`}
                        >
                          {inv.aprobado ? '✓ Aprobado' : '⚡ Requerido'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`border px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                          {inv.prioridad}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-100">
                        {inv.monto}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-350 uppercase tracking-wider cyber-title">
              Total Inversión Proyectada PETI:
            </span>
            <span
              className={`text-xl font-mono font-black animate-pulse ${
                totalCost > 330 ? 'text-red-500' : 'text-emerald-450'
              }`}
            >
              ${totalCost}.0M COP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default FinancieroView;
