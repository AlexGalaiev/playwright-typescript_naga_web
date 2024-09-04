import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

require("dotenv").config();

export default defineConfig<TestOptions>({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  expect: {
    timeout: 420000,
  },
  reporter: [["list"], ["html"]],
  use: {
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  globalSetup: process.env.CI
    ? require.resolve("./global-setup.ts")
    : undefined,

  /* Configure projects for major browsers */
  projects: [
    {
      name: "qa",
      use: {
        ...devices["Desktop Chrome"],
        //NagaMarkets: "https://sxdevmarkets.com",
        NagaMarkets: "https://nagamarkets.com",
        NagaCapital: "https://nagacap.com",
        //NagaCapital: "https://sxdevcap.com",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
      },
    },
    {
      name: "production",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://nagamarkets.com",
        NagaCapital: "https://nagacap.com",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
      },
    },
    {
      name: "main",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://nagamarkets.com",
        NagaCapital: "https://nagacap.com",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
      },
    },
  ],
});
