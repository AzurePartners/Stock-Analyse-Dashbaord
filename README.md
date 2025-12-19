# Stock Portfolio Analyzer Dashboard

A full-stack web dashboard for analyzing stock portfolios with comprehensive financial metrics, interactive charts, and real-time portfolio adjustments.


<img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/c9a3568a-171f-4b2f-9979-a2bdcc7b53ab" />
<img width="1918" height="916" alt="image" src="https://github.com/user-attachments/assets/81ba360c-ea42-4e84-ab82-4558d2f51e47" />


## Features

- **Ticker Input System**: Enter multiple stock tickers (comma-separated) to analyze
- **Price Trend Chart**: Interactive line chart showing daily closing prices with SMA5 and SMA20 overlays
- **Volatility Comparison**: Bar chart comparing annualized volatility across all stocks
- **Monthly Returns**: Bar chart showing cumulative returns for each ticker
- **Portfolio Allocation**: Interactive pie chart with sliders to adjust portfolio weights in real-time
- **Risk-Return Scatter**: Scatter plot showing relationship between risk (volatility) and return
- **Correlation Matrix**: Heatmap showing correlation coefficients between assets
- **Automated Insights**: AI-generated summary statements about portfolio performance
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS with Purity UI theme
- **Charts**: Plotly.js for interactive visualizations
- **State Management**: Zustand
- **Data Source**: Alpha Vantage API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Alpha Vantage API key (get one free at [alphavantage.co](https://www.alphavantage.co/support/#api-key))

### Installation

1. Clone or navigate to the project directory:
```bash
cd "Finance Dashboard"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Enter stock tickers in the input field (e.g., `AAPL, MSFT, TSLA`)
2. Click "Analyze Portfolio" to fetch data and compute metrics
3. View interactive charts and metrics
4. Adjust portfolio weights using sliders to see real-time portfolio metrics
5. Review automated insights for portfolio analysis

## Financial Metrics Computed

For each stock:
- **Daily Returns**: Percentage change day-over-day
- **Volatility**: Annualized standard deviation of daily returns
- **SMA5 & SMA20**: 5-day and 20-day Simple Moving Averages
- **Monthly Cumulative Return**: Total return over the analysis period
- **Sharpe Ratio**: Risk-adjusted return metric

For the portfolio:
- **Weighted Return**: Portfolio return based on current weights
- **Weighted Volatility**: Portfolio volatility based on current weights

## Project Structure

```
Finance Dashboard/
├── app/
│   ├── analytics/              # Analytics pages (performance, risk, etc.)
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main dashboard page
│   ├── api/
│   │   └── fetchStock/
│   │       └── route.ts        # Alpha Vantage API integration
│   └── globals.css              # Global styles
├── components/
│   ├── TickerInput.tsx         # Ticker input form
│   ├── PriceTrendChart.tsx     # Price trend with SMAs
│   ├── VolatilityChart.tsx     # Volatility comparison
│   ├── CumulativeReturnChart.tsx # Returns chart
│   ├── PortfolioAllocation.tsx  # Pie chart + sliders
│   ├── CorrelationHeatmap.tsx   # Correlation matrix
│   ├── RiskReturnScatter.tsx    # Risk vs Return scatter plot
│   ├── Sidebar.tsx             # Navigation sidebar
│   └── InsightsPanel.tsx      # Auto-generated insights
├── lib/
│   ├── alphaVantage.ts         # API client utilities
│   ├── calculations.ts          # Financial calculations
│   └── types.ts                 # TypeScript interfaces
└── store/
    └── portfolioStore.ts       # Zustand state management
```

## API Rate Limits

Alpha Vantage free tier allows 5 API calls per minute. The dashboard handles multiple tickers by making parallel requests. If you hit rate limits, wait a minute before trying again.

## License

ISC

## Notes

- Data is fetched from Alpha Vantage API and is for informational purposes only
- Calculations assume equal correlation between stocks (simplified portfolio model)
- Risk-free rate is assumed to be 0 for Sharpe ratio calculations

