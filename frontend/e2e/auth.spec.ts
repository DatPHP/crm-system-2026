import { test, expect } from "@playwright/test";
import { TEST_USER, loginManual } from "./helpers/auth.helper";

// Auth tests — một số cần fresh context (không dùng storageState)
test.describe("Authentication", () => {
  test("should show login page", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("h1")).toContainText("CRM Login");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("should show register link", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");
    await page.click('a[href="/register"]');
    await page.waitForURL(/register/);
    await expect(page.locator("h1")).toContainText("Create Account");
    // Có link back to login
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });

  test("should login successfully", async ({ page }) => {
    // storageState đã inject token → đi thẳng tới dashboard
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator("h1")).toContainText("Dashboard");
  });

  test("should show error with wrong password", async ({ browser }) => {
    // Dùng fresh context để tránh storageState
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    try {
      await page.goto("http://localhost:5173/login");
      await page.waitForSelector('input[type="email"]');

      await page.fill('input[type="email"]', TEST_USER.email);
      await page.fill('input[type="password"]', "wrongpassword999");

      const [response] = await Promise.all([
        page.waitForResponse((res) => res.url().includes("/auth/login"), {
          timeout: 15000,
        }),
        page.click('button[type="submit"]'),
      ]);

      // API phải trả 401
      expect(response.status()).toBe(401);

      // Vẫn ở trang login
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/login/);
    } finally {
      await context.close();
    }
  });

  test("should redirect to login if not authenticated", async ({ browser }) => {
    // Fresh context không có token
    const context = await browser.newContext({ storageState: undefined });
    const page = await context.newPage();

    try {
      await page.goto("http://localhost:5173/dashboard");
      await page.waitForURL(/login/, { timeout: 10000 });
      await expect(page).toHaveURL(/login/);
    } finally {
      await context.close();
    }
  });

  test("should logout successfully", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("Dashboard");

    // Tìm avatar button cuối trong header
    const avatarBtn = page.locator("header button").last();
    await avatarBtn.waitFor({ state: "visible", timeout: 10000 });
    await avatarBtn.click();

    await page.waitForTimeout(400);

    // Click Logout
    await page.getByRole("button", { name: /logout/i }).click();

    // Chờ redirect về login
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/login/);

    // Verify localStorage bị xóa
    const accessToken = await page.evaluate(() =>
      localStorage.getItem("accessToken"),
    );
    expect(accessToken).toBeNull();

    // Dùng fresh context để verify không vào được dashboard
    // KHÔNG dùng page hiện tại vì vẫn còn storageState
    const newContext = await page.context().browser()!.newContext({
      storageState: undefined,
    });
    const newPage = await newContext.newPage();

    try {
      await newPage.goto("http://localhost:5173/dashboard");
      await newPage.waitForURL(/login/, { timeout: 8000 });
      await expect(newPage).toHaveURL(/login/);
    } finally {
      await newContext.close();
    }
  });
});
