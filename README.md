# CryptoDashboard

A React + TypeScript dashboard for browsing live cryptocurrency market data, built on top of the [CoinGecko API](https://www.coingecko.com/en/api). It's a personal project for practicing modern React patterns — routing, global state, auth, and client-side persistence — rather than a production app.

## Features

- **Market overview** — paginated list of coins by market cap, with price, 24h/7d change, volume, and a 7-day sparkline chart.
- **Market cap filter** — narrow the currently loaded page by min/max market cap.
- **Coin details** — dedicated page per coin with price, market cap, fully diluted valuation, circulating supply, and description.
- **My Crypto** — a personal watchlist of selected coins, persisted in `localStorage`.
- **Authentication** — register/login/logout with per-user credentials hashed (SHA-256 + salt) and stored in `localStorage`; sessions survive a page reload. This is a client-only auth implementation meant for demoing the UX flow, not a real backend.
- **Dark mode** — toggle with a persisted preference.
- **Static pages** — About, Contact, Privacy, Terms of Service.
- **Code-split routing** — every route is lazily loaded via `React.lazy`.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and build
- [React Router 7](https://reactrouter.com/) (data router)
- [Zustand](https://github.com/pmndrs/zustand) for state management, with `persist` middleware for `localStorage`-backed slices
- [Recharts](https://recharts.org/) for the sparkline charts
- [Sass](https://sass-lang.com/) for styling
- [ESLint](https://eslint.org/) + [typescript-eslint](https://typescript-eslint.io/)

## Project structure

```
src/
  pages/        route-level components (About, Home, Details, MyCrypto, Login, ...)
  components/   reusable UI pieces (Menu, Footer, Auth widgets, pagination, filters, ...)
  context/      React context providers (auth, dark mode)
  store/        Zustand stores
  services/     API clients (CoinGecko, local auth storage)
  types/        shared TypeScript types
  HOC/          route guards (AuthGuard)
```

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Scripts

| Command           | Description                          |
| ------------------ | ------------------------------------- |
| `npm run dev`       | Start the Vite dev server with HMR    |
| `npm run build`     | Type-check and build for production   |
| `npm run lint`      | Run ESLint                            |
| `npm run preview`   | Preview the production build locally  |

## Known limitations

- The CoinGecko API key is hardcoded in [`src/services/cryptos.ts`](src/services/cryptos.ts) rather than pulled from an environment variable — fine for a personal/demo project, not something to do in production.
- CoinGecko's free `/coins/markets` endpoint has no server-side market cap filter, so the market cap filter only narrows the coins on the currently loaded page, not the entire dataset.
- Authentication is entirely client-side (`localStorage`) with no real backend — anyone with access to the browser's storage can inspect the (hashed) credentials.
