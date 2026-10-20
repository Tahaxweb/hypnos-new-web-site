import { expect, test } from '@playwright/test'

import { apiToken, auth, loginUI, pngBuffer } from './helpers'

/**
 * Panelden uçtan uca case study akışı:
 * yeni proje → kapak görseli yükleme (medya) → katman ekleme → katmanları yeniden sıralama → taslak → yayın → sitede doğrulama.
 */
test('panelden yeni case study oluşturulur, katmanlar sıralanır, taslak kaydedilir ve yayınlanır', async ({ page, request }) => {
  const stamp = Date.now()
  const title = `E2E Test Projesi ${stamp}`
  const slug = `e2e-test-projesi-${stamp}`

  await loginUI(page)
  await page.goto('/admin/collections/projects/create')

  // Proje bilgileri
  await page.fill('#field-title', title)
  await page.fill('#field-client', 'E2E Test Markası')
  await page.fill('#field-excerpt', 'Uçtan uca test için oluşturulan geçici proje.')

  // Kapak görseli: medya kütüphanesine yeni dosya yükle
  const cover = page.locator('#field-cover').locator('..')
  await cover.getByRole('button', { name: /Yeni oluştur/i }).first().click()
  await page.locator('input[type=file]').last().setInputFiles({ name: 'e2e kapak görseli.png', mimeType: 'image/png', buffer: await pngBuffer('E2E') })
  await page.locator('#field-alt').last().fill('E2E test kapak görseli')
  await page.getByRole('button', { name: 'Kaydet' }).last().click()
  await expect(page.locator('#field-cover').locator('..')).toContainText(/e2e-kapak-gorseli/i)

  // Katmanlar
  await page.locator('.tabs-field__tab-button', { hasText: 'Katmanlar' }).click()
  await page.locator('.blocks-field__drawer-toggler').click()
  await page.getByRole('button', { name: /Metin \(tek sütun\)/ }).click()
  await page.fill('#field-layout__0__heading', 'Birinci katman')
  await page.locator('[data-field-path="layout.0.content"] [contenteditable="true"], #field-layout__0__content [contenteditable="true"]').first().click()
  await page.keyboard.type('Metin katmanının içeriği.')

  await page.locator('.blocks-field__drawer-toggler').last().click()
  await page.getByRole('button', { name: /^Alıntı/ }).click()
  await page.fill('#field-layout__1__quote', 'İkinci katman alıntısı')
  await page.fill('#field-layout__1__author', 'Test Kişi')

  // Yeniden sırala: ikinci katmanı yukarı taşı
  await page.locator('.blocks-field__rows > *').nth(1).locator('.array-actions__button').first().click()
  await page.locator('.array-actions__action', { hasText: 'Yukarı taşı' }).click()
  await expect(page.locator('#field-layout__0__quote')).toHaveValue('İkinci katman alıntısı')

  // Taslak kaydet (otomatik kayıt açık; ayrıca elle kaydedilir)
  const saveDraft = page.getByRole('button', { name: 'Taslağı kaydet' })
  if (await saveDraft.isVisible().catch(() => false)) await saveDraft.click()
  await page.waitForURL(/\/admin\/collections\/projects\/\d+/)
  const id = page.url().match(/projects\/(\d+)/)![1]

  // Taslak henüz sitede görünmez
  await expect.poll(async () => (await request.get(`/portfolyo/${slug}`)).status(), { timeout: 30_000 }).toBe(404)

  // Yayınla
  await page.getByRole('button', { name: /^(Yayınla|Değişiklikleri yayınla)$/ }).click()
  await expect(page.getByText(/Durum:\s*Yayınlandı/)).toBeVisible()

  // Sitede katmanlar panel sırasıyla görünür
  await page.goto(`/portfolyo/${slug}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
  const quote = page.getByText('“İkinci katman alıntısı”')
  const text = page.getByRole('heading', { name: 'Birinci katman' })
  await expect(quote).toBeVisible()
  await expect(text).toBeVisible()
  const [qy, ty] = await Promise.all([quote.boundingBox(), text.boundingBox()])
  expect(qy!.y).toBeLessThan(ty!.y)

  // Kapak görseli optimize edilmiş olarak sunulur ve alternatif metni vardır
  await expect(page.getByAltText('E2E test kapak görseli')).toBeVisible()

  // Önceki sürüme dönülebilir: sürüm geçmişi oluştu
  const token = await apiToken(request)
  const versions = await request.get(`/api/projects/versions?where[parent][equals]=${id}&limit=50`, { headers: auth(token) })
  expect((await versions.json()).totalDocs).toBeGreaterThan(1)

  // Temizlik
  const proj = await (await request.get(`/api/projects/${id}?depth=0`, { headers: auth(token) })).json()
  await request.delete(`/api/projects/${id}`, { headers: auth(token) })
  if (proj.cover) await request.delete(`/api/media/${proj.cover}`, { headers: auth(token) })
})
