# MASTER_SPEC.md

# Portfolio Tracker
## Master Software Specification

Version: 1.1

Status: ACTIVE

Last Updated: 2026-07-09

---

## Document Index

| Part | Sections | Topic |
|------|----------|-------|
| 1 | 1–12 | Purpose, scope, principles, stack |
| 2 | 13–20 | System modules |
| 3 | 21 | Business rules |
| 4 | 22 | Financial calculations |
| 5 | 23–25 | Workflows, errors, performance |
| 6 | 26 | Database design |
| 7 | 27 | API specification |
| 8 | 28 | User interface |
| 9 | 29 | Software architecture |
| 10 | 30 | Security |
| 11 | 31 | Testing |
| 12 | 32 | Deployment |
| 13 | 33 | AI development workflow |
| 14 | 34–36 | Roadmap, acceptance, glossary |

Related documents: `IMPLEMENTATION_PLAN.md`, `PROJECT_RULES.md`, `Execution-*.md`

---

# 1. PURPOSE

## 1.1 Project Goal

The purpose of this project is to develop a production-grade personal finance and portfolio management platform.

This application is intended to be used as a real software product.

It is not a tutorial project.

It is not a demonstration project.

Version 1 is a complete single-user product — not a throwaway prototype or demo.

Version 1 is not minimal in ambition; it is minimal in scope (single user, no cloud, no auth).

Every architectural decision must prioritize long-term maintainability.

---

## 1.2 Main Objectives

The application must allow a user to

- manage every investment
- monitor portfolio performance
- calculate real returns
- compare investment strategies
- simulate future scenarios
- generate reports
- export reports
- work completely offline
- synchronize market prices when internet is available

---

## 1.3 Design Philosophy

The software must always prioritize

Correctness

↓

Reliability

↓

Maintainability

↓

Performance

↓

User Experience

↓

Development Speed

Never sacrifice architecture quality to finish faster.

---

## 1.4 Application Delivery Model

Version 1 is a locally hosted web application.

The user runs the application on their own machine using Docker Compose or local development scripts.

The primary interface is a browser-based desktop experience optimized for large screens.

Version 1 does not include a native desktop wrapper (Electron, Tauri) or mobile application.

Future versions may add native clients without changing core business logic.

Data remains on the user's machine. The backend and SQLite database run locally.

---

# 2. PRODUCT VISION

Portfolio Tracker is designed as a modular financial operating system.

Version 1 focuses on personal investing.

Future versions may become a complete wealth management platform.

Architecture must support future expansion without major rewrites.

---

# 3. TARGET USERS

Primary user

Individual investor

Typical characteristics

- invests regularly
- owns multiple asset classes
- wants realistic profit calculations
- wants inflation-adjusted performance
- prefers local data ownership
- values privacy
- wants fast desktop performance

---

# 4. PRODUCT PRINCIPLES

The application must be

Fast

Reliable

Simple

Predictable

Offline First

Privacy First

Modular

Production Ready

Every feature must satisfy these principles.

---

# 5. VERSION 1 SCOPE

Version 1 includes

Portfolio Management

Transaction Management

Asset Registry

Market Data Synchronization

Historical Prices

Performance Analysis

Real Return Calculations

Charts

Reports

Backup

Restore

Settings

Dark Theme

Light Theme

CSV Import

CSV Export

Excel Export

PDF Export

SQLite Database

Docker Deployment

Testing

Documentation

Everything else belongs to future versions.

---

# 6. OUT OF SCOPE

Version 1 explicitly excludes

Multi-user support

Cloud synchronization

Authentication

Authorization

Payments

Subscriptions

Broker integration

Order execution

Social features

AI assistant

Push notifications

Real-time collaboration

Mobile application

These features are intentionally excluded.

Architecture must allow adding them later.

---

# 7. SOFTWARE QUALITY REQUIREMENTS

Every module must satisfy

Readable

Testable

Replaceable

Independent

Reusable

Documented

Maintainable

No module may depend on implementation details of another module.

---

# 8. ENGINEERING PRINCIPLES

The project follows

Clean Architecture

SOLID

DRY

KISS

YAGNI

Feature Based Architecture

Layered Architecture

Composition over Inheritance

Dependency Inversion

Every implementation must respect these principles.

---

# 9. TECH STACK

Frontend

React

TypeScript

Vite

Material UI

React Router

TanStack Query

Zustand

React Hook Form

Zod

Recharts

Backend

Node.js

Express

TypeScript

Database

SQLite

better-sqlite3

Database Migrations

Custom SQL migrations (versioned, stored in apps/api)

Testing

Vitest

Playwright

Build

Docker

Docker Compose

Package Manager

pnpm

Monorepo

pnpm workspaces

CI/CD

GitHub Actions

License

MIT

---

# 10. DEVELOPMENT PHILOSOPHY

The project is developed incrementally.

No module is implemented all at once.

Every module follows

Design

↓

Implementation

↓

Review

↓

Refactor

↓

Tests

↓

Completion

No module skips this workflow.

---

# 11. DEVELOPMENT RULES

Before every implementation

Understand existing architecture.

Reuse existing code.

Avoid duplication.

Keep changes minimal.

Never rewrite working code unnecessarily.

Never create placeholder implementations.

Never invent APIs.

Never invent database tables.

Every implementation must compile.

Every implementation must pass TypeScript.

Every implementation must pass linting.

Every implementation must preserve architecture.

---

# 12. PROJECT STRUCTURE

The project consists of

apps/

packages/

docs/

docker/

scripts/

.github/

Every module must remain independent.

Shared code belongs inside packages.

Business logic never belongs inside UI.

Database access never belongs inside services.

---

END OF PART 1

---

# 13. SYSTEM MODULES

Version 1 consists of the following modules.

Core Modules

• Asset Management
• Transaction Engine
• Portfolio Engine
• Market Data Engine
• Calculation Engine

Application Modules

• Dashboard
• Reporting
• Search
• Import
• Export
• Settings
• Backup
• Restore

Infrastructure Modules

• Database
• Cache
• Logging
• Configuration
• Provider Manager
• Testing

Every module is independent.

Modules communicate only through defined interfaces.

---

# 14. ASSET MANAGEMENT MODULE

Purpose

Maintain a complete registry of every financial instrument known to the application.

