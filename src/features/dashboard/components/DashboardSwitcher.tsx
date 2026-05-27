// src/features/dashboard/components/DashboardSwitcher.tsx
import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { DashboardType } from '../types';

export const DashboardSwitcher: React.FC = () => {
  const { activeDashboard, setActiveDashboard } = useDashboard();

  const handleSwitch = (db: DashboardType) => {
    setActiveDashboard(db);
  };

  return (
    <div className="w-full flex justify-center py-1.5 animate-fadeIn z-30 relative px-2">
      <div className="glass-panel p-1 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between border border-slate-200 shadow-md max-w-xl w-full gap-1">
        <button
          onClick={() => handleSwitch('strategic_ti')}
          aria-current={activeDashboard === 'strategic_ti' ? 'page' : undefined}
          style={activeDashboard === 'strategic_ti' 
            ? { background: 'linear-gradient(to right, #ef4444, #be123c)', color: '#ffffff' } 
            : { color: '#475569' }
          }
          className={`
            flex-1
            px-4 py-2.5 
            rounded-xl 
            text-xs md:text-sm
            font-bold 
            transition-all 
            duration-300
            cyber-title 
            cursor-pointer 
            flex 
            items-center 
            justify-center 
            gap-2
            active:scale-95
            text-center
            ${activeDashboard !== 'strategic_ti' ? 'hover:text-brand-red hover:bg-slate-100' : ''}
          `}
          type="button"
        >
          <i className="fa-solid fa-scale-balanced text-xs flex-shrink-0"></i>
          <span>Dashboard Gobierno de TI</span>
        </button>

        <button
          onClick={() => handleSwitch('integral_ti_datos_ia')}
          aria-current={activeDashboard === 'integral_ti_datos_ia' ? 'page' : undefined}
          style={activeDashboard === 'integral_ti_datos_ia' 
            ? { background: 'linear-gradient(to right, #312e81, #1e1b4b)', color: '#ffffff' } 
            : { color: '#475569' }
          }
          className={`
            flex-1
            px-4 py-2.5 
            rounded-xl 
            text-xs md:text-sm
            font-bold 
            transition-all 
            duration-300
            cyber-title 
            cursor-pointer 
            flex 
            items-center 
            justify-center 
            gap-2
            active:scale-95
            text-center
            ${activeDashboard !== 'integral_ti_datos_ia' ? 'hover:text-slate-950 hover:bg-slate-100' : ''}
          `}
          type="button"
        >
          <i className="fa-solid fa-circle-nodes text-xs flex-shrink-0"></i>
          <span>Dashboard Gobernanza Integral</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSwitcher;


