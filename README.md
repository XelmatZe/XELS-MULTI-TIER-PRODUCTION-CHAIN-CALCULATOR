# EVE Online PI Production Chain Calculator
### by Xel'matZe

A multi-tier Planetary Interaction calculator for EVE Online.
Calculates required materials across P4 → P3 → P2 → P1 with stock management and live Jita market prices.

## Features
- Multi-tier input (P4, P3, P2) with demand and stock import
- Live market prices from Jita 4-4 (via Goonmetrics API, cached hourly)
- Gross / Stock / Net / Unit Price / Net Value columns
- Copy net requirements to clipboard

## Deploy to Vercel (recommended)

1. Fork or clone this repo to your GitHub account
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Click **Deploy** – no configuration needed
4. Done! Your URL will be `your-project.vercel.app`

The `/api/prices` serverless function automatically proxies the Goonmetrics API
and caches prices for 1 hour at Vercel's CDN edge.

## Local Development

```bash
npm install
npm start
```

For local price fetching, install the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

## Recipes
All PI recipes verified against [EVE University Wiki](https://wiki.eveuniversity.org/Planetary_Commodities).

## Price Data
Market prices sourced from [Goonmetrics](https://goonmetrics.apps.gnf.lt/) — Jita 4-4 Caldari Navy Assembly Plant (Station ID: 60003760).
Prices are cached for 1 hour via Vercel Edge Cache.
