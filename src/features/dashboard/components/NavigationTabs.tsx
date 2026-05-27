// src/features/dashboard/components/NavigationTabs.tsx
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { TabType } from '../types';

interface TabItem {
  id: TabType;
  label: string;
  icon: string;
  iconClass?: string;
}

const tabsConfig: TabItem[] = [
  { id: 'autodiagnostico', label: 'Autodiagnóstico', icon: 'fa-solid fa-brain', iconClass: 'text-cyan-300 animate-pulse' },
  { id: 'mapa', label: 'Mapa BSC', icon: 'fa-solid fa-map-location-dot' },
  { id: 'financiero', label: 'Financiero', icon: 'fa-solid fa-chart-line' },
  { id: 'clientes', label: 'Clientes', icon: 'fa-solid fa-hand-holding-heart' },
  { id: 'procesos', label: 'Procesos', icon: 'fa-solid fa-shield-halved' },
  { id: 'aprendizaje', label: 'Aprendizaje', icon: 'fa-solid fa-graduation-cap' },
  { id: 'gobernanza', label: 'Directivas ISO 38500', icon: 'fa-solid fa-scale-balanced' },
  { id: 'prescripcion', label: 'Prescripción', icon: 'fa-solid fa-bolt' }
];

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab } = useDashboard();

  return (
    <nav 
      className="w-full animate-fadeIn z-30"
      aria-label="Dashboard navigation"
    >
      {/* Container con scroll en mobile, flex normal en desktop */}
      <div className="glass-panel rounded-xl p-1.5 overflow-x-auto overflow-y-hidden scrollbar-hide md:overflow-visible">
        {/* Inner flex container que respeta ancho padre y es responsive */}
        <div className="flex gap-1 min-w-min md:min-w-full md:flex-wrap md:flex-nowrap">
          {tabsConfig.map((tab) => {
            const isActive = activeTab === tab.id;
            const activeClass = isActive
              ? "bg-red-650/90 text-white glow-red shadow-lg shadow-red-650/30"
              : "text-slate-400 hover:text-white hover:bg-white/5";

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`${tab.label}${isActive ? ' (seleccionado)' : ''}`}
                className={`
                  nav-tab 
                  px-3 sm:px-4 py-2.5 
                  rounded-lg 
                  text-xs sm:text-sm
                  font-semibold 
                  whitespace-nowrap 
                  transition-all 
                  duration-200
                  cyber-title 
                  cursor-pointer 
                  flex 
                  items-center 
                  justify-center 
                  gap-1.5 sm:gap-2
                  flex-shrink-0 
                  md:flex-1
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
                  hover:shadow-md
                  active:scale-95
                  ${activeClass}
                `}
                type="button"
              >
                <i 
                  className={`${tab.icon} ${tab.iconClass || ''} flex-shrink-0`}
                  aria-hidden="true"
                ></i> 
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
export default NavigationTabs;