import Link from '@/shims/Link'

/** Numaralı, büyük yazılı liste satırları (hizmet/sektör/partner). Kart yerine editoryal liste. */
export function ServiceRows({ items, size = 'lg' }: { items: { title: string; summary?: string | null; href: string }[]; size?: 'lg' | 'md' }) {
  return (
    <ul className="border-t border-line">
      {items.map((it, i) => (
        <li key={it.href} className="group relative border-b border-line">
          <div className="grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 py-5 md:grid-cols-[3.5rem_minmax(0,1.1fr)_minmax(0,1fr)_2rem] md:gap-x-8 md:py-7">
            <span className="text-caption muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <h3 className={`${size === 'lg' ? 't-list' : 'text-[clamp(1.35rem,1rem+1vw,1.9rem)] leading-tight tracking-tight'} transition-transform duration-500 ease-(--ease-out-soft) md:group-hover:translate-x-3`}>
              <Link href={it.href} className="after:absolute after:inset-0 after:content-['']">
                {it.title}
              </Link>
            </h3>
            {it.summary && (
              <p className="hidden max-w-xl text-[16px] leading-relaxed text-ink-secondary opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 md:col-start-3 md:block">
                {it.summary}
              </p>
            )}
            <span aria-hidden="true" className="col-start-3 row-start-1 justify-self-end text-xl opacity-30 transition-[opacity,transform] duration-500 group-hover:translate-x-1 group-hover:opacity-100 md:col-start-4">
              →
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
