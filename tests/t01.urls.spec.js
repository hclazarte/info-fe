// @ts-check
import { test, expect } from '@playwright/test'

test('Verificación de la ciudad por defecto, sin zonas en la página principal', async ({
  page
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Infomóvil/)
  await expect(page).toHaveURL('/bolivia/la-paz')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue(
    /la paz/i
  )
  await expect(page.locator('[data-testid="zona-input"]')).toHaveValue('')
})

test('Verificación de ciudad que no tiene zonas en la URL de una ciudad específica', async ({
  page
}) => {
  await page.goto('/Bolivia/La-Guardia')

  await expect(page).toHaveURL('bolivia/la-guardia')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue(
    /la guardia/i
  )
  await expect(page.locator('[data-testid="zona-input"]')).not.toBeVisible()
})

test('Verificación sin pais, sin ciudad y texto "transporte"', async ({
  page
}) => {
  await page.goto('/transporte')

  await expect(page).toHaveURL('bolivia/transporte')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue(
    /transporte/i
  )
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="zona-input"]')).not.toBeVisible()
})

test('Verificación con bolivia, sin ciudad y texto "baritina"', async ({
  page
}) => {
  await page.goto('/bolivia/Baritina')

  await expect(page).toHaveURL('bolivia/baritina')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue(
    'baritina'
  )
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="zona-input"]')).not.toBeVisible()
})

test('Verificación con pais y ciudad', async ({ page }) => {
  await page.goto('/Bolivia/La Paz')

  await expect(page).toHaveURL('bolivia/la-paz')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue(
    /la paz/i
  )
  await expect(page.locator('[data-testid="zona-input"]')).toHaveValue('')
})

test('Verificación con pais, ciudad y texto', async ({ page }) => {
  await page.goto('/Bolivia/La-Paz/mercancias')

  await expect(page).toHaveURL('bolivia/la-paz/mercancias')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue(
    'mercancias'
  )
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue(
    /la paz/i
  )
  await expect(page.locator('[data-testid="zona-input"]')).toHaveValue('')
})

test('Verificación con pais, ciudad y zona', async ({ page }) => {
  await page.goto('/Bolivia/La-Paz/Achumani')

  await expect(page).toHaveURL('bolivia/la-paz/achumani')
  await expect(page.locator('[data-testid="buscar-input"]')).toHaveValue('')
  await expect(page.locator('[data-testid="ciudad-input"]')).toHaveValue(
    /la paz/i
  )
  await expect(page.locator('[data-testid="zona-input"]')).toHaveValue(
    /achumani/i
  )
})
