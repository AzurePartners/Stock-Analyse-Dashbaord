import { NextRequest, NextResponse } from 'next/server';
import { fetchDailyAdjusted, parseStockData } from '@/lib/alphaVantage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tickers } = body;

    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Please provide an array of tickers' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
    if (!apiKey || apiKey === '<PUT_MY_KEY_HERE>') {
      return NextResponse.json(
        { error: 'API key not configured. Please set NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Ensure SPY benchmark is included
    const requestTickers: string[] = Array.from(new Set(['SPY', ...tickers.map((t: string) => t.toUpperCase())]));

    // Fetch data for all tickers sequentially to avoid rate limits
    // Alpha Vantage free tier: 5 calls per minute
    const results = [];
    for (let i = 0; i < requestTickers.length; i++) {
      const ticker = requestTickers[i];
      // Add delay between requests to avoid rate limiting (12 seconds = 5 calls per minute)
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 12000));
      }
      
      try {
        const response = await fetchDailyAdjusted(ticker, apiKey);
        
        // Log the full API response for debugging
        console.log(`\n=== API Response for ${ticker} ===`);
        console.log(JSON.stringify(response, null, 2));
        console.log(`=== End Response for ${ticker} ===\n`);
        
        // Check for premium endpoint message, rate limiting, or errors
        if (response['Information'] && response['Information'].includes('premium')) {
          console.log(`Premium endpoint message for ${ticker}:`, response['Information']);
          results.push({ ticker, error: 'This endpoint requires a premium subscription. Using free endpoint instead.' });
          continue;
        }
        if (response['Note']) {
          console.log(`Rate limit note for ${ticker}:`, response['Note']);
          results.push({ ticker, error: `API rate limit: ${response['Note']}` });
          continue;
        }
        if (response['Error Message']) {
          console.log(`Error message for ${ticker}:`, response['Error Message']);
          results.push({ ticker, error: response['Error Message'] });
          continue;
        }
        
        console.log(`Parsing data for ${ticker}...`);
        const stockData = parseStockData(ticker, response);
        console.log(`Parsed data for ${ticker}:`, stockData ? 'Success' : 'Failed');
        
        if (!stockData) {
          // Provide more detailed error
          if (!response['Time Series (Daily)']) {
            results.push({ ticker, error: 'No time series data in API response' });
            continue;
          }
          results.push({ ticker, error: 'Failed to parse data or invalid ticker' });
          continue;
        }
        
        results.push({ ticker, data: stockData });
      } catch (error) {
        results.push({ 
          ticker, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    // Separate successful and failed results
    const successful: Record<string, any> = {};
    const errors: Record<string, string> = {};

    results.forEach(result => {
      if (result.error) {
        errors[result.ticker] = result.error;
      } else if (result.data) {
        successful[result.ticker] = result.data;
      }
    });

    return NextResponse.json({
      success: successful,
      errors: Object.keys(errors).length > 0 ? errors : undefined,
      debug: process.env.NODE_ENV === 'development' ? {
        apiKeyConfigured: !!apiKey,
        apiKeyLength: apiKey?.length || 0,
        tickersRequested: requestTickers,
        resultsCount: results.length,
      } : undefined,
    });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

