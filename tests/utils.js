import { request, expect } from '@playwright/test'
import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

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
