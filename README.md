# CalcTools

A fast, dependency-free collection of financial calculators. Pure HTML, CSS and JavaScript — no build step, no framework.

## Structure

```
index.html            Homepage listing all calculators
calculators/           One HTML page per calculator
  freelance-day-rate.html
css/
  style.css            Global stylesheet, shared by every page
js/
  freelance-day-rate.js  Logic for the freelance day rate calculator
```

Each calculator gets its own HTML page and its own JS file, and shares the single global stylesheet.

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

- **Freelance Day Rate Calculator** (`calculators/freelance-day-rate.html`) — works out the day rate a freelancer needs to charge to hit an income goal, accounting for time off, non-billable work and business expenses.
