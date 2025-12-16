'use client';

import usePortfolioStore from '@/store/portfolioStore';

export default function RiskReturnHeatmap() {
  const { tickers, computedMetrics } = usePortfolioStore();

  if (tickers.length === 0 || Object.keys(computedMetrics).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Risk-Return Analysis</h2>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          No data available.
        </div>
      </div>
    );
  }

  const data = tickers.map(ticker => {
    const metrics = computedMetrics[ticker];
    if (!metrics) return null;
    return {
      ticker,
      volatility: metrics.volatility,
      return: metrics.cumulativeReturn,
      sharpe: metrics.sharpeRatio,
    };
  }).filter(Boolean) as Array<{ ticker: string; volatility: number; return: number; sharpe: number }>;

  // Normalize values for color coding (0-1 scale)
  const maxVol = Math.max(...data.map(d => d.volatility), 1);
  const maxReturn = Math.max(...data.map(d => Math.abs(d.return)), 1);
  const maxSharpe = Math.max(...data.map(d => Math.abs(d.sharpe)), 1);

  const getColorIntensity = (value: number, max: number, reverse = false) => {
    const normalized = Math.min(Math.abs(value) / max, 1);
    const intensity = reverse ? 1 - normalized : normalized;
    return Math.round(intensity * 100);
  };

  const getColorClass = (intensity: number, type: 'vol' | 'return' | 'sharpe') => {
    if (type === 'vol') {
      // Higher volatility = more red
      if (intensity > 70) return 'bg-red-600';
      if (intensity > 50) return 'bg-orange-500';
      if (intensity > 30) return 'bg-yellow-500';
      return 'bg-green-500';
    } else if (type === 'return') {
      // Positive = green, negative = red
      return intensity > 50 ? 'bg-green-500' : 'bg-red-500';
    } else {
      // Higher Sharpe = better (green)
      if (intensity > 70) return 'bg-green-600';
      if (intensity > 50) return 'bg-green-500';
      if (intensity > 30) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Risk-Return Analysis</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-600">
              <th className="text-left p-3 font-semibold text-gray-900 dark:text-gray-100">Ticker</th>
              <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">Volatility (%)</th>
              <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">Return (%)</th>
              <th className="text-center p-3 font-semibold text-gray-900 dark:text-gray-100">Sharpe Ratio</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const volIntensity = getColorIntensity(row.volatility, maxVol);
              const returnIntensity = getColorIntensity(row.return, maxReturn);
              const sharpeIntensity = getColorIntensity(row.sharpe, maxSharpe);

              return (
                <tr
                  key={row.ticker}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-100">{row.ticker}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      <div
                        className={`${getColorClass(volIntensity, 'vol')} text-white px-3 py-1 rounded text-sm font-medium min-w-[80px]`}
                      >
                        {row.volatility.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      <div
                        className={`${row.return >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded text-sm font-medium min-w-[80px]`}
                      >
                        {row.return >= 0 ? '+' : ''}{row.return.toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center">
                      <div
                        className={`${getColorClass(sharpeIntensity, 'sharpe')} text-white px-3 py-1 rounded text-sm font-medium min-w-[80px]`}
                      >
                        {row.sharpe.toFixed(2)}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

