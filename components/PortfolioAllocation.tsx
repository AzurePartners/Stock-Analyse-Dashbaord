'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function PortfolioAllocation() {
  const { tickers, weights, portfolioMetrics, updateWeight } = usePortfolioStore();

  // Normalize weights for display - hooks must be called before any conditional returns
  const totalWeight = tickers.reduce((sum, ticker) => sum + (weights[ticker] || 0), 0);
  const normalizedWeights = useMemo(() => {
    if (tickers.length === 0) return {};
    const normalized: Record<string, number> = {};
    tickers.forEach(ticker => {
      normalized[ticker] = totalWeight > 0 
        ? ((weights[ticker] || 0) / totalWeight) * 100 
        : 100 / tickers.length;
    });
    return normalized;
  }, [tickers, weights, totalWeight]);

  if (tickers.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-purity-text">Portfolio Allocation</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available.
        </div>
      </div>
    );
  }

  const palette = ['#13C4A3', '#2ED7C3', '#4CC9F0', '#7BDFF2', '#94D1BE', '#5FB49C', '#80FFDB', '#64DFDF', '#BDE0FE', '#A5F3DC'];
  const pieData: any[] = [
    {
      values: tickers.map(t => normalizedWeights[t]),
      labels: tickers,
      type: 'pie',
      hole: 0.4,
      marker: {
        colors: tickers.map((_, i) => palette[i % palette.length]),
      },
      textinfo: 'label+percent',
      textposition: 'outside',
      textfont: { color: '#EEF3F8', size: 12 },
      insidetextfont: { color: '#EEF3F8' },
      outsidetextfont: { color: '#EEF3F8' },
    },
  ];

  const textColor = '#EEF3F8';

  const pieLayout: any = {
    title: {
      text: 'Portfolio Weights',
      font: { size: 16, color: textColor },
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { t: 50, r: 50, b: 50, l: 50 },
    showlegend: true,
    legend: {
      font: { color: textColor },
      bgcolor: 'rgba(255,255,255,0.08)',
      bordercolor: 'rgba(255,255,255,0.2)',
      borderwidth: 1,
    },
  };

  const handleWeightChange = (ticker: string, value: number) => {
    updateWeight(ticker, Math.max(0, Math.min(100, value)));
  };

  return (
    <div className="chart-dark p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Portfolio Allocation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <Plot
            data={pieData}
            layout={pieLayout}
            config={{ responsive: true, displayModeBar: false }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            {tickers.map((ticker) => (
              <div key={ticker} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/80">
                    {ticker}
                  </label>
                  <span className="text-sm font-semibold text-white">
                    {normalizedWeights[ticker].toFixed(1)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weights[ticker] || 0}
                  onChange={(e) => handleWeightChange(ticker, parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purity-mint"
                />
              </div>
            ))}
          </div>

          {portfolioMetrics && (
            <div className="mt-6 p-4 bg-white/5 border border-white/20 rounded-lg space-y-2">
              <h3 className="font-semibold text-white">Portfolio Metrics</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/80">Expected Return:</span>
                  <span className="font-medium text-white">
                    {portfolioMetrics.weightedReturn.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80">Volatility:</span>
                  <span className="font-medium text-white">
                    {portfolioMetrics.weightedVolatility.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
