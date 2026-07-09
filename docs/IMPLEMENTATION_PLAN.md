# IMPLEMENTATION PLAN

Version: 1.1

Status: ACTIVE

Last Updated: 2026-07-09

Reference: `MASTER_SPEC.md` (v1.1)

---

# PURPOSE

This document defines the complete implementation order of the project.

Every task must be completed in sequence.

No task may be skipped.

No future task may begin before its dependencies are complete.

Each task must be independently testable.

Each task should require approximately 1–2 hours of implementation.

Each task has a matching `Execution-NNN.md` prompt when implementation begins.

---

# PHASE 1 — PROJECT FOUNDATION

## 001 Repository Initialization

Goal

Create the monorepo structure.

Deliverables

- Repository created
- pnpm workspace
- Root package.json
- .gitignore
- README
- LICENSE (MIT)
- Folder structure per MASTER_SPEC §29.2

Dependencies

None

Completion Criteria

Repository structure exists. Workspace resolves. No application code yet.

---

## 002 Development Environment

Goal

Prepare the local development environment.

Deliverables

- TypeScript (tsconfig.base.json)
- ESLint
- Prettier
- Husky
- Commitlint (Conventional Commits)
- EditorConfig
- VSCode settings (recommended, not committed if ignored)

Dependencies

001

Completion Criteria

Lint and formatting scripts run without errors on empty workspace.

---

## 003 Docker Infrastructure

Goal

Prepare Docker development environment.

Deliverables

- Dockerfile (Frontend)
- Dockerfile (Backend)
- docker-compose.yml
- Environment file templates (.env.example)
- SQLite volume mount for backend data directory

Dependencies

002

Completion Criteria

`docker compose up` starts frontend and backend. SQLite persists in named volume.

---

## 004 Shared Configuration

Goal

Create centralized configuration package (`packages/config`).

Deliverables

- Environment loader
- Typed configuration
- Zod validation
- Shared constants

Dependencies

003

Completion Criteria

Frontend and backend can import typed config from `@portfolio-tracker/config`.

---

## 005 Logging Infrastructure

Goal

Create centralized logging.

Deliverables

- Logger interface in packages/shared or packages/config
- Log levels
- Structured JSON logging
- Request logging middleware stub

Dependencies

004

Completion Criteria

Logs work in development. Sensitive fields are never logged.

---

# PHASE 2 — DATABASE

## 006 Database Bootstrap

Goal

Initialize SQLite database layer in backend.

Deliverables

- better-sqlite3 connection module
- WAL mode enabled
- Foreign keys enabled
- Database file path from config

Dependencies

005

Completion Criteria

Backend connects to SQLite. PRAGMA settings verified.

---

## 007 Database Migrations

Goal

Implement versioned SQL migration system.

Deliverables

- Migration runner
- schema_migrations table (MASTER_SPEC §26.16)
- Initial migration (empty schema bootstrap)
- Migration CLI script

Dependencies

006

Completion Criteria

Migrations run in order. Applied migrations recorded. Re-run is idempotent.

---

## 008 Database Connection

Goal

Expose database access through repository layer only.

Deliverables

- Connection pool / singleton
- Transaction helper (begin, commit, rollback)
- Health check query

Dependencies

007

Completion Criteria

Integration test verifies connect, migrate, query, transaction rollback.

---

## 009 Database Models

Goal

Create TypeScript types and row mappers for all tables.

Deliverables

- Types for all tables in MASTER_SPEC §26.2
- Row-to-domain mappers
- No business logic in models

Dependencies

008

Completion Criteria

All table types compile. Mappers round-trip correctly in unit tests.

---

## 010 Repositories Foundation

Goal

Create base repository patterns.

Deliverables

- Base repository interface
- Prepared statement helpers
- Pagination helpers
- Soft-delete query helpers

Dependencies

009

Completion Criteria

Sample repository CRUD test passes against in-memory or temp SQLite.

---

## 011 Database Tests

Goal

Verify database layer reliability.

Deliverables

- Migration tests
- Repository integration tests
- Integrity check tests

Dependencies

010

Completion Criteria

All database tests pass in CI. Coverage target for repositories: 90%.

---

