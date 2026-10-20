type Props = { data: object | null | undefined | (object | null | undefined)[] }

/** Yapılandırılmış veri. `<` karakteri kaçışlanır; içerik panelden gelse bile script enjeksiyonu yapılamaz. */
export function JsonLd({ data }: Props) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean)
  if (!list.length) return null
  return list.map((item, i) => (
    <script
      key={i}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
    />
  ))
}
