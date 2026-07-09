# Portfolio Tracker

Production-oriented personal finance and portfolio management platform.

## Quick Start

Requirements: Node 20/22, pnpm 9, Docker (optional)

```powershell
cd C:\Users\Mehmet\portfolio-tracker
pnpm install
pnpm dev:api
```

In another terminal:

```powershell
pnpm dev:web
```

- API: http://localhost:3000/api/v1/health
- Web: http://localhost:5173

## Implemented (V1 skeleton)

- SQLite schema + migrations
- Express REST API (`/api/v1`)
- Asset / Transaction / Portfolio / Settings endpoints
- Portfolio engine (weighted average, realized/unrealized P/L)
- Mock market data provider (no API keys required)
- React + MUI dashboard (Dashboard, Portfolio, Transactions, Assets, Settings)

## Scripts

- `pnpm dev:api` — API server
- `pnpm dev:web` — Web UI
- `pnpm test` — Vitest (portfolio engine)
- `pnpm lint` / `pnpm typecheck`

## Spec Documents

Place in `docs/`:

- `MASTER_SPEC.md`
- `IMPLEMENTATION_PLAN.md`
- `PROJECT_RULES.md`

## Notes

- Node 24 is not supported (`better-sqlite3` native bindings)
- External market providers can be added later via API keys
