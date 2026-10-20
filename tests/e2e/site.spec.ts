import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

import fs from 'node:fs'
import path from 'node:path'

const PAGES = ['/', '/blog', '/blog/iyi-bir-case-study-nasil-yazilir', '/neler-yapiyoruz', '/hizmetler/web-sitesi-gelistirme', '/sektorler/saglik', '/partnerler/shopify', '/portfolyo', '/portfolyo/can-modern', '/hakkimizda', '/iletisim', '/kvkk']

test.describe('site', () => {
  for (const path of PAGES) {
    test(`${path}: tek h1, canonical, açıklama ve ciddi erişilebilirlik hatası yok`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', path === '/' ? /^https?:\/\/[^/]+\/?$/ : new RegExp(`${path}$`))
      expect((await page.locator('meta[name=description]').getAttribute('content'))?.length).toBeGreaterThan(40)
      expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0)

      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      const serious = axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }

  test('Hakkımızda sayfası brifteki metni ve "creative reklam ajansı" vurgusunu içerir', async ({ page }) => {
    await page.goto('/hakkimizda')
    await expect(page.getByText('Hypnos Interactive geleneksel, dijital ve sosyal medya reklamcılığı ile 360 derece iletişim yaparak insanlarla markalar arasında bağ kurmayı hedefler.')).toBeVisible()
    await expect(page.getByText(/akıl, fikir ve teknik üçlüsünün sinerjisi/)).toBeVisible()
    await expect(page.locator('strong', { hasText: 'creative reklam ajansı!' })).toBeVisible()
  })

  test('menü: açılır panel ve klavye ile kapatma', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: /Neler yapıyoruz/i })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('link', { name: 'Meta Ads Yönetimi' }).first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('mobil menü açılır, alt menüler görünür, Esc ile kapanır', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const btn = page.getByRole('button', { name: 'Menü' })
    await btn.click()
    await expect(page.getByRole('navigation', { name: 'Mobil menü' })).toBeVisible()
    await page.getByRole('navigation', { name: 'Mobil menü' }).locator('summary', { hasText: 'Sektörler' }).click()
    await expect(page.getByRole('link', { name: 'Otomotiv' }).last()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Mobil menü' })).toBeHidden()
    // Yatay kaydırma olmamalı
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy()
  })

  test('portfolyo filtresi çalışır ve adrese yazılır', async ({ page }) => {
    await page.goto('/portfolyo')
    await page.getByRole('button', { name: 'Savunma Sanayi' }).click()
    await expect(page).toHaveURL(/sektor=savunma-sanayi/)
    await expect(page.getByRole('link', { name: 'GTI Savunma Sanayi' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Krembi' })).toBeHidden()
  })

  test('iletişim formu: doğrulama hataları ve başarılı gönderim', async ({ page }) => {
    await page.goto('/iletisim?hizmet=meta-ads-yonetimi')
    await expect(page.locator('#service')).toHaveValue('Meta Ads Yönetimi')
    await page.waitForTimeout(2200) // bot korumasındaki en kısa süre
    await page.getByRole('button', { name: /Gönder/ }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'işaretli alanları' })).toBeVisible()
    await expect(page.locator('#name')).toHaveAttribute('aria-invalid', 'true')

    const name = `E2E Form ${Date.now()}`
    await page.fill('#name', name)
    await page.fill('#email', 'form@hypnos.test')
    await page.fill('#message', 'Uçtan uca test mesajı: bir web sitesi projesi için görüşmek istiyoruz.')
    await page.getByLabel(/aydınlatma metnini/).check()
    await page.getByRole('button', { name: /Gönder/ }).click()
    await expect(page.getByRole('status')).toContainText('mesajınız bize ulaştı')

    // Talep sunucunun data/iletisim-talepleri.jsonl dosyasına yazılır; testten sonra satır temizlenir
    const file = path.resolve(process.env.CONTACT_DATA_DIR || './data', 'iletisim-talepleri.jsonl')
    const lines = fs.readFileSync(file, 'utf8').trim().split('\n')
    const found = lines.map((l) => JSON.parse(l)).find((r) => r.name === name)
    expect(found?.service).toBe('Meta Ads Yönetimi')
    fs.writeFileSync(file, lines.filter((l) => !l.includes(name)).join('\n') + (lines.length > 1 ? '\n' : ''))
  })

  test('404, yönlendirmeler, sitemap, robots ve llms.txt', async ({ request }) => {
    expect((await request.get('/olmayan-sayfa')).status()).toBe(404)
    expect((await request.get('/portfolyo/olmayan-proje')).status()).toBe(404)
    const r = await request.get('/hizmetler', { maxRedirects: 0 })
    expect([301, 308]).toContain(r.status())
    expect(r.headers()['location']).toContain('/neler-yapiyoruz#hizmetler')

    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('/hakkimizda')
    expect(sitemap).not.toContain('/hizmetler/') // örnek işaretli içerikler indekslenmez
    expect(sitemap).toContain('/portfolyo/can-modern')
    expect(sitemap).not.toContain('/admin')

    expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:')
    const llms = await (await request.get('/llms.txt')).text()
    expect(llms).toContain('# Hypnos Interactive')
    expect(llms).not.toContain('Örnek Sağlık')
  })

  test('örnek içerik uyarısı ve noindex', async ({ page }) => {
    await page.goto('/hizmetler/marka-kimligi')
    await expect(page.getByRole('note')).toContainText('Örnek içerik')
    await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/)
  })

  test('blog: liste, kategori filtresi ve yazı sayfası', async ({ page }) => {
    await page.goto('/blog')
    await page.getByRole('button', { name: 'Ajans Notları' }).click()
    await expect(page).toHaveURL(/kategori=ajans-notlari/)
    await page.getByRole('link', { name: 'İyi bir case study nasıl yazılır?' }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('İyi bir case study nasıl yazılır?')
    await expect(page.getByText(/dk okuma/).first()).toBeVisible()
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(ld.some((t) => t.includes('"BlogPosting"'))).toBeTruthy()
  })

  test('harita: onay vermeden Google yüklenmez, düğmeyle yüklenir', async ({ page }) => {
    await page.goto('/iletisim')
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0)
    await page.getByRole('button', { name: /Haritayı göster/ }).click()
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1)
  })
})
