import React from 'react'
import { BookOpen, Calendar, Clock, ArrowRight, Tag } from 'lucide-react'

interface PostSummary {
  id: string
  title: string
  date: string
  readingTime: string
  summary: string
  tags: string[]
}

const SAMPLE_POSTS: PostSummary[] = [
  {
    id: 'securing-local-llm-cloudflared',
    title: 'Exposing Local Ollama Workstations Securely with Cloudflare Tunnels',
    date: '2026-09-24',
    readingTime: '5 min read',
    summary: 'A deep architectural dive into zero-trust networking: bridging GitHub Pages SPAs with local hardware LLMs without opening router ports or exposing home IP ranges.',
    tags: ['Cloudflare', 'Security', 'Ollama', 'FastAPI'],
  },
  {
    id: 'kernel-virtualization-benchmarks',
    title: 'Benchmarking KVM and Lightweight MicroVMs on Linux Mini PCs',
    date: '2026-08-15',
    readingTime: '8 min read',
    summary: 'Evaluating hypervisor overhead, memory ballooning, and CPU scheduling across AMD Ryzen and Intel N-series processors for personal homelabs.',
    tags: ['Linux', 'Virtualization', 'KVM', 'Hardware'],
  },
  {
    id: 'reactive-state-resilience',
    title: 'Offline-First Architectures: Graceful Degradation in Modern SPAs',
    date: '2026-07-02',
    readingTime: '6 min read',
    summary: 'Using TanStack Query to manage edge-to-homelab connectivity: polling telemetry, backoff retries, and seamless client fallbacks when hardware nodes power down.',
    tags: ['React', 'TypeScript', 'TanStack Query', 'Architecture'],
  },
]

export const BlogsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>Technical Articles & Systems Research</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Writing about GNU/Linux, virtualization, cloud engineering, and edge-native architectures.
        </p>
      </div>

      <div className="space-y-6">
        {SAMPLE_POSTS.map((post) => (
          <article
            key={post.id}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all group space-y-3"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {post.title}
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed">{post.summary}</p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {tag}
                  </span>
                ))}
              </div>

              <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
                Read full note <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
