'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function VolatilityChart() {
  const { tickers, computedMetrics } = usePortfolioStore();

  if (tickers.length === 0 || Object.keys(computedMetrics).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Volatility Comparison</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available.
        </div>
      </div>
    );
  }

  const volatilityData = tickers
    .map(ticker => ({
      ticker,
      volatility: computedMetrics[ticker]?.volatility || 0,
    }))
    .filter(item => item.volatility > 0)
    .sort((a, b) => b.volatility - a.volatility);

  const data: any[] = [
    {
      x: volatilityData.map(d => d.ticker),
      y: volatilityData.map(d => d.volatility),
      type: 'bar',
      marker: {
        color: volatilityData.map(d => {
          const vol = d.volatility;
          if (vol > 40) return '#ef4444'; // red for high volatility
          if (vol > 25) return '#f59e0b'; // orange for medium-high
          if (vol > 15) return '#eab308'; // yellow for medium
          return '#22c55e'; // green for low
        }),
      },
    },
  ];

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#1a1a1a';
  const gridColor = isDark ? '#374151' : '#e0e0e0';
  const axisColor = isDark ? '#9ca3af' : '#666';

  const layout: any = {
    title: {
      text: 'Annualized Volatility (%)',
      font: { size: 16, color: textColor },
    },
    xaxis: {
      title: 'Ticker',
      color: axisColor,
      gridcolor: gridColor,
    },
    yaxis: {
      title: 'Volatility (%)',
      color: axisColor,
      gridcolor: gridColor,
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, r: 50, b: 60, l: 60 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Volatility Comparison</h2>
      <div className="h-80">
        <Plot
          data={data}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