Responsibilities

Register assets

Update asset information

Search assets

Categorize assets

Synchronize assets from providers

Validate symbols

Supported Asset Types

Stocks

ETF

Mutual Funds

Currencies

Gold

Silver

Indices

Crypto (future ready)

Bonds (future ready)

Supported Markets

BIST

NASDAQ

NYSE

FOREX

Precious Metals

Crypto

Mutual Funds

Each asset must contain

Unique Identifier

Ticker

Display Name

Market

Currency

Asset Type

Provider

Status

Created Date

Updated Date

Deleted Flag

The Asset module never performs calculations.

---

# 15. TRANSACTION ENGINE

Purpose

Store every financial event.

Nothing inside the application exists without a transaction.

Every portfolio is reconstructed from transactions.

Supported Operations

Buy

Sell

Dividend

Split

Bonus Issue

Deposit

Withdraw

Transfer In

Transfer Out

Fee

Tax

Interest

Every transaction stores

Transaction ID

Asset ID

Operation Type

Quantity

Unit Price

Commission

Currency

Exchange Rate

Trade Date

Settlement Date

Broker

Notes

Created At

Updated At

Deleted At

Audit Information

Rules

Transactions represent immutable financial history.

Correction of a mistake is done by editing the record with a full audit trail — not by silent overwrite.

Every edit stores previous and current values in audit_logs.

Deletion should be logical whenever possible.

Portfolio must always be rebuildable from transaction history.

---

# 16. PORTFOLIO ENGINE

Purpose

Transform transaction history into portfolio positions.

Input

Assets

Transactions

Market Prices

Exchange Rates

Output

Current Positions

Average Cost

Current Value

Total Cost

Profit

Loss

Allocation

The Portfolio Engine never modifies transactions.

It only reads them.

Portfolio calculations must always be deterministic.

Running the same calculation twice must produce identical results.

---

# 17. MARKET DATA ENGINE

Purpose

Provide normalized market data.

Supported Data

Current Prices

Historical Prices

Exchange Rates

Inflation

Market Status

Trading Calendar

Supported Providers

Yahoo Finance

Alpha Vantage

Finnhub

Polygon

TwelveData

TCMB

Future providers can be added without changing business logic.

Provider failures must automatically fall back to another provider.

---

# 18. CALCULATION ENGINE

Purpose

Perform every financial calculation.

Supported Calculations

Average Cost

Current Value

Realized Profit

Unrealized Profit

Portfolio Allocation

Inflation Adjusted Return

Currency Adjusted Return

Compound Annual Growth Rate (CAGR)

Time Weighted Return (TWR)

Money Weighted Return (XIRR)

Annual Return

Monthly Return

Daily Return

Maximum Drawdown

Volatility

Sharpe Ratio

Sortino Ratio (future)

Beta (future)

Alpha (future)

Treynor Ratio (future)

All calculations must be deterministic.

Every formula must have unit tests.

---

# 19. REPORTING MODULE

Purpose

Generate professional financial reports.

Supported Reports

Portfolio Summary

Performance Report

Transaction Report

Asset Allocation

Sector Allocation

Currency Allocation

Tax Summary

Dividend Report

Inflation Report

Custom Reports

Supported Export Formats

PDF

Excel

CSV

JSON

Reports must never modify application data.

---

# 20. DASHBOARD MODULE

Purpose

Provide an overview of the entire portfolio.

Dashboard Widgets

Portfolio Value

Today's Change

Total Profit

Total Return

Real Return

Cash Balance

Largest Position

Best Performer

Worst Performer

Asset Allocation

Sector Allocation

Recent Transactions

Latest Market Updates

Watchlist (future)

Widgets must remain independent.

Every widget loads independently.

Failure of one widget must never affect another.

---

END OF PART 2


---

# 21. BUSINESS RULES

The Business Rules define the financial truth of the application.

Every calculation must follow these rules.

Business rules have higher priority than implementation details.

If implementation and business rules conflict,

Business Rules always win.

---

# 21.1 GENERAL PRINCIPLES

The portfolio is reconstructed entirely from transaction history.

Nothing is manually calculated.

Nothing is permanently stored if it can be reproduced.

Every portfolio state must be reproducible.

The same input must always produce the same output.

No randomness is allowed.

---

# 21.2 TRANSACTION ORDER

Transactions are processed in chronological order.

Primary Sort

Trade Date

Secondary Sort

Creation Time

Tertiary Sort

Transaction ID

Changing the order of transactions changes the portfolio.

Therefore ordering is mandatory.

---

# 21.3 BUY TRANSACTION

A BUY transaction

Increases quantity.

Increases total invested capital.

Recalculates average cost.

Does not generate profit.

Does not change realized profit.

Example

Buy

100 shares

100 TL

Result

Quantity

100

Average Cost

100 TL

---

# 21.4 SELL TRANSACTION

A SELL transaction

Reduces quantity.

Does not change historical buy records.

Generates realized profit.

Average cost remains based on remaining shares.

Example

Buy

100 @ 100

Sell

40 @ 150

Remaining

60 shares

Average Cost

100

Realized Profit

(150-100) × 40

---

# 21.5 PARTIAL SELL

Partial selling never recalculates purchase prices.

Only quantity decreases.

Average cost of remaining units remains unchanged.

---

# 21.6 COMPLETE EXIT

When quantity reaches zero

Position becomes closed.

Average cost resets.

Future purchases start a completely new position.

Historical records remain unchanged.

---

# 21.7 COMMISSION

Commission is part of investment cost.

Buy Commission

Adds to cost basis.

Sell Commission

Reduces realized profit.

Commission must always be included in calculations.

---

# 21.8 DIVIDEND

Dividends do not change

Quantity

Average Cost

Purchase History

Dividends increase realized income.

Dividend tax is recorded separately.

---

# 21.9 STOCK SPLIT

Stock Split changes

Quantity

Average Cost

Total investment remains identical.

Example

100 shares

100 TL

2:1 Split

↓

200 shares

50 TL

Portfolio value remains unchanged.

---

# 21.10 BONUS ISSUE

Bonus shares

Increase quantity.

Reduce average cost proportionally.

Total invested capital remains unchanged.

---

# 21.11 CASH DEPOSIT

Cash Deposit

