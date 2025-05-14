import { test, expect, errors } from '@playwright/test'

test('Verificación de la ciudad por defecto, sin zonas en la página principal', async ({
  page
}) => {
  await page.goto('/tarija/el-molino')
  await expect(page).toHaveURL('/bolivia/tarija/el-molino')
  const etiquetaBusqueda = page.locator('[data-testid="etiqueta-busqueda"]')
  const rawText = await etiquetaBusqueda.innerText()
  const match = rawText.match(/\((\d+)\)/)
  if (!match) throw new Error('Formato inesperado')
  const cantidad = parseInt(match[1], 10)
  await expect(cantidad).toBeGreaterThan(0)

  const resultados = page.locator('[data-testid="resultados-div"]')
  while (true) {
    try {
      await Promise.all([
        resultados.evaluate((el) => {
          el.scrollTop = el.scrollHeight
        }),
        page.waitForResponse(
          (r) => r.url().includes('/api/comercios/lista') && r.status() === 200,
          { timeout: 3000 }
        )
      ])
    } catch (err) {
      if (err instanceof errors.TimeoutError) break
      throw err
    }
  }

  await expect(
    resultados.locator('[data-testclass="tarjeta-control"]')
  ).toHaveCount(cantidad)
})
