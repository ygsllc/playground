export type MessageRole = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  status?: 'sending' | 'sent' | 'error'
}

export interface BackendChatResponse {
  conversation_id?: string
  response?: string
  answer?: string
  output?: string
  reply?: string
  context?: string[]
}

export interface ChatResponse {
  answer: string
  context?: string[]
  confidence?: number
}

export interface ChatError {
  code: string
  message: string
  details?: unknown
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: ChatError | null
  lastMessageId: string | null
}

export interface ChatContextValue extends ChatState {
  sendMessage: (content: string) => Promise<void>
  clearChat: () => void
  retryLastMessage: () => Promise<void>
} 