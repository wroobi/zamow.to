import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// Clean up rendered components after every test to avoid cross-test bleeding.
afterEach(() => {
  cleanup();
});
