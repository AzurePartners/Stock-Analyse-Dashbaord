'use client';

import dynamic from 'next/dynamic';
import usePortfolioStore from '@/store/portfolioStore';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function RollingVolatilityChart() {
  const { tickers, stockData, computedMetrics } = usePortfolioStore();

  if (tickers.length === 0 || Object.keys(stockData).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Rolling Volatility (10-Day)</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available. Enter tickers to analyze.
        </div>
      </div>
    );
  }

  const traces: any[] = [];
  const allTickers = [...tickers];
  if (stockData['SPY']) allTickers.unshift('SPY');

  allTickers.forEach((ticker, index) => {
    const data = stockData[ticker];
    const metrics = computedMetrics[ticker];
    if (!data || !metrics || !metrics.rollingVol10) return;
    const dates = data.dates.slice(1);
    const series = metrics.rollingVol10;
    const validDates = dates.filter((_, i) => !isNaN(series[i]));
    const validSeries = series.filter(v => !isNaN(v));
    traces.push({
      x: validDates,
      y: validSeries,
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: `hsla(${index * 60}, 70%, 50%, 0.12)`,
      name: `${ticker} 10D Vol`,
      line: { width: 2, color: index === 0 && ticker === 'SPY' ? '#13C4A3' : `hsl(${index * 60}, 70%, 50%)` },
      hovertemplate: '%{x}<br>%{y:.4f}<extra>' + ticker + '</extra>',
    });
  });

  const textColor = '#EEF3F8';
  const gridColor = 'rgba(255,255,255,0.15)';
  const axisColor = '#D7F5F1';

  const layout: any = {
    title: { text: 'Rolling Volatility (10-Day)', font: { size: 16, color: textColor } },
    xaxis: { title: 'Date', color: axisColor, gridcolor: gridColor },
    yaxis: { title: 'Std Dev (daily)', color: axisColor, gridcolor: gridColor },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'x unified' as const,
    hoverlabel: { bgcolor: 'rgba(15,30,45,0.9)', bordercolor: '#2ED7C3', font: { color: '#EEF3F8' } },
    legend: {
      orientation: 'h' as const,
      x: 0,
      xanchor: 'left' as const,
      y: -0.3,
      yanchor: 'top' as const,
      font: { color: textColor },
      bgcolor: 'rgba(255,255,255,0.0)',
    },
    margin: { t: 50, r: 50, b: 120, l: 60 },
  };

  const config = {
    responsive: true,
    displayModeBar: true,
  };

  return (
    <div className="chart-dark p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Rolling Volatility (10-Day)</h2>
      <div className="h-96">
        <Plot data={traces} layout={layout} config={config} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}
