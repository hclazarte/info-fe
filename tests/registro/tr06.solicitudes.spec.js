// tests/registro/tr06.tokens.spec.js
import { test, expect } from '@playwright/test'
import { waitForTokenPageData, prepararEscenario } from '../utils'

test.use({ browserName: 'chromium' })
test.describe('@acceptance', () => {
  test('Flujo TR06 – Token expirado o inválido', async ({ page, baseURL }) => {
    // Preparar escenario TR06 en BE (token expirado)
    const json = await prepararEscenario('tr06', baseURL)
    const tokenExpirado = json.token

    // Ir al link con token expirado
    await page.goto(`/app/registro-comercio?token=${tokenExpirado}`)

    // Verificar que aparece mensaje de token inválido o expirado
    await expect(page.getByText('Token inválido o expirado')).toBeVisible()

    // Ir a un token inventado
    const tokenInvalido = 'this_is_a_bad_token'
    await page.goto(`/app/registro-comercio?token=${tokenInvalido}`)

    // Verificar que aparece el mismo mensaje de token inválido o expirado
    await expect(page.getByText('Token inválido o expirado')).toBeVisible()
  })
})
