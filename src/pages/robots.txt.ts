import type { APIRoute } from 'astro'

import { absoluteURL } from '@/lib/paths'

export const GET: APIRoute = () => {
  // Yayın dışı ortamlarda (önizleme sunucusu vb.) tüm siteyi kapat; canlıda PUBLIC_SITE_ENV=production verin
  const isProduction = import.meta.env.PUBLIC_SITE_ENV === 'production'
  const body = isProduction
    ? `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${absoluteURL('/sitemap.xml')}\n`
    : `User-agent: *\nDisallow: /\n\nSitemap: ${absoluteURL('/sitemap.xml')}\n`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