# PHASE 3 — BACKEND FOUNDATION

## 012 Express Bootstrap

Goal

Initialize Express application in `apps/api`.

Deliverables

- Express app entry point
- Route registration
- Graceful shutdown
- CORS for local frontend

Dependencies

011

Completion Criteria

API starts. Returns 404 for unknown routes. Shuts down cleanly.

---

## 013 Middleware

Goal

Add standard middleware stack.

Deliverables

- Request ID
- JSON body parser
- Request logging
- Response time header

Dependencies

012

Completion Criteria

Every request logged with request ID. Invalid JSON returns 400.

---

## 014 Error Handling

Goal

Unified error handling per MASTER_SPEC §27.2.

Deliverables

- AppError hierarchy
- Global error middleware
- Consistent `{ success, data, errors }` format

Dependencies

013

Completion Criteria

Validation, business, and unexpected errors return correct status codes and shape.

---

## 015 Validation

Goal

Request validation layer.

Deliverables

- Zod schemas for common patterns
- Validation middleware factory
- Pagination query validation

Dependencies

014

Completion Criteria

Invalid requests never reach services. Error details include field paths.

---

## 016 Health Check

Goal

Implement `/health` endpoint per MASTER_SPEC §27.10.

Deliverables

- Database health
- Disk space check
- Application version
- Provider status placeholder

Dependencies

015

Completion Criteria

GET `/api/v1/health` returns structured status. Unhealthy DB returns appropriate code.

---

## 017 Background Jobs

Goal

Job runner infrastructure.

Deliverables

- Job scheduler interface
- Job registry
- Non-blocking execution from HTTP handlers

Dependencies

016

Completion Criteria

Sample job runs on schedule and on demand without blocking API responses.

---

## 018 Provider Framework

Goal

Extensible market data provider architecture.

Deliverables

- Provider interface
- Provider manager skeleton
- Normalized DTO types (MASTER_SPEC §29.11)
- Fallback chain logic stub

Dependencies

017

Completion Criteria

Mock provider implements interface. Manager selects by priority.

---

# PHASE 4 — FRONTEND FOUNDATION

## 019 React Bootstrap

Goal

Initialize Vite + React + TypeScript in `apps/web`.

Deliverables

- Vite config
- React 18+ setup
- Path aliases matching MASTER_SPEC §29.14
- Strict TypeScript

Dependencies

004 (config package)

Completion Criteria

`pnpm dev` serves empty React app.

---

## 020 Routing

Goal

Application routing structure.

Deliverables

- React Router setup
- Route definitions for all main pages (MASTER_SPEC §28.5)
- Lazy-loaded page components (stubs)

Dependencies

019

Completion Criteria

All sidebar routes navigate correctly. Unknown route shows 404 page.

---

## 021 Theme

Goal

Material UI theme with light/dark/system support.

Deliverables

- MUI theme configuration
- Theme provider
- Theme persistence in settings stub

Dependencies

020

Completion Criteria

Theme switches work. All base components respect theme.

---

## 022 Layout

Goal

Application shell layout.

Deliverables

- Header, Sidebar, Content, Footer (MASTER_SPEC §28.3)
- Collapsible sidebar
- Responsive breakpoints

Dependencies

021

Completion Criteria

Layout consistent across routes. Sidebar collapse preserves icons.

---

## 023 Shared Components

Goal

Bootstrap `packages/ui` with reusable components.

Deliverables

- Button, Input, Dialog, Card stubs
- DataTable shell
- Loading skeleton component
- Empty state component

Dependencies

022

Completion Criteria

UI package exports components usable from apps/web.

---

## 024 API Client

Goal

Typed HTTP client for backend API.

Deliverables

- Fetch wrapper with error parsing
- Response type matching §27.1 / §27.2
- TanStack Query provider setup

Dependencies

023

Completion Criteria

Client parses success and error responses. Query provider wraps app.

---

## 025 Global State

Goal

Client-side state for non-server data.

Deliverables

- Zustand store for UI preferences
- Theme and sidebar state
- No business/financial state in global store

Dependencies

024

Completion Criteria

UI state persists where appropriate. Financial data only from API/query cache.

---

## 026 Error Boundary

Goal

