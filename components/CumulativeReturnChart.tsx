'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function CumulativeReturnChart() {
  const { tickers, computedMetrics } = usePortfolioStore();

  if (tickers.length === 0 || Object.keys(computedMetrics).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Returns</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available.
        </div>
      </div>
    );
  }

  const returnData = tickers
    .map(ticker => ({
      ticker,
      return: computedMetrics[ticker]?.cumulativeReturn || 0,
    }))
    .sort((a, b) => b.return - a.return);

  const data: any[] = [
    {
      x: returnData.map(d => d.ticker),
      y: returnData.map(d => d.return),
      type: 'bar',
      marker: {
        color: returnData.map(d => (d.return >= 0 ? '#22c55e' : '#ef4444')),
      },
    },
  ];

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#1a1a1a';
  const gridColor = isDark ? '#374151' : '#e0e0e0';
  const axisColor = isDark ? '#9ca3af' : '#666';

  const layout: any = {
    title: {
      text: 'Monthly Cumulative Return (%)',
      font: { size: 16, color: textColor },
    },
    xaxis: {
      title: 'Ticker',
      color: axisColor,
      gridcolor: gridColor,
    },
    yaxis: {
      title: 'Return (%)',
      color: axisColor,
      gridcolor: gridColor,
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, r: 50, b: 60, l: 60 },
    shapes: [
      {
        type: 'line',
        xref: 'paper',
        yref: 'y',
        x0: 0,
        y0: 0,
        x1: 1,
        y1: 0,
        line: {
          color: axisColor,
          width: 1,
          dash: 'dash',
        },
      },
    ],
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Monthly Returns</h2>
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

