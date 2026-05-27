// src/features/financiero/components/IncomeDonutChart.tsx
import React, { useEffect, useRef } from 'react';

interface IncomeDonutChartProps {
  hemoIncome: number;
  loteriaIncome: number;
  eduIncome: number;
}

export const IncomeDonutChart: React.FC<IncomeDonutChartProps> = ({
  hemoIncome,
  loteriaIncome,
  eduIncome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const Chart = (window as any).Chart;
    if (!Chart || !canvasRef.current) return;

    // Destroy existing chart instance to prevent canvas reuse errors
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Hemocentro', 'Lotería y Otros', 'Educación'],
        datasets: [
          {
            data: [hemoIncome, loteriaIncome, eduIncome],
            backgroundColor: ['#d32f2f', '#4b5563', '#ffab00'],
            borderWidth: 2.5,
            borderColor: '#ffffff',
            hoverOffset: 6,
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
        cutout: '65%',
      },
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [hemoIncome, loteriaIncome, eduIncome]);

  return <canvas ref={canvasRef} id="incomeDonutChart" />;
};
export default IncomeDonutChart;
