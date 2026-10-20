import type { AnchorHTMLAttributes } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { prefetch?: boolean; scroll?: boolean; replace?: boolean }

/** next/link yerine düz bağlantı (Astro sayfaları tam sayfa gezinir). */
export default function Link({ prefetch: _p, scroll: _s, replace: _r, ...rest }: Props) {
  return <a {...rest} />
}
