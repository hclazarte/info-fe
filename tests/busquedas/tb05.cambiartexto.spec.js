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

    // Obtiene todos los textos de títulos y servicios
    const tarjetas = await page
      .locator('[data-testclass="tarjeta-control"]')
      .all()

    let tituloValido = null
    let palabraValida = null

    for (const tarjeta of tarjetas) {
      const titulo = await tarjeta
        .locator('[data-testclass="tarjeta-title"]')
        .textContent()
      const servicio = await tarjeta
        .locator('[data-testclass="tarjeta-servicios"]')
        .textContent()

      const palabra = servicio
        ?.trim()
        .split(/\s+/)
        .find((p) => p.length > 6)

      if (palabra) {
        tituloValido = titulo?.trim() ?? ''
        palabraValida = palabra
        break // parar en la primera tarjeta válida
      }
    }

    expect(palabraValida).toBeTruthy()

    const buscador = page.getByTestId('buscar-input')
    await buscador.click()
    await buscador.fill(palabraValida)
    await expect(buscador).toHaveValue(palabraValida)

    await buscador.dispatchEvent('input')
    await page.waitForResponse('**/api/comercios/lista?**')

    const cantidadFil = await searchCount(page)
    await expect(cantidadFil).toBeLessThan(cantidadInic)

    const tituloFil = await page
      .locator('[data-testclass="tarjeta-title"]')
      .first()
      .textContent()
    await expect(tituloFil).toBe(tituloValido)

    await buscador.click()
    await buscador.fill(palabraValida + ' ')
    await expect(buscador).toHaveValue(palabraValida + ' ')

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
