import { request, expect } from '@playwright/test'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'
// import { LONG_WAIT_TIMEOUT } from '/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// tests/utils.js
/**
 * Guarda un PDF codificado en base64 en un archivo temporal.
 * @param {{ content_base64: string, filename: string }} comprobantePdf
 * @param {string} dir - Directorio donde guardar el archivo (por defecto 'tmp')
 * @returns {string} - Ruta absoluta del archivo guardado
 */
export async function saveBase64PdfToFile(comprobantePdf, dir = 'tmp') {
  const { content_base64, filename } = comprobantePdf
  const buffer = Buffer.from(content_base64, 'base64')
  const tempPath = path.join(__dirname, '..', dir, filename)

  fs.mkdirSync(path.dirname(tempPath), { recursive: true })
  fs.writeFileSync(tempPath, buffer)

  return tempPath
}
/**
 * Navega a `path` y espera a que /api/comercios/lista responda 200.
 * Si existe el atributo data-loading en <body>, espera a que sea 'false'.
 * Si no existe, espera 1 segundo fijo.
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
export async function gotoAndWait(page, path) {
  // Espera a la respuesta de la lista
  const waitList = page.waitForResponse(
    (r) => r.url().includes('/api/comercios/lista') && r.status() === 200
  )

  await page.goto(path)
  await waitList

  // Verifica si existe el atributo data-loading
  const body = page.locator('body')
  const hasAttr = await body.evaluate((el) => el.hasAttribute('data-loading'))

  if (hasAttr) {
    // Si existe, espera a que su valor sea 'false' (timeout por defecto: 5s)
    await expect(body).toHaveAttribute('data-loading', 'false')
  } else {
    // Si no existe, espera un segundo fijo como fallback
    await page.waitForTimeout(1000)
  }
}
/**
 * Devuelve el número de registros indicado en el texto de la etiqueta de búsqueda.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<number>}
 */
export async function searchCount(page) {
  const etiqueta = page.getByTestId('etiqueta-busqueda')
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

/**
 * Hace clic en una tarjeta y espera los requests asincrónicos asociados:
 * - POST /api/log_clics (required)
 * - recaptcha enterprise reload (optional)
 *
 * @param {import('@playwright/test').Locator} locator
 * @param {{ timeout?: number }} [options]
 */
export async function clickCardAndWait(card, { timeout = 60000 } = {}) {
  const page = card.page()

  // Elegir en qué elemento hacer click: primero el título, si existe;
  // si no existe, hacemos click en la tarjeta completa como fallback.
  const title = card.locator('[data-testclass="tarjeta-title"]')
  const target = (await title.count()) > 0 ? title : card

  const waitRecaptcha = page
    .waitForResponse(
      (r) =>
        r.url().includes('recaptcha/enterprise/reload') && r.status() === 200,
      { timeout }
    )
    .catch(() => {
      // Si no ocurre o expira, no detiene el flujo
    })

  await Promise.all([target.click(), waitRecaptcha])
}
