import { expect, test } from '@playwright/test'

import { AUTHOR, apiToken, auth, pngBuffer } from './helpers'

test.describe('yetkiler ve medya güvenliği', () => {
  test('yazar taslak oluşturabilir ama yayınlayamaz ve silemez', async ({ request }) => {
    const token = await apiToken(request, AUTHOR)
    const created = await request.post('/api/projects?draft=true', {
      headers: auth(token),
      data: { title: `Yazar taslağı ${Date.now()}`, client: 'Test', excerpt: 'x', _status: 'draft' },
    })
    expect(created.status()).toBe(201)
    const id = (await created.json()).doc.id

    const publish = await request.patch(`/api/projects/${id}`, { headers: auth(token), data: { _status: 'published' } })
    expect(publish.status()).toBe(403)

    const del = await request.delete(`/api/projects/${id}`, { headers: auth(token) })
    expect(del.status()).toBe(403)

    const admin = await apiToken(request)
    expect((await request.delete(`/api/projects/${id}`, { headers: auth(admin) })).ok()).toBeTruthy()
  })

  test('yazar iletişim taleplerini ve kullanıcıları göremez', async ({ request }) => {
    const token = await apiToken(request, AUTHOR)
    expect((await request.get('/api/contact-submissions', { headers: auth(token) })).status()).toBe(403)
    const users = await (await request.get('/api/users', { headers: auth(token) })).json()
    expect(users.docs.length).toBe(1)
  })

  test('ziyaretçi taslakları ve iletişim taleplerini göremez', async ({ request }) => {
    const res = await (await request.get('/api/projects?limit=100&depth=0')).json()
    expect(res.docs.every((d: { _status: string }) => d._status === 'published')).toBeTruthy()
    expect((await request.get('/api/contact-submissions')).status()).toBe(403)
  })

  test('SVG ve izin verilmeyen dosya türleri reddedilir; alt metin zorunludur', async ({ request }) => {
    const token = await apiToken(request)
    const svg = await request.post('/api/media', {
      headers: auth(token),
      multipart: {
        file: { name: 'x.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>') },
        _payload: JSON.stringify({ alt: 'svg' }),
      },
    })
    expect(svg.status()).toBeGreaterThanOrEqual(400)

    const noAlt = await request.post('/api/media', {
      headers: auth(token),
      multipart: { file: { name: 'a.png', mimeType: 'image/png', buffer: await pngBuffer() }, _payload: JSON.stringify({}) },
    })
    expect(noAlt.status()).toBe(400)
  })

  test('5 hatalı girişten sonra hesap kilitlenir', async ({ request }) => {
    const email = `kilit-${Date.now()}@hypnos.test`
    const admin = await apiToken(request)
    const u = await request.post('/api/users', { headers: auth(admin), data: { email, password: 'Dogru-Sifre-123', name: 'Kilit Testi', role: 'author' } })
    const id = (await u.json()).doc.id
    for (let i = 0; i < 5; i++) await request.post('/api/users/login', { data: { email, password: 'yanlis' } })
    const locked = await request.post('/api/users/login', { data: { email, password: 'Dogru-Sifre-123' } })
    expect(locked.ok()).toBeFalsy()
    await request.delete(`/api/users/${id}`, { headers: auth(admin) })
  })
})