Graceful UI error handling.

Deliverables

- React error boundary
- Error fallback UI per MASTER_SPEC §28.17
- Retry action

Dependencies

025

Completion Criteria

Thrown render errors show recovery UI, not blank screen.

---

# PHASE 5 — MARKET DATA

## 027 Provider Manager

Goal

Complete provider manager with priority and health.

Deliverables

- Provider registration
- Priority selection
- Health check tracking
- Automatic fallback

Dependencies

018

Completion Criteria

Primary provider failure triggers fallback. Status exposed via API.

---

## 028 Yahoo Provider

Goal

Yahoo Finance provider implementation.

Deliverables

- Current price fetch
- Historical price fetch
- Response normalization to NormalizedPrice

Dependencies

027

Completion Criteria

Integration test with mocked HTTP returns normalized prices.

---

## 029 TCMB Provider

Goal

TCMB exchange rate provider.

Deliverables

- Exchange rate fetch
- Normalization to NormalizedExchangeRate

Dependencies

027

Completion Criteria

TCMB rates parsed and stored with correct timestamps.

---

## 030 Price Cache

Goal

Cache market prices in memory and SQLite.

Deliverables

- Cache layer per MASTER_SPEC §27.16
- TTL from provider config
- Invalidation on refresh

Dependencies

028

Completion Criteria

Cache hit avoids provider call. Stale data refreshed on demand.

---

## 031 Exchange Rates

Goal

Exchange rate storage and retrieval.

Deliverables

- exchange_rates repository
- Historical rate lookup by date
- API endpoints GET `/prices/history` (rates subset)

Dependencies

029, 030

Completion Criteria

Transaction date uses historical rate, never today's rate.

---

## 032 Inflation

Goal

Inflation data module.

Deliverables

- inflation_history repository
- Inflation data import/sync
- NormalizedInflation DTO

Dependencies

031

Completion Criteria

Inflation lookup by country/year/month works. Missing data fails gracefully.

---

## 033 Synchronization

Goal

End-to-end price sync workflow.

Deliverables

- POST `/prices/refresh` job
- Sync orchestration per MASTER_SPEC §23.6
- UI trigger stub

Dependencies

032

Completion Criteria

Sync updates cache and triggers portfolio recalculation hook.

---

# PHASE 6 — ASSET MANAGEMENT

## 034 Asset Domain

Goal

Asset entity and validation rules.

Deliverables

- Asset domain model
- Asset validators (Zod)
- Asset type and market enums

Dependencies

033

Completion Criteria

Domain unit tests cover validation rules and edge cases.

---

## 035 Asset Repository

Goal

Asset persistence layer.

Deliverables

- CRUD with soft delete
- Search and filter queries
- Unique ticker + market constraint

Dependencies

034

Completion Criteria

Repository tests cover all CRUD and search scenarios.

---

## 036 Asset Service

Goal

Asset business logic.

Deliverables

- Create, update, search assets
- Provider search integration
- Duplicate prevention

Dependencies

035

Completion Criteria

Service tests verify duplicate rejection and provider fallback search.

---

## 037 Asset API

Goal

Asset REST endpoints per MASTER_SPEC §27.3.

Deliverables

- GET/POST/PUT/DELETE `/assets`
- GET `/assets/search`
- Pagination and filtering

Dependencies

036

Completion Criteria

All asset endpoints return standard response format. Integration tests pass.

---

## 038 Asset UI

Goal

Asset management page.

Deliverables

- Asset table with search/filter
- Create/edit asset forms
- Asset detail view

Dependencies

037

Completion Criteria

User can search, create, edit, soft-delete assets via UI.

---

## 039 Asset Tests

Goal

Complete asset module test coverage.

Deliverables

- E2E: create asset via UI
- API integration suite
- Coverage ≥ 90% for asset service

Dependencies

038

Completion Criteria

All asset tests green. No regression in lint/typecheck.

---

# PHASE 7 — TRANSACTIONS

## 040 Transaction Domain

Goal

Transaction entity and operation types.

Deliverables

- All operation types from MASTER_SPEC §15
- Validation rules from §21.19–21.21
- Audit fields

Dependencies

039

Completion Criteria

