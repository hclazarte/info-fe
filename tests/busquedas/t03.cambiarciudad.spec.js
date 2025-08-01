import { test, expect } from '@playwright/test'
import { gotoAndWait } from '../utils'

test('Verificación que la búsqueda se recargue al cambiar ciudades', async ({
  page
}) => {
  const responsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/comercios/lista') && r.status() === 200
  )
  await gotoAndWait(page, '/')
  await responsePromise
  await page.locator('[data-testid="ciudad-pulldown-button"]').click()
  const ciudades = await page.locator('[data-testclass="ciudad-li"]')
  const primera = ciudades.nth(0)
  const segunda = ciudades.nth(1)
  const tercera = ciudades.nth(2)

  await primera.click()
  await page.waitForResponse('**/api/comercios/lista?**')
  const ciudadUnoValor = await page
    .locator('[data-testid="ciudad-input"]')
    .inputValue()
  // Que la ciudad 1 esté en la url
  const slug1 = ciudadUnoValor.trim().toLowerCase().replace(/\s+/g, '-')
  await expect(page).toHaveURL(new RegExp(`/${slug1}`, 'i'))
  const textoTitulo1 = await page
    .locator('[data-testclass="tarjeta-title"]')
    .first()
    .textContent()

  await page.locator('[data-testid="ciudad-pulldown-button"]').click()
  await segunda.click()
  await page.waitForResponse('**/api/comercios/lista?**')
  const ciudadDosValor = await page
    .locator('[data-testid="zona-input"]')
    .inputValue()
  // Que la ciudad2 esté en la url
  const slug2 = ciudadDosValor.trim().toLowerCase().replace(/\s+/g, '-')
  await expect(page).toHaveURL(new RegExp(`/${slug2}`, 'i'))
  const textoTitulo2 = await page
    .locator('[data-testclass="tarjeta-title"]')
    .first()
    .textContent()
  // Que el contenido de 2 difiera del de 1
  expect(textoTitulo2).not.toBe(textoTitulo1)

  await page.locator('[data-testid="ciudad-pulldown-button"]').click()
  await tercera.click()
  await page.waitForResponse('**/api/comercios/lista?**')
  const ciudadTresValor = await page
    .locator('[data-testid="ciudad-input"]')
    .inputValue()
  // Que la zona3 esté en la url
  const slug3 = ciudadTresValor.trim().toLowerCase().replace(/\s+/g, '-')
  await expect(page).toHaveURL(new RegExp(`/${slug3}`, 'i'))
  const textoTitulo3 = await page
    .locator('[data-testclass="tarjeta-title"]')
    .first()
    .textContent()
  // Que el contenido de 3 difiera del de 1
  expect(textoTitulo3).not.toBe(textoTitulo1)
  expect(textoTitulo3).not.toBe(textoTitulo2)
})
