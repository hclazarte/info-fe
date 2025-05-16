import { test, expect, errors } from '@playwright/test'
import { gotoAndWait, searchCount } from './utils'

test('Verificación de la ciudad por defecto, sin zonas en la página principal', async ({
  page
}) => {
  await gotoAndWait(page, '/tarija/el-molino')
  await expect(page).toHaveURL('/bolivia/tarija/el-molino')

  const cantidad = await searchCount(page)
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
