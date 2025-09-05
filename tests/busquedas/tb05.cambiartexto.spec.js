import { test, expect } from '@playwright/test'
import { gotoAndWait, searchCount } from '../utils'
import { text } from 'stream/consumers'

test.describe('@smoke', () => {
  test('Verificar que al escribir en el buscador se apliquen correctamente los filtros', async ({
    page
  }) => {
    await gotoAndWait(page, '/oruro')
    await expect(page).toHaveURL('/bolivia/oruro')

    const cantidadInic = await searchCount(page)
    await expect(cantidadInic).toBeGreaterThan(0)

    const titulo = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    const servicio = await page
      .locator('[data-testclass="tarjeta-servicios"]')
      .first()
      .textContent()
    const texto = servicio
      .trim()
      .split(/\s+/)
      .find((palabra) => palabra.length > 2)

    const buscador = page.getByTestId('buscar-input')
    await buscador.click()
    await buscador.fill(texto)
    await expect(buscador).toHaveValue(texto)

    await buscador.dispatchEvent('input')
    await page.waitForResponse('**/api/comercios/lista?**')

    const cantidadFil = await searchCount(page)
    await expect(cantidadFil).toBeLessThan(cantidadInic)

    const tituloFil = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    await expect(tituloFil).toBe(titulo)

    await buscador.click()
    await buscador.fill(texto + ' ')
    await expect(buscador).toHaveValue(texto + ' ')

    await buscador.dispatchEvent('input')

    const cantidadFil2 = await searchCount(page)
    await expect(cantidadFil2).toBe(cantidadFil)

    const tituloFil2 = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    await expect(tituloFil).toBe(tituloFil2)
  })
})
