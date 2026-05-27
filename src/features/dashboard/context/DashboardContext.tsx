// src/features/dashboard/context/DashboardContext.tsx
import React from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useDashboard = () => {
  return useDashboardStore();
};
