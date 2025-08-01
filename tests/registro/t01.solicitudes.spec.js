import { test, expect, request } from '@playwright/test';

test('Escenario 1 - email igual a email verificado gratuito ', async ({ page, baseURL }) => {
  // Preparar el escenario en el backend y obtener el token
  const apiContext = await request.newContext();
  const response = await apiContext.post(`${baseURL}/api/solicitudes/preparar_escenario`, {
    data: { caso: 1 }
  });

  expect(response.ok()).toBeTruthy();
  const { token } = await response.json();
  expect(token).toBeDefined();

  // Navegar al flujo de registro con el token
  await page.goto(`${baseURL}/app/registro-comercio?token=${token}`);

  // Verificar que el paso 1 se muestra
  await expect(page.getByText('Paso 1')).toBeVisible();

  // Verificar que el botón Siguiente esté deshabilitado o muestre mensaje
  const botonSiguiente = page.getByRole('button', { name: /siguiente/i });

  // Opción A: está deshabilitado
  await expect(botonSiguiente).toBeDisabled();

  // Opción B: hace click y muestra mensaje de error
  // await botonSiguiente.click();
  // await expect(page.getByText(/debe validar/i)).toBeVisible();
});
