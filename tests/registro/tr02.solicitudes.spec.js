import { test, expect, request } from '@playwright/test'
import {
  gotoAndWait,
  waitForTokenPageData,
  prepararEscenario,
  saveBase64PdfToFile
} from '../utils'

test.use({ browserName: 'chromium' })
test.describe('@acceptance', () => {
  test('Flujo TR02 – email igual en solicitud y comercio 53258', async ({
    page,
    baseURL
  }) => {
    const json = await prepararEscenario('tr02', baseURL)
    const tempPath = await saveBase64PdfToFile(json.comprobante_pdf)
    const token = json.token

    await waitForTokenPageData(page, token)

    // Verificar que el paso inicial sea Información del Comercio
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Verificar que ya esté seleccionado el plan de pago gratuito por defecto
    const radioGratutito = page.getByTestId('gratuito-input')
    await expect(radioGratutito).toBeChecked()

    // Elegir tipo de plan "De Pago"
    await page.getByTestId('depago-input').check()

    // Substep 1
    await page.getByTestId('ciudad-select').selectOption('44') // Oruro
    await page.getByTestId('zona-select').selectOption('31') // Central

    await page.getByTestId('nombre-zona-input').fill('14 DE SEPTIEMBRE')
    await page.getByTestId('calle-numero-input').fill('AYACUCHO Nº s/n')
    await page.getByTestId('planta-input').fill('')
    await page.getByTestId('numero-local-input').fill('')

    const botonSiguiente = page.getByTestId('siguiente-button')
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Substep 2
    await page.getByTestId('telefono1-input').fill('72300013')
    await page.getByTestId('telefono2-input').fill('')
    await page.getByTestId('whatsapp-input').fill('59160500015')
    await page.getByTestId('pagina-web-input').fill('https://vasquez.com.bo')
    await page
      .getByTestId('servicios-textarea')
      .fill('COMERCIALIZACIÓN VARIADA')
    await page.getByTestId('claves-textarea').fill('VASQUEZ ORURO')

    // Volver a modo gratuito
    await radioGratutito.check()
    await page.pause()
    await expect(page.getByTestId('error-telefono_whatsapp')).toBeVisible()
    await expect(page.getByTestId('error-pagina_web')).toBeVisible()
    await expect(page.getByTestId('error-servicios')).toBeVisible()

    // Verificar que WhatsApp tiene el valor esperado
    const inputWhatsapp = page.getByTestId('whatsapp-input')
    const inputPaginaWeb = page.getByTestId('pagina-web-input')
    const inputServicios = page.getByTestId('servicios-textarea')

    await expect(inputWhatsapp).toHaveValue('59172300013')
    await expect(inputPaginaWeb).toHaveValue('')
    await expect(inputServicios).toHaveValue('')

    // Elegir nuevamente tipo de plan "De Pago"
    await page.getByTestId('depago-input').check()

    await page.getByTestId('whatsapp-input').fill('59172300013')
    await page.getByTestId('pagina-web-input').fill('https://vasquez.com.bo')
    await page
      .getByTestId('servicios-textarea')
      .fill('COMERCIALIZACIÓN VARIADA')
    await page.getByTestId('claves-textarea').fill('VASQUEZ ORURO')

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText('Pago del Plan')

    const fileInput = page.getByTestId('comprobante-input')
    await fileInput.setInputFiles(tempPath)

    const validarButton = page.getByTestId('validar-button')
    await expect(validarButton).toBeEnabled()
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/documentos') && r.status() === 200,
        { timeout: 60000 }
      ),
      validarButton.click()
    ])

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

    // Verificación final
    await gotoAndWait(page, '/bolivia/oruro/vasquez-oruro')
    const tarjeta = page.locator('[data-testclass="tarjeta-control"]', {
      hasText: 'COMERCIAL VASQUEZ'
    })
    await expect(tarjeta).toContainText('Email disponible')
    await expect(tarjeta.getByText('COMERCIAL VASQUEZ')).toBeVisible()
    await expect(tarjeta.getByText('COMERCIALIZACIÓN VARIADA')).toBeVisible()
    await expect(
      tarjeta.getByText('AYACUCHO Nº s/n, 14 DE SEPTIEMBRE')
    ).toBeVisible()
    await expect(tarjeta.getByText('72300013')).toBeVisible()

    // Verificar modal
    await clickCardAndWait(tarjeta)
    const modal = page.getByTestId('detalle-modal')
    await expect(
      modal.getByRole('heading', { name: 'COMERCIAL VASQUEZ' })
    ).toBeVisible()
    await expect(modal.getByText('Comercio validado')).toBeVisible()
    await expect(modal.getByText('Zona: 14 DE SEPTIEMBRE')).toBeVisible()
    await expect(modal.getByText('Dirección: AYACUCHO Nº s/n')).toBeVisible()
    await expect(
      modal.getByText('Servicios: COMERCIALIZACIÓN VARIADA')
    ).toBeVisible()
    await expect(modal.getByText('Teléfonos:')).toBeVisible()
    await expect(modal.getByTestId('telefono_whatsapp')).toContainText(
      '59172300013'
    )
    await expect(
      modal.getByTestId('telefonos').getByTestId('telefono-item').first()
    ).toHaveText('72300013')
    await expect(modal.getByText('Enviar Correo')).toBeVisible()
    await expect(modal.getByText('Ver Mapa')).toBeVisible()
    await expect(modal.getByAltText('WhatsApp')).toBeVisible()
    await expect(modal.getByRole('button', { name: '✕' })).toBeVisible()
  })
})
