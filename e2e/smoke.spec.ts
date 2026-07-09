import { expect, test } from "@playwright/test";

test("loads dashboard and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Portfolio Tracker")).toBeVisible();
  await page.getByRole("link", { name: "Assets" }).click();
  await expect(page.getByText("Add Asset")).toBeVisible();
  await page.getByRole("link", { name: "Transactions" }).click();
  await expect(page.getByText("Add Transaction")).toBeVisible();
});
