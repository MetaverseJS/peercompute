import { defineConfig, devices } from '@playwright/test';

const useExistingServer = process.env.USE_EXISTING_SERVER === '1' || process.env.USE_EXISTING_SERVER === 'true';
const webServer = useExistingServer
  ? undefined
  : {
      command: 'HTTPS=0 DEV_HOST=127.0.0.1 ./start-dev.sh',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    };

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer,
});
