import { create } from 'zustand';
import { StockData, ComputedMetrics, PortfolioMetrics } from '@/lib/types';
import { computeStockMetrics, calculatePortfolioMetrics } from '@/lib/calculations';

interface PortfolioState {
  tickers: string[];
  stockData: Record<string, StockData>;
  weights: Record<string, number>;
  computedMetrics: Record<string, ComputedMetrics>;
  portfolioMetrics: PortfolioMetrics | null;
  loading: boolean;
  error: string | null;

  // Actions
  setTickers: (tickers: string[]) => void;
  addTicker: (ticker: string) => void;
  removeTicker: (ticker: string) => void;
  setStockData: (ticker: string, data: StockData) => void;
  updateWeight: (ticker: string, weight: number) => void;
  computeAllMetrics: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const usePortfolioStore = create<PortfolioState>((set, get) => ({
  tickers: [],
  stockData: {},
  weights: {},
  computedMetrics: {},
  portfolioMetrics: null,
  loading: false,
  error: null,

  setTickers: (tickers) => {
    set({ tickers });
    // Initialize equal weights
    const equalWeight = 100 / tickers.length;
    const weights: Record<string, number> = {};
    tickers.forEach(ticker => {
      weights[ticker] = equalWeight;
    });
    set({ weights });
  },

  addTicker: (ticker) => {
    const { tickers } = get();
    if (!tickers.includes(ticker.toUpperCase())) {
      const newTickers = [...tickers, ticker.toUpperCase()];
      get().setTickers(newTickers);
    }
  },

  removeTicker: (ticker) => {
    const { tickers, stockData, weights, computedMetrics } = get();
    const newTickers = tickers.filter(t => t !== ticker);
    const newStockData = { ...stockData };
    const newWeights = { ...weights };
    const newComputedMetrics = { ...computedMetrics };
    
    delete newStockData[ticker];
    delete newWeights[ticker];
    delete newComputedMetrics[ticker];
    
    set({ 
      tickers: newTickers,
      stockData: newStockData,
      weights: newWeights,
      computedMetrics: newComputedMetrics,
    });
    get().computeAllMetrics();
  },

  setStockData: (ticker, data) => {
    const { stockData } = get();
    set({ 
      stockData: { ...stockData, [ticker]: data },
      error: null,
    });
    get().computeAllMetrics();
  },

  updateWeight: (ticker, weight) => {
    const { weights } = get();
    set({ weights: { ...weights, [ticker]: weight } });
    get().computeAllMetrics();
  },

  computeAllMetrics: () => {
    const { tickers, stockData, weights } = get();
    
    // Compute metrics for each stock
    const computedMetrics: Record<string, ComputedMetrics> = {};
    tickers.forEach(ticker => {
      const data = stockData[ticker];
      if (data) {
        computedMetrics[ticker] = computeStockMetrics(data);
      }
    });

    // Compute portfolio metrics
    const portfolioMetrics = calculatePortfolioMetrics(tickers, computedMetrics, weights);

    set({ computedMetrics, portfolioMetrics });
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  reset: () => {
    set({
      tickers: [],
      stockData: {},
      weights: {},
      computedMetrics: {},
      portfolioMetrics: null,
      loading: false,
      error: null,
    });
  },
}));

export default usePortfolioStore;

