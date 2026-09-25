import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Cpu, Cloud, ArrowRight, Activity, Sparkles, BookOpen } from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const HomePage: React.FC = () => {
  const { isOnline, isOllamaConnected, health } = useBackendHealth()

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-900/40 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid Architecture: GitHub Pages + Local Mini PC</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Guilherme Viegas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Systems Engineer & Researcher
            </span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Exploring GNU/Linux systems, virtualization, Kubernetes, cloud architecture, and self-hosted AI compute nodes. Built with React, TypeScript, and a private zero-trust inference tunnel.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/ai-chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Mini PC AI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Articles</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Cloud className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-base">Static Edge Frontend</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vite, React 19, and Tailwind CSS compiled directly into static assets deployed instantly via GitHub Pages. Resilient to workstation offline cycles.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-base">Self-Hosted Mini PC</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            FastAPI + Ollama server running locally on Linux. Streams real-time tokens over SSE and provides zero-cost private inference with local GPUs.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-base">Cloudflare Tunnel</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Outbound-only encrypted tunnel without opening router ports or exposing home IP addresses. Guarded by in-memory rate limiting.
          </p>
        </div>
      </section>

      {/* Real-time Workstation Card */}
      <section className="p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-200 text-sm">
              Workstation Hardware Telemetry
            </h4>
            <p className="text-xs text-slate-400">
              {isOnline
                ? `Active • Connected to local Ollama runtime (${health?.models?.length || 0} models available)`
                : 'Offline • Mini PC is either powered off or disconnected from Cloudflare Tunnel'}
            </p>
            {isOnline && isOllamaConnected && (
              <span className="text-[11px] text-emerald-400 font-mono">Inference online & ready</span>
            )}
          </div>
        </div>

        <Link
          to="/status"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-mono inline-flex items-center gap-1.5 underline underline-offset-4"
        >
          View Live Diagnostics &rarr;
        </Link>
      </section>
    </div>
  )
}
