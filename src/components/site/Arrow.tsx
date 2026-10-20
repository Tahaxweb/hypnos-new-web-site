/** Marka kuralı: oklar ikon değil, düz "→" karakteridir. */
export function Arrow({ dir = 'right' }: { dir?: 'right' | 'down' | 'up-right' }) {
  const ch = dir === 'down' ? '↓' : dir === 'up-right' ? '↗' : '→'
  return (
    <span className="arrow" aria-hidden="true">
      {ch}
    </span>
  )
}
