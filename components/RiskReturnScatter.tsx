'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function RiskReturnScatter() {
  const { tickers, stockData, computedMetrics, weights } = usePortfolioStore();

  const allTickers = [...tickers];
  if (stockData['SPY']) allTickers.unshift('SPY');

  const xVol: number[] = [];
  const yRet: number[] = [];
  const labels: string[] = [];
  const sizes: number[] = [];
  const sharpes: number[] = [];

  allTickers.forEach(t => {
    const m = computedMetrics[t];
    if (!m) return;
    labels.push(t);
    xVol.push(m.volatility);
    yRet.push(m.cumulativeReturn);
    sharpes.push(m.sharpeDaily ?? 0);
    const w = (weights[t] ?? 0);
    const size = 10 + (w / 100) * 30; // bubble size scaled by weight
    sizes.push(size);
  });

  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const data: any[] = [
    {
      x: xVol,
      y: yRet,
      text: labels.map((t, i) => `${t}<br>Sharpe: ${sharpes[i].toFixed(3)}`),
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sizes,
        color: labels.map((_, i) => i === 0 && labels[0] === 'SPY' ? '#13C4A3' : '#2ED7C3'),
        sizemode: 'area' as const,
      },
      hovertemplate:
        '%{text}<br>Vol: %{x:.2f}<br>Monthly Return: %{y:.2f}%<extra></extra>',
    },
  ];

  const layout: any = {
    title: { text: 'Risk–Return (Monthly vs Volatility)', font: { size: 16, color: textColor } },
    xaxis: { title: 'Volatility (annualized)', color: axisColor, gridcolor: gridColor },
    yaxis: { title: 'Monthly Return (%)', color: axisColor, gridcolor: gridColor },
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
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Risk–Return Scatter</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-dark p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Risk–Return Scatter</h2>
      <div className="h-96">
        <Plot data={data} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
