import { defineConfig } from '@playwright/test';

const port = process.env.PORT || '8171';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  expect: { timeout: 7000 },
  fullyParallel: true,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1440, height: 900 },
    video: 'on',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: `python3 -m http.server ${port} --bind 127.0.0.1 --directory prototype/seller-ai-training`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: false
  }
});
