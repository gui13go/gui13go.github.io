import React, { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AGENT_PERSONAS, type AgentPersonaConfig } from '../config/agentPersonas'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

const OLLAMA_BASE_URL = 'https://ollama.guilhermeviegas.dev'
const MODEL_NAME = 'gemma4:latest'

// Helper: Strip raw HTML tags if model returns any
function sanitizeModelOutput(text: string): string {
  if (!text) return ''
  return text.replace(/<\/?[a-z][a-z0-9]*\b[^>]*>/gi, '')
}

export const SimpleAgent: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const persona: AgentPersonaConfig | undefined = slug ? AGENT_PERSONAS[slug] : undefined

  useDocumentMeta({
    title: persona ? `${persona.name} | AI Roleplay & Interactive Dialogue` : 'AI Agent | Gui13go',
    description: persona?.bio || 'Interactive conversational AI agent.',
    image: persona?.thumbAvatar || persona?.avatar,
  })

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [statusText, setStatusText] = useState('Operational')
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'streaming' | 'error'>('idle')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Initialize or restore chat session when persona changes
  useEffect(() => {
    if (!persona) return

    window.scrollTo({ top: 0, behavior: 'instant' })

    const storageKey = `agent_chat_history_${persona.id}`
    let initialMessages: ChatMessage[] = []

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          initialMessages = parsed
        }
      }
    } catch (e) {
      console.warn('Failed to load chat history from localStorage', e)
    }

    if (initialMessages.length === 0) {
      initialMessages = [
        {
          id: 'greeting',
          role: 'assistant',
          content: persona.greetingMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]
    }

    setMessages(initialMessages)
    setStatusText('Operational')
    setConnectionStatus('idle')

    // Test API connectivity in background
    fetch(`${OLLAMA_BASE_URL}/api/tags`, { method: 'GET', signal: AbortSignal.timeout(4000) })
      .then((res) => {
        if (res.ok) {
          setStatusText('Neural Mesh Online')
        }
      })
      .catch(() => {
        // Fallback status remains operational
      })

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [persona?.id])

  // Save history to localStorage
  useEffect(() => {
    if (!persona || messages.length === 0) return
    const storageKey = `agent_chat_history_${persona.id}`
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages))
    } catch {
      // ignore storage quota errors
    }
  }, [messages, persona?.id])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  // Adjust textarea height
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`
    }
  }

  const handleResetSession = () => {
    if (!persona) return
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const freshMessages: ChatMessage[] = [
      {
        id: `greeting-${Date.now()}`,
        role: 'assistant',
        content: persona.greetingMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]
    setMessages(freshMessages)
    const storageKey = `agent_chat_history_${persona.id}`
    localStorage.removeItem(storageKey)
    setIsStreaming(false)
    setConnectionStatus('idle')
    setStatusText('Operational')
  }

  const sendMessage = async (userPrompt: string) => {
    const trimmed = userPrompt.trim()
    if (!trimmed || isStreaming || !persona) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const assistantId = `assistant-${Date.now()}`
    const emptyAssistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage, emptyAssistantMessage])
    setInputText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    setIsStreaming(true)
    setConnectionStatus('streaming')
    setStatusText('Streaming inference...')

    const controller = new AbortController()
    abortControllerRef.current = controller

    // Construct conversation payload for Ollama
    const apiMessages = [
      { role: 'system', content: persona.systemPrompt },
      ...messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: trimmed },
    ]

    let accumulated = ''

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: apiMessages,
          stream: true,
          options: {
            temperature: 0.75,
            top_p: 0.9,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No readable response stream available')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine) continue

          try {
            const data = JSON.parse(trimmedLine)
            if (data.message?.content) {
              accumulated += data.message.content
              const clean = sanitizeModelOutput(accumulated)
              setMessages((prev) =>
                prev.map((msg) => (msg.id === assistantId ? { ...msg, content: clean } : msg))
              )
            }
          } catch {
            // ignore JSON parse chunk errors
          }
        }
      }

      setStatusText('Operational')
      setConnectionStatus('idle')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatusText('Interrupted')
      } else {
        console.error('Inference error:', err)
        setConnectionStatus('error')
        setStatusText('Gateway Offline')
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content:
                    msg.content ||
                    `⚠️ **Connection Notice:** Unable to contact neural runtime (${err.message || 'Network error'}). Please verify the Ollama cluster connection or try again in a moment.`,
                }
              : msg
          )
        )
      }
    } finally {
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputText)
    }
  }

  if (!persona) {
    return (
      <main className="main">
        <div style={{ maxWidth: '800px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
          <h2>Agent Not Found</h2>
          <p style={{ color: 'var(--secondary)' }}>The requested agent ({slug}) does not exist or has not been configured.</p>
          <Link to="/agents/" className="agent-header-pill" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
            ← Back to All Agents
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="main agent-chat-main">
      <div className="agent-chat-wrapper">
        {/* Breadcrumbs & Header */}
        <header className="agent-chat-header">
          <div className="agent-breadcrumbs">
            <Link to="/">Home</Link> <span>/</span>
            <Link to="/agents/">Agents</Link> <span>/</span>
            <span>{persona.name}</span>
          </div>

          <div className="agent-profile-banner">
            <div className="agent-avatar-container">
              <img
                src={persona.thumbAvatar || persona.avatar}
                alt={persona.name}
                className="agent-avatar-img-locked"
                style={{
                  width: '80px',
                  height: '80px',
                  maxWidth: '80px',
                  maxHeight: '80px',
                  objectFit: 'cover',
                  borderRadius: '1.2rem',
                  display: 'block',
                }}
              />
              <span
                className={`agent-profile-status-indicator ${isStreaming ? 'pulse' : ''}`}
                style={{
                  background: connectionStatus === 'error' ? '#ef4444' : '#10b981',
                }}
                title={statusText}
              />
            </div>

            <div className="agent-profile-info">
              <div className="agent-profile-title-row">
                <h1 className="agent-chat-name">{persona.name}</h1>
                <span className="agent-status-badge">
                  <span
                    className="agent-status-dot"
                    style={{
                      background: connectionStatus === 'error' ? '#ef4444' : '#10b981',
                      boxShadow: connectionStatus === 'streaming' ? '0 0 10px #10b981' : undefined,
                    }}
                  />
                  <span>{statusText}</span>
                </span>
              </div>
              <p className="agent-chat-bio">{persona.bio}</p>
              <div className="agent-profile-tags">
                {persona.tags.map((tag) => (
                  <span key={tag} className="agent-tool-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="agent-header-actions">
              <button
                type="button"
                className="agent-header-pill"
                onClick={handleResetSession}
                title="Reset current conversation"
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 109-9A9.75 9.75.0 005.26 5.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
                <span>Reset Session</span>
              </button>
              <Link to="/agents/" className="agent-header-pill" title="Back to Agents Gallery">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                <span>All Agents</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Chat Interactive Workspace */}
        <section className="agent-chat-card" aria-label="Interactive Dialogue">
          {/* Conversation History Viewport */}
          <div className="agent-messages-container" role="log" aria-live="polite">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'
              return (
                <div key={msg.id} className={`agent-msg-row ${isUser ? 'user-msg-row' : 'bot-msg-row'}`}>
                  {!isUser && (
                    <div className="agent-msg-avatar">
                      <img
                        src={persona.thumbAvatar || persona.avatar}
                        alt={persona.name}
                        style={{
                          width: '36px',
                          height: '36px',
                          maxWidth: '36px',
                          maxHeight: '36px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  )}

                  <div className={`agent-msg-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}`}>
                    <div className="agent-msg-header">
                      <span className="agent-msg-sender">{isUser ? 'You' : persona.name}</span>
                      <span className="agent-msg-time">{msg.timestamp}</span>
                    </div>

                    <div className="agent-msg-text">
                      {msg.content ? (
                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.content}</div>
                      ) : isStreaming ? (
                        <div className="agent-typing-dots">
                          <span className="dot" />
                          <span className="dot" />
                          <span className="dot" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Conversation Prompts */}
          <div className="agent-quick-prompts-wrapper">
            <div className="agent-quick-prompts-label">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Tactical Starters:
            </div>
            <div className="agent-quick-prompts-container">
              {persona.quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="agent-quick-prompt-chip"
                  disabled={isStreaming}
                  onClick={() => sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Controller Bar */}
          <div className="agent-input-container">
            <form
              className="agent-input-form"
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage(inputText)
              }}
            >
              <textarea
                ref={textareaRef}
                className="agent-textarea"
                placeholder={persona.placeholder}
                rows={1}
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                disabled={isStreaming}
                aria-label={`Your message to ${persona.name}`}
              />
              <button
                type="submit"
                className="agent-send-btn"
                disabled={!inputText.trim() || isStreaming}
                aria-label="Send Message"
                title="Send (Enter)"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            <div className="agent-input-footer">
              <span>
                Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line.
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
export default SimpleAgent