Increases cash balance.

Does not affect investments.

Does not affect returns.

---

# 21.12 CASH WITHDRAWAL

Cash Withdrawal

Reduces cash balance.

Does not modify investment history.

---

# 21.13 TRANSFER BETWEEN ACCOUNTS

Transfers

Never create profit.

Never create loss.

Only ownership location changes.

Asset identity remains identical.

---

# 21.14 CURRENCY CONVERSION

Every transaction stores

Original Currency

↓

Exchange Rate

↓

Base Currency

Historical exchange rates are immutable.

Never recalculate old exchange rates.

---

# 21.15 HISTORICAL DATA

Historical prices

Historical inflation

Historical exchange rates

must never change after being stored.

Corrections require explicit synchronization.

---

# 21.16 DELETED TRANSACTIONS

Transactions are never physically deleted.

Use soft delete.

Deleted records remain available for audit.

---

# 21.17 AUDIT RULE

Every modification records

Created At

Updated At

Deleted At

Source

Operation

Previous Version

Current Version

Nothing important happens without an audit trail.

---

# 21.18 TRANSACTION MODIFICATION

Users may edit existing transactions to correct mistakes.

Every edit must

Record previous_value and new_value in audit_logs

Update updated_at on the transaction

Trigger portfolio recalculation

Never physically delete the original audit history

Edits must not bypass validation rules (§21.19).

Bulk import corrections use the import workflow, not manual bulk edits.

---

# 21.19 TAX RULES (VERSION 1)

Version 1 supports tax recording and reporting — not automated tax advice.

Transaction tax field

Stores tax amount associated with a transaction (e.g. dividend withholding).

Tax is recorded separately from commission.

Tax does not change quantity or average cost unless the transaction type requires it.

Tax Summary Report

Aggregates recorded tax amounts by period and transaction type.

Does not calculate statutory tax obligations automatically.

Future versions may add jurisdiction-specific tax rules.

---

# 21.20 VALIDATION RULES

Reject

Negative quantity

Negative price

Unknown currency

Unknown asset

Invalid trade date

Duplicate identifiers

Invalid exchange rate

Validation occurs before persistence.

---

# 21.21 DETERMINISTIC REQUIREMENT

Every calculation must satisfy

Same Input

↓

Same Output

Always.

No hidden state.

No cached calculation may change financial truth.

---

END OF PART 3

---

# 22. FINANCIAL CALCULATION SPECIFICATION

This chapter defines every financial calculation performed by the application.

Every formula must be deterministic.

Every formula must be unit tested.

Every formula must produce identical results regardless of operating system.

Floating point precision errors must be minimized.

All calculations must preserve financial accuracy.

---

# 22.1 BASE CURRENCY

The application has one Base Currency.

Default

TRY

Future versions may allow changing the Base Currency.

Every calculation must eventually be converted into the Base Currency.

Original transaction values are never modified.

---

# 22.2 MULTI CURRENCY

Each transaction stores

Original Currency

Original Price

Historical Exchange Rate

Converted Base Currency Value

Calculations use historical exchange rates.

Never today's exchange rate.

---

# 22.3 COST BASIS

Cost Basis represents

Total amount invested.

Formula

Total Purchase Cost

+

Purchase Commissions

+

Purchase Taxes

=

Cost Basis

Sell commissions are NOT included.

---

# 22.4 AVERAGE COST

Version 1 uses

Weighted Average Cost

FIFO

Future

LIFO

Future

Specific Identification

Future

Average Cost Formula

Average Cost

=

Total Cost Basis

/

Current Quantity

The calculation must be recalculated after every BUY transaction.

SELL transactions never recalculate historical purchase prices.

---

# 22.5 CURRENT VALUE

Formula

Current Quantity

×

Latest Market Price

Current Value updates whenever market prices change.

---

# 22.6 REALIZED PROFIT

Formula

Sell Value

-

Historical Cost Basis

-

Sell Commission

=

Realized Profit

Realized Profit never changes after a completed sale.

---

# 22.7 UNREALIZED PROFIT

Formula

Current Market Value

-

Current Cost Basis

=

Unrealized Profit

This value changes continuously with market prices.

---

# 22.8 TOTAL PROFIT

Formula

Realized Profit

+

Unrealized Profit

=

Total Profit

---

# 22.9 PORTFOLIO VALUE

Formula

Sum(Current Value)

+

Cash Balance

Portfolio value always includes available cash.

---

# 22.10 PORTFOLIO ALLOCATION

Formula

Asset Current Value

/

Portfolio Value

Expressed as percentage.

The total allocation must always equal 100%.

Allow a tolerance only for floating-point precision.

---

# 22.11 CASH BALANCE

Cash Balance

=

Deposits

-

Withdrawals

-

Purchases

+

Sales

+

Dividends

-

Fees

Cash calculations must always reconcile.

---

# 22.12 INFLATION ADJUSTED VALUE

Inflation calculations always use

Historical CPI

Never estimate inflation.

Never interpolate missing values.

If inflation data is unavailable,

the calculation must fail gracefully.

---

# 22.13 REAL RETURN

Formula

Nominal Return

-

Inflation

=

Real Return

Inflation source must always be recorded.

---

# 22.14 EXCHANGE RATE RETURN

Currency gains must be separated from

Investment gains.

The application should distinguish

Investment Performance

Currency Performance

Combined Performance

These values must never be mixed.

---

# 22.15 ROUNDING

Internal calculations

Minimum precision

8 decimal places

Display

Currency

2 decimals

Quantity

Up to 8 decimals

Percentages

2 decimals

Never round internal calculations early.

Only round when displaying values.

---

# 22.16 MISSING MARKET DATA

If no valid market price exists

Mark asset

Price Unavailable

Portfolio calculations continue.

Only market-dependent metrics become unavailable.

The application must never crash.

---

# 22.17 NEGATIVE POSITIONS

Negative quantity

Not supported in Version 1.

Short selling

Excluded.

Future architecture must allow extension.

---

END OF PART 4

---

# 23. USER WORKFLOWS

This chapter defines how a user interacts with the application.

Every workflow must be predictable.

Every workflow must be reversible whenever technically possible.

No workflow may leave the application in an inconsistent state.

---

# 23.1 FIRST APPLICATION START

When the application starts for the first time

