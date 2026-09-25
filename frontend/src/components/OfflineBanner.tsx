import React from 'react'
import { ServerOff, RefreshCw, Cpu } from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { API_BASE_URL } from '../config/api'

export const OfflineBanner: React.FC = () => {
  const { isOnline, isOllamaConnected, refetch, isFetching } = useBackendHealth()

  // If online and inference engine is connected, display nothing
  if (isOnline && isOllamaConnected) {
    return null
  }

  return (
    <div
      role="alert"
      className="bg-amber-950/70 border-b border-amber-600/40 text-amber-200 px-4 py-2.5 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          {isOnline && !isOllamaConnected ? (
            <>
              <Cpu className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>
                <strong>Workstation Connected:</strong> Ollama engine is not detected on the Mini PC. AI inference is temporarily paused.
              </span>
            </>
          ) : (
            <>
              <ServerOff className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Workstation API is currently offline.</strong> AI features are unavailable.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="text-[11px] text-amber-400/70 font-mono hidden md:inline">
            Target: {API_BASE_URL}
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors text-xs cursor-pointer disabled:opacity-50"
            title="Retry connecting to Mini PC"
          >
            <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{isFetching ? 'Checking...' : 'Check Status'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
