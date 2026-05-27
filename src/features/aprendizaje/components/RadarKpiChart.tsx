// src/features/aprendizaje/components/RadarKpiChart.tsx
import React, { useEffect, useRef } from 'react';

interface RadarKpiChartProps {
  currentUptime: number;
  digitalMaturity: number;
  digitalTramites: number;
  iso27001: number;
  csat: number;
  systemIntegration: number;
}

export const RadarKpiChart: React.FC<RadarKpiChartProps> = ({
  currentUptime,
  digitalMaturity,
  digitalTramites,
  iso27001,
  csat,
  systemIntegration,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart || !canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Dynamic calculations as in charts.js
    const scaledUptime = Math.max(0, Math.min(100, (currentUptime - 95) * 20)); // scale 95-100 to 0-100
    const scaledMaturity = (digitalMaturity / 5.0) * 100;
    const scaledCsat = csat * 10;

    const currentRadar = [
      scaledUptime,
      scaledMaturity,
      digitalTramites,
      systemIntegration,
      iso27001,
      scaledCsat,
    ];

    const targetRadar = [96, 84, 90, 100, 90, 90]; // Static targets as defined in localFallbackData

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          "Disponibilidad Servicios",
          "Madurez Digital",
          "Trámites Digitales",
          "Integración Sistemas",
          "Cumplimiento ISO 27001",
          "Satisfacción Usuarios",
        ],
        datasets: [
          {
            label: 'Estado Actual 2026',
            data: currentRadar,
            fill: true,
            backgroundColor: 'rgba(211, 47, 47, 0.15)',
            borderColor: 'rgba(211, 47, 47, 0.85)',
            pointBackgroundColor: '#ff3344',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(211, 47, 47, 1)',
          },
          {
            label: 'Meta PETI 2030',
            data: targetRadar,
            fill: true,
            backgroundColor: 'rgba(0, 230, 118, 0.05)',
            borderColor: 'rgba(0, 230, 118, 0.75)',
            pointBackgroundColor: '#00e676',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 230, 118, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#475569',
              font: { family: 'Outfit', size: 11, weight: 'bold' },
            },
          },
        },
        scales: {
          r: {
            grid: { color: 'rgba(15, 23, 42, 0.07)' },
            angleLines: { color: 'rgba(15, 23, 42, 0.07)' },
            pointLabels: {
              color: '#334155',
              font: { family: 'Outfit', size: 9.5, weight: 'bold' },
            },
            ticks: { display: false },
            min: 0,
            max: 100,
          },
        },
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [currentUptime, digitalMaturity, digitalTramites, iso27001, csat, systemIntegration]);

  return <canvas ref={canvasRef} id="radarKpiChart" />;
};
export default RadarKpiChart;
