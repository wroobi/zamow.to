import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import LoginForm from "../LoginForm";
import { toast } from "sonner";

describe("LoginForm", () => {
  const validCredentials = {
    email: "jan@test.pl",
    password: "bezpieczneHaslo",
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("wysyła żądanie logowania i przekierowuje po sukcesie", async () => {
    const user = userEvent.setup();
    const originalLocation = window.location;
    let currentHref = "http://localhost/";
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        get href() {
          return currentHref;
        },
        set href(value) {
          currentHref = value;
        },
      },
    });

    try {
      const fetchMock = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: "123" } }),
      } as Response);

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/e-mail/i), validCredentials.email);
      await user.type(screen.getByLabelText(/hasło/i), validCredentials.password);

      const submitButton = screen.getByRole("button", { name: /zaloguj się/i });

      await user.click(submitButton);

      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );
      const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
      expect(JSON.parse(requestInit.body as string)).toEqual(validCredentials);

      expect(toast.success).toHaveBeenCalledWith("Zalogowano pomyślnie");
      expect(currentHref).toBe("/");
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
    }
  });

  it("wyświetla błąd przy nieudanym logowaniu", async () => {
    const user = userEvent.setup();
    const originalLocation = window.location;
    let currentHref = "http://localhost/";
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        get href() {
          return currentHref;
        },
        set href(value) {
          currentHref = value;
        },
      },
    });

    try {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid credentials." }),
      } as Response);

      render(<LoginForm />);

      await user.type(screen.getByLabelText(/e-mail/i), validCredentials.email);
      await user.type(screen.getByLabelText(/hasło/i), validCredentials.password);

      const submitButton = screen.getByRole("button", { name: /zaloguj się/i });

      await user.click(submitButton);

      expect(toast.error).toHaveBeenCalledWith("Nieprawidłowe dane logowania.");
      expect(currentHref).toBe("http://localhost/");
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: originalLocation,
      });
    }
  });
});
