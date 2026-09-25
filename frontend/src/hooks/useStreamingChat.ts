import { useState, useCallback, useRef } from 'react'
import { API_BASE_URL, DEFAULT_MODEL } from '../config/api'
import type { ChatMessage } from '../types/api'

interface UseStreamingChatOptions {
  model?: string
  systemPrompt?: string
}

export function useStreamingChat(options: UseStreamingChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (options.systemPrompt) {
      return [{ role: 'system', content: options.systemPrompt }]
    }
    return []
  })
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsStreaming(false)
    }
  }, [])

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isStreaming) return

      setError(null)

      const newUserMsg: ChatMessage = { role: 'user', content: userInput.trim() }
      const updatedMessages = [...messages, newUserMsg]

      // Add user message immediately and placeholder for assistant
      setMessages([...updatedMessages, { role: 'assistant', content: '' }])
      setIsStreaming(true)

      const controller = new AbortController()
      abortControllerRef.current = controller

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            model: options.model || DEFAULT_MODEL,
            messages: updatedMessages,
            temperature: 0.7,
            stream: true,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Server returned status ${response.status}`)
        }

        if (!response.body) {
          throw new Error('ReadableStream not supported by browser response')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        let assistantReply = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || trimmed.startsWith(':')) continue

            if (trimmed.startsWith('event: error')) {
              // Wait for subsequent data line
              continue
            }

            if (trimmed.startsWith('data:')) {
              const rawData = trimmed.replace(/^data:\s*/, '')
              if (rawData === '[DONE]') {
                break
              }

              try {
                const parsed = JSON.parse(rawData)
                if (parsed.error) {
                  setError(parsed.error)
                  break
                }

                // OpenAI-compatible chunk format or direct content chunk
                const contentChunk =
                  parsed.choices?.[0]?.delta?.content ||
                  parsed.message?.content ||
                  parsed.response ||
                  ''

                if (contentChunk) {
                  assistantReply += contentChunk
                  setMessages((prev) => {
                    const next = [...prev]
                    const lastIdx = next.length - 1
                    if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
                      next[lastIdx] = { role: 'assistant', content: assistantReply }
                    }
                    return next
                  })
                }
              } catch {
                // If not valid JSON, treat raw text as content chunk
                if (rawData && rawData !== '[DONE]') {
                  assistantReply += rawData
                  setMessages((prev) => {
                    const next = [...prev]
                    const lastIdx = next.length - 1
                    if (lastIdx >= 0 && next[lastIdx].role === 'assistant') {
                      next[lastIdx] = { role: 'assistant', content: assistantReply }
                    }
                    return next
                  })
                }
              }
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Intentional abort
          return
        }
        const errorMsg =
          err instanceof Error
            ? err.message
            : 'Unable to stream reply from local AI workstation.'
        setError(errorMsg)
        // Update placeholder to indicate error
        setMessages((prev) => {
          const next = [...prev]
          const lastIdx = next.length - 1
          if (lastIdx >= 0 && next[lastIdx].role === 'assistant' && !next[lastIdx].content) {
            next[lastIdx] = {
              role: 'assistant',
              content: `⚠️ Error: ${errorMsg}`,
            }
          }
          return next
        })
      } finally {
        setIsStreaming(false)
        abortControllerRef.current = null
      }
    },
    [isStreaming, messages, options.model]
  )

  const clearMessages = useCallback(() => {
    stopStreaming()
    setMessages(options.systemPrompt ? [{ role: 'system', content: options.systemPrompt }] : [])
    setError(null)
  }, [options.systemPrompt, stopStreaming])

  return {
    messages,
    isStreaming,
    error,
    sendMessage,
    stopStreaming,
    clearMessages,
  }
}
