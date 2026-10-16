import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import type { BackendHealthResponse } from '../types/api'

/**
 * Periodically polls the self-hosted backend health or Ollama endpoints every 30 seconds.
 * Tracks online/offline status, model availability, and Ollama connectivity.
 */
export function useBackendHealth() {
  const query = useQuery<BackendHealthResponse, Error>({
    queryKey: ['backend-health', API_BASE_URL],
    queryFn: async ({ signal }) => {
      // First try standard Ollama /api/tags (works when pointed directly to Ollama)
      try {
        const tagsRes = await fetch(`${API_BASE_URL}/api/tags`, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal,
        })
        if (tagsRes.ok) {
          const tagsData = await tagsRes.json()
          const modelNames = (tagsData.models || []).map((m: { name?: string }) => m.name || '')
          return {
            status: 'ok',
            service: 'Ollama Edge Workstation Node',
            gpu: true,
            ollama_connected: true,
            models: modelNames,
            timestamp: Date.now() / 1000,
          }
        }
      } catch {
        // Fallback to /health check if using a custom gateway
      }

      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
      })

      if (!response.ok) {
        throw new Error(`Health check returned status ${response.status}`)
      }

      return (await response.json()) as BackendHealthResponse
    },
    refetchInterval: 30000, // Query every 30 seconds
    retry: 1,
    staleTime: 25000,
    refetchOnWindowFocus: true,
  })

  const isOnline = query.isSuccess && query.data?.status === 'ok'
  const isOllamaConnected = Boolean(query.data?.ollama_connected)

  return {
    ...query,
    isOnline,
    isOllamaConnected,
    health: query.data,
  }
}
