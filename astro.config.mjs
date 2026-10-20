import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import fs from 'node:fs'

const site = (process.env.PUBLIC_SERVER_URL || 'https://www.hypnosinteractive.com').replace(/\/$/, '')

// Eski site adresleri + Payload panelinde tanımlıydı yönlendirmeler (src/content/data/redirects.json)
const PREFIX = { projects: '/portfolyo', services: '/hizmetler', sectors: '/sektorler', partners: '/partnerler', pages: '', posts: '/blog' }
const panel = {}
try {
  for (const r of JSON.parse(fs.readFileSync('./src/content/data/redirects.json', 'utf8'))) {
    const to = typeof r.to === 'string' ? r.to : r.to ? `${PREFIX[r.to.relationTo]}/${r.to.slug}` : null
    if (r.from && to) panel[r.from.replace(/\/$/, '') || '/'] = { status: r.type === '302' ? 302 : 301, destination: to }
  }
} catch {}

export default defineConfig({
  site,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  server: { port: 3100 },
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  },
  redirects: {
    '/hizmetler': { status: 301, destination: '/neler-yapiyoruz#hizmetler' },
    '/sektorler': { status: 301, destination: '/neler-yapiyoruz#sektorler' },
    '/partnerler': { status: 301, destination: '/neler-yapiyoruz#partnerler' },
    '/works': { status: 301, destination: '/portfolyo' },
    '/about': { status: 301, destination: '/hakkimizda' },
    '/contact': { status: 301, destination: '/iletisim' },
    '/services': { status: 301, destination: '/neler-yapiyoruz' },
    ...panel,
  },
})
