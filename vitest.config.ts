import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const astroMiddlewareMock = fileURLToPath(new URL("./tests/mocks/astro-middleware.ts", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "astro:middleware": astroMiddlewareMock,
    },
  },
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    environmentMatchGlobs: [
      ["src/pages/api/**", "node"],
      ["src/middleware/**", "node"],
    ],
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}", "tests/unit/**/*.{test,spec}.{ts,tsx}"],
    passWithNoTests: true,
    deps: {
      inline: ["parse5", "cssstyle", "data-urls", "whatwg-url", "nwsapi"],
    },
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "./coverage/unit",
    },
  },
});
