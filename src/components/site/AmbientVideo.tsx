type Props = { src: string; type?: string | null; poster?: string; label?: string | null; ambient?: boolean }

/**
 * Atmosfer videoları (data-ambient) sessiz ve döngüde oynar; davranışı src/layouts/Base.astro içindeki betik ekler:
 * azaltılmış hareket tercihinde otomatik oynatılmaz, ekran dışındayken durdurulur.
 * Betik çalışmazsa video kontrollerle ve yalnız tıklanınca yüklenir.
 */
export function AmbientVideo({ src, type, poster, label, ambient }: Props) {
  return (
    <video
      poster={poster}
      playsInline
      controls
      preload="none"
      data-ambient={ambient ? '' : undefined}
      aria-label={label || undefined}
      className="h-full w-full object-cover"
    >
      <source src={src} type={type || undefined} />
    </video>
  )
}
