## Scope
- Add five new charts, a SPY benchmark overlay, expanded insights, and an “Advanced Analytics” section without altering the existing file/folder structure.
- Reuse existing store and fetched data; add minimal calculations/utilities to support rolling volatility, Sharpe (daily definition), and correlation.

## Calculations (lib)
- Update `lib/calculations.ts`:
  - `calculateRollingVolatility(dailyReturns: number[], window=10): number[]` — rolling stddev over `window` days (not annualized) for charting.
  - `mean(arr: number[]): number` and `std(arr: number[]): number` — helpers.
  - `calculateSharpeDaily(dailyReturns: number[]): number` — `mean(daily_returns) / std(daily_returns)`.
  - `alignSeriesByDates(series: {dates: string[]; values: number[]}[]): {dates: string[]; valuesByKey: Record<string, number[]>}` — intersect dates and align arrays.
  - `computeCorrelationMatrix(tickers: string[], stockData: Record<string, StockData>): { labels: string[]; matrix: number[][]; pairs: Array<{a:string;b:string;corr:number}> }` — uses aligned daily returns; Pearson correlation.
- Extend `computeStockMetrics` to include:
  - `rollingVol10: number[]` (from `calculateRollingVolatility`).
  - `sharpeDaily: number` (from `calculateSharpeDaily`).
- Keep existing annualized `volatility` and monthly `cumulativeReturn` for Risk–Return scatter.
- Update `lib/types.ts` to add `rollingVol10` and `sharpeDaily` in `ComputedMetrics`; optionally export a `CorrelationMatrix` type.

## Backend (API)
- Extend `app/api/fetchStock/route.ts`:
  - Always fetch `SPY` in the same loop and include it in response under `success` (or `benchmark: {ticker:'SPY', data}` if preferred). Respect existing 12s delay for rate limits.
  - Ensure the same 30-day range via existing `parseStockData`.
  - No structural changes; incremental logic only.

## Components (new files in `components/`)
- `DailyReturnsChart.tsx`
  - Interactive Plotly line or bar (toggle via local state) with `%` daily returns for each ticker (+ optional SPY).
  - Uses `usePortfolioStore()` → `stockData`, `computedMetrics`.
- `RollingVolatilityChart.tsx`
  - Multi-line Plotly chart for 10-day rolling volatility (`computedMetrics[t].rollingVol10`).
  - Style consistent with `PriceTrendChart` (dark/light aware).
- `SharpeComparisonChart.tsx`
  - Plotly bar chart of `computedMetrics[t].sharpeDaily` across tickers (+ SPY).
- `CorrelationHeatmap.tsx`
  - Plotly heatmap using `computeCorrelationMatrix(...)`; interactive hover shows correlation values.
  - Render inside card identical to other charts.
- `RiskReturnScatter.tsx`
  - Plotly scatter: X = `computedMetrics[t].volatility` (annualized), Y = `computedMetrics[t].cumulativeReturn` (monthly %), bubble text shows ticker, return, volatility, Sharpe.
  - Bubble size fixed or scaled by weight if available.
- `BenchmarkToggle.tsx` (optional small control)
  - Local toggle for showing/hiding SPY overlay in `PriceTrendChart` and including SPY in other comparisons.

## UI Integration
- Update `app/page.tsx`:
  - Add a titled section "Advanced Analytics" below the existing grid.
  - Insert new components in a responsive grid: `DailyReturnsChart`, `RollingVolatilityChart`, `SharpeComparisonChart`, `CorrelationHeatmap`, `RiskReturnScatter`.
  - Keep card styling consistent (`bg-white dark:bg-gray-800`, rounded, shadow, padding).
- Update `PriceTrendChart.tsx`:
  - Add optional SPY overlay trace behind a local toggle (via `BenchmarkToggle` or inline switch).

## Insights Expansion
- Update `components/InsightsPanel.tsx` to compute and display:
  - “Highest Sharpe ratio: ___” using `sharpeDaily`.
  - “Most stable asset (lowest volatility): ___” using existing annualized `volatility`.
  - “Highest risk-adjusted return: ___” using `sharpeDaily` (or `cumulativeReturn / volatility`; pick `sharpeDaily` for consistency).
  - “Most correlated pair: ___ at ___ correlation” using `computeCorrelationMatrix`.
- Use only existing fetched data; no new endpoints.

## State & Data Handling
- Continue deriving metrics in `portfolioStore.computeAllMetrics()`; store remains unchanged except additional fields in `ComputedMetrics`.
- Perform correlation alignment inside components or a small util; avoid adding global store state.
- Include SPY data into store via existing `setStockData('SPY', ...)` when API returns it; treat it like any other ticker.

## Styling & UX
- Follow existing Tailwind tokens/classes and card layout; ensure dark mode compatibility.
- Use unified Plotly layout (title, axes colors, grid, legend) matching `PriceTrendChart`.
- Ensure interactivity: hover tooltips, legend toggles, and mode bar options consistent.

## Validation
- Unit-test calculation helpers (`mean`, `std`, `calculateRollingVolatility`, correlation) with small fixtures.
- Manual verification in dev: enter 2–4 tickers and confirm charts render; toggle SPY overlay; confirm insights update with changes.
- Watch for Alpha Vantage rate limits; with SPY included, keep 12s spacing.

## Deliverables
- New chart components and optional toggle control.
- Extended calculations and types, updated `computeStockMetrics`.
- Backend API updated to include SPY automatically.
- Updated `InsightsPanel` and `app/page.tsx` to mount “Advanced Analytics”.
- No file structure changes; only additive edits and imports.

## Notes
- Sharpe definition will follow your spec: `mean(daily_returns) / std(daily_returns)` (daily-level). Existing annualized metrics remain for scatter X-axis.
- Correlation aligns on intersected dates to ensure accurate coefficients.
- The provided `.figma` reference will inspire card spacing/visual density; we’ll keep the current design system and not copy assets.