import React from 'react'
import { Cpu, Globe } from 'lucide-react'

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-indigo-500/20 shrink-0">
          GV
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-100">Guilherme Viegas</h1>
          <p className="text-indigo-400 font-mono text-sm">
            Systems Engineer & Cloud Architect • Open Code, Open Mind 🚀
          </p>
          <p className="text-slate-300 text-sm leading-relaxed max-w-xl">
            Passionate about low-level systems, Linux kernel internals, container orchestration, edge cloud computing, and making local AI accessible and privacy-respecting.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Cpu className="w-4 h-4" />
            <span>Hardware & Homelab Specs</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 font-mono">
            <li>• Linux Mini PC (x86_64 / Ryzen / Dedicated APU)</li>
            <li>• Engine: Ollama inference runtime running locally</li>
            <li>• Networking: Cloudflare Zero Trust encrypted edge tunnel</li>
            <li>• Gateway: FastAPI Python 3.11 asynchronous proxy</li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Globe className="w-4 h-4" />
            <span>Frontend Architecture</span>
          </div>
          <ul className="text-xs text-slate-400 space-y-2 font-mono">
            <li>• Static hosting on GitHub Pages with zero server cost</li>
            <li>• Vite 8 + React 19 + TypeScript + Tailwind CSS</li>
            <li>• TanStack Query for reactive health monitoring & retries</li>
            <li>• Resilient SSE stream consumer with graceful degradation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
