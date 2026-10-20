import type { CSSProperties, ImgHTMLAttributes } from 'react'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  src: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  unoptimized?: boolean
  quality?: number
}

/** next/image yerine düz <img>. Görseller zaten dışa aktarımda boyutlandırılmış sürümlerle geldiği için ek işlem yapılmaz. */
export default function Image({ fill, priority, unoptimized: _u, quality: _q, style, width, height, ...rest }: Props) {
  const fillStyle: CSSProperties = fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%' } : {}
  return (
    <img
      {...rest}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ ...fillStyle, ...style }}
    />
  )
}
