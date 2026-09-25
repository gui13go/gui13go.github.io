export interface BackendHealthResponse {
  status: string
  service?: string
  gpu?: boolean
  ollama_connected?: boolean
  models?: string[]
  timestamp?: number
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  model?: string
  messages: ChatMessage[]
  temperature?: number
  stream?: boolean
}
