import { test, expect } from "@playwright/test";

test.describe("Notifications UI & Interactions", () => {
  test("should show empty notifications state", async ({ page }) => {
    // Intercept notifications API call and return empty list
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ notifications: [], unreadCount: 0 }),
      });
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Locating the Bell icon button (title="Notifications")
    const bellBtn = page.locator('button[title="Notifications"]');
    await expect(bellBtn).toBeVisible({ timeout: 15000 });

    // Badge should not be visible (no text in bellBtn's absolute span if count is 0)
    const badge = bellBtn.locator("span");
    await expect(badge).not.toBeVisible();

    // Open the dropdown
    await bellBtn.click();

    // Verify header title
    await expect(page.locator("span:has-text('Notifications')")).toBeVisible();
    // Verify empty state
    await expect(page.locator("text=No notifications yet")).toBeVisible();
  });

  test("should show notifications list and mark as read", async ({ page }) => {
    let markReadCalled = false;

    // Intercept notifications GET
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          notifications: [
            {
              id: 1,
              title: "New Order",
              message: "Order ORD-001 has been created",
              type: "order_created",
              isRead: false,
              createdAt: new Date().toISOString(),
              metadata: { orderId: 101 },
            },
            {
              id: 2,
              title: "Paid Order",
              message: "Order ORD-002 has been paid",
              type: "order_paid",
              isRead: true,
              createdAt: new Date().toISOString(),
              metadata: { orderId: 102 },
            },
          ],
          unreadCount: 1,
        }),
      });
    });

    // Intercept PATCH for marking as read
    await page.route("**/api/notifications/1/read", async (route) => {
      markReadCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 1 }),
      });
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const bellBtn = page.locator('button[title="Notifications"]');
    await expect(bellBtn).toBeVisible({ timeout: 15000 });

    // Badge showing unread count
    const badge = bellBtn.locator("span");
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText("1");

    // Click bell to open
    await bellBtn.click();

    // Verify unread badge in header
    await expect(page.locator("text=1 new")).toBeVisible();

    // Verify notifications items
    await expect(
      page.locator("text=Order ORD-001 has been created"),
    ).toBeVisible();
    await expect(
      page.locator("text=Order ORD-002 has been paid"),
    ).toBeVisible();

    // Click the unread notification
    await page.locator("text=Order ORD-001 has been created").click();

    // Check it calls the read API
    await page.waitForTimeout(500);
    expect(markReadCalled).toBe(true);

    // Click should also navigate to the order page
    await expect(page).toHaveURL(/orders\/101/);
  });

  test("should mark all as read and clear read notifications", async ({
    page,
  }) => {
    let markAllReadCalled = false;
    let clearReadCalled = false;

    // Intercept notifications GET
    await page.route("**/api/notifications", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          notifications: [
            {
              id: 1,
              title: "New Order",
              message: "Order ORD-001 has been created",
              type: "order_created",
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              title: "Paid Order",
              message: "Order ORD-002 has been paid",
              type: "order_paid",
              isRead: true,
              createdAt: new Date().toISOString(),
            },
          ],
          unreadCount: 1,
        }),
      });
    });

    // Intercept mark-all-as-read
    await page.route("**/api/notifications/read-all", async (route) => {
      markAllReadCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 1 }),
      });
    });

    // Intercept clear-read
    await page.route("**/api/notifications/clear/read", async (route) => {
      clearReadCalled = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ count: 1 }),
      });
    });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const bellBtn = page.locator('button[title="Notifications"]');
    await bellBtn.click();

    // Click "Mark all as read" button
    const markAllBtn = page.locator('button[title="Mark all as read"]');
    await expect(markAllBtn).toBeVisible();
    await markAllBtn.click();
    await page.waitForTimeout(300);
    expect(markAllReadCalled).toBe(true);

    // Click "Clear read" button
    const clearReadBtn = page.locator('button[title="Clear read"]');
    await expect(clearReadBtn).toBeVisible();
    await clearReadBtn.click();
    await page.waitForTimeout(300);
    expect(clearReadCalled).toBe(true);
  });
});
