import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ChatContextValue, ChatState, Message, ChatError } from '../types/chat'
import { sendMessage as apiSendMessage } from '../services/api'

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  lastMessageId: null,
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: ChatError | null }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { id: string; status: Message['status'] } }
  | { type: 'CLEAR_CHAT' }

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        lastMessageId: action.payload.id,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id ? { ...msg, status: action.payload.status } : msg
        ),
      }
    case 'CLEAR_CHAT':
      return initialState
    default:
      return state
  }
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const sendMessage = async (content: string) => {
    const messageId = uuidv4()
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      status: 'sending',
    }

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage })
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await apiSendMessage(content)
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'sent' },
      })

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date().toISOString(),
        status: 'sent',
      }

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { id: messageId, status: 'error' },
      })
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'SEND_ERROR',
          message: 'Failed to send message. Please try again.',
          details: error,
        },
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const clearChat = () => {
    dispatch({ type: 'CLEAR_CHAT' })
  }

  const retryLastMessage = async () => {
    if (!state.lastMessageId) return

    const lastMessage = state.messages.find(msg => msg.id === state.lastMessageId)
    if (!lastMessage || lastMessage.role !== 'user') return

    dispatch({ type: 'SET_ERROR', payload: null })
    await sendMessage(lastMessage.content)
  }

  const value: ChatContextValue = {
    ...state,
    sendMessage,
    clearChat,
    retryLastMessage,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
} 