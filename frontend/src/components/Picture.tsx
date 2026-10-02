import React from 'react'

export interface PictureProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  pictureClassName?: string
  fetchPriority?: 'high' | 'low' | 'auto'
}

/**
 * Modern HTML5 <picture> component implementing content negotiation
 * serving next-gen AVIF first, then WebP fallback, before standard PNG/JPEG.
 */
export const Picture: React.FC<PictureProps> = ({
  src,
  alt,
  className,
  pictureClassName,
  loading = 'lazy',
  fetchPriority,
  ...rest
}) => {
  const isRaster = /\.(jpg|jpeg|png)$/i.test(src)

  if (!isRaster) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        // @ts-expect-error React 19 supports fetchPriority but React types vary
        fetchpriority={fetchPriority}
        {...rest}
      />
    )
  }

  const avifSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.avif')
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  return (
    <picture className={pictureClassName}>
      <source type="image/avif" srcSet={avifSrc} />
      <source type="image/webp" srcSet={webpSrc} />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        // @ts-expect-error React 19 supports fetchPriority but React types vary
        fetchpriority={fetchPriority}
        {...rest}
      />
    </picture>
  )
}

export default Picture
