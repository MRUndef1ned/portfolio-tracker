import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@portfolio-tracker/shared": path.resolve(__dirname, "packages/shared/src"),
      "@portfolio-tracker/config": path.resolve(__dirname, "packages/config/src")
    }
  },
  test: {
    include: ["apps/api/src/**/*.test.ts"]
  }
});
