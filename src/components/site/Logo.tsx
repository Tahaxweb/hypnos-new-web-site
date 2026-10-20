type Props = { size?: number; className?: string; title?: string }

/** Hypnos pusula işareti. Renk `currentColor` üzerinden yalnız ink veya ink-inverse olur. */
export function HypnosMark({ size = 32, className, title }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 101.28 101.28"
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M60.71 0H40.58V101.28H60.71V0Z" />
      <path d="M101.28 60.71V40.58L0 40.58V60.71L101.28 60.71Z" />
      <path d="M93.57 21.95L79.33 7.72L7.72 79.33L21.95 93.57L93.57 21.95Z" />
      <path d="M79.33 93.58L93.56 79.34L21.95 7.73L7.71 21.96L79.33 93.58Z" />
    </svg>
  )
}

/**
 * Resmî çizgi (stroke) logo: "Hypnos Logolar/hypnos-icon-logo.svg" ile aynı yol.
 * Çizgi kalınlığı ölçekten bağımsızdır; renk `currentColor` ile verilir.
 */
export function HypnosMarkStroke({ className, strokeWidth = 1.25 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 1129 1130" fill="none" className={className} aria-hidden="true">
      <path
        d="M669.9 7.5V310.081L682.704 297.275L883.833 96.123L1032.89 245.201L831.76 446.354L818.958 459.158H1121.5V669.987H818.958L831.76 682.79L1032.89 883.947L883.834 1033.02L682.704 831.867L669.9 819.062V1121.64H459.1V819.062L446.296 831.867L245.171 1033.02L96.1113 883.939L297.239 682.79L310.04 669.987H7.5V459.158H310.041L297.239 446.354L96.1113 245.201L245.17 96.124L446.296 297.275L459.1 310.081V7.5H669.9Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
