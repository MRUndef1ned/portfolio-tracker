import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  retries: 1,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "pnpm dev:api",
      url: "http://localhost:3000/api/v1/health",
      timeout: 120_000,
      reuseExistingServer: true
    },
    {
      command: "pnpm dev:web",
      url: "http://localhost:5173",
      timeout: 120_000,
      reuseExistingServer: true
    }
  ]
});
