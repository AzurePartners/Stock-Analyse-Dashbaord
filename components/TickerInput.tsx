'use client';

import { useState } from 'react';
import usePortfolioStore from '@/store/portfolioStore';

export default function TickerInput() {
  const [inputValue, setInputValue] = useState('');
  const { setTickers, setLoading, setError, reset, loading, error } = usePortfolioStore();

  const handleAnalyze = async () => {
    if (!inputValue.trim()) {
      setError('Please enter at least one ticker symbol');
      return;
    }

    // Parse comma-separated tickers
    const tickers = inputValue
      .split(',')
      .map(t => t.trim().toUpperCase())
      .filter(t => t.length > 0);

    if (tickers.length === 0) {
      setError('Please enter valid ticker symbols');
      return;
    }

    setError(null);
    setLoading(true);
    reset();
    setTickers(tickers);

    try {
      const response = await fetch('/api/fetchStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tickers }),
      });

      const data = await response.json();

      // Log API response for debugging
      console.log('API Response:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stock data');
      }

      const { setStockData } = usePortfolioStore.getState();

      // Process successful results
      if (data.success) {
        Object.entries(data.success).forEach(([ticker, stockData]: [string, any]) => {
          setStockData(ticker, stockData);
        });
      }

      // Handle errors for specific tickers
      if (data.errors) {
        const errorMessages = Object.entries(data.errors)
          .map(([ticker, error]) => `${ticker}: ${error}`)
          .join(', ');
        setError(`Some tickers failed: ${errorMessages}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter tickers (e.g., AAPL, MSFT, TSLA)"
          className="flex-1 px-4 py-3 rounded-lg border border-purity-border bg-purity-card text-purity-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purity-mint"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-3 bg-purity-mint text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze Portfolio'}
        </button>
      </div>
      {error && (
        <div className="mt-2 text-red-600 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

