import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/suites/**/*.test.ts"],
    globals: true,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    fileParallelism: false,
    sequence: { concurrent: false },
    setupFiles: ["src/support/setup.ts"],
  },
});
