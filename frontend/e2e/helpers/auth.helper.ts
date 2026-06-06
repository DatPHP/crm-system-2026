import { Page } from "@playwright/test";

export const TEST_USER = {
  email: "admin@gmail.com",
  password: "password123",
  name: "Admin",
};

// Dùng khi cần login thủ công (không dùng storageState)
export async function loginManual(page: Page) {
  await page.goto("/login");
  await page.waitForSelector('input[type="email"]', { timeout: 15000 });

  await page.fill('input[type="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes("/auth/login") && res.status() === 200,
      { timeout: 20000 },
    ),
    page.click('button[type="submit"]'),
  ]);

  await page.waitForURL("**/dashboard", { timeout: 15000 });
  await page.waitForLoadState("networkidle");
}
