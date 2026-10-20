import Link from '@/shims/Link'

import { Arrow } from '@/components/site/Arrow'

export function NotFound() {
  return (
    <section className="container-site py-24 md:py-36">
      <p className="t-label muted">Hata 404</p>
      <h1 className="t-display-sm mt-6 max-w-4xl">
        Aradığınız sayfa <span className="t-accent">burada</span> değil.
      </h1>
      <p className="t-intro muted mt-8 max-w-2xl">Adres değişmiş veya sayfa kaldırılmış olabilir. Şu sayfalardan devam edebilirsiniz:</p>
      <ul className="mt-10 flex flex-wrap gap-3">
        <li><Link href="/" className="btn btn-lg">Ana sayfa <Arrow /></Link></li>
        <li><Link href="/portfolyo" className="btn btn-lg">Portfolyo <Arrow /></Link></li>
        <li><Link href="/neler-yapiyoruz" className="btn btn-lg">Neler yapıyoruz <Arrow /></Link></li>
        <li><Link href="/iletisim" className="btn btn-lg">İletişim <Arrow /></Link></li>
      </ul>
    </section>
  )
}
