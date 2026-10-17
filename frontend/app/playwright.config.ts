import { defineConfig, devices } from "@playwright/test";
import { API, BASE_URL, POSTS_PER_PAGE } from "./e2e/settings.mjs";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  timeout: 30_000,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node e2e/mock-api.mjs",
      url: `${API}/__health`,
      reuseExistingServer: false,
    },
    {
      // ビルドは先に完了させ、ブラウザと同時に実行しない。
      command: "node .output/server/index.mjs",
      url: `${BASE_URL}/NewPost`,
      reuseExistingServer: false,
      env: {
        NITRO_HOST: "127.0.0.1",
        NITRO_PORT: "3100",
        NUXT_PUBLIC_HTTP_PROTOCOL: "http",
        NUXT_PUBLIC_BACKEND_HOST: "127.0.0.1",
        NUXT_PUBLIC_BACKEND_PORT: "3101",
        NUXT_PUBLIC_RECAPTCHA_ENABLED: "false",
        NUXT_PUBLIC_POSTS_PER_PAGE: String(POSTS_PER_PAGE),
      },
    },
  ],
});