Domain tests for every transaction type validation.

---

## 041 Transaction Repository

Goal

Transaction persistence.

Deliverables

- CRUD with soft delete
- Chronological ordering queries
- Filter by date, type, asset, currency

Dependencies

040

Completion Criteria

Queries return correct sort order (trade_date, created_at, id).

---

## 042 Transaction Service

Goal

Transaction business logic and audit.

Deliverables

- Create, edit (with audit_logs), soft delete
- Portfolio rebuild trigger
- Validation before persist

Dependencies

041

Completion Criteria

Edit writes audit_logs. Invalid transactions rejected. Rebuild triggered.

---

## 043 Transaction API

Goal

Transaction REST endpoints per MASTER_SPEC §27.4.

Deliverables

- Full CRUD endpoints
- POST `/transactions/import` (CSV)
- GET `/transactions/export`

Dependencies

042

Completion Criteria

Import is transactional (all or nothing). Export matches import format.

---

## 044 Transaction UI

Goal

Transaction management page.

Deliverables

- Transaction table with filters
- Create/edit/delete forms
- Confirmation dialogs for destructive actions
- Import/export UI stubs

Dependencies

043

Completion Criteria

Full transaction CRUD via UI. Unsaved changes warning on forms.

---

## 045 Transaction Tests

Goal

Transaction module test coverage.

Deliverables

- Unit tests for ordering rules
- Integration tests for import
- E2E: create transaction → portfolio updates

Dependencies

044

Completion Criteria

All transaction tests pass. Import rollback verified on invalid row.

---

# PHASE 8 — PORTFOLIO

## 046 Portfolio Builder

Goal

Rebuild portfolio from transaction history.

Deliverables

- Full rebuild algorithm
- Incremental rebuild for single asset (MASTER_SPEC §25)
- Fallback to full rebuild on failure

Dependencies

045

Completion Criteria

1000-transaction fixture rebuilds correctly. Incremental matches full rebuild.

---

## 047 Position Engine

Goal

Calculate current positions from transactions.

Deliverables

- Quantity tracking per asset
- Closed position detection (quantity = 0)
- Multi-account support

Dependencies

046

Completion Criteria

Unit tests cover buy, sell, partial sell, complete exit scenarios.

---

## 048 Average Cost Engine

Goal

Weighted average cost calculations.

Deliverables

- Average cost per MASTER_SPEC §22.4
- Commission included in cost basis
- Split and bonus issue handling

Dependencies

047

Completion Criteria

All §21.3–21.10 examples pass as unit tests.

---

## 049 Allocation Engine

Goal

Portfolio allocation percentages.

Deliverables

- Asset allocation
- Cash included in total
- 100% total with float tolerance

Dependencies

048

Completion Criteria

Allocation sums to 100% ± 0.01% for test portfolios.

---

## 050 Portfolio API

Goal

Portfolio REST endpoints per MASTER_SPEC §27.5.

Deliverables

- GET `/portfolio`, `/portfolio/positions`, `/portfolio/allocation`
- GET `/portfolio/performance`, `/portfolio/history`

Dependencies

049

Completion Criteria

API returns correct positions after transaction changes. Response time < 500ms for 10k txs.

---

## 051 Portfolio UI

Goal

Portfolio page.

Deliverables

- Positions table
- Allocation charts (Recharts)
- Performance summary
- Filters and sorting

Dependencies

050

Completion Criteria

Portfolio page displays live data. No calculations in UI components.

---

## 052 Portfolio Tests

Goal

Portfolio module test coverage.

Deliverables

- Deterministic calculation tests
- Performance test with 10k transactions
- E2E portfolio display flow

Dependencies

051

Completion Criteria

Calculation tests match MASTER_SPEC examples exactly.

---

# PHASE 9 — CALCULATIONS

## 053 Profit Engine

Goal

Realized and unrealized profit calculations.

Deliverables

- Realized profit (§22.6)
- Unrealized profit (§22.7)
- Total profit (§22.8)

Dependencies

052

Completion Criteria

All profit formulas unit tested with edge cases.

---

## 054 Inflation Engine

Goal

Inflation-adjusted calculations.

Deliverables