The application shall

Create database

↓

Run migrations

↓

Verify integrity

↓

Initialize configuration

↓

Load default settings

↓

Display onboarding

If initialization fails

Display recovery instructions.

---

# 23.2 ADDING A NEW ASSET

Workflow

User opens Asset Manager

↓

Searches for asset

↓

Application searches local database

↓

If missing

Search provider

↓

Validate result

↓

Store asset

↓

Return asset to user

Duplicate assets are not allowed.

---

# 23.3 ADDING A TRANSACTION

Workflow

User selects asset

↓

Selects transaction type

↓

Enters quantity

↓

Enters price

↓

Enters commission

↓

Chooses currency

↓

Chooses transaction date

↓

Validation

↓

Save transaction

↓

Rebuild portfolio

↓

Refresh dashboard

Portfolio recalculation must occur automatically.

---

# 23.4 EDITING A TRANSACTION

Workflow

Load transaction

↓

Validate modification

↓

Save changes

↓

Invalidate affected cache

↓

Rebuild portfolio

↓

Refresh UI

Every modification must be logged.

---

# 23.5 DELETING A TRANSACTION

Workflow

Confirmation

↓

Soft Delete

↓

Audit Log

↓

Portfolio Recalculation

↓

Refresh Views

Deletion must never destroy historical audit information.

---

# 23.6 MARKET PRICE SYNCHRONIZATION

Workflow

Start synchronization

↓

Provider selection

↓

Retrieve data

↓

Validate response

↓

Normalize

↓

Update cache

↓

Refresh calculations

↓

Refresh UI

Failure of one provider must not stop synchronization.

---

# 23.7 IMPORTING DATA

Workflow

Select file

↓

Detect format

↓

Validate structure

↓

Preview import

↓

Detect duplicates

↓

User confirmation

↓

Import

↓

Portfolio rebuild

↓

Summary report

Import is transactional.

Partial imports are not allowed.

---

# 23.8 EXPORTING DATA

Workflow

Choose format

↓

Choose content

↓

Generate file

↓

Verify

↓

Download

Generated files never modify application data.

---

# 23.9 DATABASE BACKUP

Workflow

Create backup

↓

Verify backup

↓

Store timestamp

↓

Display success

Backups must be recoverable.

---

# 23.10 DATABASE RESTORE

Workflow

Select backup

↓

Validate

↓

Verify integrity

↓

Restore

↓

Restart services

↓

Verify application

Restore must never overwrite invalid data.

---

# 23.11 IMPORT FILE FORMAT (VERSION 1)

Version 1 CSV import uses a defined application format.

Required columns

ticker

transaction_type

quantity

unit_price

trade_date

currency

Optional columns

commission

tax

exchange_rate

settlement_date

broker

account

notes

Import validates every row before persistence.

Duplicate detection uses ticker + trade_date + transaction_type + quantity + unit_price.

Unsupported formats are rejected with a clear error message.

Example template is stored in docs/import-template.csv.

---

# 24. ERROR HANDLING

Errors are grouped into

Validation Errors

Business Errors

Database Errors

Provider Errors

Application Errors

Unexpected Errors

Users receive understandable messages.

Developers receive detailed logs.

---

# 25. PERFORMANCE REQUIREMENTS

Application startup

Target

Less than 3 seconds

Portfolio recalculation

Target

Less than 500 ms

Dashboard loading

Target

Less than 2 seconds

Search response

Target

Less than 200 ms

Large portfolio support

Minimum

100,000 transactions

Memory usage should remain predictable.

Performance must degrade gracefully.

Portfolio recalculation strategy

Full rebuild from transactions is the default and must always produce correct results.

For performance, the Portfolio Engine may incrementally recalculate only affected assets after a single transaction change.

Incremental recalculation must produce identical results to a full rebuild.

If incremental path fails, fall back to full rebuild automatically.

---

END OF PART 5


---

# 26. DATABASE DESIGN

This chapter defines the complete database schema.

The database is the single source of truth.

Every persistent piece of information must exist inside the database.

Business logic never modifies the schema.

The schema is versioned through migrations.

---

# 26.1 DATABASE ENGINE

Version 1

SQLite

Requirements

ACID compliant

WAL mode enabled

Foreign keys enabled

Prepared statements only

Automatic backup support

Migration support

Future migration path

PostgreSQL

The architecture must allow replacing SQLite without changing business logic.

---

# 26.2 DATABASE TABLES

Version 1 contains the following tables

assets

transactions

portfolio_positions

price_history

exchange_rates

inflation_history

cash_accounts

providers

settings

application_logs

audit_logs

database_metadata

backup_history

schema_migrations

---

# 26.3 ASSETS TABLE

Purpose

Stores every financial instrument.

Columns

id

ticker

display_name

market

asset_type

currency

provider

isin

status

created_at

updated_at

deleted_at

Indexes

ticker

market

asset_type

currency

Unique

ticker + market

---

# 26.4 TRANSACTIONS TABLE

Purpose

Stores every financial operation.

Columns

id

asset_id

transaction_type

quantity

unit_price

commission

tax

currency

exchange_rate

trade_date

settlement_date

broker

account

notes

created_at

updated_at

deleted_at

Indexes

asset_id

trade_date

transaction_type

currency

Foreign Keys

asset_id

→

assets.id

---

# 26.5 PORTFOLIO_POSITIONS

Purpose

Stores a materialized cache of current portfolio positions for fast reads.

This table is not the source of truth.

The source of truth remains transactions.

This table may be dropped and fully regenerated from transactions at any time.

Portfolio Engine writes here after every recalculation.

Columns

id

asset_id

quantity

average_cost

cost_basis

market_price

market_value

realized_profit

unrealized_profit

allocation

updated_at

Foreign Keys

asset_id

→

assets.id

---

# 26.6 PRICE_HISTORY

Purpose

Historical market prices.

Columns

id

asset_id

provider

price

currency

timestamp

Indexes

asset_id

timestamp

provider

Retention policy configurable.

---

# 26.7 EXCHANGE_RATES

Purpose

Historical exchange rates.

Columns

id

base_currency

target_currency

rate

provider

timestamp

Unique

base_currency

target_currency

timestamp

---

# 26.8 INFLATION_HISTORY

Purpose

Historical inflation values.

