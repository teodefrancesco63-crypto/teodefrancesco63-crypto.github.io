# CalcTools

A fast, dependency-light collection of financial calculators. Pure HTML, CSS and JavaScript — no build step, no framework. The only third-party code is [Chart.js](https://www.chartjs.org/), vendored locally in `js/vendor/` so the site has no runtime CDN dependency.

## Structure

```
index.html              Homepage — category cards + full calculator grid
categories/              One page per category (Finance, Freelance, Travel)
calculators/             One HTML page per calculator
css/
  style.css              Global stylesheet, shared by every page
js/
  common.js              Shared helpers (money formatting, chart upsert, color palette)
  nav.js                 Dropdown / mobile menu behavior, shared by every page
  vendor/chart.min.js     Vendored Chart.js (no CDN dependency)
  <slug>.js              Calculation logic for each calculator
```

Each calculator has its own HTML page and its own JS file, and shares the global stylesheet, nav script, and common helpers.

## Running locally

No build tools required — any static file server works, e.g.:

```bash
python -m http.server 8090
```

Then open `http://localhost:8090`.

## Deploying to GitHub Pages

1. Push this repo to GitHub.
2. In the repo settings, under **Pages**, set the source to the `main` branch, root folder.
3. The included `.nojekyll` file disables Jekyll processing so all files are served as-is.

## Calculators

### Finance — Épargne
- **Compound Interest** (`calculators/compound-interest.html`)
- **Savings Goal** (`calculators/savings-goal.html`)
- **Emergency Fund** (`calculators/emergency-fund.html`)
- **Retirement Savings** (`calculators/retirement-savings.html`)
- **Net Worth** (`calculators/net-worth.html`)

### Finance — Emprunt
- **Loan Repayment** (`calculators/loan-repayment.html`)
- **Mortgage** (`calculators/mortgage.html`)

### Finance — Budget
- **Monthly Budget** (`calculators/monthly-budget.html`)

### Freelance
- **Day Rate** (`calculators/freelance-day-rate.html`) — includes EUR/USD/GBP currency conversion.
- **Project Quote** (`calculators/project-quote.html`)
- **Tax Calculator** (`calculators/freelance-tax.html`)
- **Hourly Rate** (`calculators/hourly-rate.html`)

### Travel
- **Travel Budget** (`calculators/travel-budget.html`)
- **Currency Converter** (`calculators/currency-converter.html`)
- **Trip Cost Per Day** (`calculators/trip-cost-per-day.html`)
