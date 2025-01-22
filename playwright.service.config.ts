import { getServiceConfig, ServiceOS } from "@azure/microsoft-playwright-testing";
import { defineConfig } from "@playwright/test";
import { AzureCliCredential } from "@azure/identity";
import config from "./playwright.config";

export default defineConfig(
  config,
  getServiceConfig(config, {
    serviceAuthType:'ACCESS_TOKEN', // Use this option when you want to authenticate using access tokens. This mode of auth should be enabled for the workspace.
    os: ServiceOS.WINDOWS, // Select the operating system where you want to run tests.
    runId: new Date().toISOString(), // Set a unique ID for every test run to distinguish them in the service portal.
    credential: new AzureCliCredential(), // Select the authentication method you want to use with Entra.
    useCloudHostedBrowsers: true, // Select if you want to use cloud-hosted browsers to run your Playwright tests.
    exposeNetwork: '<loopback>', // Use this option to connect to local resources from your Playwright test code without having to configure additional firewall settings.
    timeout: 30000 // Set the timeout for your tests.ß
  }),
  {
    reporter: [
      ["list"],
      [
        "@azure/microsoft-playwright-testing/reporter",
        {
          enableGitHubSummary: true, // Enable/disable GitHub summary in GitHub Actions workflow.
        },
      ],
    ],
  },
);