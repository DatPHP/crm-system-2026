import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://localhost:5173/login");
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });

    await page.fill('input[type="email"]', "admin@gmail.com");
    await page.fill('input[type="password"]', "password123");

    // Chờ API response
    const [response] = await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes("/auth/login") && res.status() === 200,
        { timeout: 20000 },
      ),
      page.click('button[type="submit"]'),
    ]);

    // Chờ redirect dashboard
    await page.waitForURL("**/dashboard", { timeout: 15000 });

    // Lưu storageState (localStorage + cookies) vào file
    await page.context().storageState({ path: "e2e/.auth/user.json" });

    console.log("✅ Global setup: login successful, storage saved");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
