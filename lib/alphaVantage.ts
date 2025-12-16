const API_BASE_URL = 'https://www.alphavantage.co/query';

export interface AlphaVantageResponse {
  'Meta Data'?: {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)'?: Record<string, {
    '1. open': string;
    '2. high': string;
    '3. low': string;
    '4. close': string;
    '5. volume': string;
  }>;
  'Note'?: string;
  'Error Message'?: string;
  'Information'?: string; // Premium endpoint message
}

/**
 * Fetch daily time series data from Alpha Vantage (free endpoint)
 */
export async function fetchDailyAdjusted(
  symbol: string,
  apiKey: string
): Promise<AlphaVantageResponse> {
  const params = new URLSearchParams({
    function: 'TIME_SERIES_DAILY',
    symbol: symbol.toUpperCase(),
    outputsize: 'compact', // Returns last 100 data points
    apikey: apiKey,
  });

  const url = `${API_BASE_URL}?${params.toString()}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

/**
 * Parse Alpha Vantage response into structured StockData
 * Filters to last 30 days (approximately 1 month)
 */
export function parseStockData(
  ticker: string,
  response: AlphaVantageResponse
): { ticker: string; dates: string[]; closingPrices: number[]; adjustedClose: number[] } | null {
  // Check for premium endpoint message or other errors
  if (response['Error Message'] || response['Note'] || response['Information']) {
    return null;
  }

  const timeSeries = response['Time Series (Daily)'];
  if (!timeSeries) {
    return null;
  }

  // Get all dates and sort them (most recent first in API response)
  const dates = Object.keys(timeSeries).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Filter to last 30 days (approximately 1 month)
  const oneMonthAgo = new Date();
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
  const recentDates = dates.filter(date => new Date(date) >= oneMonthAgo);

  // If we have less than 30 days, use all available data
  const datesToUse = recentDates.length > 0 ? recentDates : dates.slice(-30);

  const closingPrices: number[] = [];
  const adjustedClose: number[] = [];

  datesToUse.forEach(date => {
    const dayData = timeSeries[date];
    if (dayData) {
      // TIME_SERIES_DAILY only has regular close price, use it for both
      const closePrice = parseFloat(dayData['4. close']);
      closingPrices.push(closePrice);
      adjustedClose.push(closePrice); // Use regular close as adjusted close
    }
  });

  return {
    ticker,
    dates: datesToUse,
    closingPrices,
    adjustedClose,
  };
}