- Real return (§22.13)
- Inflation-adjusted value (§22.12)
- CPI lookup integration

Dependencies

053

Completion Criteria

Missing inflation data fails gracefully with user-visible message.

---

## 055 Currency Engine

Goal

Multi-currency calculations.

Deliverables

- Historical rate conversion (§22.2)
- Currency return separation (§22.14)
- Base currency (TRY) reporting

Dependencies

054

Completion Criteria

Never uses today's rate for historical transactions.

---

## 056 Performance Engine

Goal

Performance metrics.

Deliverables

- CAGR, TWR, XIRR (§18)
- Daily/monthly/annual returns
- Maximum drawdown

Dependencies

055

Completion Criteria

Metrics match reference calculations in unit tests.

---

## 057 Financial Metrics

Goal

Risk and ratio metrics.

Deliverables

- Volatility, Sharpe ratio
- Portfolio value (§22.9)
- Cash balance (§22.11)

Dependencies

056

Completion Criteria

95% coverage on calculation engine business logic.

---

## 058 Calculation Tests

Goal

Comprehensive financial test suite.

Deliverables

- Golden file tests for complex portfolios
- Regression tests for every formula in §22
- Cross-platform determinism verification

Dependencies

057

Completion Criteria

Same input → same output on repeated runs. All §22 formulas covered.

---

# PHASE 10 — REPORTING

## 059 Report Engine

Goal

Report generation core.

Deliverables

- Report templates for all types in MASTER_SPEC §19
- Async generation for large reports
- Preview before export

Dependencies

058

Completion Criteria

All report types generate without modifying application data.

---

## 060 PDF Export

Goal

PDF report export.

Deliverables

- PDF generator library integration
- Portfolio summary and performance PDFs
- GET `/reports/export/pdf`

Dependencies

059

Completion Criteria

Generated PDF opens correctly. Data matches API response.

---

## 061 Excel Export

Goal

Excel report export.

Deliverables

- XLSX generation
- GET `/reports/export/excel`

Dependencies

059

Completion Criteria

Excel file opens in LibreOffice/Excel with correct data.

---

## 062 CSV Export

Goal

CSV report and data export.

Deliverables

- CSV generation per report type
- GET `/reports/export/csv`
- Matches import template format where applicable

Dependencies

059

Completion Criteria

CSV round-trip: export → import produces identical transactions.

---

## 063 Report UI

Goal

Reports page.

Deliverables

- Report selector and parameters
- Preview panel
- Export buttons
- Generation status indicator

Dependencies

060, 061, 062

Completion Criteria

User generates, previews, and downloads reports from UI.

---

# PHASE 11 — DASHBOARD

## 064 Dashboard Layout

Goal

Dashboard page structure.

Deliverables

- Widget grid layout
- Independent widget loading
- Error isolation per widget

Dependencies

063

Completion Criteria

One failed widget does not break others.

---

## 065 Summary Widgets

Goal

Core summary widgets.

Deliverables

- Portfolio value, today's change, total profit
- Total return, real return, cash balance

Dependencies

064

Completion Criteria

Widgets display correct values from API. Skeleton shown while loading.

---

## 066 Portfolio Widgets

Goal

Allocation and performance widgets.

Deliverables

- Asset/sector/currency allocation
- Best/worst performer, largest position

Dependencies

065

Completion Criteria

Allocation widget sums to 100%. Performers ranked correctly.

---

## 067 Charts

Goal

Dashboard charts with Recharts.

Deliverables

- Line, area, bar, pie, donut charts
- Prepared data from API only

Dependencies

066

Completion Criteria

Charts render correctly in light and dark themes.

---

## 068 Dashboard Tests

Goal

Dashboard test coverage.

Deliverables

- Widget unit tests
- E2E dashboard load test
- Performance: dashboard < 2 seconds

Dependencies

067

Completion Criteria

Dashboard meets performance target with 10k transaction fixture.

---

# PHASE 12 — SETTINGS

## 069 Settings Module

Goal

Settings CRUD and persistence.

Deliverables

- settings repository and service
- GET/PUT/POST reset endpoints (§27.8)
- Settings UI sections (§28.11)

Dependencies

068

Completion Criteria

