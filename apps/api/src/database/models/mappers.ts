import type {
  Asset,
  AssetRow,
  BackupHistoryRow,
  CashAccountRow,
  DatabaseMetadataRow,
  ExchangeRateRow,
  InflationHistoryRow,
  PortfolioPositionRow,
  PriceHistoryRow,
  ProviderRow,
  SchemaMigrationRow,
  SettingRow,
  Transaction,
  TransactionRow
} from "./types";

export function mapAssetRowToDomain(row: AssetRow): Asset {
  return {
    id: row.id,
    ticker: row.ticker,
    displayName: row.display_name,
    market: row.market,
    assetType: row.asset_type,
    currency: row.currency,
    provider: row.provider,
    isin: row.isin,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

export function mapAssetDomainToRow(asset: Asset): AssetRow {
  return {
    id: asset.id,
    ticker: asset.ticker,
    display_name: asset.displayName,
    market: asset.market,
    asset_type: asset.assetType,
    currency: asset.currency,
    provider: asset.provider,
    isin: asset.isin,
    status: asset.status,
    created_at: asset.createdAt,
    updated_at: asset.updatedAt,
    deleted_at: asset.deletedAt
  };
}

export function mapTransactionRowToDomain(row: TransactionRow): Transaction {
  return {
    id: row.id,
    assetId: row.asset_id,
    transactionType: row.transaction_type,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    commission: row.commission,
    tax: row.tax,
    currency: row.currency,
    exchangeRate: row.exchange_rate,
    tradeDate: row.trade_date,
    settlementDate: row.settlement_date,
    broker: row.broker,
    account: row.account,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at
  };
}

export function mapTransactionDomainToRow(transaction: Transaction): TransactionRow {
  return {
    id: transaction.id,
    asset_id: transaction.assetId,
    transaction_type: transaction.transactionType,
    quantity: transaction.quantity,
    unit_price: transaction.unitPrice,
    commission: transaction.commission,
    tax: transaction.tax,
    currency: transaction.currency,
    exchange_rate: transaction.exchangeRate,
    trade_date: transaction.tradeDate,
    settlement_date: transaction.settlementDate,
    broker: transaction.broker,
    account: transaction.account,
    notes: transaction.notes,
    created_at: transaction.createdAt,
    updated_at: transaction.updatedAt,
    deleted_at: transaction.deletedAt
  };
}

export function mapPortfolioPositionRow(row: PortfolioPositionRow): PortfolioPositionRow {
  return { ...row };
}

export function mapPriceHistoryRow(row: PriceHistoryRow): PriceHistoryRow {
  return { ...row };
}

export function mapExchangeRateRow(row: ExchangeRateRow): ExchangeRateRow {
  return { ...row };
}

export function mapInflationHistoryRow(row: InflationHistoryRow): InflationHistoryRow {
  return { ...row };
}

export function mapCashAccountRow(row: CashAccountRow): CashAccountRow {
  return { ...row };
}

export function mapProviderRow(row: ProviderRow): ProviderRow {
  return { ...row };
}

export function mapSettingRow(row: SettingRow): SettingRow {
  return { ...row };
}

export function mapDatabaseMetadataRow(row: DatabaseMetadataRow): DatabaseMetadataRow {
  return { ...row };
}

export function mapBackupHistoryRow(row: BackupHistoryRow): BackupHistoryRow {
  return { ...row };
}

export function mapSchemaMigrationRow(row: SchemaMigrationRow): SchemaMigrationRow {
  return { ...row };
}
