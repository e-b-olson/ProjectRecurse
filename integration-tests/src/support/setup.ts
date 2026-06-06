import { afterAll, beforeAll } from "vitest";
import { assertSafeIntegrationTarget } from "./env.js";
import { runGlobalCleanup } from "./cleanup.js";

beforeAll(() => {
  assertSafeIntegrationTarget();
});

afterAll(async () => {
  await runGlobalCleanup();
});
