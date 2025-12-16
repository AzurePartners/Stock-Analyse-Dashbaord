# Stock Portfolio Analyzer Dashboard - Project Summary

## 1. What It Is

A full-stack web dashboard for analyzing stock portfolios. It allows users to:

- Enter multiple stock tickers (e.g., AAPL, MSFT, TSLA)
- Fetch historical price data from Alpha Vantage API
- Compute comprehensive financial metrics (returns, volatility, moving averages, Sharpe ratio)
- Visualize data through interactive charts (price trends, volatility, returns, portfolio allocation)
- Adjust portfolio weights with sliders and see real-time portfolio metrics
- View automated insights about portfolio performance

The dashboard features a Bloomberg-inspired professional UI with dark/light mode toggle and fully responsive design.

## 2. How It Was Built

### Development Approach

This project was built using AI-assisted development with detailed prompt engineering. The entire application was constructed from scratch based on a comprehensive specification provided to an AI coding assistant.

### Original Development Prompt

The project was initiated with the following prompt:

```
Build me a full-stack web dashboard for a "Stock Portfolio Analyzer". 
Use modern, visually appealing UI components and multiple graphs.

### TECH STACK
- Frontend: React (Next.js 14, TailwindCSS, Chart.js or Plotly.js)
- Backend: Python FastAPI OR Next.js API routes (Cursor can choose)
- State management: simple local state or zustand
- Charts must be interactive.

### DATA SOURCE
Use Alpha Vantage API with my key:
API_KEY = "<PUT_MY_KEY_HERE>"

### FEATURES
1. **Ticker Input System**
   - A text field where the user enters stock tickers (e.g., AAPL, MSFT, TSLA).
   - A button to "Analyze Portfolio".

2. **Backend Fetching**
   For each ticker:
   - Fetch past **1 month daily prices** (TIME_SERIES_DAILY_ADJUSTED).
   - Extract: closing price, date.

3. **FINANCIAL METRICS TO COMPUTE**
   For each stock:
   - Daily returns (%)
   - Volatility (standard deviation of daily returns)
   - 5-day Simple Moving Average (SMA5)
   - 20-day Simple Moving Average (SMA20)
   - Monthly cumulative return (%)

   For the portfolio:
   - Equal weights by default
   - Weighted return
   - Weighted volatility

4. **DASHBOARD SECTIONS (MULTIPLE GRAPHS)**

   **A. Price Trend Chart**
   - Line chart showing daily closing price for each stock.
   - SMA5 and SMA20 lines overlaid.

   **B. Volatility Chart**
   - Bar chart comparing volatility for all stocks.

   **C. Cumulative Return Chart**
   - Bar chart showing total return of each ticker over the month.

   **D. Portfolio Allocation Pie Chart**
   - Default equal weights.
   - Allow user to adjust weights via sliders.
   - Changes update portfolio return & volatility in real time.

   **E. Risk-Return Heatmap**
   - Color-coded grid of:
       - Ticker
       - Volatility
       - Cumulative return
       - Sharpe ratio (Cursor compute)

   **F. Insights Section**
   Automatically generate short summary statements:
   - "AAPL had the highest monthly return."
   - "TSLA shows highest volatility."
   - "Portfolio expected return: X%, volatility: Y%."

5. **UI/UX REQUIREMENTS**
   - Clean professional finance UI (similar to Bloomberg-lite).
   - Top navigation bar.
   - Grid-based layout for charts.
   - Light/dark mode toggle.
   - Responsive design for desktop + mobile.

6. **CODE ORGANIZATION**
   - /pages or /app structure depending on Next.js version
   - /components for charts (PriceChart.jsx, VolatilityChart.jsx, etc.)
   - /lib for API + financial calculations
   - /api/fetchStock for AlphaVantage requests
   - Use async/await and error handling

7. **DELIVERABLE**
   A fully functional **web dashboard** running in the browser with:
   - Inputs
   - Multiple graphs
   - Financial metrics
   - Automated insights
   - Real-time portfolio adjustments
```

### Follow-Up Development Prompt

After the initial implementation, a second prompt was provided to extend the dashboard with advanced analytics features:

