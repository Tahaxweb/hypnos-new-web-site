import type { APIRequestContext, Page } from '@playwright/test'
import sharp from 'sharp'

export const ADMIN = { email: process.env.SEED_ADMIN_EMAIL!, password: process.env.SEED_ADMIN_PASSWORD! }
export const AUTHOR = { email: process.env.SEED_AUTHOR_EMAIL!, password: process.env.SEED_AUTHOR_PASSWORD! }

export async function loginUI(page: Page, user = ADMIN) {
  await page.goto('/admin/login')
  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type=submit]')
  await page.waitForURL(/\/admin$/)
}

/** REST API için oturum: dönen token Authorization başlığında kullanılır. */
export async function apiToken(request: APIRequestContext, user = ADMIN) {
  const res = await request.post('/api/users/login', { data: user })
  if (!res.ok()) throw new Error(`Giriş başarısız: ${res.status()}`)
  return (await res.json()).token as string
}

export const auth = (token: string) => ({ Authorization: `JWT ${token}` })

export async function pngBuffer(label = 'TEST', w = 1600, h = 1000) {
  return sharp(
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#000"/><text x="80" y="${h / 2}" font-size="120" fill="#fff" font-family="Helvetica">${label}</text></svg>`),
  )
    .png()
    .toBuffer()
}
