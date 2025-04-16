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
  method: 'post',  // Set default method to POST
  timeout: 30000, // 30 second timeout
  timeoutErrorMessage: 'Request timed out. The server is taking too long to respond.',
})

// Ensure all requests are POST
api.interceptors.request.use(
  (config) => {
    config.method = 'post';  // Force POST method
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
    console.log('Starting health check...')
    console.log('Checking health at:', `${API_URL}/`)
    console.log('Using headers:', api.defaults.headers)
    const response = await api.get('/')
    console.log('Health check complete response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    })
    return true
  } catch (error) {
    console.error('Health check failed:', error)
    if (error instanceof AxiosError) {
      console.error('Health check detailed error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers
        }
      })
    }
    return false
  }
}

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    console.log('Starting message send process...')
    // First check if the API is healthy
    const isHealthy = await checkHealth()
    console.log('Health check result:', isHealthy)
    if (!isHealthy) {
      throw new ApiError('API is not responding', 'API_UNHEALTHY')
    }

    console.log('Sending request to:', `${API_URL}`)
    console.log('Request headers:', api.defaults.headers)
    const payload = [{
      sessionId: "webhook-session",
      action: "sendMessage",
      chatInput: message
    }]
    console.log('Request payload:', payload)
    
    const response = await api.post<BackendChatResponse>('', payload)
    
    console.log('Raw backend response:', response.data)
    let data = response.data;
    
    // Handle array response (like from n8n)
    if (Array.isArray(data)) {
      console.log('Response is an array, extracting first element:', data);
      data = data[0] || {};
    }

    // Handle string response
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse response data:', e);
      }
    }

    // Check for valid response fields
    const answer = data.answer || data.response || data.output;
    if (!answer) {
      console.error('Invalid response format:', data);
      throw new ApiError(
        'No valid answer found in backend response. Raw data: ' + JSON.stringify(data),
        'INVALID_RESPONSE_FORMAT'
      );
    }

    return {
      answer: answer,
      context: data.context || []
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