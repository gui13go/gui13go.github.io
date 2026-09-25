import React from 'react'
import { Activity, Server, Cpu, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'
import { API_BASE_URL } from '../config/api'

export const StatusPage: React.FC = () => {
  const { isOnline, isOllamaConnected, health, isFetching, refetch } = useBackendHealth()

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span>Workstation & Gateway Diagnostics</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time telemetry of your self-hosted Linux Mini PC and Cloudflare Tunnel link.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Probing...' : 'Refresh Now'}</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Node Connectivity */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-slate-200">Gateway API Connection</h3>
            </div>
            {isOnline ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <XCircle className="w-3.5 h-3.5" />
                OFFLINE
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Target Endpoint:</span>
              <span className="text-slate-200">{API_BASE_URL}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Service:</span>
              <span className="text-slate-200">{health?.service || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Last Telemetry:</span>
              <span className="text-slate-200">
                {health?.timestamp
                  ? new Date(health.timestamp * 1000).toLocaleTimeString()
                  : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Ollama LLM Engine */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="font-semibold text-slate-200">Local Ollama Engine</h3>
            </div>
            {isOllamaConnected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                READY
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <XCircle className="w-3.5 h-3.5" />
                UNAVAILABLE
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">GPU Acceleration:</span>
              <span className="text-slate-200">{health?.gpu ? 'Enabled' : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-500">Loaded Models:</span>
              <span className="text-indigo-400 font-semibold">
                {health?.models && health.models.length > 0
                  ? health.models.join(', ')
                  : 'None loaded'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Polling Interval:</span>
              <span className="text-slate-200">Every 30s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Troubleshooting guide when offline */}
      {(!isOnline || !isOllamaConnected) && (
        <div className="p-6 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 space-y-3">
          <h4 className="font-semibold text-sm text-slate-300">
            Want to start the local backend on your Linux Mini PC?
          </h4>
          <ol className="list-decimal list-inside text-xs text-slate-400 space-y-2 font-mono leading-relaxed">
            <li>Ensure Ollama is running: <code className="text-indigo-300">systemctl start ollama</code> or <code className="text-indigo-300">ollama serve</code></li>
            <li>In your terminal, navigate to <code className="text-indigo-300">backend/</code></li>
            <li>Copy environment template: <code className="text-indigo-300">cp .env.example .env</code> and add your Cloudflare <code className="text-indigo-300">TUNNEL_TOKEN</code></li>
            <li>Launch containerized services: <code className="text-indigo-300">docker compose up -d</code></li>
          </ol>
        </div>
      )}
    </div>
  )
}
