import { test, expect, request } from '@playwright/test'
import { gotoAndWait, waitForTokenPageData, prepararEscenario, saveBase64PdfToFile } from '../utils'

test.describe('@acceptance', () => {
  test('Flujo distinto email en solicitud y comercio 53257', async ({
    page,
    baseURL
  }) => {
    const json = await prepararEscenario('tr01', baseURL)
    const tempPath = await saveBase64PdfToFile(json.comprobante_pdf)
    let token = json.token
    
    await waitForTokenPageData(page, token)

    // Verificar que el paso inicial sea Validación de Identidad
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Validación de Identidad'
    )

    // Verificar que los botones estén deshabilitados
    const botonSiguiente = page.getByTestId('siguiente-button')
    await expect(botonSiguiente).toBeDisabled()
    const botonValidar = page.getByTestId('validar-button')
    await expect(botonValidar).toBeDisabled()

    // Verificar que el texto de la empresa sea GEOSOFT INTERNACIONAL SRL
    const empresaP = page.getByTestId('empresa-p')
    await expect(empresaP).toHaveText('GEOSOFT INTERNACIONAL SRL')

    // Ir a la aplicación y verificar que el email no esta verificado
    await gotoAndWait(page, '/bolivia/la-paz/geosoft-internacional-srl')
    const tarjeta = page.locator('[data-testclass="tarjeta-control"]', {
      hasText: 'GEOSOFT INTERNACIONAL SRL'
    })
    await expect(tarjeta).toContainText('Email no disponible')

    // Cargar NIT, CI y presionar validar
    await page.goto(`${baseURL}/app/registro-comercio?token=${token}`)
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Validación de Identidad'
    )

    const nit = page.getByTestId('nit-input')
    await nit.setInputFiles('./public/data/NIT-GEOSOFT.pdf')

    const ci = page.getByTestId('ci-input')
    await ci.setInputFiles('./public/data/CI.jpg')

    const validarButton = page.getByTestId('validar-button')

    // Click y espera hasta que llegue respuesta exitosa de la validación
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/documentos') && r.status() === 200,
        { timeout: 60000 }
      ),
      validarButton.click()
    ])

    // Verificar que se muestre el texto de validación
    await expect(page.getByText('Registro Validado')).toBeVisible({
      timeout: 60000
    })
    const siguienteButton = page.getByTestId('siguiente-button')

    await expect(siguienteButton).toBeEnabled()
    await siguienteButton.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Ir a la aplicación y verificar que el email está verificado
    await gotoAndWait(page, '/bolivia/la-paz/geosoft-internacional-srl')
    await expect(tarjeta).toContainText('Email disponible')

    // Cargar NIT, CI y presionar validar
    await page.goto(`${baseURL}/app/registro-comercio?token=${token}`)
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Elegir tipo de plan "De Pago"
    await page.getByTestId('depago-input').check()

    // Substep 1
    await page.getByTestId('ciudad-select').selectOption('24')
    await page.getByTestId('zona-select').selectOption('67')

    await page.getByTestId('nombre-zona-input').fill('14 DE SEPTIEMBRE')
    await page.getByTestId('calle-numero-input').fill('CALLE 9 ESQUINA A')
    await page.getByTestId('planta-input').fill('SEGUNDO PISO')
    await page.getByTestId('numero-local-input').fill('12B')

    // Ir a substep 2
    await expect(siguienteButton).toBeEnabled()
    await siguienteButton.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Substep 2
    await page.getByTestId('telefono1-input').fill('72123456')
    await page.getByTestId('telefono2-input').fill('76543210')
    await page.getByTestId('whatsapp-input').fill('59172123456')
    await page.getByTestId('pagina-web-input').fill('https://geosoft.bo')

    // Para los textareas sin data-testid (usa texto visible u otro método)
    await page
      .getByTestId('servicios-textarea')
      .fill('SISTEMAS WEB, APP MÓVILES, CLOUD')
    await page.getByTestId('claves-textarea').fill('ESPERICAURICONO')

    // Ir a Plan de Pagos
    await expect(siguienteButton).toBeEnabled()
    await siguienteButton.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Pago del Plan'
    )

    // Selecciona el input de tipo file y carga el archivo temporal
    const fileInput = page.getByTestId('comprobante-input')
    await fileInput.setInputFiles(tempPath)
    
    // Valida comprobante y espera hasta que llegue respuesta exitosa de la validación
    await expect(validarButton).toBeEnabled()
    await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/api/documentos') && r.status() === 200,
        { timeout: 60000 }
      ),
      validarButton.click()
    ])

    
  })
})
