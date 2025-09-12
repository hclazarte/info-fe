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

    // 1. Verificar título Información del Comercio
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // 2. Verificar que Tipo Plan está habilitado
    const planGratuito = page.getByTestId('gratuito-input')
    await expect(planGratuito).toBeEnabled()
    await planGratuito.check()

    // 3. Editar datos básicos
    await page.getByTestId('nombre-zona-input').fill('SAN MIGUEL')
    await page.getByTestId('calle-numero-input').fill('AV. BALLIVIÁN 123')

    const botonSiguiente = page.getByTestId('siguiente-button')

    // 4. Pulsar siguiente y avanzar a segunda pantalla de información
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    // Editar en substep 2
    await page.getByTestId('telefono1-input').fill('78945612')

    // Avanzar a Autorización
    await expect(botonSiguiente).toBeEnabled()
    await botonSiguiente.click()
    await expect(page.getByTestId('titulo-paso')).toHaveText('Autorización')

    // 5. Dar autorización
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

    // // 6. Verificar que la URL final no contiene "registro-comercio"
    // await expect(page).not.toHaveURL(/.*registro-comercio.*/)

    // // 7. Recargar la url de registro y verificar datos editados
    // await page.goto(`${baseURL}/app/registro-comercio?token=${token}`)
    // await expect(page.getByTestId('titulo-paso')).toHaveText(
    //   'Información del Comercio'
    // )
    // await expect(page.getByTestId('nombre-zona-input')).toHaveValue('SAN MIGUEL')
    // await expect(page.getByTestId('pagina-web-input')).toHaveValue(
    //   'https://sanmiguel.bo'
    // )

    // // Avanzar y volver a verificar persistencia
    // await expect(botonSiguiente).toBeEnabled()
    // await botonSiguiente.click()
    // await expect(page.getByTestId('pagina-web-input')).toHaveValue(
    //   'https://sanmiguel.bo'
    // )

    // // 8. Terminar flujo en ¡Gracias por registrarse!
    // await expect(botonSiguiente).toBeEnabled()
    // await botonSiguiente.click()
    // await expect(page.getByTestId('titulo-paso')).toHaveText(
    //   '¡Gracias por registrarse!'
    // )

    // // Verificación final en frontend
    // await gotoAndWait(page, '/bolivia/la-paz/san-miguel')
    // const tarjeta = page.locator('[data-testclass="tarjeta-control"]', {
    //   hasText: 'SAN MIGUEL'
    // })
    // await expect(tarjeta).toContainText('CAFETERÍA, RESTAURANTE')
    // await expect(tarjeta).toContainText('78945612')
  })
})
