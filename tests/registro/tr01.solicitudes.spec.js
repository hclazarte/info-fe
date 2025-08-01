import { test, expect, request } from '@playwright/test'

test('Escenario 1 - email igual a email verificado gratuito ', async ({
  page,
  baseURL
}) => {
  // Preparar el escenario en el backend y obtener el token
  const apiContext = await request.newContext()
  const response = await apiContext.post(
    `${baseURL}/api/solicitudes/preparar_escenarios`,
    {
      data: { caso: 1 }
    }
  )

  expect(response.ok()).toBeTruthy()

  const json = await response.json() // aquí obtenés el array de tokens

  const tokenComercioValidado = json.find((d) => d.comercio_id === 53258)?.token
  expect(tokenComercioValidado).toBeDefined()

  // Navegar al flujo de registro con el token
  await page.goto(
    `${baseURL}/app/registro-comercio?token=${tokenComercioValidado}`
  )

  // Verificar que no esté en paso de validación de identidad
  await expect(page.locator('[data-testid="titulo-paso"]')).not.toHaveText(
    'Validación de Identidad'
  )

  const botonSiguiente = page.locator('[data-testid="siguiente-button"]')
  const botonAtras = page.locator('[data-testid="atras-button"]')

  await expect(botonSiguiente).toBeEnabled()
  await expect(botonAtras).toBeDisabled()
})
