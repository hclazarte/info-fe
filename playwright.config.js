// @ts-check
import { defineConfig, devices } from '@playwright/test';
import fs from 'node:fs';          // ← 1) NUEVO
import path from 'node:path';      // ← 2) NUEVO

// 3) Lee public/config.json (o el que uses para el build)
const cfgPath = path.resolve(process.cwd(), 'public', 'config.json');
let baseUrl = 'http://localhost:5173';       // valor de respaldo por si falta el archivo

try {
  const raw = fs.readFileSync(cfgPath, 'utf8');
  baseUrl = JSON.parse(raw).baseUrl ?? baseUrl;
} catch (err) {
  console.warn(`⚠️  No se pudo leer ${cfgPath}; se usará ${baseUrl}`);
}

// 4) Si defines BASE_URL en el entorno, tiene prioridad
const finalBaseURL = process.env.BASE_URL || baseUrl;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  /** Ajustes compartidos */
  use: {
    baseURL: finalBaseURL,         // ← aquí entra la URL del JSON
    trace: 'on-first-retry'
  },

  /** Proyectos (browsers) */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } }
  ],

  /* Servidor local opcional
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI
  },
  */
});
