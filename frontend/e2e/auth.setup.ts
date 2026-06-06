import { test as setup, expect, chromium } from "@playwright/test";
import axios from "axios";
import * as fs from "fs";
import * as path from "path";

const authFile = "e2e/.auth/user.json";
const API_URL = "http://localhost:3000/api";

setup("authenticate", async ({ page }) => {
  // ── CÁCH 1: Gọi API trực tiếp lấy token ──────────────
  let accessToken = "";
  let refreshToken = "";

  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: "admin@gmail.com",
      password: "password123",
    });

    accessToken = response.data.accessToken;
    refreshToken = response.data.refreshToken;

    console.log("✅ Got tokens from API directly");
  } catch (error: any) {
    // Nếu API call fail, thử login qua browser
    console.log("⚠️ Direct API failed, trying browser login...");

    await page.goto("http://localhost:5173/login");
    await page.waitForSelector('input[type="email"]', { timeout: 15000 });

    await page.fill('input[type="email"]', "admin@gmail.com");
    await page.fill('input[type="password"]', "password123");

    const [res] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes("/auth/login") && r.status() === 200,
        { timeout: 20000 },
      ),
      page.click('button[type="submit"]'),
    ]);

    const data = await res.json();
    accessToken = data.accessToken;
    refreshToken = data.refreshToken;
  }

  if (!accessToken) {
    throw new Error(
      "❌ Could not get access token — check credentials and backend",
    );
  }

  // ── Inject token vào browser context ─────────────────
  await page.goto("http://localhost:5173");
  await page.waitForLoadState("domcontentloaded");

  // Set localStorage trực tiếp
  await page.evaluate(
    ({ at, rt }) => {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      // Support key cũ
      localStorage.setItem("token", at);
    },
    { at: accessToken, rt: refreshToken },
  );

  // Verify bằng cách navigate tới protected route
  await page.goto("http://localhost:5173/dashboard");
  await page.waitForTimeout(2000); // chờ React hydrate

  const url = page.url();
  if (url.includes("/login")) {
    throw new Error(
      `❌ Still redirected to login after setting tokens. URL: ${url}`,
    );
  }

  // Lưu storageState
  await page.context().storageState({ path: authFile });
  console.log("✅ Auth setup complete — tokens saved to", authFile);
  console.log("   accessToken:", accessToken.substring(0, 20) + "...");
});
