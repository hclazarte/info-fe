import { test, expect } from '@playwright/test';

test('Verificación de la ciudad por defecto, sin zonas en la página principal', async ({ page }) => {
  await page.goto('/tarija/el-molino');
  await expect(page).toHaveURL('/bolivia/tarija/el-molino');
  const etiquetaBusqueda = page.locator('[data-testid="etiqueta-busqueda"]')
  const rawText = await etiquetaBusqueda.innerText();
  const match = rawText.match(/\((\d+)\)/);
  if (!match) throw new Error('Formato inesperado');
  const cantidad = parseInt(match[1], 10);
  await expect(cantidad).toBeGreaterThan(0);
  const resultados = await page.locator('[data-testid="resultados-div"]')
  await resultados.evaluate(node => {
    node.scrollTop = node.scrollHeight;
  });
  await expect(resultados.locator('section')).toHaveCount(cantidad);
});