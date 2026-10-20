# Hypnos Interactive — Web Sitesi (Astro)

Next.js + Payload CMS projesinden Astro'ya taşındı. Sayfalar derlemede statik üretilir; yalnız iletişim formu ucu (`/api/iletisim`) sunucuda çalışır (Node adaptörü).

```bash
npm install
npm run dev        # http://localhost:3100
npm run build      # dist/
PUBLIC_SITE_ENV=production npm start   # üretim sunucusu (PORT, HOST ile ayarlanır)
npm run test:e2e   # Playwright (build + start kendisi yapar)
```

## İçerik

Payload veritabanındaki yayınlı içerik `src/content/` altına JSON olarak aktarıldı ve medya `public/media/` içinde:

| Yol | İçerik |
|---|---|
| `src/content/projects, services, sectors, partners, pages, posts, categories` | Her kayıt bir JSON dosyası (dosya adı = URL kısa adı) |
| `src/content/data/site.json` | Kurum bilgileri, iletişim, sosyal hesaplar |
| `src/content/data/home.json`, `page-texts.json` | Ana sayfa ve sabit sayfa metinleri |
| `src/content/data/redirects.json` | Ek yönlendirmeler (`astro.config.mjs` okur) |

Yeni case study eklemek için `src/content/projects/` altına mevcut bir dosyayı kopyalayıp düzenleyin; görselleri `public/media/` içine koyup `url` alanında `/media/dosya.webp` yazın. Katman (blok) türleri `blockType` alanıyla belirlenir: `text`, `twoColumns`, `mediaText`, `media`, `gallery`, `video`, `stats`, `quote`, `projectFacts`, `cta`, `faq`, `servicesList`, `projectsShowcase`. Panel (`/admin`) artık yoktur; istenirse Keystatic/Decap gibi dosya tabanlı bir panel bu klasörlere bağlanabilir.

## Yapı

```
src/pages/        Rotalar (.astro) + api/iletisim, sitemap.xml, robots.txt, llms.txt
src/views/        Sayfa görünümleri (React, derlemede statik HTML'e çizilir)
src/components/   Bloklar ve site bileşenleri; etkileşimli olanlar "ada" (Island) olarak canlandırılır
src/layouts/Base.astro   Başlık/SEO, menü, altbilgi
src/lib/data.ts   İçerik JSON'larını okuyup ilişkileri çözer
src/styles/globals.css   Tasarım token'ları (Tailwind v4)
```

## Ortam değişkenleri

`.env.example` dosyasına bakın. Canlıda `PUBLIC_SERVER_URL` ve `PUBLIC_SITE_ENV=production` derleme öncesi tanımlı olmalı. İletişim talepleri `data/iletisim-talepleri.jsonl` dosyasına yazılır (kalıcı disk gerekir); sunucusuz ortamda `CONTACT_WEBHOOK_URL` kullanın.
