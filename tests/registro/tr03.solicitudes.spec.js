// tests/registro/tr03.solicitud.spec.js
import { test, expect } from '@playwright/test'
import { gotoAndWait, waitForTokenPageData, prepararEscenario } from '../utils'

test.describe('@acceptance', () => {
  test('Flujo TR03 – Comercio con plan gratuito, documentos validados, no autorizado', async ({
    page,
    baseURL
  }) => {
    // Preparar escenario en BE
    const json = await prepararEscenario('tr03', baseURL)
    const token = json.token

    // Ir al link con token
    await waitForTokenPageData(page, token)

    // 1. Al acceder al link con token, se muestra el título “Información del Comercio”.
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // 2. El campo “Tipo Plan” está habilitado y se puede seleccionar “Gratuito”.
    const planGratuito = page.getByTestId('gratuito-input')
    await expect(planGratuito).toBeEnabled()
    await planGratuito.check()

    // 3. Es posible editar datos del comercio.
    await page.getByTestId('nombre-zona-input').fill('SAN MIGUEL')
    await page.getByTestId('calle-numero-input').fill('AV. BALLIVIÁN 123')
    const botonSiguiente = page.getByTestId('siguiente-button')

    // 4. Pulsar siguiente y editar en la segunda pantalla de información
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )
    await page.getByTestId('telefono1-input').fill('78945612')

    // 5. En la pantalla de autorización, al pulsar “Sí autorizo”, “Terminar”, y finaliza el proceso.
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText('Autorización')

    const checkbox = page.getByTestId('autorizo-input')
    await checkbox.check()

    const botonTerminar = page.getByTestId('terminar-button')
    await expect(botonTerminar).toBeEnabled()
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/comercios') && r.status() === 200,
        { timeout: 60000 }
      ),
      botonTerminar.click()
    ])

    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )
    const botonFinalizar = page.getByTestId('finalizar-button')

    await expect(botonFinalizar).toBeEnabled()
    await botonFinalizar.click()

    // 6. La URL final no contiene registro-comercio.
    await expect(page).not.toHaveURL(/.*registro-comercio.*/)

    // 7. Al recargar el link de registro, los datos editados se conservan.
    await waitForTokenPageData(page, token)
    await expect(page.getByTestId('nombre-zona-input')).toHaveValue(
      'SAN MIGUEL'
    )
    await expect(page.getByTestId('calle-numero-input')).toHaveValue(
      'AV. BALLIVIÁN 123'
    )
    await botonSiguiente.click()
    await expect(page.getByTestId('telefono1-input')).toHaveValue('78945612')

    // 8. Al avanzar nuevamente, se muestran los datos editados hasta llegar a “¡Gracias por registrarse!”.
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )
  })
})
