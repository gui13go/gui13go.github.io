import { useEffect } from 'react'

interface DocumentMetaProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const DEFAULT_TITLE = 'Gui13go'
const DEFAULT_DESCRIPTION =
  'Personal technical portfolio and blog on GNU/Linux, Systems Engineering, Security, Virtualization, and Cloud Architecture.'
const DEFAULT_IMAGE = '/favicon.svg'

function setOrCreateMeta(name: string, content: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let meta = document.querySelector<HTMLMetaElement>(selector)
  if (!meta) {
    meta = document.createElement('meta')
    if (isProperty) {
      meta.setAttribute('property', name)
    } else {
      meta.setAttribute('name', name)
    }
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function setOrCreateCanonical(href: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export function useDocumentMeta({ title, description, image, url }: DocumentMetaProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Gui13go` : DEFAULT_TITLE
    const metaDescription = description || DEFAULT_DESCRIPTION
    const metaImage = image || DEFAULT_IMAGE
    const fullUrl = url || window.location.href

    document.title = fullTitle

    // Standard metadata
    setOrCreateMeta('description', metaDescription)

    // Open Graph / Social Sharing
    setOrCreateMeta('og:title', fullTitle, true)
    setOrCreateMeta('og:description', metaDescription, true)
    setOrCreateMeta('og:image', metaImage, true)
    setOrCreateMeta('og:url', fullUrl, true)
    setOrCreateMeta('og:type', 'website', true)

    // Twitter card
    setOrCreateMeta('twitter:card', 'summary_large_image')
    setOrCreateMeta('twitter:title', fullTitle)
    setOrCreateMeta('twitter:description', metaDescription)
    setOrCreateMeta('twitter:image', metaImage)

    // Canonical link
    setOrCreateCanonical(fullUrl)

    return () => {
      // Restore defaults on unmount
      document.title = DEFAULT_TITLE
      setOrCreateMeta('description', DEFAULT_DESCRIPTION)
      setOrCreateMeta('og:title', DEFAULT_TITLE, true)
      setOrCreateMeta('og:description', DEFAULT_DESCRIPTION, true)
      setOrCreateMeta('og:image', DEFAULT_IMAGE, true)
    }
  }, [title, description, image, url])
}
