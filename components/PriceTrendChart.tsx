'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';
import { useEffect, useState } from 'react';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function PriceTrendChart() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();
  const [showSpy, setShowSpy] = useState(true);
  const [showSMA5, setShowSMA5] = useState(true);
  const [showSMA20, setShowSMA20] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelected(new Set(tickers));
  }, [tickers]);

  if (tickers.length === 0 || Object.keys(stockData).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Price Trend</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  const traces: any[] = [];

  // Add closing price traces for each ticker
  const baseTickers = [...tickers];
  const withSpy = showSpy && stockData['SPY'] ? ['SPY', ...baseTickers] : baseTickers;
  const activeTickers = withSpy.filter(t => t === 'SPY' ? true : selected.has(t));

  activeTickers.forEach((ticker, index) => {
    const data = stockData[ticker];
    const metrics = computedMetrics[ticker];
    
    if (data && metrics) {
      // Closing price trace
      traces.push({
        x: data.dates,
        y: data.closingPrices,
        type: 'scatter',
        mode: 'lines',
        name: `${ticker} Close`,
        line: { width: 2, color: `hsl(${index * 60}, 70%, 50%)` },
      });

      // SMA5 trace
      if (showSMA5) {
        const sma5Dates = data.dates.filter((_, i) => !isNaN(metrics.sma5[i]));
        const sma5Values = metrics.sma5.filter(v => !isNaN(v));
        if (sma5Values.length > 0) {
          traces.push({
            x: sma5Dates,
            y: sma5Values,
            type: 'scatter',
            mode: 'lines',
            name: `${ticker} SMA5`,
            line: { width: 1.5, dash: 'dash', color: `hsl(${index * 60}, 70%, 50%)` },
            opacity: 0.7,
          });
        }
      }

      // SMA20 trace
      if (showSMA20) {
        const sma20Dates = data.dates.filter((_, i) => !isNaN(metrics.sma20[i]));
        const sma20Values = metrics.sma20.filter(v => !isNaN(v));
        if (sma20Values.length > 0) {
          traces.push({
            x: sma20Dates,
            y: sma20Values,
            type: 'scatter',
            mode: 'lines',
            name: `${ticker} SMA20`,
            line: { width: 1.5, dash: 'dot', color: `hsl(${index * 60}, 70%, 50%)` },
            opacity: 0.7,
          });
        }
      }
    }
  });

  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const layout: any = {
    title: {
      text: 'Price Trend with Moving Averages',
      font: { size: 16, color: textColor },
    },
    xaxis: {
      title: 'Date',
      color: axisColor,
      gridcolor: gridColor,
    },
    yaxis: {
      title: 'Price ($)',
      color: axisColor,
      gridcolor: gridColor,
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'x unified' as const,
    hoverlabel: { bgcolor: 'rgba(15,30,45,0.9)', bordercolor: '#2ED7C3', font: { color: '#EEF3F8' } },
    legend: {
      orientation: 'h' as const,
      x: 0,
      xanchor: 'left' as const,
      y: -0.35,
      yanchor: 'top' as const,
      font: { color: textColor, size: 11 },
      bgcolor: 'rgba(0,0,0,0.3)',
      bordercolor: 'rgba(255,255,255,0.25)',
      borderwidth: 1,
      itemsizing: 'constant' as const,
    },
    margin: { t: 50, r: 50, b: 240, l: 60 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className="chart-dark p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Price Trend</h2>
        <div className="flex items-center gap-4">
          {stockData['SPY'] && (
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={showSpy}
                onChange={(e) => setShowSpy(e.target.checked)}
                className="rounded"
              />
              Show SPY overlay
            </label>
          )}
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={showSMA5}
              onChange={(e) => setShowSMA5(e.target.checked)}
              className="rounded"
            />
            Show SMA5
          </label>
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={showSMA20}
              onChange={(e) => setShowSMA20(e.target.checked)}
              className="rounded"
            />
            Show SMA20
          </label>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="text-sm text-white/80">Tickers:</span>
        {tickers.map(t => (
          <button
            key={t}
            onClick={() => {
              const next = new Set(selected);
              if (next.has(t)) next.delete(t); else next.add(t);
              setSelected(next);
            }}
            className={`px-2 py-1 rounded-md text-sm border ${selected.has(t) ? 'bg-purity-mint text-white border-purity-mint' : 'bg-white/10 text-white border-white/20'}`}
          >
            {t}
          </button>
        ))}
        <button
          onClick={() => setSelected(new Set(tickers))}
          className="ml-2 px-2 py-1 rounded-md text-sm bg-white/10 text-white border border-white/20"
        >
          Select all
        </button>
        <button
          onClick={() => setSelected(new Set())}
          className="px-2 py-1 rounded-md text-sm bg-white/10 text-white border border-white/20"
        >
          Clear
        </button>
      </div>
      <div className="h-[36rem]">
        <Plot
          data={traces}
          layout={layout}
          config={config}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}

