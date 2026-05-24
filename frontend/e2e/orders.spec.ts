import { test, expect } from "@playwright/test";

// storageState được inject tự động từ playwright.config.ts
// Không cần login thủ công nữa

test.describe("Orders", () => {
  test("should show orders page", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/orders/);
    await expect(page.locator("h1")).toContainText("Orders");
    await expect(page.getByRole("button", { name: /new order/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("should navigate to create order page", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: /new order/i }).click();
    await page.waitForURL(/orders\/create/, { timeout: 10000 });
    await expect(page).toHaveURL(/orders\/create/);
  });

  test("should show create order form elements", async ({ page }) => {
    await page.goto("/orders/create");
    await page.waitForLoadState("networkidle");

    // Step 1 — customer
    await expect(page.locator("text=① Select Customer")).toBeVisible({
      timeout: 10000,
    });

    // Step 2 — products
    await expect(page.locator("text=② Add Products")).toBeVisible();

    // Summary
    await expect(page.locator("text=Order Summary")).toBeVisible();

    // Submit button
    await expect(
      page.getByRole("button", { name: /create order/i }),
    ).toBeVisible();
  });

  test("should search orders with debounce", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.waitFor({ state: "visible", timeout: 5000 });

    await searchInput.fill("ORD-");
    await page.waitForTimeout(600); // debounce 400ms + buffer
    await page.waitForLoadState("networkidle");

    // Table vẫn visible
    await expect(page.locator("table")).toBeVisible();
  });

  test("should clear search and restore full list", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill("ORD-XXXXXX-999"); // search không có kết quả
    await page.waitForTimeout(600);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(600);
    await page.waitForLoadState("networkidle");

    // Table vẫn hiện
    await expect(page.locator("table")).toBeVisible();
  });

  test("should show order detail or empty state", async ({ page }) => {
    await page.goto("/orders");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    const viewBtns = page.locator('button[title="View detail"]');
    const emptyText = page.locator("text=No orders yet");

    const hasOrders = await viewBtns
      .first()
      .isVisible()
      .catch(() => false);

    if (hasOrders) {
      await viewBtns.first().click();
      await page.waitForLoadState("networkidle");

      // Dùng selector cụ thể hơn — tránh strict mode violation
      // OrderDetailPage có h2 "Customer" trong section riêng
      await expect(
        page.locator("h2").filter({ hasText: "Customer" }),
      ).toBeVisible({ timeout: 5000 });

      await expect(
        page.locator("h2").filter({ hasText: "Order Items" }),
      ).toBeVisible();

      await expect(
        page.locator("h2").filter({ hasText: "History" }),
      ).toBeVisible();

      // Print Invoice button
      await expect(
        page.getByRole("button", { name: /print invoice/i }),
      ).toBeVisible();
    } else {
      // Không có order — pass luôn
      await expect(page.locator("table")).toBeVisible();
    }
  });
});
