# Portfolio Tracker

Portfolio Tracker is a production-grade personal finance and portfolio management platform.

This repository follows a spec-first workflow. The implementation is guided by:

- `MASTER_SPEC.md`
- `IMPLEMENTATION_PLAN.md`
- `PROJECT_RULES.md`

## Requirements

- Node.js 20+
- pnpm 9+
- Docker + Docker Compose

## Installation

1. Clone the repository.
2. Copy environment templates when available.
3. Install dependencies with `pnpm install` (after application packages are added).

## Development

- Monorepo package manager: `pnpm`
- Root scripts are defined in `package.json`
- Docker setup starts in task 003

## Project Structure

- `apps/` application entry points (`web`, `api`)
- `packages/` shared reusable packages (`shared`, `ui`, `config`)
- `docs/` project documentation (API, DB schema, import template)
- `docker/` container files
- `scripts/` developer scripts
- `.github/` CI/CD workflows

## License

MIT — see `LICENSE`.
