-- Portfolio Tracker initial schema (MASTER_SPEC §26)

CREATE TABLE IF NOT EXISTS assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL,
  display_name TEXT NOT NULL,
  market TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  currency TEXT NOT NULL,
  provider TEXT,
  isin TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  UNIQUE (ticker, market)
);

CREATE INDEX IF NOT EXISTS idx_assets_ticker ON assets (ticker);
CREATE INDEX IF NOT EXISTS idx_assets_market ON assets (market);
CREATE INDEX IF NOT EXISTS idx_assets_asset_type ON assets (asset_type);
CREATE INDEX IF NOT EXISTS idx_assets_currency ON assets (currency);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL,
  transaction_type TEXT NOT NULL,
  quantity REAL NOT NULL,
  unit_price REAL NOT NULL,
  commission REAL NOT NULL DEFAULT 0,
  tax REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL,
  exchange_rate REAL NOT NULL DEFAULT 1,
  trade_date TEXT NOT NULL,
  settlement_date TEXT,
  broker TEXT,
  account TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  deleted_at TEXT,
  FOREIGN KEY (asset_id) REFERENCES assets (id)
);

CREATE INDEX IF NOT EXISTS idx_transactions_asset_id ON transactions (asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_trade_date ON transactions (trade_date);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_type ON transactions (transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_currency ON transactions (currency);

CREATE TABLE IF NOT EXISTS portfolio_positions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  average_cost REAL NOT NULL DEFAULT 0,
  cost_basis REAL NOT NULL DEFAULT 0,
  market_price REAL,
  market_value REAL,
  realized_profit REAL NOT NULL DEFAULT 0,
  unrealized_profit REAL NOT NULL DEFAULT 0,
  allocation REAL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (asset_id) REFERENCES assets (id)
);

CREATE TABLE IF NOT EXISTS price_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  asset_id INTEGER NOT NULL,
  provider TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  FOREIGN KEY (asset_id) REFERENCES assets (id)
);

CREATE INDEX IF NOT EXISTS idx_price_history_asset_id ON price_history (asset_id);
CREATE INDEX IF NOT EXISTS idx_price_history_timestamp ON price_history (timestamp);
CREATE INDEX IF NOT EXISTS idx_price_history_provider ON price_history (provider);

CREATE TABLE IF NOT EXISTS exchange_rates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  base_currency TEXT NOT NULL,
  target_currency TEXT NOT NULL,
  rate REAL NOT NULL,
  provider TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  UNIQUE (base_currency, target_currency, timestamp)
);

CREATE TABLE IF NOT EXISTS inflation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  country TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  inflation_rate REAL NOT NULL,
  source TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (country, year, month)
);

CREATE TABLE IF NOT EXISTS cash_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name TEXT NOT NULL UNIQUE,
  currency TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS providers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  provider_name TEXT NOT NULL UNIQUE,
  priority INTEGER NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  timeout INTEGER NOT NULL DEFAULT 30000,
  retry_count INTEGER NOT NULL DEFAULT 3,
  cache_duration INTEGER NOT NULL DEFAULT 300,
  last_health_check TEXT,
  status TEXT NOT NULL DEFAULT 'unknown'
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'string',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS application_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  context TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  timestamp TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS database_metadata (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  schema_version TEXT NOT NULL,
  application_version TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_backup TEXT,
  last_migration TEXT,
  integrity_status TEXT NOT NULL DEFAULT 'unknown'
);

CREATE TABLE IF NOT EXISTS backup_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  backup_name TEXT NOT NULL,
  backup_date TEXT NOT NULL DEFAULT (datetime('now')),
  backup_size INTEGER NOT NULL,
  checksum TEXT NOT NULL,
  restore_verified INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'created'
);

INSERT OR IGNORE INTO database_metadata (id, schema_version, application_version)
VALUES (1, '001', '0.1.0');
