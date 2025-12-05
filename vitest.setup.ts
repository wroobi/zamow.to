import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

vi.mock("sonner", () => {
  const success = vi.fn();
  const error = vi.fn();

  return {
    toast: {
      success,
      error,
    },
  };
});

// Clean up rendered components after every test to avoid cross-test bleeding.
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
