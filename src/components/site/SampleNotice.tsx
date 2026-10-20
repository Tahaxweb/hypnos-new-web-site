/** Örnek içerik uyarısı: gerçek içerikle değiştirilene kadar ziyaretçiyi ve ekibi bilgilendirir. */
export function SampleNotice({ show, what = 'Bu sayfa' }: { show?: boolean | null; what?: string }) {
  if (!show) return null
  return (
    <div role="note" className="border-b border-line bg-surface-raised">
      <p className="container-site py-3 text-caption text-ink-muted">
        <strong className="font-semibold text-ink">Örnek içerik.</strong> {what} yapıyı göstermek için hazırlanmış örnek içerik
        barındırır; gerçek proje bilgisi değildir.
      </p>
    </div>
  )
}
