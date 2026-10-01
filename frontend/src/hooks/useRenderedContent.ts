import { useQuery } from '@tanstack/react-query'

export interface ParsedRenderedContent {
  htmlContent: string
  title?: string
  description?: string
  image?: string
}

export function useRenderedContent(url: string | null) {
  return useQuery<ParsedRenderedContent, Error>({
    queryKey: ['rendered-content', url],
    queryFn: async ({ signal }) => {
      if (!url) throw new Error('No URL specified')

      const res = await fetch(url, { signal })
      if (!res.ok) {
        throw new Error(`Failed to load content from ${url} (HTTP ${res.status})`)
      }

      const rawHtml = await res.text()

      // Normalize links to use local SPA routes
      const cleaned = rawHtml
        .replace(/https:\/\/gui13go\.github\.io\//g, '/')
        .replace(/http:\/\/localhost:1313\//g, '/')

      const parser = new DOMParser()
      const doc = parser.parseFromString(cleaned, 'text/html')

      const mainElement = doc.querySelector('main')
      const htmlContent = mainElement ? mainElement.innerHTML : cleaned

      // Extract metadata for SEO and Document Head
      const title =
        doc.querySelector('.post-title')?.textContent?.trim() ||
        doc.querySelector('h1')?.textContent?.trim() ||
        doc.querySelector('title')?.textContent?.trim() ||
        undefined

      const description =
        doc.querySelector('.post-description')?.textContent?.trim() ||
        doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ||
        undefined

      const image =
        doc.querySelector('.entry-cover img')?.getAttribute('src') ||
        doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        undefined

      return {
        htmlContent,
        title,
        description,
        image,
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000,    // 30 minutes garbage collection
    enabled: Boolean(url),
    retry: 1,
  })
}
