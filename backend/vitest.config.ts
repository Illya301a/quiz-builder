import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    exclude: ["dist/**", "node_modules/**"],
    env: {
      DATABASE_PATH: "./data/test.db",
      FRONTEND_URL: "http://localhost:3000",
      PORT: "4000",
    },
  },
});
