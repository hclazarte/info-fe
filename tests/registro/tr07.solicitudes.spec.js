// tests/registro/tr07.solicitudes_no_seprec.spec.js
import { test, expect } from '@playwright/test'
import { LONG_WAIT_TIMEOUT } from '../config.js'
import {
  gotoAndWait,
  waitForTokenPageData,
  prepararEscenario,
  saveBase64PdfToFile
} from '../utils'

test.use({ browserName: 'chromium' })

test.describe('@acceptance', () => {
  test('Flujo TR07 – Comercio No SEPREC con plan de pago (bloqueado) hasta publicación y verificación en búsqueda', async ({
    page,
    baseURL
  }) => {
    // Preparar escenario en BE (TR07)
    const json = await prepararEscenario('tr07', baseURL)
    const tempPath = await saveBase64PdfToFile(json.comprobante_pdf)
    const token = json.token

    // Abrir enlace con token
    await waitForTokenPageData(page, token)

    // Se muestra el paso de Información del Comercio
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Plan bloqueado en "De Pago"
    const radioPago = page.getByTestId('depago-input')
    const radioGratuito = page.getByTestId('gratuito-input')
    await expect(radioPago).toBeChecked()
    await expect(radioPago).toBeDisabled()
    await expect(radioGratuito).not.toBeChecked()
    await expect(radioGratuito).toBeDisabled()

    const botonSiguiente = page.getByTestId('siguiente-button')
    await botonSiguiente.click()

    // Completar campos mínimos requeridos del comercio
    await page.getByTestId('telefono1-input').fill('78900001')
    await page.getByTestId('claves-textarea').fill('ASUSTADERAS')
    await page
      .getByTestId('servicios-textarea')
      .fill('SERVICIOS DE ASUSTADERAS')

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // Paso de Ubicación Geográfica: fijar coordenadas (llenando inputs para evitar flakiness)
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )
    await page.getByTestId('latitud-input').fill('-16.511713')
    await page.getByTestId('longitud-input').fill('-68.125082')

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText('Pago del Plan')

    // Paso de Pago: subir comprobante y validar
    const fileInput = page.getByTestId('comprobante-input')
    await fileInput.setInputFiles(tempPath)

    const validarButton = page.getByTestId('validar-button')
    await expect(validarButton).toBeEnabled()
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/documentos') && r.status() === 200,
        { timeout: LONG_WAIT_TIMEOUT }
      ),
      validarButton.click()
    ])

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // Paso de Autorización
    await expect(page.getByTestId('titulo-paso')).toHaveText('Autorización')
    const checkbox = page.getByTestId('autorizo-input')
    await checkbox.check()

    const botonTerminar = page.getByTestId('terminar-button')
    await expect(botonTerminar).toBeEnabled()
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/comercios') && r.status() === 200,
        { timeout: LONG_WAIT_TIMEOUT }
      ),
      botonTerminar.click()
    ])

    // Mensaje final
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )

    // Ver resultados en página pública (búsqueda/slug)
    await page.goto('/bolivia/la-paz/tienda-don-toleras')
    await expect(
      page.getByText('TIENDA DON TOLERAS', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText('Av. Murillo N° 1234', { exact: false })
    ).toBeVisible()
  })
})
