import { mean, std, calculateRollingVolatility, computeCorrelationMatrix } from '../calculations';
import { StockData, ComputedMetrics } from '../types';

export function runCalculationSelfTest() {
  const arr = [1, 2, 3, 4, 5];
  const m = mean(arr);
  const s = std(arr);

  const returns = [0.5, -0.2, 0.1, 0.0, 0.3, -0.1, 0.2, 0.4, -0.3, 0.2];
  const roll = calculateRollingVolatility(returns, 5);

  const a: StockData = { ticker: 'AAA', dates: ['2024-01-02','2024-01-03','2024-01-04','2024-01-05'], closingPrices: [100,101,99,100], adjustedClose: [100,101,99,100] };
  const b: StockData = { ticker: 'BBB', dates: ['2024-01-02','2024-01-03','2024-01-04','2024-01-05'], closingPrices: [50,50.5,49.5,49.8], adjustedClose: [50,50.5,49.5,49.8] };
  const ma: ComputedMetrics = { dailyReturns: [1,-1,1.01], volatility: 0, sma5: [], sma20: [], cumulativeReturn: 0, sharpeRatio: 0, rollingVol10: [], sharpeDaily: 0 };
  const mb: ComputedMetrics = { dailyReturns: [1, -1.98, 0.6], volatility: 0, sma5: [], sma20: [], cumulativeReturn: 0, sharpeRatio: 0, rollingVol10: [], sharpeDaily: 0 };

  const { labels, matrix } = computeCorrelationMatrix(['AAA','BBB'], { AAA: a, BBB: b }, { AAA: ma, BBB: mb });

  return {
    mean: m,
    std: s,
    rollingVolLength: roll.length,
    corrLabels: labels,
    corrMatrixSize: matrix.length,
  };
}
