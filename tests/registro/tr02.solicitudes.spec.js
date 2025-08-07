import { test, expect, request } from '@playwright/test'
import { gotoAndWait, waitForTokenPageData, prepararEscenario } from '../utils'

test.describe('@acceptance', () => {
  test('Flujo mismo email en solicitud y comercio 53258', async ({
    page,
    baseURL
  }) => {
    const json = await prepararEscenario('tr02')
    let token = json.token

    await waitForTokenPageData(page, json.token)
    await expect(page.getByTestId('titulo-paso')).toHaveText(
      'Información del Comercio'
    )

    const botonSiguiente = page.getByTestId('siguiente-button')
    const botonAtras = page.getByTestId('atras-button')

    await expect(botonSiguiente).toBeEnabled()
    await expect(botonAtras).toBeDisabled()
  })
})
