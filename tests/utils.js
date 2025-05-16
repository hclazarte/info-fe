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
