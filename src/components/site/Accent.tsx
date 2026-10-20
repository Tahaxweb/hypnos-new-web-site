/** Başlıktaki vurgulu ifadeyi italik serif ile gösterir. Vurgu bulunamazsa başlık olduğu gibi döner. */
export function AccentText({ text, accent }: { text: string; accent?: string | null }) {
  if (!accent) return <>{text}</>
  const i = text.toLocaleLowerCase('tr').indexOf(accent.toLocaleLowerCase('tr'))
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <span className="t-accent">{text.slice(i, i + accent.length)}</span>
      {text.slice(i + accent.length)}
    </>
  )
}
