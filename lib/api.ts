// API Client para comunicação com backend .NET
const API_BASE = 'http://localhost:5175/api'

// Tipagens baseadas na API real
interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'Psychologist' | 'Parent'
}

interface AuthResponse {
  token: string
  userId: string
  username: string
  email: string
  role: string
  firstName: string
  lastName: string
  expiresAt: string
}

interface ApiError {
  message?: string
  errors?: Record<string, string[]>
  status?: number
}

// Função para fazer requests com tratamento de erro melhorado
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Adicionar token se existir
  const token = localStorage.getItem('aspct_token')
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    let errorMessage = `API Error: ${response.status}`

    try {
      const errorData: ApiError = await response.json()
      if (errorData.message) {
        errorMessage = errorData.message
      } else if (errorData.errors) {
        // Tratar erros de validação
        const messages = Object.values(errorData.errors).flat()
        errorMessage = messages.join(', ')
      }
    } catch {
      // Se não conseguir parsear o erro, usar mensagem padrão
    }

    throw new Error(errorMessage)
  }

  return response.json()
}

// Funções específicas da API
export const api = {
  // Auth endpoints
  login: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest('/Auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password } satisfies LoginRequest),
    }),

  register: (userData: RegisterRequest): Promise<AuthResponse> =>
    apiRequest('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  validateToken: (token: string): Promise<boolean> =>
    apiRequest('/Auth/validate-token', {
      method: 'POST',
      body: JSON.stringify(token),
    }),
}