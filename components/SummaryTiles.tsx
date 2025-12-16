'use client';

import usePortfolioStore from '@/store/portfolioStore';

function Tile({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="card p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold text-purity-text mt-1">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function SummaryTiles() {
  const { tickers, computedMetrics, portfolioMetrics } = usePortfolioStore();

  const tickersCount = tickers.length;
  const weightedReturn = portfolioMetrics?.weightedReturn ?? 0;
  const weightedVol = portfolioMetrics?.weightedVolatility ?? 0;
  const bestSharpeTicker =
    tickers
      .map(t => ({ t, s: computedMetrics[t]?.sharpeDaily ?? 0 }))
      .sort((a, b) => b.s - a.s)[0]?.t || '-';
  const bestSharpe =
    tickers
      .map(t => computedMetrics[t]?.sharpeDaily ?? 0)
      .reduce((m, v) => (v > m ? v : m), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Tile title="Portfolio Value" value="$—" sub="Connect brokerage to populate" />
      <Tile title="Expected Return" value={`${weightedReturn.toFixed(2)}%`} sub="+ trend monthly" />
      <Tile title="Volatility" value={`${weightedVol.toFixed(2)}%`} sub="annualized" />
      <Tile title="Best Sharpe" value={`${bestSharpe.toFixed(2)}`} sub={bestSharpeTicker} />
    </div>
  );
}
