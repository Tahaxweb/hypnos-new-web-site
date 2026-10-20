import { AccentText } from './Accent'
import { Breadcrumbs, type Crumb } from './Breadcrumbs'

type Props = {
  title: string
  accent?: string | null
  intro?: string | null
  crumbs?: Crumb[]
  label?: string
  children?: React.ReactNode
}

/** Alt sayfaların açılışı: konum, tek h1 ve kısa yanıt niteliğinde giriş. */
export function PageHero({ title, accent, intro, crumbs, label, children }: Props) {
  return (
    <header className="container-site pt-10 pb-16 md:pt-14 md:pb-24">
      {crumbs && <Breadcrumbs items={crumbs} />}
      <div className="grid-site mt-14 gap-y-6 md:mt-24">
        <div className="col-span-4 md:col-span-3">{label && <p className="text-[16px] text-ink-secondary">{label}</p>}</div>
        <div className="col-span-4 md:col-span-9">
          <h1 className="t-hero max-w-[22ch] hero-line">
            <AccentText text={title} accent={accent} />
          </h1>
          {intro && <p className="mt-8 max-w-2xl text-lead muted">{intro}</p>}
          {children}
        </div>
      </div>
    </header>
  )
}
