# Indi Net Worth

A production-ready MVP for projecting an India-focused personal net worth plan. The app models EPF, NPS, PPF, LIC policies, bank savings, fixed deposits, Sukanya Samriddhi Yojana, mutual funds, stocks, and gratuity with year-by-year visualizations.

## Features

- React + Vite frontend with TailwindCSS and Headless UI.
- Reusable financial engine for compounding, SIPs, EPF, NPS, gratuity, real estate, rental income, and net worth aggregation.
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

## Deploy

This repo includes a GitHub Actions workflow for GitHub Pages. Push the `main` branch, then enable Pages in the repository settings:

1. Open GitHub repo settings.
2. Go to `Pages`.
3. Set `Build and deployment` source to `GitHub Actions`.
4. Push to `main`.

The app will be published at:

```text
https://gunjan075.github.io/indi-net-worth/
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
- `calculateEPF()` combines the entered employee contribution with an employer contribution approximation until the configured retirement/maturity age.
- EPS is modeled separately from EPF corpus. The app caps EPS salary at ₹15,000/month, uses ₹1,250/month as the default EPS contribution, and estimates pension as `pensionable salary × pensionable service ÷ 70`.
- EPS pension is displayed as monthly retirement income, not added to net worth, because it is a social-security pension rather than an investable corpus.
- `calculateGratuity()` treats gratuity as an employer-paid benefit, not an employee deduction. It uses last drawn monthly Basic + DA × 15 × completed years of service ÷ divisor.
- Gratuity supports the standard `26` divisor for employees covered under the Payment of Gratuity Act and a `30` divisor approximation for non-Act policies.
- Gratuity eligibility starts after 5 completed years of service. Service years are rounded up only when the extra service period exceeds 6 months.
- The default private-sector tax-free gratuity cap is set to ₹20 lakh as editable metadata.
- Contribution windows stop at the earliest configured cap: max investment years or maturity age minus current age. The accumulated corpus still compounds after fresh investments stop.
- Real estate flats add property appreciation plus rent cashflow, while plots use appreciation only by default.
- `aggregateNetWorth()` creates the year-wise table and optional inflation-adjusted totals.

Returns, lock-ins, and rates are projections, not financial advice. Real EPF, PPF, NPS, tax, and gratuity outcomes depend on changing rules, salary structure, employer policies, and market performance.
