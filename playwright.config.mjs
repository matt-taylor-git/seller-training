import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:8171',
    viewport: { width: 1440, height: 900 },
    video: 'on',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'python3 -m http.server 8171 --bind 127.0.0.1 --directory prototype/seller-ai-training',
    url: 'http://127.0.0.1:8171',
    reuseExistingServer: false
  }
});
