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

## Implemented

- SQLite schema + migrations + repository layer
- Express REST API (`/api/v1`)
- Asset / Transaction / Portfolio / Settings endpoints
- Reporting, CSV import/export, backup/restore endpoints
- Portfolio engine (weighted average, realized/unrealized P/L, deterministic ordering)
- Mock market data provider (no API keys required)
- React + MUI dashboard (Dashboard, Portfolio, Transactions, Assets, Reports, Import, Export, Backup, Settings)
- Vitest domain tests

## Scripts

- `pnpm dev:api` — API server
- `pnpm dev:web` — Web UI
- `pnpm test` — Vitest
- `pnpm lint` / `pnpm typecheck`

## Notes

- Node 24 is not supported (`better-sqlite3` native bindings)
- External market providers can be added later via API keys
- Spec documents live in `docs/`
