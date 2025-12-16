'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function SharpeComparisonChart() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();

  const labels: string[] = [];
  const values: number[] = [];

  const allTickers = [...tickers];
  if (stockData['SPY']) allTickers.unshift('SPY');

  allTickers.forEach(t => {
    const m = computedMetrics[t];
    if (!m) return;
    labels.push(t);
    values.push(m.sharpeDaily ?? 0);
  });

  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const data: any[] = [
    {
      x: labels,
      y: values,
      type: 'bar',
      marker: { color: labels.map((_, i) => i === 0 && labels[0] === 'SPY' ? '#13C4A3' : '#2ED7C3') },
      hovertemplate: '%{x}<br>Sharpe (daily): %{y:.3f}<extra></extra>',
    },
  ];

  const layout: any = {
    title: { text: 'Sharpe Ratio (Daily)', font: { size: 16, color: textColor } },
    xaxis: { title: 'Ticker', color: axisColor, gridcolor: gridColor },
    yaxis: { title: 'Sharpe', color: axisColor, gridcolor: gridColor, zeroline: true, zerolinecolor: gridColor },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, r: 50, b: 80, l: 60 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  if (labels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Sharpe Comparison</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-dark p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Sharpe Comparison</h2>
      <div className="h-96">
        <Plot data={data} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
