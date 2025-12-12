import { describe, expect, it, vi } from "vitest";
import { onRequest } from "../index";
import type { APIContext } from "astro";

const createSupabaseServerInstanceMock = vi.hoisted(() => vi.fn());

vi.mock("@/db/supabase.client", () => ({
  createSupabaseServerInstance: createSupabaseServerInstanceMock,
}));

describe("middleware auth", () => {
  const buildContext = (path: string) => {
    const url = new URL(`http://localhost${path}`);
    const request = new Request(url);
    const locals: Record<string, unknown> = {};
    const redirect = vi.fn(() => new Response(null, { status: 302 }));
    const next = vi.fn();

    return {
      ctx: {
        locals,
        cookies: {} as unknown,
        url,
        request,
        redirect,
      } as unknown as APIContext,
      locals,
      redirect,
      next,
    };
  };

  it("przekierowuje gościa na stronę logowania (TC-AUTH-005)", async () => {
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    createSupabaseServerInstanceMock.mockReturnValue(supabaseMock);

    const { ctx, redirect, next } = buildContext("/app");

    const response = await onRequest(ctx, next);

    expect(createSupabaseServerInstanceMock).toHaveBeenCalledWith({
      cookies: ctx.cookies,
      headers: ctx.request.headers,
    });
    expect(supabaseMock.auth.getUser).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/auth/login");
    expect(next).not.toHaveBeenCalled();
    expect(response).toBeDefined();
  });

  it("pozwala przejść dla ścieżek publicznych", async () => {
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };

    createSupabaseServerInstanceMock.mockReturnValue(supabaseMock);

    const { ctx, redirect, next } = buildContext("/auth/login");

    await onRequest(ctx, next);

    expect(redirect).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("ustawia dane użytkownika dla zalogowanego (TC-AUTH-006)", async () => {
    const supabaseMock = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: "user-1", email: "jan@test.pl" } },
        }),
      },
    };

    createSupabaseServerInstanceMock.mockReturnValue(supabaseMock);

    const { ctx, locals, next, redirect } = buildContext("/app");

    await onRequest(ctx, next);

    expect(locals.user).toEqual({ id: "user-1", email: "jan@test.pl" });
    expect(next).toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