Columns

id

country

year

month

inflation_rate

source

updated_at

One record per

Country

Year

Month

---

# 26.9 CASH_ACCOUNTS

Purpose

Cash balances per account.

Columns

id

account_name

currency

balance

created_at

updated_at

Multiple accounts supported.

Relationship

transactions.account references cash_accounts.account_name (logical link).

Cash-altering transaction types (Deposit, Withdraw, Buy, Sell, Dividend, Fee, Tax) affect the linked cash account balance.

Transfer In and Transfer Out move value between accounts without creating profit or loss.

---

# 26.10 PROVIDERS

Purpose

Provider configuration.

Columns

id

provider_name

priority

enabled

timeout

retry_count

cache_duration

last_health_check

status

Only one provider can have Priority 1.

---

# 26.11 SETTINGS

Purpose

User configuration.

Columns

key

value

type

updated_at

Settings remain key-value based.

---

# 26.12 APPLICATION_LOGS

Purpose

Application logging.

Columns

id

level

source

message

context

timestamp

Logs should support filtering.

---

# 26.13 AUDIT_LOGS

Purpose

Permanent audit trail.

Columns

id

entity

entity_id

operation

previous_value

new_value

timestamp

Audit logs are immutable.

---

# 26.14 DATABASE_METADATA

Purpose

Database information.

Columns

schema_version

application_version

created_at

last_backup

last_migration

integrity_status

One row only.

---

# 26.15 BACKUP_HISTORY

Purpose

Backup tracking.

Columns

id

backup_name

backup_date

backup_size

checksum

restore_verified

status

Backups must be verifiable.

---

# 26.16 SCHEMA_MIGRATIONS

Purpose

Track applied database schema migrations.

Columns

id

version

name

applied_at

checksum

One row per applied migration file.

Never modify applied migration files.

---

# 26.17 RELATIONSHIPS

assets

↓

transactions

↓

portfolio_positions

price_history

↓

exchange_rates

↓

calculation_engine

All relationships use foreign keys.

Cascade delete is NOT allowed.

Soft delete is preferred.

---

# 26.18 INDEXING STRATEGY

Create indexes only for

Frequently searched columns

Foreign keys

Date columns

Ticker

Provider

Avoid unnecessary indexes.

---

# 26.19 MIGRATION POLICY

Every schema change

↓

New migration

↓

Version increment

↓

Integrity verification

↓

Backup

↓

Deployment

Schema must never be modified manually.

---

END OF PART 6

---

# 27. API SPECIFICATION

The Backend exposes a RESTful JSON API.

Every endpoint is versioned.

Base URL

/api/v1

All responses use UTF-8 encoded JSON.

Every response follows the same structure.

---

# 27.1 SUCCESS RESPONSE

Every successful request returns

{
    success: true,
    data: ...,
    meta: { },
    errors: null
}

Never return different success formats.

---

# 27.2 ERROR RESPONSE

Every failed request returns

{
    success: false,
    data: null,
    errors: {
        code: "...",
        message: "...",
        details: [...]
    }
}

Stack traces are never exposed.

---

# 27.3 ASSET ENDPOINTS

GET

/assets

Returns paginated asset list.

Supports

Search

Sorting

Filtering

Pagination

--------------------------------

GET

/assets/{id}

Returns one asset.

--------------------------------

POST

/assets

Creates asset.

--------------------------------

PUT

/assets/{id}

Updates asset.

--------------------------------

DELETE

/assets/{id}

Soft delete.

--------------------------------

GET

/assets/search

Search assets from

Database

↓

Provider

---

# 27.4 TRANSACTION ENDPOINTS

GET

/transactions

Supports

Pagination

Sorting

Filtering

Date Range

Ticker

Currency

Type

--------------------------------

GET

/transactions/{id}

--------------------------------

POST

/transactions

--------------------------------

PUT

/transactions/{id}

--------------------------------

DELETE

/transactions/{id}

Soft delete.

--------------------------------

POST

/transactions/import

Import transactions from CSV (Version 1).

Requires preview and user confirmation before commit.

Import is transactional — all or nothing.

--------------------------------

GET

/transactions/export

---

# 27.5 PORTFOLIO ENDPOINTS

GET

/portfolio

Portfolio Summary

--------------------------------

GET

/portfolio/positions

--------------------------------

GET

/portfolio/allocation

--------------------------------

GET

/portfolio/performance

--------------------------------

GET

/portfolio/history

---

# 27.6 MARKET DATA

GET

/prices/current

--------------------------------

GET

/prices/history

--------------------------------

POST

/prices/refresh

--------------------------------

GET

/providers/status

--------------------------------

GET

/providers/health

---

# 27.7 REPORTS

GET

/reports/portfolio

GET

/reports/performance

GET

/reports/tax

GET

/reports/dividend

GET

/reports/export/pdf

GET

/reports/export/excel

GET

/reports/export/csv

---

# 27.8 SETTINGS

GET

/settings

PUT

/settings

POST

/settings/reset

---

# 27.9 BACKUP

POST

/backup

GET

/backup/list

POST

/backup/restore

DELETE

/backup/{id}

---

# 27.10 HEALTH

GET

/health

Returns

Application

Database

Cache

Providers

Disk

Memory

Version

---

# 27.11 VALIDATION

Every request validates

Headers

↓

Parameters

↓

Body

↓

Business Rules

Invalid requests never reach business logic.

---

# 27.12 PAGINATION

Every collection supports

page

pageSize

sort

order

search

filter

Responses include

total

page

pageSize

totalPages

---

# 27.13 VERSIONING

Breaking changes

↓

New API Version

Never break existing endpoints.

---

# 27.14 RATE LIMITING

Version 1 runs locally with a single user.

Rate limiting is optional in Version 1 but the response format (429, Retry-After) must be implemented for future multi-user readiness.

Default local deployment may disable strict limits.

---

# 27.15 SEARCH

GET

/search

Global search across assets, transactions, and settings.

Query parameters

q (required)

type (optional: asset | transaction | all)

limit (optional, default 20)

Results grouped by category.

---

# 27.16 CACHING

Read

↓

Memory Cache

↓

SQLite Cache

↓

External Provider

Cache invalidation must be automatic.

---

# 27.17 API DOCUMENTATION

