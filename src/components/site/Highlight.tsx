/**
 * Metindeki önemli ifadeleri koyu, geri kalanını gri gösterir. Metin değiştirilmez;
 * yalnız bulunan ifadeler vurgulanır (nötr gri #8a8a8a, büyük yazıda WCAG AA (3,4:1)).
 */
export function Highlight({ text, phrases }: { text: string; phrases: string[] }) {
  const found = phrases.filter((p) => text.includes(p)).sort((a, b) => text.indexOf(a) - text.indexOf(b))
  const parts: { t: string; strong: boolean }[] = []
  let pos = 0
  for (const p of found) {
    const i = text.indexOf(p, pos)
    if (i < 0) continue
    if (i > pos) parts.push({ t: text.slice(pos, i), strong: false })
    parts.push({ t: p, strong: true })
    pos = i + p.length
  }
  if (pos < text.length) parts.push({ t: text.slice(pos), strong: false })
  return (
    <>
      {parts.map((part, k) =>
        part.strong ? (
          <strong key={k} className="font-normal text-ink">
            {part.t}
          </strong>
        ) : (
          <span key={k} className="text-[#8a8a8a]">
            {part.t}
          </span>
        ),
      )}
    </>
  )
}
