# Indi Net Worth

A production-ready MVP for projecting an India-focused personal net worth plan. The app models EPF, NPS, PPF, LIC policies, bank savings, fixed deposits, Sukanya Samriddhi Yojana, mutual funds, stocks, and gratuity with year-by-year visualizations.

## Features

- React + Vite frontend with TailwindCSS and Headless UI.
- Reusable financial engine for compounding, SIPs, EPF, NPS, gratuity, and net worth aggregation.
- Dashboard with line, stacked area, and pie charts using Recharts.
- Dynamic investment editor powered by React Hook Form and Zod.
- Conservative, moderate, and aggressive scenarios.
- Inflation-adjusted projection toggle.
- LocalStorage profile persistence with reset.
- CSV export for the projection table.
- Responsive layout and dark mode.

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```text
src/
  components/
  features/
    investments/
    projections/
  hooks/
  pages/
  store/
  utils/
```

## Financial Notes

The formulas are intentionally transparent and easy to adjust:

- `calculateCompoundGrowth()` compounds a current value annually.
- `calculateSIP()` compounds monthly contributions.
- `calculateEPF()` combines the entered employee contribution with an employer contribution approximation.
- `calculateGratuity()` uses the common Indian approximation: last drawn monthly basic/DA × 15 ÷ 26 × completed years of service.
- `aggregateNetWorth()` creates the year-wise table and optional inflation-adjusted totals.

Returns, lock-ins, and rates are projections, not financial advice. Real EPF, PPF, NPS, tax, and gratuity outcomes depend on changing rules, salary structure, employer policies, and market performance.