Every endpoint documents

Purpose

Parameters

Body

Response

Status Codes

Examples

Error Cases

OpenAPI generation should be supported.

---

END OF PART 7


---

# 28. USER INTERFACE SPECIFICATION

The User Interface must prioritize

Clarity

↓

Consistency

↓

Speed

↓

Accessibility

↓

Visual Quality

The interface exists to help users make financial decisions quickly.

Every screen must have a clear purpose.

---

# 28.1 DESIGN PRINCIPLES

The interface must be

Minimal

Professional

Responsive

Accessible

Consistent

Predictable

Fast

Animations must be subtle.

Decoration must never reduce usability.

---

# 28.2 DESIGN SYSTEM

Framework

Material Design 3

Theme

Material UI

Supported Themes

Light

Dark

System

Every component must support every theme.

---

# 28.3 LAYOUT

Application Layout

Header

↓

Sidebar

↓

Content

↓

Footer

The layout remains consistent across the application.

---

# 28.4 HEADER

The Header contains

Application Logo

Current Page

Global Search

Quick Actions

Theme Switch

Settings

Notification Area (future)

Header height remains fixed.

---

# 28.5 SIDEBAR

Navigation

Dashboard

Portfolio

Transactions

Assets

Reports

Import

Export

Backup

Settings

Sidebar must support collapse.

Icons remain visible when collapsed.

---

# 28.6 DASHBOARD

Dashboard contains

Portfolio Summary

Performance

Allocation

Recent Transactions

Cash Position

Market Status

Quick Actions

Every widget loads independently.

---

# 28.7 PORTFOLIO PAGE

Contains

Portfolio Summary

Current Positions

Performance

Allocation

Filters

Sorting

Pagination

Position Details

Charts

Portfolio calculations never occur in the UI.

---

# 28.8 TRANSACTION PAGE

Contains

Transaction Table

Search

Advanced Filters

Bulk Actions

Create

Edit

Delete

Restore

Import

Export

All destructive actions require confirmation.

---

# 28.9 ASSET PAGE

Contains

Search

Filters

Asset Table

Details

Provider Information

Market Information

No portfolio calculations.

---

# 28.10 REPORT PAGE

Contains

Report Selector

Parameters

Preview

Export

History

Generation Status

Large reports should execute asynchronously.

---

# 28.11 SETTINGS PAGE

Sections

General

Appearance

Currency

Providers

Database

Backup

Advanced

Developer

Every change must be validated before saving.

---

# 28.12 TABLES

Every table supports

Sorting

Filtering

Pagination

Column Visibility

Column Resize (future)

Export

Keyboard Navigation

Sticky Headers

Virtual Scrolling for large datasets.

---

# 28.13 FORMS

Every form provides

Inline Validation

Error Messages

Required Field Indicators

Reset

Submit

Cancel

Unsaved Changes Warning

---

# 28.14 SEARCH

Global Search

Supports

Ticker

Asset Name

Transaction

Report

Settings

Results grouped by category.

---

# 28.15 LOADING STATES

Every asynchronous operation displays

Skeleton

↓

Progress Indicator

↓

Completed State

Never leave the user without feedback.

---

# 28.16 EMPTY STATES

Every screen defines

Empty Portfolio

No Results

No Internet

No Transactions

No Assets

Every empty state explains the next recommended action.

---

# 28.17 ERROR STATES

Every error screen includes

Clear Explanation

Recovery Action

Retry Button

Technical details remain hidden from end users.

---

# 28.18 RESPONSIVENESS

Supported

Desktop

Laptop

Tablet

Mobile

Desktop remains the primary experience.

---

# 28.19 ACCESSIBILITY

Support

Keyboard Navigation

Visible Focus

Screen Readers

ARIA Labels

High Contrast

WCAG AA compatibility target.

---

# 28.20 NOTIFICATIONS

Use Snackbar notifications.

Levels

Success

Information

Warning

Error

Never use browser alert dialogs.

---

# 28.21 CHARTS

Library

Recharts

Supported

Line

Area

Bar

Pie

Donut

Heatmap (future)

Charts receive prepared data.

Charts never perform business calculations.

---

# 28.22 ICONOGRAPHY

Use one icon library.

Material Symbols only.

Avoid mixing icon styles.

---

# 28.23 UI PERFORMANCE

Target

Initial Render

< 2 seconds

Navigation

< 200 ms

Table Filtering

< 100 ms

Large tables use virtualization.

---

END OF PART 8


---

# 29. SOFTWARE ARCHITECTURE

This chapter defines the software architecture.

Every implementation must follow these rules.

Architecture has higher priority than implementation convenience.

If code conflicts with architecture,

Architecture wins.

---

# 29.1 ARCHITECTURE STYLE

The application follows

Clean Architecture

Feature-Based Architecture

Layered Architecture

SOLID Principles

Dependency Injection

Composition over Inheritance

The architecture must remain stable throughout the project's lifetime.

---

# 29.2 PROJECT STRUCTURE

portfolio-tracker/

apps/

web/

api/

packages/

shared/

ui/

config/

docs/

docker/

scripts/

.github/

Every directory has a single responsibility.

---

# 29.3 FRONTEND STRUCTURE

apps/web/src/

app/

pages/

features/

components/

layouts/

hooks/

providers/

services/

theme/

routes/

types/

constants/

utils/

assets/

styles/

Business logic belongs only inside feature modules.

---

# 29.4 FEATURE STRUCTURE

Every feature follows the same structure.

feature/

components/

hooks/

services/

repositories/

validators/

dto/

types/

utils/

tests/

index.ts

Every feature must be self-contained.

---

# 29.5 BACKEND STRUCTURE

apps/api/src/

config/

controllers/

services/

repositories/

providers/

routes/

middleware/

validators/

database/

cache/

jobs/

errors/

types/

utils/

Application bootstrap remains isolated.

---

# 29.6 LAYER RESPONSIBILITIES

Presentation Layer

Displays information.

Collects user input.

Never performs calculations.

Business Layer

Contains all business rules.

Coordinates workflows.

Infrastructure Layer

Handles database.

External providers.

Filesystem.

Network.

Domain Layer

Contains financial models.

Business entities.

Value objects.

No layer may violate these responsibilities.

---

# 29.7 DEPENDENCY FLOW

