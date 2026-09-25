import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Terminal, Cpu, BookOpen, User, Sparkles, Activity } from 'lucide-react'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const Navbar: React.FC = () => {
  const location = useLocation()
  const { isOnline, isOllamaConnected } = useBackendHealth()

  const navItems = [
    { path: '/', label: 'Home', icon: Terminal },
    { path: '/blogs', label: 'Blogs', icon: BookOpen },
    { path: '/ai-chat', label: 'Local AI', icon: Sparkles },
    { path: '/status', label: 'Node Status', icon: Activity },
    { path: '/about', label: 'About', icon: User },
  ]

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold tracking-tight text-lg text-slate-100 group-hover:text-indigo-400 transition-colors">
            Gui13go <span className="text-xs text-indigo-400 font-mono font-normal">v2.0</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Real-time backend status dot */}
        <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isOnline
                ? isOllamaConnected
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            }`}
          />
          <span className="text-xs font-mono text-slate-400">
            {isOnline ? (isOllamaConnected ? 'Mini PC AI Ready' : 'Mini PC Online') : 'Mini PC Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
