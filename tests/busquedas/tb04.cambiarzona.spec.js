import { test, expect } from '@playwright/test'
import { gotoAndWait } from '../utils'

test.describe('@smoke', () => {
  test('Verificación que la búsqueda se recargue al cambiar zonas', async ({
    page
  }) => {
    await gotoAndWait(page, '/oruro')
    await expect(page).toHaveURL('/bolivia/oruro')
    await page.getByTestId('zona-pulldown-button').click()
    const zonas = await page.locator('[data-testclass="zona-li"]')
    const primera = zonas.nth(0)
    const segunda = zonas.nth(1)
    const tercera = zonas.nth(2)

    await primera.click()
    await page.waitForResponse('**/api/comercios/lista?**')
    const zonaUnoValor = await page
      .locator('[data-testid="zona-input"]')
      .inputValue()
    // Que la zona1 esté en la url
    const slug1 = zonaUnoValor.trim().toLowerCase().replace(/\s+/g, '-')
    await expect(page).toHaveURL(new RegExp(`/${slug1}`, 'i'))
    const textoTitulo1 = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()

    await page.getByTestId('zona-pulldown-button').click()
    await segunda.click()
    await page.waitForResponse('**/api/comercios/lista?**')
    const zonaDosValor = await page
      .locator('[data-testid="zona-input"]')
      .inputValue()
    // Que la zona2 esté en la url
    const slug2 = zonaDosValor.trim().toLowerCase().replace(/\s+/g, '-')
    await expect(page).toHaveURL(new RegExp(`/${slug2}`, 'i'))
    const textoTitulo2 = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    // Que el contenido de 2 difiera del de 1
    expect(textoTitulo2).not.toBe(textoTitulo1)

    await page.getByTestId('zona-pulldown-button').click()
    await tercera.click()
    await page.waitForResponse('**/api/comercios/lista?**')
    const zonaTresValor = await page
      .locator('[data-testid="zona-input"]')
      .inputValue()
    // Que la zona3 esté en la url
    const slug3 = zonaTresValor.trim().toLowerCase().replace(/\s+/g, '-')
    await expect(page).toHaveURL(new RegExp(`/${slug3}`, 'i'))
    const textoTitulo3 = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    // Que el contenido de 3 difiera del de 1
    expect(textoTitulo3).not.toBe(textoTitulo1)
    expect(textoTitulo3).not.toBe(textoTitulo2)
  })
})
