import { request, expect } from '@playwright/test'

// tests/utils.js
/**
 * Navega a `path` y espera a que /api/comercios/lista responda 200
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
export async function gotoAndWait(page, path) {
  const waitList = page.waitForResponse(
    (r) => r.url().includes('/api/comercios/lista') && r.status() === 200
  )
  await page.goto(path)
  await waitList
}

/**
 * Devuelve el número de registros indicado en el texto de la etiqueta de búsqueda.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
export async function searchCount(page) {
  const etiqueta = page.locator('[data-testid="etiqueta-busqueda"]')
  const rawText = await etiqueta.textContent()
  if (!rawText) return 0

  const match = rawText.match(/\((\d+)\)/)
  return match ? parseInt(match[1], 10) : 0
}

/**
 * Carga la página de registro de solicitudes y espera los endpoint necesarios se carguen
 * @param {*} page
 * @param {*} token
 */
export async function waitForTokenPageData(page, token) {
  const waitSolicitudes = page.waitForResponse(
    (r) =>
      r.url().includes('/api/solicitudes/buscar_por_token') &&
      r.status() === 200,
    { timeout: 50000 }
  )

  const waitCiudades = page.waitForResponse(
    (r) => r.url().endsWith('/api/ciudades') && r.status() === 200,
    { timeout: 50000 }
  )

  const waitZonas = page.waitForResponse(
    (r) => r.url().match(/\/api\/ciudades\/\d+\/zonas$/) && r.status() === 200,
    { timeout: 50000 }
  )
  await page.goto(`/app/registro-comercio?token=${token}`)
  await Promise.all([waitSolicitudes, waitCiudades, waitZonas])
}

/**
 * Consulta un endpoint para traer los datos para el test
 * @param {*} nombreEscenario
 * @param {*} baseURL
 * @returns
 */
export async function prepararEscenario(
  nombreEscenario,
  baseURL = 'http://localhost:3000'
) {
  const apiContext = await request.newContext()
  const response = await apiContext.post(
    `${baseURL}/api/solicitudes/preparar_escenario/${nombreEscenario}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  expect(response.ok()).toBeTruthy()
  return await response.json()
}
