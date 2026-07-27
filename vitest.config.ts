import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@components": path.resolve(__dirname, "./src/Components"),
      "@types": path.resolve(__dirname, "./src/Types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      Components: path.resolve(__dirname, "./src/Components"),
      utils: path.resolve(__dirname, "./src/utils"),
      lib: path.resolve(__dirname, "./src/lib"),
      api: path.resolve(__dirname, "./src/api"),
      "api-hooks": path.resolve(__dirname, "./src/api-hooks"),
      shared: path.resolve(__dirname, "./backend/src/shared"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
