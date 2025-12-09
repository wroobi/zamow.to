import { expect, test, type Page } from "@playwright/test";

class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto("/auth/login");
  }

  emailField() {
    return this.page.getByLabel("E-mail");
  }

  passwordField() {
    return this.page.getByLabel("Hasło");
  }

  submitButton() {
    return this.page.getByRole("button", { name: "Zaloguj się" });
  }

  async submit(credentials: { email: string; password: string }) {
    const { email, password } = credentials;
    await this.emailField().fill(email);
    await this.passwordField().fill(password);
    await this.submitButton().click();
  }

  async expectToast(message: string) {
    await expect(this.page.getByText(message, { exact: true })).toBeVisible();
  }
}

test.describe.serial("Logowanie użytkownika", () => {
  test("waliduje formularz przy niepoprawnych danych", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    // Wait for client component hydration and inputs to be ready
    await page.waitForSelector('form[aria-label="Formularz logowania"]');
    await page.waitForSelector("input#email");

    // Submit empty values and expect validation messages
    await loginPage.submit({ email: "", password: "" });

    await expect(page.getByText("Podaj poprawny adres e-mail")).toBeVisible();
    await expect(page.getByText("Hasło musi mieć min. 6 znaków")).toBeVisible();
  });

  test("informuje o błędnych poświadczeniach", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForSelector('form[aria-label="Formularz logowania"]');

    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Invalid credentials." }),
      });
    });

    // Submit and assert toast appears (route interception should respond quickly)
    await loginPage.submit({ email: "jan@firma.pl", password: "tajnehaslo" });
    await loginPage.expectToast("Nieprawidłowe dane logowania.");
    await expect(page).toHaveURL(/\/auth\/login$/);
  });

  test("loguje użytkownika z prawidłowymi danymi", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await page.waitForSelector('form[aria-label="Formularz logowania"]');

    // Intercept login and respond with a valid user
    let capturedRequest: any = null;
    await page.route("**/api/auth/login", async (route) => {
      capturedRequest = await route.request().postDataJSON();
      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: { id: "user-1", email: capturedRequest.email } }),
      });
    });

    // Wait for the request to be made and fulfil it with 200
    const [request] = await Promise.all([
      page.waitForRequest((r) => r.url().includes("/api/auth/login") && r.method() === "POST"),
      loginPage.submit({ email: "jan@firma.pl", password: "poprawnehaslo" }),
    ]);

    // Ensure the intercepted route was called and responded with 200
    expect(request).toBeTruthy();

    // Now wait for navigation to happen as app sets window.location.href = '/'
    await page.waitForURL(/\/$/, { timeout: 5000 });
  });
});
