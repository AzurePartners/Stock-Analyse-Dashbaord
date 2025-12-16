'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';
import { computeCorrelationMatrix } from '@/lib/calculations';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function CorrelationHeatmap() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();

  const allTickers = [...tickers];
  if (stockData['SPY']) allTickers.unshift('SPY');

  const { labels, matrix } = computeCorrelationMatrix(allTickers, stockData, computedMetrics);

  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const data: any[] = [
    {
      z: matrix,
      x: labels,
      y: labels,
      type: 'heatmap',
      colorscale: [
        [0, '#0B1E2D'],
        [0.5, '#FFFFFF'],
        [1, '#13C4A3'],
      ],
      zmin: -1,
      zmax: 1,
      reversescale: false,
      hovertemplate: '%{x} vs %{y}<br>corr=%{z:.2f}<extra></extra>',
    },
  ];

  const layout: any = {
    title: { text: 'Correlation Matrix (Daily Returns)', font: { size: 16, color: textColor } },
    xaxis: { color: axisColor, gridcolor: gridColor },
    yaxis: { color: axisColor, gridcolor: gridColor, autorange: 'reversed' },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, r: 50, b: 80, l: 80 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  if (labels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Correlation Matrix</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-dark p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Correlation Matrix</h2>
      <div className="h-96">
        <Plot data={data} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
