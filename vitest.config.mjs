import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  test: {
    // Every test file under src/, wherever it sits. This used to be
    // `**/__tests__/**`, which silently skipped any test placed next to its
    // source file: the suite stayed green while three files never ran.
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
