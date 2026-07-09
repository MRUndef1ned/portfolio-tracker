export interface AssetRow {
  id: number;
  ticker: string;
  display_name: string;
  market: string;
  asset_type: string;
  currency: string;
  provider: string | null;
  isin: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TransactionRow {
  id: number;
  asset_id: number;
  transaction_type: string;
  quantity: number;
  unit_price: number;
  commission: number;
  tax: number;
  currency: string;
  exchange_rate: number;
  trade_date: string;
  settlement_date: string | null;
  broker: string | null;
  account: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PortfolioPositionRow {
  id: number;
  asset_id: number;
  quantity: number;
  average_cost: number;
  cost_basis: number;
  market_price: number | null;
  market_value: number | null;
  realized_profit: number;
  unrealized_profit: number;
  allocation: number | null;
  updated_at: string;
}

export interface PriceHistoryRow {
  id: number;
  asset_id: number;
  provider: string;
  price: number;
  currency: string;
  timestamp: string;
}

export interface ExchangeRateRow {
  id: number;
  base_currency: string;
  target_currency: string;
  rate: number;
  provider: string;
  timestamp: string;
}

export interface InflationHistoryRow {
  id: number;
  country: string;
  year: number;
  month: number;
  inflation_rate: number;
  source: string;
  updated_at: string;
}

export interface CashAccountRow {
  id: number;
  account_name: string;
  currency: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface ProviderRow {
  id: number;
  provider_name: string;
  priority: number;
  enabled: number;
  timeout: number;
  retry_count: number;
  cache_duration: number;
  last_health_check: string | null;
  status: string;
}

export interface SettingRow {
  key: string;
  value: string;
  type: string;
  updated_at: string;
}

export interface ApplicationLogRow {
  id: number;
  level: string;
  source: string;
  message: string;
  context: string | null;
  timestamp: string;
}

export interface AuditLogRow {
  id: number;
  entity: string;
  entity_id: string;
  operation: string;
  previous_value: string | null;
  new_value: string | null;
  timestamp: string;
}

export interface DatabaseMetadataRow {
  id: number;
  schema_version: string;
  application_version: string;
  created_at: string;
  last_backup: string | null;
  last_migration: string | null;
  integrity_status: string;
}

export interface BackupHistoryRow {
  id: number;
  backup_name: string;
  backup_date: string;
  backup_size: number;
  checksum: string;
  restore_verified: number;
  status: string;
}

export interface SchemaMigrationRow {
  id: number;
  version: string;
  name: string;
  applied_at: string;
  checksum: string;
}

export interface Asset {
  id: number;
  ticker: string;
  displayName: string;
  market: string;
  assetType: string;
  currency: string;
  provider: string | null;
  isin: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Transaction {
  id: number;
  assetId: number;
  transactionType: string;
  quantity: number;
  unitPrice: number;
  commission: number;
  tax: number;
  currency: string;
  exchangeRate: number;
  tradeDate: string;
  settlementDate: string | null;
  broker: string | null;
  account: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
