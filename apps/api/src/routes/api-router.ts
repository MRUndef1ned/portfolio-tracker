import { Router } from "express";
import { z } from "zod";
import { successResponse } from "@portfolio-tracker/shared/api-types";
import type { AppServices } from "../services/app-services";
import { paginationSchema, validateBody, validateQuery } from "../middleware/validate";
import { checkDatabaseHealth } from "../database/health";
import type Database from "better-sqlite3";

const assetSchema = z.object({
  ticker: z.string().min(1),
  displayName: z.string().min(1),
  market: z.string().min(1),
  assetType: z.string().min(1),
  currency: z.string().min(3).max(3),
  provider: z.string().nullable().optional(),
  isin: z.string().nullable().optional(),
  status: z.string().default("active")
});

const transactionSchema = z.object({
  assetId: z.number().int().positive(),
  transactionType: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().nonnegative(),
  commission: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  currency: z.string().min(3).max(3),
  exchangeRate: z.number().positive().default(1),
  tradeDate: z.string().min(1),
  settlementDate: z.string().nullable().optional(),
  broker: z.string().nullable().optional(),
  account: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

const settingsSchema = z.record(z.string());
const importSchema = z.object({ csv: z.string().min(1) });
const restoreSchema = z.object({ fileName: z.string().min(1) });

export function createApiRouter(services: AppServices, db: Database.Database): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    const dbHealth = checkDatabaseHealth(db);
    res.json(
      successResponse({
        application: "ok",
        database: dbHealth.ok ? "ok" : "error",
        diskFreeMb: dbHealth.diskFreeMb,
        integrity: dbHealth.integrity,
        version: "0.1.0"
      })
    );
  });

  router.get("/assets", validateQuery(paginationSchema), (req, res) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const result = services.listAssets(page, pageSize);
    res.json(successResponse(result.items, {
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages
    }));
  });

  router.get("/assets/search", (req, res) => {
    res.json(successResponse(services.searchAssets(String(req.query.q ?? ""))));
  });

  router.get("/assets/:id", (req, res) => {
    res.json(successResponse(services.getAsset(Number(req.params.id))));
  });

  router.post("/assets", validateBody(assetSchema), (req, res) => {
    res.status(201).json(successResponse(services.createAsset(req.body)));
  });

  router.put("/assets/:id", validateBody(assetSchema.partial()), (req, res) => {
    res.json(successResponse(services.updateAsset(Number(req.params.id), req.body)));
  });

  router.delete("/assets/:id", (req, res) => {
    services.deleteAsset(Number(req.params.id));
    res.json(successResponse({ deleted: true }));
  });

  router.get("/transactions", validateQuery(paginationSchema), (req, res) => {
    const { page, pageSize } = paginationSchema.parse(req.query);
    const result = services.listTransactions(page, pageSize);
    res.json(successResponse(result.items, {
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages
    }));
  });

  router.get("/transactions/export", (_req, res) => {
    res.setHeader("content-type", "text/csv; charset=utf-8");
    res.send(services.exportTransactionsCsv());
  });

  router.post("/transactions/import", validateBody(importSchema), (req, res) => {
    res.status(201).json(successResponse(services.importTransactionsCsv(req.body.csv)));
  });

  router.get("/transactions/:id", (req, res) => {
    res.json(successResponse(services.getTransaction(Number(req.params.id))));
  });

  router.post("/transactions", validateBody(transactionSchema), (req, res) => {
    res.status(201).json(successResponse(services.createTransaction(req.body)));
  });

  router.put("/transactions/:id", validateBody(transactionSchema.partial()), (req, res) => {
    res.json(successResponse(services.updateTransaction(Number(req.params.id), req.body)));
  });

  router.delete("/transactions/:id", (req, res) => {
    services.deleteTransaction(Number(req.params.id));
    res.json(successResponse({ deleted: true }));
  });

  router.get("/portfolio", async (_req, res, next) => {
    try {
      res.json(successResponse(await services.getPortfolioSummary()));
    } catch (error) {
      next(error);
    }
  });

  router.get("/portfolio/positions", async (_req, res, next) => {
    try {
      const summary = await services.getPortfolioSummary();
      res.json(successResponse(summary.positions));
    } catch (error) {
      next(error);
    }
  });

  router.get("/reports/portfolio", async (_req, res, next) => {
    try {
      res.json(successResponse(await services.getPortfolioReport()));
    } catch (error) {
      next(error);
    }
  });

  router.get("/reports/performance", async (_req, res, next) => {
    try {
      const report = await services.getPortfolioReport();
      res.json(successResponse({
        totalProfit: report.summary.totalProfit,
        totalReturnPct: report.summary.totalReturnPct,
        positions: report.summary.positions
      }));
    } catch (error) {
      next(error);
    }
  });

  router.get("/reports/export/csv", (_req, res) => {
    res.setHeader("content-type", "text/csv; charset=utf-8");
    res.send(services.exportTransactionsCsv());
  });

  router.get("/reports/export/json", async (_req, res, next) => {
    try {
      res.json(successResponse(await services.getPortfolioReport()));
    } catch (error) {
      next(error);
    }
  });

  router.get("/settings", (_req, res) => {
    res.json(successResponse(services.getSettings()));
  });

  router.put("/settings", validateBody(settingsSchema), (req, res) => {
    res.json(successResponse(services.updateSettings(req.body)));
  });

  router.post("/backup", (_req, res) => {
    res.status(201).json(successResponse(services.createBackup()));
  });

  router.get("/backup/list", (_req, res) => {
    res.json(successResponse(services.listBackups()));
  });

  router.post("/backup/restore", validateBody(restoreSchema), (req, res) => {
    res.json(successResponse(services.restoreBackup(req.body.fileName)));
  });

  router.get("/search", (req, res) => {
    const q = String(req.query.q ?? "");
    res.json(successResponse({
      assets: services.searchAssets(q),
      transactions: services.listTransactions(1, 100).items.filter((tx) =>
        tx.transactionType.toLowerCase().includes(q.toLowerCase())
      )
    }));
  });

  return router;
}
