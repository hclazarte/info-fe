// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

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
    trace: 'on-first-retry'
  },

  projects: [
    {
      name: 'acceptance-chrome',
      use: { browserName: 'chromium' },
      grep: /@acceptance/,
      workers: 1,   // solo una instancia a la vez
      retries: 0
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
      grepInvert: /@acceptance/,
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
      grepInvert: /@acceptance/,
    },
  ]
})
