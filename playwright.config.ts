import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  expect: { timeout: 10_000 },
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }
  ],
  reporter: 'list',
  retries: process.env.CI ? 1 : 0,
  testDir: './tests/browser',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:6006',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'node scripts/serve-storybook.mjs',
    port: 6006,
    reuseExistingServer: false,
    timeout: 30_000
  }
});
