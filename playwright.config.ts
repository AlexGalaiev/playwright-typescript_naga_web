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
    video: 'off',
    screenshot:'only-on-failure',
    trace:'retain-on-failure',
  },
  // globalSetup: process.env.CI && process.env.CRON_RUN !== "schedule"
  //   ? require.resolve("./global-setup.ts")
  //   : undefined,

  /* Configure projects for major browsers */
  projects: [
    {
      name: "qa",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://app.sxdev.io",
        //NagaMarkets: "https://nagamarkets.com",
        //NagaCapital: "https://app.naga.com",
        NagaCapital: "https://app.sxdev.io",
        NagaMena: "https://app.sxdev.io",
        //NagaMena: "https://app.naga.com",
        //NagaAfrica: "https://nagaafrica.com",
        NagaAfrica: "https://app.sxdev.io",
        NagaX: "https://app.sxdev.io/eu",
        //NagaCapital: "https://sxdevcap.com",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
    {
      name: "production",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://app.naga.com",
        //NagaCapital: "https://sxdevcap.com",
        NagaCapital: "https://app.naga.com",
        NagaMena: "https://app.naga.com",
        NagaAfrica: "https://app.naga.com",
        //NagaAfrica: "https://sxdevafrica.com",
        NagaX: "https://app.naga.com/eu",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
    {
      name: "smoke",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://app.naga.com",
        NagaCapital: "https://app.naga.com",
        NagaMena: "https://app.naga.com",
        NagaAfrica: "https://app.naga.com",
        NagaX: "https://app.naga.com/eu",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
    {
      name: "master",
      use: {
        ...devices["Desktop Chrome"],
        NagaMarkets: "https://app.naga.com",
        NagaCapital: "https://app.naga.com",
        NagaMena: "https://app.naga.com",
        NagaAfrica: "https://app.naga.com",
        NagaX: "https://app.naga.com/eu",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
    {
      name: "mobileQA",
      use: {
        ...devices["iPhone 15 Pro Max"],
        NagaMarkets: "https://sxdevmarkets.com",
        //NagaMarkets: "https://nagamarkets.com",
        //NagaCapital: "https://nagacap.com",
        NagaCapital: "https://app.sxdev.io",
        NagaMena: "https://app.sxdev.io",
        //NagaAfrica: "https://nagaafrica.com",
        NagaAfrica: "https://app.sxdev.io",
        NagaX: "https://app.sxdev.io/eu",
        //NagaCapital: "https://sxdevcap.com",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
    {
      name: "mobileProd",
      use: {
        ...devices["iPhone 15 Pro Max"],
        NagaMarkets: "https://nagamarkets.com",
        //NagaCapital: "https://sxdevcap.com",
        NagaCapital: "https://app.naga.com",
        NagaMena: "https://app.naga.com",
        NagaAfrica: "https://app.naga.com",
        //NagaAfrica: "https://sxdevafrica.com",
        NagaX: "https://app.naga.com/eu",
        NSCountry: "Bosnia and Herzegovina",
        NMCountry: "France",
        NagaMenaCountry: "United Arab Emirates",
        NagaAfricaCountry: "South Africa",
        NagaXCountry: "Bosnia and Herzegovina",
        WebsiteNagaCom: "https://naga.com"
      },
    },
  ],
});
