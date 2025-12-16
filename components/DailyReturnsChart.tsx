'use client';

import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function DailyReturnsChart() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();
  const [mode, setMode] = useState<'lines' | 'markers'>('lines');

  const traces = useMemo(() => {
    const items: any[] = [];
    const palette = ['#13C4A3', '#2ED7C3', '#4CC9F0', '#7BDFF2', '#94D1BE', '#5FB49C'];
    const allTickers = [...tickers];
    // Include SPY if present
    if (stockData['SPY']) allTickers.unshift('SPY');

    allTickers.forEach((ticker, index) => {
      const data = stockData[ticker];
      const metrics = computedMetrics[ticker];
      if (!data || !metrics || !metrics.dailyReturns) return;
      const dates = data.dates.slice(1);
      if (mode === 'lines') {
        items.push({
          x: dates,
          y: metrics.dailyReturns,
          type: 'scatter',
          mode: 'lines',
          name: `${ticker} Daily %`,
          line: { width: 1.8, color: palette[index % palette.length] },
          hovertemplate: '%{x}<br>%{y:.2f}%<extra>' + ticker + '</extra>',
        });
      } else {
        items.push({
          x: dates,
          y: metrics.dailyReturns,
          type: 'bar',
          name: `${ticker} Daily %`,
          marker: { color: palette[index % palette.length] },
          hovertemplate: '%{x}<br>%{y:.2f}%<extra>' + ticker + '</extra>',
        });
      }
    });
    return items;
  }, [tickers, stockData, computedMetrics, mode]);

  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const layout: any = {
    title: { text: 'Daily Returns (%)', font: { size: 16, color: textColor } },
    xaxis: { title: 'Date', color: axisColor, gridcolor: gridColor, zerolinecolor: gridColor },
    yaxis: { title: 'Return (%)', color: axisColor, gridcolor: gridColor, zerolinecolor: gridColor },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'x unified' as const,
    hoverlabel: { bgcolor: 'rgba(15,30,45,0.9)', bordercolor: '#2ED7C3', font: { color: '#EEF3F8' } },
    legend: {
      orientation: 'h' as const,
      yanchor: 'bottom' as const,
      y: -0.3,
      xanchor: 'center' as const,
      x: 0.5,
      font: { color: textColor },
      bgcolor: 'rgba(0,0,0,0.3)',
      bordercolor: 'rgba(255,255,255,0.25)',
      borderwidth: 1,
    },
    margin: { t: 50, r: 50, b: 80, l: 60 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  if (tickers.length === 0 || Object.keys(stockData).length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-purity-text">Daily Returns</h2>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  return (
    <div className="chart-dark p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Daily Returns</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('lines')}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === 'lines'
                ? 'bg-purity-mint text-white'
                : 'bg-white/20 text-white'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setMode('markers')}
            className={`px-3 py-1 rounded-md text-sm ${
              mode === 'markers'
                ? 'bg-purity-mint text-white'
                : 'bg-white/20 text-white'
            }`}
          >
            Bar
          </button>
        </div>
      </div>
      <div className="h-96">
        <Plot data={traces} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