Presentation

↓

Application

↓

Domain

↓

Infrastructure

Dependencies only point downward.

Circular dependencies are forbidden.

---

# 29.8 CONTROLLERS

Controllers

Receive request

Validate input

Call service

Return response

Controllers never

Access database

Calculate financial values

Call external providers directly

---

# 29.9 SERVICES

Services contain

Business rules

Workflow orchestration

Validation

Coordination

Services never know HTTP.

Services never know UI.

---

# 29.10 REPOSITORIES

Repositories

Persist data

Retrieve data

Execute queries

Nothing else.

Repositories never contain business rules.

---

# 29.11 PROVIDERS

Providers communicate with external systems.

Examples

Yahoo Finance

Finnhub

TCMB

Polygon

Alpha Vantage

Provider responses must always be normalized.

Normalized provider output (packages/shared)

Every market data provider returns data mapped to these shapes before entering business logic:

NormalizedPrice

- assetId or ticker + market
- price (number)
- currency (ISO 4217)
- timestamp (ISO 8601)
- provider (string)

NormalizedExchangeRate

- baseCurrency
- targetCurrency
- rate (number)
- timestamp
- provider

NormalizedInflation

- country
- year
- month
- inflationRate (number)
- source

Providers never expose raw third-party response objects to services.

---

# 29.12 SHARED PACKAGE

The shared package contains

Common Types

Common Errors

Utilities

Result Objects

Validators

Constants

Business-independent code only.

---

# 29.13 UI PACKAGE

Reusable UI only.

Buttons

Inputs

Dialogs

Cards

Tables

Charts

Icons

Layout Components

No business-specific components.

---

# 29.14 IMPORT RULES

Use package aliases.

Avoid long relative imports.

Example

@shared

@ui

@app

@features

@utils

Internal implementation files must never be imported directly.

---

# 29.15 CONFIGURATION

Configuration is centralized.

Application code never reads

process.env

directly.

Configuration is injected through typed configuration services.

---

# 29.16 ERROR HANDLING

Every layer returns predictable errors.

Errors move upward.

Infrastructure

↓

Application

↓

Presentation

Raw errors must never reach users.

---

# 29.17 LOGGING

Logging is centralized.

Every important operation records

Timestamp

Module

Severity

Message

Context

Sensitive information must never be logged.

---

# 29.18 BACKGROUND JOBS

Background jobs execute independently.

Examples

Price synchronization

Backup

Cache cleanup

Inflation updates

Jobs must never block user requests.

---

# 29.19 EXTENSIBILITY

Every module should be replaceable.

Replacing

SQLite

↓

PostgreSQL

must require minimal changes.

Replacing a market data provider must not affect business logic.

---

# 29.20 ARCHITECTURAL RULES

Never duplicate business rules.

Never bypass layers.

Never create hidden dependencies.

Never couple UI to database.

Never mix presentation with calculations.

Keep modules independent.

Prefer composition over inheritance.

---

END OF PART 9


---

# 30. SECURITY SPECIFICATION

Security is mandatory.

Every feature must be secure by default.

Security is considered during

Design

↓

Implementation

↓

Testing

↓

Deployment

No feature is exempt.

---

# 30.1 SECURITY PRINCIPLES

The application follows

Least Privilege

Defense in Depth

Zero Trust

Secure by Default

Fail Secure

Never trust external input.

---

# 30.2 INPUT VALIDATION

Validate every

Request

Query Parameter

Route Parameter

Form Field

CSV Import

Excel Import

Configuration

Provider Response

Validation occurs before business logic.

---

# 30.3 SQL SECURITY

All database queries

Use prepared statements.

Never concatenate SQL strings.

Repositories are the only layer allowed to execute SQL.

SQL Injection must be impossible.

---

# 30.4 OUTPUT ENCODING

Never render untrusted HTML.

Escape user-generated content.

Prevent Cross-Site Scripting (XSS).

---

# 30.5 FILE SECURITY

Allowed import formats

CSV

XLSX

JSON

Every imported file must be

Validated

Scanned

Parsed safely

Unexpected formats are rejected.

---

# 30.6 SECRET MANAGEMENT

Never hardcode

API Keys

Tokens

Passwords

Secrets

Use

Environment Variables

Configuration Services

Secrets are never committed to Git.

---

# 30.7 EXTERNAL PROVIDERS

Every provider request uses

Timeout

Retry Policy

Validation

Rate Limiting

Response Normalization

External data is never trusted.

---

# 30.8 LOGGING

Logs must never contain

Passwords

API Keys

Access Tokens

Sensitive Personal Information

Secrets must always be masked.

---

# 30.9 BACKUP SECURITY

Backups must contain

Checksum

Creation Date

Version

Integrity Status

Restore must verify integrity before execution.

---

# 30.10 RESTORE SECURITY

Restore process

Validate Backup

↓

Verify Checksum

↓

Create Temporary Database

↓

Run Integrity Check

↓

Replace Active Database

Never overwrite production data without validation.

---

# 30.11 DEPENDENCY SECURITY

Every dependency must be

Maintained

Trusted

Actively Supported

Security updates must be applied regularly.

Unused dependencies must be removed.

---

# 30.12 APPLICATION PERMISSIONS

The application accesses only

Database

Configuration

Cache

Logs

Backups

No unnecessary filesystem access.

---

# 30.13 ERROR HANDLING

Users receive

Readable Messages

Developers receive

Detailed Logs

Stack traces are never exposed publicly.

---

# 30.14 OFFLINE SECURITY

Offline mode must never reduce security.

Loss of internet connectivity must not expose or corrupt local data.

---

# 30.15 FUTURE AUTHENTICATION

Version 1

Single-user application.

Authentication is intentionally excluded.

Architecture must allow future addition of

Authentication

Authorization

Role-Based Access Control

without major refactoring.

---

# 30.16 SECURITY AUDIT

Every release verifies

Input Validation

SQL Injection Protection

XSS Protection

Dependency Vulnerabilities

Backup Integrity

Restore Procedure

Configuration Security

Environment Variables

Security verification is part of the release process.

---

END OF PART 10

---

# 31. TESTING STRATEGY

Testing is mandatory.

A feature is complete only when it passes all required tests.

---

# 31.1 TEST PYRAMID

