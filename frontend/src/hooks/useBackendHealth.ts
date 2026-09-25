import { useQuery } from '@tanstack/react-query'
import { API_BASE_URL } from '../config/api'
import type { BackendHealthResponse } from '../types/api'

/**
 * Periodically polls the self-hosted backend /health endpoint every 30 seconds.
 * Tracks online/offline status, GPU acceleration availability, and Ollama connectivity.
 */
export function useBackendHealth() {
  const query = useQuery<BackendHealthResponse, Error>({
    queryKey: ['backend-health'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
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
