import { test, expect } from "@playwright/test";

// Basic smoke test to confirm the app responds on the root route.
test.describe("Smoke", () => {
  test("login page responds", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/login$/);
  });
});
