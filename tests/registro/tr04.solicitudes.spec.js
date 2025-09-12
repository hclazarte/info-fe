// tests/registro/tr04.solicitudes.spec.js
import { test, expect } from '@playwright/test'
import { waitForTokenPageData, prepararEscenario } from '../utils'

test.describe('@acceptance', () => {
  test('Flujo TR04 – Comercio con plan de pago vigente y autorizado', async ({
    page,
    baseURL
  }) => {
    // Preparar escenario en BE
    const json = await prepararEscenario('tr04', baseURL)
    const token = json.token

    // Ir al link con token
    await waitForTokenPageData(page, token)

    // 1. Verificar título Información del Comercio
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // 2. Verificar que Tipo Plan está deshabilitado
    const planPago = page.getByTestId('depago-input')
    await expect(planPago).toBeDisabled()

    // 3. Pulsar siguiente
    const botonSiguiente = page.getByTestId('siguiente-button')
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // 4. Cambiar el dato página web
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )
    const paginaWebInput = page.getByTestId('pagina-web-input')
    await paginaWebInput.fill('https://tr04-demo.com.bo')
    await expect(paginaWebInput).toHaveValue('https://tr04-demo.com.bo')

    // 5. Siguiente → debe ir directo a ¡Gracias por registrarse!
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )

    // 6. Recargar el link del token
    await waitForTokenPageData(page, token)

    // Avanzar y verificar que persiste la página web editada
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('pagina-web-input')).toHaveValue(
      'https://tr04-demo.com.bo'
    )
  })
})
