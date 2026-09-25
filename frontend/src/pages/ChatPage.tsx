import React, { useState } from 'react'
import { Send, Square, Sparkles, AlertCircle, Bot, User, Trash2 } from 'lucide-react'
import { useStreamingChat } from '../hooks/useStreamingChat'
import { useBackendHealth } from '../hooks/useBackendHealth'

export const ChatPage: React.FC = () => {
  const [input, setInput] = useState('')
  const { isOnline, isOllamaConnected, health } = useBackendHealth()
  const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } =
    useStreamingChat({
      systemPrompt: 'You are an intelligent AI assistant running locally on Guilherme Viegas\'s Linux Mini PC. You provide helpful, technical, concise, and accurate responses.',
    })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isStreaming) return
    sendMessage(input)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const visibleMessages = messages.filter((m) => m.role !== 'system')

  return (
    <div className="max-w-4xl mx-auto py-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Mini PC Local AI Inference
            </h1>
            <p className="text-xs text-slate-400">
              Streaming directly from Ollama via FastAPI SSE gateway
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {visibleMessages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Warning inside Chat */}
      {(!isOnline || !isOllamaConnected) && (
        <div className="my-4 p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-amber-300">
              Mini PC Hardware is Currently Offline or Unreachable
            </p>
            <p className="text-amber-200/80">
              New chat prompts cannot be processed until the local server or Cloudflare Tunnel is started on your Mini PC. You can still read static pages and explore cached articles!
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {visibleMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
            <Bot className="w-12 h-12 text-slate-600" />
            <div className="max-w-md space-y-1">
              <p className="text-slate-300 font-medium text-sm">No messages yet</p>
              <p className="text-xs text-slate-500">
                Ask questions about Linux kernels, container architecture, or run code experiments against your local LLM weights.
              </p>
            </div>
            {health?.models && health.models.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-mono text-indigo-400/80 bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-900/40">
                  Active model: {health.models[0]}
                </span>
              </div>
            )}
          </div>
        ) : (
          visibleMessages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-sm leading-relaxed ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content || (isStreaming && idx === visibleMessages.length - 1 ? (
                    <span className="inline-flex items-center gap-1 text-slate-400 italic">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      Generating tokens...
                    </span>
                  ) : null)}
                </div>
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-900/50 text-rose-300 text-xs">
            {error}
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="pt-2 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isOnline || !isOllamaConnected}
            placeholder={
              !isOnline || !isOllamaConnected
                ? 'Workstation offline - inference disabled'
                : 'Type your prompt (Enter to send, Shift+Enter for new line)...'
            }
            rows={2}
            className="w-full rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 p-3 pr-24 text-sm resize-none disabled:opacity-50 disabled:cursor-not-allowed outline-none transition-colors"
          />

          <div className="absolute right-3 flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={stopStreaming}
                className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
                title="Stop generation"
              >
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || !isOnline || !isOllamaConnected}
                className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
