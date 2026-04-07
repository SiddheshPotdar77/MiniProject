import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',                 // Folder containing test files
  timeout: 60 * 1000,                 // Global timeout per test
  retries: 0,                         // Retry failed tests
  fullyParallel: false,                // Run tests in parallel
  workers:1,
  reporter: [
    ['list'],                         // Console output
    ['html', { outputFolder: 'reports/html' }], // HTML report
    ['allure-playwright']             // Allure report
  ],
  use: {
    baseURL:'https://opensource-demo.orangehrmlive.com/', // OrangeHRM demo site
    headless: true,                   // Run in headless mode
    screenshot: 'only-on-failure',    // Capture screenshots on failure
    video: 'retain-on-failure',       // Record video on failure
    trace: 'retain-on-failure'        // Collect trace on failure
  },
  //globalSetup: require.resolve('./fixtures/global.setup'),
  //globalTeardown: require.resolve('./fixtures/global.teardown'),

  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});