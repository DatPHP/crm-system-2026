import { test, expect } from "@playwright/test";

test.describe("Products", () => {
  test("should show products page", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/products/);
    await expect(page.locator("h1")).toContainText("Products");
    await expect(
      page.getByRole("button", { name: /add product/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("should open and close add product form", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Open form
    await page.getByRole("button", { name: /add product/i }).click();
    await expect(page.locator("text=New Product")).toBeVisible({
      timeout: 5000,
    });

    // Form fields hiện đủ
    await expect(page.locator("input[placeholder]").first()).toBeVisible();

    // Cancel
    await page.getByRole("button", { name: /cancel/i }).click();
    await expect(page.locator("text=New Product")).not.toBeVisible();
  });

  test("should search products with debounce", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.waitFor({ state: "visible", timeout: 5000 });

    await searchInput.fill("iphone");
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Table vẫn render
    await expect(page.locator("table")).toBeVisible();
  });

  test("should show pagination or empty/data state", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    const showingText = await page
      .locator("text=Showing")
      .isVisible()
      .catch(() => false);
    const noDataText = await page
      .locator("text=No data found")
      .isVisible()
      .catch(() => false);
    const tableExists = await page
      .locator("table")
      .isVisible()
      .catch(() => false);

    expect(showingText || noDataText || tableExists).toBeTruthy();
  });

  test("should show export dropdown", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // ExportButton component — button có Download icon + text "Export"
    const exportBtn = page.getByRole("button", { name: /export/i });
    await expect(exportBtn).toBeVisible({ timeout: 5000 });

    // Click để mở dropdown
    await exportBtn.click();
    await page.waitForTimeout(300);

    // Dropdown hiện options
    await expect(page.locator("text=Excel")).toBeVisible({ timeout: 3000 });
  });

  test("should be responsive on mobile", async ({ page }) => {
    await page.goto("/products");
    await page.waitForLoadState("networkidle");

    // Verify ở products trước
    await expect(page.locator("h1")).toContainText("Products");

    // Đổi viewport
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);

    // Layout vẫn đúng
    await expect(page.locator("h1")).toContainText("Products");
    await expect(
      page.getByRole("button", { name: /add product/i }),
    ).toBeVisible({ timeout: 5000 });
  });
});