Settings validated before save. Reset restores defaults.

---

## 070 Backup

Goal

Database backup functionality.

Deliverables

- POST `/backup`, GET `/backup/list`
- Checksum verification
- backup_history recording

Dependencies

069

Completion Criteria

Backup file restorable. Checksum verified on creation.

---

## 071 Restore

Goal

Database restore functionality.

Deliverables

- POST `/backup/restore`
- Integrity check before replace
- Temporary database validation (§30.10)

Dependencies

070

Completion Criteria

Restore from backup returns application to backed-up state.

---

## 072 Provider Settings

Goal

Provider configuration UI and API.

Deliverables

- Enable/disable providers
- Priority configuration
- Timeout and retry settings

Dependencies

071

Completion Criteria

Provider priority changes affect provider manager selection.

---

## 073 Preferences

Goal

User preferences (theme, currency display, locale).

Deliverables

- Appearance settings
- Base currency display (TRY fixed in v1)
- Onboarding flow (§23.1)

Dependencies

072

Completion Criteria

First launch shows onboarding. Preferences persist across restarts.

---

# PHASE 13 — OPTIMIZATION

## 074 Performance Optimization

Goal

Meet all performance targets in MASTER_SPEC §25.

Deliverables

- Profile portfolio rebuild at 100k transactions
- Virtual scrolling for large tables
- Query and index optimization

Dependencies

073

Completion Criteria

All §25 targets met or documented with justified exceptions.

---

## 075 Accessibility

Goal

WCAG 2.1 AA compliance.

Deliverables

- Keyboard navigation audit
- ARIA labels
- Focus management
- High contrast support

Dependencies

074

Completion Criteria

Automated a11y scan passes. Manual keyboard walkthrough complete.

---

## 076 Security Review

Goal

Complete security checklist from MASTER_SPEC §30.

Deliverables

- SQL injection verification
- XSS prevention audit
- Dependency vulnerability scan
- Secret management verification

Dependencies

075

Completion Criteria

All §30.16 checklist items verified and documented.

---

## 077 Code Review

Goal

Full codebase architecture review.

Deliverables

- Layer boundary audit
- No business logic in UI verification
- Import rule compliance (§29.14)

Dependencies

076

Completion Criteria

No architectural violations found or all fixed.

---

## 078 Refactoring

Goal

Address technical debt from review.

Deliverables

- Refactorings with unchanged behavior
- Improved naming and structure
- No new features

Dependencies

077

Completion Criteria

All tests still pass after refactoring.

---

## 079 Documentation

Goal

Complete project documentation.

Deliverables

- README (install, dev, docker, backup)
- docs/api-spec.md (from §27)
- docs/db-schema.md (from §26)
- docs/import-template.csv

Dependencies

078

Completion Criteria

New developer can run project from README alone.

---

# PHASE 14 — RELEASE

## 080 Final Testing

Goal

Full test suite and acceptance criteria verification.

Deliverables

- All unit, integration, E2E tests pass
- MASTER_SPEC §35 checklist verified

Dependencies

079

Completion Criteria

Zero failing tests. Acceptance criteria checklist signed off.

---

## 081 Final Build

Goal

Production build verification.

Deliverables

- Production frontend build
- Production backend build
- Typecheck and lint clean

Dependencies

080

Completion Criteria

`pnpm build` succeeds for all packages.

---

## 082 Docker Validation

Goal

Verify Docker deployment end-to-end.

Deliverables

- docker compose production config
- Volume persistence test
- Health check verification

Dependencies

081

Completion Criteria

Fresh machine can run app with only Docker and `docker compose up`.

---

## 083 Release Candidate

Goal

Prepare v1.0.0 release candidate.

Deliverables

- Semantic version tag
- Release notes
- Known issues list
- Rollback instructions

Dependencies

082

Completion Criteria

RC tagged. Release notes complete.

---

## 084 Version 1.0 Release

Goal

Ship Version 1.0.

Deliverables

- GitHub release
- Final migration version locked
- CI/CD pipeline green

Dependencies

083

Completion Criteria

MASTER_SPEC §35 acceptance criteria fully satisfied. Version 1.0 released.

---

END OF IMPLEMENTATION PLAN
