// tests/registro/tr05.solicitudes.spec.js
import { test, expect } from '@playwright/test'
import { waitForTokenPageData, prepararEscenario } from '../utils'

test.use({ browserName: 'chromium' })
test.describe('@acceptance', () => {
  test('Flujo TR05 – Comercio con plan gratuito y autorizado', async ({
    page,
    baseURL
  }) => {
    // Preparar escenario en BE
    const json = await prepararEscenario('tr05', baseURL)
    const token = json.token

    // Ir al link con token
    await waitForTokenPageData(page, token)

    // Al acceder al link con token, se muestra el título “Información del Comercio”.
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    const botonSiguiente = page.getByTestId('siguiente-button')

    // Pulsar “Siguiente” tres veces (no se muestran validación de documentos ni pago).
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // El flujo termina mostrando el título “¡Gracias por registrarse!”.
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )
  })
})