Unit Tests

↓

Integration Tests

↓

End-to-End Tests

Business logic receives the highest test coverage.

---

# 31.2 UNIT TESTS

Every financial calculation must have

Deterministic tests

Edge case tests

Regression tests

Examples

Average Cost

Realized Profit

Portfolio Allocation

Inflation Adjustment

Currency Conversion

---

# 31.3 INTEGRATION TESTS

Verify interaction between

API

↓

Services

↓

Repositories

↓

Database

Real workflows must be tested.

---

# 31.4 END-TO-END TESTS

Critical workflows include

Create Asset

↓

Create Transaction

↓

Portfolio Update

↓

Price Refresh

↓

Generate Report

↓

Export

The workflow must succeed without manual intervention.

---

# 31.5 PERFORMANCE TESTS

Verify

Large Portfolios

Large Transaction History

Large Reports

Slow Providers

Low Memory Conditions

Performance degradation must remain predictable.

---

# 31.6 REGRESSION TESTS

Every fixed bug

↓

New Regression Test

The same bug must never reappear unnoticed.

---

# 31.7 COVERAGE TARGETS

Business Logic

95%

Services

90%

Repositories

90%

Utilities

95%

Coverage percentage alone is not sufficient.

Test quality is more important than quantity.

---

# 31.8 TEST ENVIRONMENTS

Development

Testing

CI

Each environment remains isolated.

Production data is never used during automated testing.

---

# 31.9 RELEASE QUALITY GATE

No release is allowed unless

Build succeeds

Lint succeeds

Tests succeed

Coverage acceptable

Security checks pass

Documentation updated

---

END OF PART 11

---

# 32. DEPLOYMENT & OPERATIONS

The application must be deployable using a single documented procedure.

Deployments must be

Repeatable

Deterministic

Reversible

Observable

No manual source code changes are allowed during deployment.

---

# 32.1 ENVIRONMENTS

Supported environments

Development

Testing

Staging

Production

Each environment uses its own configuration.

Data must never be shared between environments.

---

# 32.2 BUILD PROCESS

Every release follows

Install Dependencies

↓

Type Check

↓

Lint

↓

Unit Tests

↓

Integration Tests

↓

Production Build

↓

Artifact Generation

↓

Release

A failed step immediately stops the pipeline.

---

# 32.3 DOCKER

The application must run with

docker compose up

Required services

Frontend (nginx or Vite preview serving static build)

Backend (Express API + SQLite)

SQLite is embedded in the Backend service — not a separate database container.

Persist the SQLite file using a named Docker volume mounted to the backend data directory.

Optional future services

Redis

Nginx (reverse proxy)

Workers

Every container defines

Health Check

Restart Policy

Resource Limits

---

# 32.4 BACKUP STRATEGY

Automatic

Daily

Before every migration

Before every restore

Manual backups supported.

Every backup must be restorable.

---

# 32.5 MONITORING

Monitor

Application Status

Database Health

Provider Health

Memory Usage

CPU Usage

Disk Usage

Backup Status

Unexpected Errors

Critical failures generate structured logs.

---

# 32.6 DISASTER RECOVERY

Recovery procedure

Detect failure

↓

Restore latest verified backup

↓

Run integrity check

↓

Restart services

↓

Validate application

Recovery procedure must be documented and tested.

---

# 32.7 RELEASE MANAGEMENT

Every release includes

Semantic Version

Release Notes

Migration Version

Database Version

Known Issues

Rollback Instructions

No release is considered complete without documentation.

---

END OF PART 12

---

# 33. AI DEVELOPMENT WORKFLOW

The AI is treated as a software engineering team.

Every implementation follows the same workflow.

---

# 33.1 EXECUTION FLOW

Repository Analysis

↓

Architecture Review

↓

Task Planning

↓

Implementation

↓

Self Review

↓

Refactoring

↓

Testing

↓

Verification

↓

Stop

The AI must never skip steps.

---

# 33.2 IMPLEMENTATION RULES

Before modifying code

Understand existing implementation.

Reuse existing abstractions.

Avoid duplication.

Keep changes minimal.

Never rewrite working modules without necessity.

---

# 33.3 CODE REVIEW

Every completed task is reviewed for

Architecture

Readability

Performance

Security

Maintainability

Consistency

No task is complete without review.

---

# 33.4 REFACTORING

Refactoring is allowed only when

Behavior remains unchanged.

Architecture improves.

Complexity decreases.

No hidden functionality is introduced.

---

# 33.5 STOP CONDITION

When the assigned task is complete

Stop immediately.

Do not implement additional features.

Wait for the next execution task.

---

END OF PART 13

---

# 34. DEVELOPMENT ROADMAP

Phase 1

Project Foundation

Architecture

Infrastructure

Database

Frontend Foundation

Backend Foundation

Completed before business modules.

---

Phase 2

Asset Management

Transaction Engine

Portfolio Engine

Market Data Engine

Calculation Engine

Core business functionality.

---

Phase 3

Dashboard

Reports

Import

Export

Settings

Backup

Restore

Complete user functionality.

---

Phase 4

Optimization

Performance

Security Review

Accessibility

Documentation

Release Preparation

Production readiness.

---

Phase 5

Future Versions

Authentication

Cloud Sync

Broker Integrations

Mobile Application

AI Assistant

Multi-user Support

Advanced Analytics

These features remain outside Version 1.

---

END OF PART 14

---

# 35. ACCEPTANCE CRITERIA

Version 1 is complete only when

Application builds successfully.

All automated tests pass.

Database migrations succeed.

Portfolio calculations match expected results.

Reports generate correctly.

Import and export work.

Backup and restore are verified.

Performance targets are met.

Security checks pass.

Documentation is complete.

Docker deployment works.

No critical known defects remain.

Only then may Version 1 be released.

---

# 36. GLOSSARY

Asset

A financial instrument tracked by the application.

Transaction

A financial event affecting the portfolio.

Position

The current holding derived from transactions.

Cost Basis

Total invested amount including purchase costs.

Realized Profit

Profit from completed sales.

Unrealized Profit

Profit or loss on current holdings.

Base Currency

The primary currency used for reporting.

Provider

An external service supplying market data.

Portfolio

The complete set of current positions and cash balances.

---

END OF MASTER_SPEC.md