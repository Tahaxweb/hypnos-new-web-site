import Link from '@/shims/Link'

import { JsonLd } from './JsonLd'
import { breadcrumbSchema } from '@/lib/jsonld'

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Ana Sayfa', path: '/' }, ...items]
  return (
    <>
      <nav aria-label="Sayfa konumu" className="text-caption muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-2">
              {i < all.length - 1 ? (
                <>
                  <Link href={c.path} className="hover:text-ink">
                    {c.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              ) : (
                <span aria-current="page" className="text-ink">
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all)} />
    </>
  )
}
