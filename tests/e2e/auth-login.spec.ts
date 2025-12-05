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

test.describe("Logowanie użytkownika", () => {
  test("waliduje formularz przy niepoprawnych danych", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await loginPage.submit({ email: "", password: "" });

    await expect(page.getByText("Podaj poprawny adres e-mail")).toBeVisible();
    await expect(page.getByText("Hasło musi mieć min. 6 znaków")).toBeVisible();
  });

  test("informuje o błędnych poświadczeniach", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ error: "Invalid credentials." }),
      });
    });

    const failedResponse = page.waitForResponse("**/api/auth/login");
    await loginPage.submit({ email: "jan@firma.pl", password: "tajnehaslo" });
    await failedResponse;

    await expect(page).toHaveURL(/\/auth\/login$/);
    await loginPage.expectToast("Nieprawidłowe dane logowania.");
  });

  test("loguje użytkownika z prawidłowymi danymi", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await page.route("**/api/auth/login", async (route) => {
      const requestBody = route.request().postDataJSON() as { email: string; password: string };
      expect(requestBody).toEqual({ email: "jan@firma.pl", password: "poprawnehaslo" });

      await route.fulfill({
        status: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ user: { id: "user-1", email: requestBody.email } }),
      });
    });

    await loginPage.submit({ email: "jan@firma.pl", password: "poprawnehaslo" });

    await page.waitForURL("**/");
    await expect(page).toHaveURL(/\/$/);
  });
});