```
1. Daily Returns Chart

Line or bar chart showing % daily returns for each ticker.

Must be interactive.

Use the already-fetched daily price data.

2. Rolling Volatility Chart

Compute 10-day rolling volatility for each ticker.

Add a multi-line chart showing rolling volatility over time.

Use same style as the price trend chart.

3. Sharpe Ratio Comparison

Compute Sharpe for each ticker:

Sharpe = mean(daily_returns) / std(daily_returns)

Add a bar chart comparing Sharpe ratios.

4. Correlation Heatmap

Using the existing daily returns, compute a correlation matrix .

Add an interactive heatmap (Plotly recommended).

Place inside a card similar to other charts.

5. Risk–Return Scatter Plot

X-axis = Volatility

Y-axis = Monthly Return

Each bubble = one ticker

Add hover details: ticker, return, volatility, Sharpe.

6. SPY Benchmark Overlay

Automatically fetch SPY prices in the backend (same date range).

Add SPY to:

price chart (optional toggle)

cumulative return comparison

Sharpe comparison

Do NOT modify the base structure — just extend current charts.

7. Insights Expansion

Extend the current insights generator to include:

"Highest Sharpe ratio: ___"

"Most stable asset (lowest volatility): ___"

"Highest risk-adjusted return: ___"

"Most correlated pair: ___ at ___ correlation"

Only use data already fetched.

8. UI Enhancements

Add a new grid section titled "Advanced Analytics"

Insert the new charts there.

Ensure the layout remains responsive.

Use the same design system (Tailwind + your card components).

9. DO NOT modify the existing file structure.

Just add:

new chart components

new calculations

extended backend logic (only where necessary)

new imports + hooks on the frontend

Everything should build on top of what is already generated.

10. Deliverables

New React components for each new chart

Updated backend logic for rolling volatility, correlation matrix, Sharpe

Updated portfolio insights generator

Integration into existing dashboard UI

And update the frontend as well
```

### Development Process

1. **Initial Planning**: The AI assistant created a comprehensive plan based on the first prompt, breaking down the project into 11 distinct tasks
2. **Project Setup**: Next.js 14 project initialized with TypeScript, TailwindCSS, and all required dependencies
3. **Incremental Development**: Features were built step-by-step:
   - Core libraries (calculations, API client, types)
   - State management with Zustand
   - API route for Alpha Vantage integration
   - Individual chart components
   - Main dashboard layout
4. **Iterative Refinement**: 
   - Fixed React hooks violations
   - Switched from premium to free API endpoint
   - Added SPY benchmark integration
   - Enhanced error handling and logging
5. **Testing & Debugging**: 
   - Resolved TailwindCSS v4 compatibility issues (downgraded to v3)
   - Fixed TypeScript type issues with Plotly.js
   - Added comprehensive error handling for API rate limits
6. **Advanced Features Extension** (Second Prompt):
   - Additional chart components for advanced analytics
   - Extended calculations for rolling volatility, correlation matrix
   - Enhanced insights generator
   - New "Advanced Analytics" section in UI
   - SPY benchmark integration across multiple charts

### Key Decisions Made During Development

- **Backend Choice**: Selected Next.js API routes over FastAPI for simplicity and unified codebase
- **Chart Library**: Chose Plotly.js over Chart.js for advanced interactivity
- **API Endpoint**: Initially used `TIME_SERIES_DAILY_ADJUSTED` (premium), later switched to `TIME_SERIES_DAILY` (free tier) to work with standard API keys
- **Rate Limiting**: Implemented sequential API calls with 12-second delays instead of parallel calls to respect Alpha Vantage's 5 calls/minute limit
- **State Management**: Used Zustand for lightweight, performant state management

## 3. Technical Implementation


### Architecture & Structure

```
Finance Dashboard/
├── app/
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                 # Main dashboard page with grid layout
│   ├── api/
│   │   └── fetchStock/
│   │       └── route.ts        # API route for Alpha Vantage integration
│   └── globals.css              # TailwindCSS + custom styles
├── components/
│   ├── TickerInput.tsx         # Input form with comma-separated ticker parsing
│   ├── PriceTrendChart.tsx     # Line chart with SMA5/20 overlays
│   ├── VolatilityChart.tsx     # Bar chart comparing volatility
│   ├── CumulativeReturnChart.tsx # Bar chart showing monthly returns
│   ├── PortfolioAllocation.tsx  # Pie chart + weight sliders
│   ├── RiskReturnHeatmap.tsx   # Color-coded risk-return table
│   ├── InsightsPanel.tsx       # Auto-generated insights
│   └── ThemeToggle.tsx         # Dark/light mode switcher
├── lib/
│   ├── alphaVantage.ts         # API client utilities
│   ├── calculations.ts         # Financial calculations (returns, volatility, SMA, Sharpe)
│   └── types.ts                # TypeScript interfaces
└── store/
    └── portfolioStore.ts       # Zustand state management
```

### Key Features Implemented

