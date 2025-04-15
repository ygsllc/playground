import axios, { AxiosError } from 'axios'
import { ChatResponse, ChatError, BackendChatResponse } from '../types/chat'

// In development, this will be proxied through Vite's dev server
const API_URL = '/api'
const API_TOKEN = 'rnd_MVpVh1sXBzM6IWd6XQ217vSjiXh0'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_TOKEN}`,
  },
  timeout: 30000, // 30 second timeout
  timeoutErrorMessage: 'Request timed out. The server is taking too long to respond.',
})

// Log all requests
api.interceptors.request.use(
  (config) => {
    console.log('Making request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    })
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Log all responses
api.interceptors.response.use(
  (response) => {
    console.log('Received response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    })
    return Promise.reject(error)
  }
)

export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Health check function
export async function checkHealth(): Promise<boolean> {
  try {
    console.log('Checking health at:', `${API_URL}/`)
    const response = await api.get('/')
    console.log('Health check response:', response.data)
    return true
  } catch (error) {
    console.error('Health check failed:', error)
    if (error instanceof AxiosError) {
      console.error('Health check error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      })
    }
    return false
  }
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    // First check if the API is healthy
    const isHealthy = await checkHealth()
    if (!isHealthy) {
      throw new ApiError('API is not responding', 'API_UNHEALTHY')
    }

    console.log('Sending request to:', `${API_URL}/chat`)
    console.log('Request headers:', api.defaults.headers)
    console.log('Request payload:', {
      query: message,
      user_id: "test_user",
      organization_id: "test_org"
    })
    
    const response = await api.post<BackendChatResponse>('/chat', {
      query: message,
      user_id: "test_user",
      organization_id: "test_org"
    })
    
    console.log('Raw response:', response)
    console.log('Response data type:', typeof response.data)
    console.log('Response data:', response.data)
    console.log('Response data keys:', Object.keys(response.data))
    
    if (!response.data) {
      throw new ApiError('No response data from server', 'NO_RESPONSE_DATA')
    }

    // Check if response.data is a string (might be JSON string)
    if (typeof response.data === 'string') {
      try {
        response.data = JSON.parse(response.data)
      } catch (e) {
        console.error('Failed to parse response data:', e)
      }
    }

    // Check if we have the answer field
    if (!response.data.answer && !response.data.response) {
      console.error('Invalid response format:', response.data)
      throw new ApiError('Invalid response format from server', 'INVALID_RESPONSE_FORMAT')
    }
    
    // Transform the response to match our frontend's expected format
    return {
      answer: response.data.answer || response.data.response || '',
      context: response.data.context || []
    }
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof AxiosError) {
      console.error('Axios Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      })
      
      if (error.code === 'ECONNABORTED') {
        throw new ApiError(
          'Request timed out. Please try again.',
          'TIMEOUT_ERROR',
          error
        )
      }
      
      const errorMessage = error.response?.data?.message || error.response?.data?.detail || 'Failed to send message'
      throw new ApiError(
        errorMessage,
        error.response?.data?.code || 'NETWORK_ERROR',
        error.response?.data
      )
    }
    throw new ApiError('An unexpected error occurred', 'UNKNOWN_ERROR', error)
  }
}

// Add rate limiting and retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 429) {
      // Implement retry logic for rate limiting
      const retryAfter = error.response.headers['retry-after'] || 1
      await new Promise(resolve => setTimeout(resolve, retryAfter * 1000))
      return api.request(error.config)
    }
    return Promise.reject(error)
  }
) 