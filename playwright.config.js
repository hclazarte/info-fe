// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

const LONG_WAIT_TIMEOUT =
  process.env.INFOMOVIL_LONG_WAIT_TIMEOUT
    ? parseInt(process.env.INFOMOVIL_LONG_WAIT_TIMEOUT, 10)
    : 60_000

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    trace: 'on',
    screenshot: 'on',
    actionTimeout: LONG_WAIT_TIMEOUT,
    navigationTimeout: LONG_WAIT_TIMEOUT
  },

  projects: [
    {
      name: 'acceptance-chrome',
      use: { browserName: 'chromium' },
      grep: /@acceptance|@notready/,
      workers: 1,
      retries: 0
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
      grepInvert: /@acceptance|@notready/
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
      grepInvert: /@acceptance|@notready/
    }
  ]
})
