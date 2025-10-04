// tests/registro/tr07.solicitudes_no_seprec.spec.js
import { test, expect } from '@playwright/test'
import { waitForTokenPageData, prepararEscenario } from '../utils'
import path from 'path'

test.use({ browserName: 'chromium' })

test.describe('@notready', () => {
  test('Flujo TR07 – Comercio No SEPREC con plan de pago (bloqueado) hasta publicación y verificación en búsqueda', async ({
    page,
    baseURL
  }) => {
    // 1) Preparar escenario en BE (TR07)
    const json = await prepararEscenario('tr07', baseURL)
    const token = json.token

    // 2) Abrir enlace con token
    await waitForTokenPageData(page, token)

    // Se muestra el paso de Información del Comercio
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // 3) Plan bloqueado en "De Pago"
    const radioPago = page.getByTestId('depago-input')
    const radioGratuito = page.getByTestId('gratuito-input')
    await expect(radioPago).toBeChecked()
    await expect(radioPago).toBeDisabled()
    await expect(radioGratuito).not.toBeChecked()
    await expect(radioGratuito).toBeDisabled()

    const botonSiguiente = page.getByTestId('siguiente-button')

    // 4) Completar campos mínimos requeridos del comercio
    await page.getByTestId('telefono1-input').fill('78900001')
    await page.getByTestId('palabras-clave-textarea').fill('ASUSTADERAS')
    await page
      .getByTestId('servicios-textarea')
      .fill('SERVICIOS DE ASUSTADERAS')

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // 5) Paso de Ubicación Geográfica: fijar coordenadas (llenando inputs para evitar flakiness)
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )
    await page.getByTestId('latitud-input').fill('-16.511713')
    await page.getByTestId('longitud-input').fill('-68.125082')

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // 6) Paso de Pago: subir comprobante y validar
    await expect(page.getByTestId('titulo-paso')).toHaveText('Pago del Plan')
    const comprobantePath = path.resolve(
      __dirname,
      '../fixtures/comprobante.pdf'
    )
    await page
      .getByTestId('archivo-comprobante-input')
      .setInputFiles(comprobantePath)

    const validarButton = page.getByTestId('validar-button')
    await expect(validarButton).toBeEnabled()
    await validarButton.click()
    await expect(page.getByTestId('estado-validacion-label')).toHaveText(
      /Registro Validado/i
    )

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()

    // 7) Paso de Autorización
    await expect(page.getByTestId('titulo-paso')).toHaveText('Autorización')
    await page.getByTestId('autorizar-checkbox').check()
    await page.getByTestId('terminar-button').click()

    // 8) Mensaje final
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      '¡Gracias por registrarse!'
    )

    // 9) Ver resultados en página pública (búsqueda/slug)
    //    Opción por slug directo para estabilidad
    await page.goto('/bolivia/la-paz/tienda-don-toleras')
    await expect(
      page.getByText('TIENDA DON TOLERAS', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText('Av. Murillo N° 1234', { exact: false })
    ).toBeVisible()
  })
})
