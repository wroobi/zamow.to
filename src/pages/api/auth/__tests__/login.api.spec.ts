import { afterEach, describe, expect, it, type Mock, vi } from "vitest";
import { POST } from "../login";
import { createSupabaseServerInstance } from "@/db/supabase.client";

vi.mock("@/db/supabase.client", () => ({
  createSupabaseServerInstance: vi.fn(),
}));

describe("POST /api/auth/login", () => {
  const cookiesStub = {} as any;
  const headers = new Headers({ "content-type": "application/json" });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("zwraca 200 i użytkownika przy poprawnych danych", async () => {
    const supabaseMock = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "jan@test.pl" } },
          error: null,
        }),
      },
    };

    (createSupabaseServerInstance as unknown as Mock).mockReturnValue(supabaseMock);

    const payload = { email: "jan@test.pl", password: "bezpieczneHaslo" };
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const response = await POST({ request, cookies: cookiesStub } as any);

    expect(createSupabaseServerInstance).toHaveBeenCalledWith({
      cookies: cookiesStub,
      headers: request.headers,
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: { id: "user-1", email: "jan@test.pl" } });
    expect(supabaseMock.auth.signInWithPassword).toHaveBeenCalledWith(payload);
  });

  it("zwraca 401 przy błędnych danych logowania", async () => {
    const supabaseMock = {
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Invalid credentials."),
        }),
      },
    };

    (createSupabaseServerInstance as unknown as Mock).mockReturnValue(supabaseMock);

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: "jan@test.pl", password: "zlehaslo" }),
    });

    const response = await POST({ request, cookies: cookiesStub } as any);

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ error: "Invalid credentials." });
  });

  it("zwraca 400 przy błędnym formacie danych", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers,
      body: JSON.stringify({ email: "niepoprawny", password: "123" }),
    });

    const response = await POST({ request, cookies: cookiesStub } as any);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid email or password." });
    expect(createSupabaseServerInstance).not.toHaveBeenCalled();
  });
});
