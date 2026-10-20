import type { APIRoute } from 'astro'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

import type { ContactState } from '@/lib/contact'
import { getSiteSettings } from '@/lib/data'

export const prerender = false

const schema = z.object({
  name: z.string().trim().min(2, 'Adınızı ve soyadınızı yazın.').max(120),
  email: z.string().trim().email('Geçerli bir e-posta adresi yazın.').max(160),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[0-9+()\s-]*$/, 'Telefon numarası yalnız rakam, boşluk ve + ( ) - içerebilir.')
    .optional()
    .or(z.literal('')),
  company: z.string().trim().max(160).optional(),
  service: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().min(20, 'Projenizi birkaç cümleyle anlatın (en az 20 karakter).').max(5000),
  consent: z.literal('on', { error: 'Devam etmek için aydınlatma metnini okuduğunuzu onaylayın.' }),
  sourcePage: z.string().max(200).optional(),
})

// IP başına basit hız sınırı: 10 dakikada en fazla 5 gönderim (tek sunucu örneği için)
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > MAX_PER_WINDOW
}

const json = (body: ContactState, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } })

/** Talepler CONTACT_DATA_DIR (varsayılan ./data) altındaki iletisim-talepleri.jsonl dosyasına eklenir; CONTACT_WEBHOOK_URL varsa ayrıca oraya iletilir. */
async function store(record: Record<string, unknown>) {
  const dir = path.resolve(process.env.CONTACT_DATA_DIR || './data')
  fs.mkdirSync(dir, { recursive: true })
  fs.appendFileSync(path.join(dir, 'iletisim-talepleri.jsonl'), JSON.stringify(record) + '\n')
  const hook = process.env.CONTACT_WEBHOOK_URL
  if (hook) {
    const res = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...record, notifyEmail: getSiteSettings().notifyEmail ?? getSiteSettings().email }) })
    if (!res.ok) throw new Error(`Webhook ${res.status}`)
  }
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json')
  const done = (state: ContactState) => (wantsJson ? json(state, state.status === 'error' ? 400 : 200) : Response.redirect(new URL(`/iletisim?durum=${state.status === 'success' ? 'ok' : 'hata'}`, request.url), 303))

  const fd = await request.formData()
  const raw = Object.fromEntries(fd.entries()) as Record<string, string>
  const values = { ...raw }
  delete values.website
  delete values.startedAt

  // Bal küpü: insanların görmediği alan doldurulduysa veya form 2 saniyeden kısa sürede gönderildiyse bot kabul et
  const startedAt = Number(raw.startedAt || 0)
  if (raw.website || (startedAt && Date.now() - startedAt < 2000)) return done({ status: 'success', message: 'Teşekkürler, mesajınız bize ulaştı.' })

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || clientAddress || 'yerel'
  if (rateLimited(ip)) return json({ status: 'error', message: 'Kısa sürede çok fazla gönderim yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.', values }, 429)

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: ContactState['fieldErrors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState['fieldErrors']>
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message
    }
    return json({ status: 'error', message: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values }, 400)
  }

  const d = parsed.data
  try {
    await store({ ...d, consent: true, status: 'new', createdAt: new Date().toISOString() })
  } catch (err) {
    console.error('İletişim formu kaydedilemedi', err)
    return json({ status: 'error', message: 'Mesajınız şu anda iletilemedi. Lütfen e-posta ile yazın.', values }, 500)
  }
  return done({ status: 'success', message: 'Teşekkürler, mesajınız bize ulaştı. En kısa sürede dönüş yapacağız.' })
}
