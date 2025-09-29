// @ts-check
import { test, expect } from '@playwright/test'
import { gotoAndWait } from '../utils'

test.describe('@smoke', () => {
  test('Verificación de la ciudad por defecto, sin zonas en la página principal', async ({
    page
  }) => {
    await gotoAndWait(page, '/')
    await expect(page).toHaveTitle(/Infomóvil/)
    await expect(page.getByTestId('buscar-input')).toHaveValue('')
    await expect(page.getByTestId('ciudad-input')).toHaveValue(/la paz/i)
    await expect(page.getByTestId('zona-input')).toHaveValue('')
    await expect(page).toHaveURL('/bolivia/la-paz')
  })
})
test.describe('@smoke', () => {
  test('Verificación de ciudad que no tiene zonas en la URL de una ciudad específica', async ({
    page
  }) => {
    await gotoAndWait(page, '/Bolivia/La-Guardia')

    await expect(page.getByTestId('buscar-input')).toHaveValue('')
    await expect(page.getByTestId('ciudad-input')).toHaveValue(/la guardia/i)
    await expect(page.getByTestId('zona-input')).not.toBeVisible()
    await expect(page).toHaveURL('bolivia/la-guardia')
  })
})
test.describe('@smoke', () => {
  test('Verificación sin pais, sin ciudad y texto "transporte"', async ({
    page
  }) => {
    await gotoAndWait(page, '/transporte')

    await expect(page.getByTestId('buscar-input')).toHaveValue(/transporte/i)
    await expect(page.getByTestId('ciudad-input')).toHaveValue('')
    await expect(page.getByTestId('zona-input')).not.toBeVisible()
    await expect(page).toHaveURL('bolivia/transporte')
  })
})
test.describe('@smoke', () => {
  test('Verificación con bolivia, sin ciudad y texto "baritina"', async ({
    page
  }) => {
    await gotoAndWait(page, '/bolivia/Baritina')

    await expect(page.getByTestId('buscar-input')).toHaveValue('baritina')
    await expect(page.getByTestId('ciudad-input')).toHaveValue('')
    await expect(page.getByTestId('zona-input')).not.toBeVisible()
    await expect(page).toHaveURL('bolivia/baritina')
  })
})
test.describe('@smoke', () => {
  test('Verificación con pais y ciudad', async ({ page }) => {
    await gotoAndWait(page, '/Bolivia/La Paz')

    await expect(page.getByTestId('buscar-input')).toHaveValue('')
    await expect(page.getByTestId('ciudad-input')).toHaveValue(/la paz/i)
    await expect(page.getByTestId('zona-input')).toHaveValue('')
    await expect(page).toHaveURL('bolivia/la-paz')
  })
})
test.describe('@smoke', () => {
  test('Verificación con pais, ciudad y texto', async ({ page }) => {
    await gotoAndWait(page, '/Bolivia/La-Paz/mercancias')

    await expect(page.getByTestId('buscar-input')).toHaveValue('mercancias')
    await expect(page.getByTestId('ciudad-input')).toHaveValue(/la paz/i)
    await expect(page.getByTestId('zona-input')).toHaveValue('')
    await expect(page).toHaveURL('bolivia/la-paz/mercancias')
  })
})
test.describe('@smoke', () => {
  test('Verificación con pais, ciudad y zona', async ({ page }) => {
    await gotoAndWait(page, '/Bolivia/La-Paz/Achumani')

    await expect(page.getByTestId('buscar-input')).toHaveValue('')
    await expect(page.getByTestId('ciudad-input')).toHaveValue(/la paz/i)
    await expect(page.getByTestId('zona-input')).toHaveValue(/achumani/i)
    await expect(page).toHaveURL('bolivia/la-paz/achumani')
  })
})
test.describe('@smoke', () => {
  test('Verificación con palabra and', async ({ page }) => {
    await gotoAndWait(page, '/bolivia/acuavid-import-and-export')

    await expect(page.getByTestId('buscar-input')).toHaveValue(
      'acuavid-import-and-export'
    )
    await expect(page).toHaveURL('bolivia/acuavid-import-and-export')
  })
})
