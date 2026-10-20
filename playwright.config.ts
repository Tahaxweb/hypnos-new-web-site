import { defineConfig, devices } from '@playwright/test'

/**
 * Uçtan uca testler. Varsayılan olarak çalışan geliştirme sunucusunu (localhost:3100) kullanır;
 * sunucu kapalıysa geliştirme sunucusunu kendisi başlatır.
 */
const executablePath = process.env.CHROMIUM_PATH || undefined

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3100',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: { executablePath },
  },
  projects: [
    { name: 'masaustu', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions: { executablePath } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3100',
    reuseExistingServer: true,
    timeout: 180_000,
  },
})