#### 1. API Integration
- Sequential API calls with 12-second delays to respect Alpha Vantage's 5 calls/minute limit
- Comprehensive error handling for rate limits and invalid tickers
- Uses free tier `TIME_SERIES_DAILY` endpoint (not premium `TIME_SERIES_DAILY_ADJUSTED`)
- SPY benchmark automatically included in all portfolio requests

#### 2. Financial Calculations (`lib/calculations.ts`)
- Daily returns calculation
- Annualized volatility (standard deviation × √252)
- SMA5 and SMA20 moving averages
- Monthly cumulative returns
- Sharpe ratio (risk-adjusted return)
- Portfolio-weighted metrics

#### 3. Interactive Charts
- **Price Trend Chart**: Line chart with SMA overlays for all tickers
- **Volatility Chart**: Bar chart comparing volatility across stocks
- **Returns Chart**: Bar chart showing monthly cumulative returns
- **Portfolio Allocation**: Pie chart with real-time weight adjustments via sliders
- **Risk-Return Heatmap**: Color-coded table showing volatility, returns, and Sharpe ratios

#### 4. State Management
- Zustand store manages portfolio state
- Real-time updates when weights change
- Automatic metric recalculation

### Recent Updates

**Phase 1 (Initial Implementation):**
- ✅ Added SPY benchmark ticker to all portfolio requests (for comparison/benchmarking)
- ✅ Switched from premium endpoint to free tier endpoint
- ✅ Added comprehensive error handling and logging
- ✅ Fixed React hooks violations in PortfolioAllocation component

**Phase 2 (Advanced Analytics - Pending Implementation):**
- 🔄 Daily Returns Chart - Line/bar chart showing % daily returns for each ticker
- 🔄 Rolling Volatility Chart - 10-day rolling volatility multi-line chart over time
- 🔄 Sharpe Ratio Comparison - Bar chart comparing Sharpe ratios across tickers
- 🔄 Correlation Heatmap - Interactive correlation matrix visualization using Plotly
- 🔄 Risk-Return Scatter Plot - Volatility vs. Monthly Return with hover details
- 🔄 SPY Benchmark Overlay - Integration across price chart, cumulative returns, and Sharpe comparison
- 🔄 Expanded Insights - Additional metrics including highest Sharpe, most stable asset, risk-adjusted returns, and correlation pairs
- 🔄 Advanced Analytics Section - New UI grid section for extended features

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS with dark mode support
- **Charts**: Plotly.js for interactive visualizations
- **State Management**: Zustand
- **Backend**: Next.js API routes
- **Data Source**: Alpha Vantage API (free tier - `TIME_SERIES_DAILY` endpoint)

## 3. Why It Matters

### For Users
- **Portfolio Analysis**: Understand performance, risk, and diversification at a glance
- **Real-time Adjustments**: See how weight changes affect portfolio metrics instantly
- **Visual Insights**: Complex financial data made accessible through interactive charts
- **Educational**: Learn about financial metrics and portfolio construction

### Technical Value
- **Modern Stack**: Built with Next.js 14 App Router, TypeScript, React best practices
- **Scalable Architecture**: Modular components, clean separation of concerns
- **API Integration**: Handles rate limits and errors gracefully
- **Production-Ready**: Comprehensive error handling, loading states, responsive design

### Business Value
- **Cost-Effective**: Uses free API tier (no subscription needed)
- **Fast Development**: Leverages modern tools and frameworks
- **Extensible**: Easy to add features (more metrics, different data sources, etc.)

## Next Steps / Completion Tasks

The following items may need completion or verification:

1. **SPY Benchmark Integration**: The code now includes SPY in all requests, but you may want to:
   - Display SPY data separately in charts for comparison
   - Calculate portfolio performance vs. SPY benchmark
   - Add a "vs. Benchmark" metric in the insights panel

2. **Error Handling**: Verify that premium endpoint messages are properly caught and displayed to users

3. **Testing**: Test with multiple tickers to ensure sequential API calls work correctly with rate limiting

4. **Documentation**: Update README.md to reflect the free tier endpoint usage and SPY benchmark feature

5. **UI Enhancements**: Consider adding:
   - Loading indicators for individual ticker fetches
   - Progress bar showing API call status
   - Better error messages explaining rate limits

## Environment Setup

Create `.env.local` file:
```
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

## Running the Application

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Rate Limits

Alpha Vantage free tier allows 5 API calls per minute. The application handles this by:
- Making sequential requests (not parallel)
- Adding 12-second delays between requests
- Displaying appropriate error messages if rate limits are hit

---

*This summary provides context for continuing development or making improvements to the Stock Portfolio Analyzer Dashboard.*

