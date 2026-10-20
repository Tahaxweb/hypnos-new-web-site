import type { ReactNode } from 'react'

export type Appearance = {
  background?: 'surface' | 'raised' | 'inverse' | null
  width?: 'narrow' | 'default' | 'wide' | 'full' | null
  paddingTop?: 'none' | 'sm' | 'md' | 'lg' | null
  paddingBottom?: 'none' | 'sm' | 'md' | 'lg' | null
  align?: 'left' | 'center' | null
  label?: string | null
  anchor?: string | null
}

const PT = { none: 'pt-0', sm: 'pt-8 md:pt-12', md: 'pt-14 md:pt-20', lg: 'pt-20 md:pt-32' }
const PB = { none: 'pb-0', sm: 'pb-8 md:pb-12', md: 'pb-14 md:pb-20', lg: 'pb-20 md:pb-32' }
const BG = { surface: '', raised: 'band-raised', inverse: 'band-inverse' }

/**
 * Bir katmanın dış çerçevesi. Etiket varsa editoryal ızgara (solda etiket, sağda içerik) kullanılır.
 * "Tam genişlik" yalnız görsel katmanlarda kenardan kenara taşar; metin her zaman okunabilir genişlikte kalır.
 */
export function Section({ appearance, children, fullBleed }: { appearance?: Appearance | null; children: ReactNode; fullBleed?: boolean }) {
  const a = appearance ?? {}
  const width = a.width ?? 'default'
  const center = a.align === 'center'
  const bg = BG[a.background ?? 'surface']
  const pt = PT[a.paddingTop ?? 'md']
  const pb = PB[a.paddingBottom ?? 'md']
  const id = a.anchor ? a.anchor.replace(/[^a-z0-9-]/gi, '-').toLowerCase() : undefined

  if (width === 'full' && fullBleed) {
    return (
      <section id={id} className={`${bg} ${pt} ${pb}`}>
        {a.label && (
          <div className="container-site mb-6">
            <p className="t-label muted">{a.label}</p>
          </div>
        )}
        {children}
      </section>
    )
  }

  // Etiketli düzende içerik sağdaki 9 sütuna yerleşir
  const inner =
    width === 'narrow'
      ? 'md:col-span-7 lg:col-span-6'
      : width === 'wide' || width === 'full'
        ? 'md:col-span-9'
        : 'md:col-span-8 lg:col-span-7'

  if (a.label && !center) {
    return (
      <section id={id} className={`${bg} ${pt} ${pb}`}>
        <div className="container-site grid-site gap-y-6">
          <div className="col-span-4 md:col-span-3">
            <p className="text-[16px] md:sticky md:top-[calc(var(--header-h)+24px)]">{a.label}</p>
          </div>
          <div className={`col-span-4 ${inner} reveal`}>{children}</div>
        </div>
      </section>
    )
  }

  const max =
    width === 'narrow' ? 'max-w-3xl' : width === 'default' ? 'max-w-5xl' : 'max-w-none'
  return (
    <section id={id} className={`${bg} ${pt} ${pb}`}>
      <div className={`container-site`}>
        {a.label && <p className={`t-label muted mb-6 ${center ? 'text-center' : ''}`}>{a.label}</p>}
        <div className={`${max} ${center ? 'mx-auto text-center [&_.prose-hypnos]:mx-auto' : ''} reveal`}>{children}</div>
      </div>
    </section>
  )
}

export function BlockHeading({ children, center }: { children?: string | null; center?: boolean }) {
  if (!children) return null
  return <h2 className={`t-hero mb-8 max-w-[24ch] text-[clamp(1.6rem,1rem+2vw,2.75rem)] ${center ? 'mx-auto text-center' : ''}`}>{children}</h2>
}
