// src/features/dashboard/components/Dashboard.tsx
import React from 'react';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import DashboardHeader from './DashboardHeader';
import MetricStrip from './MetricStrip';
import NavigationTabs from './NavigationTabs';
import DashboardSwitcher from './DashboardSwitcher';

// Subviews (Dashboard 1)
import DiagnosticConsole from '../../autodiagnostico/components/DiagnosticConsole';
import BscMap from '../../bsc-map/components/BscMap';
import FinancieroView from '../../financiero/components/FinancieroView';
import ClientesView from '../../clientes/components/ClientesView';
import ProcesosView from '../../procesos/components/ProcesosView';
import AprendizajeView from '../../aprendizaje/components/AprendizajeView';
import GobernanzaView from '../../gobernanza/components/GobernanzaView';
import PrescripcionView from '../../prescripcion/components/PrescripcionView';

// Subviews (Dashboard 2)
import IntegralDashboardView from '../../integral/components/IntegralDashboardView';

const DashboardContent: React.FC = () => {
  const { activeDashboard, activeTab, toast, initialize } = useDashboard();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Dynamically render active tab view for Dashboard 1 (IT Governance)
  const renderActiveView = () => {
    switch (activeTab) {
      case 'autodiagnostico':
        return <DiagnosticConsole />;
      case 'mapa':
        return <BscMap />;
      case 'financiero':
        return <FinancieroView />;
      case 'clientes':
        return <ClientesView />;
      case 'procesos':
        return <ProcesosView />;
      case 'aprendizaje':
        return <AprendizajeView />;
      case 'gobernanza':
        return <GobernanzaView />;
      case 'prescripcion':
        return <PrescripcionView />;
      default:
        return <DiagnosticConsole />;
    }
  };

  return (
    <div className="w-full px-2 md:px-6 py-4 max-w-none space-y-6 relative">
      {/* 1. Header Section */}
      <DashboardHeader />

      {/* 2. Switcher Selector (Pill Switcher) */}
      <DashboardSwitcher />

      {/* 3. Conditional Dashboard Rendering with Fade-in Transition */}
      <div key={activeDashboard} className="w-full animate-fadeIn transition-all duration-300">
        {activeDashboard === 'strategic_ti' ? (
          <>
            {/* 3a. Unifying Top Metric Strip */}
            <MetricStrip />

            {/* 3b. Navigation Tabs */}
            <NavigationTabs />

            {/* 3c. Active Viewport Content */}
            <main className="w-full">
              {renderActiveView()}
            </main>
          </>
        ) : (
          /* Dashboard 2: Dashboard Estratégico Integral (TI + Datos + IA) */
          <main className="w-full">
            <IntegralDashboardView />
          </main>
        )}
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};
export default Dashboard;

