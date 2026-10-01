import { useQuery } from '@tanstack/react-query'

export interface SearchItem {
  title: string
  permalink: string
  summary?: string
  content?: string
  tags?: string[]
}

export function useSearchIndex() {
  return useQuery<SearchItem[], Error>({
    queryKey: ['search-index'],
    queryFn: async ({ signal }) => {
      const res = await fetch('/index.json', { signal })
      if (!res.ok) {
        throw new Error(`Failed to load search index (HTTP ${res.status})`)
      }
      return (await res.json()) as SearchItem[]
    },
    staleTime: Infinity, // Static index does not change during session
    gcTime: 60 * 60 * 1000,
  })
}
