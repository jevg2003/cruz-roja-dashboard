// src/features/dashboard/components/Dashboard.tsx
import React from 'react';
import { DashboardProvider, useDashboard } from '../context/DashboardContext';
import DashboardHeader from './DashboardHeader';
import MetricStrip from './MetricStrip';
import NavigationTabs from './NavigationTabs';

// Subviews
import DiagnosticConsole from '../../autodiagnostico/components/DiagnosticConsole';
import BscMap from '../../bsc-map/components/BscMap';
import FinancieroView from '../../financiero/components/FinancieroView';
import ClientesView from '../../clientes/components/ClientesView';
import ProcesosView from '../../procesos/components/ProcesosView';
import AprendizajeView from '../../aprendizaje/components/AprendizajeView';
import GobernanzaView from '../../gobernanza/components/GobernanzaView';
import PrescripcionView from '../../prescripcion/components/PrescripcionView';

const DashboardContent: React.FC = () => {
  const { activeTab, toast, initialize } = useDashboard();

  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Dynamically render active tab view
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
    <div className="w-full px-4 md:px-8 py-6 max-w-7xl mx-auto space-y-6 relative">
      {/* 1. Header Section */}
      <DashboardHeader />

      {/* 2. Unifying Top Metric Strip */}
      <MetricStrip />

      {/* 3. Navigation Tabs */}
      <NavigationTabs />

      {/* 4. Active Viewport Content */}
      <main className="w-full">
        {renderActiveView()}
      </main>

      {/* 5. Custom Toast Notifications */}
      {toast && (
        <div
          id="alert-toast"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-red-950/95 border-2 border-red-500/80 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-md animate-bounce"
        >
          <i className="fa-solid fa-bell text-red-500 text-xl animate-ping"></i>
          <div>
            <h5 className="text-xs font-bold text-slate-100 uppercase tracking-wider cyber-title">
              {toast.title}
            </h5>
            <p className="text-[10px] text-slate-300 mt-1">
              {toast.message}
            </p>
          </div>
        </div>
      )}
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
