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

// === SESSION TYPES ===
interface SessionResponse {
  sessionId: string
  childId: string
  childName: string
  psychologistId: string
  psychologistName: string
  sessionDate: string
  duration: number
  sessionType: string
  notesWhatWasDone?: string
  notesWhatWasDiagnosed?: string
  notesWhatWillBeDone?: string
  isSharedWithParent: boolean
  createdAt: string
  updatedAt?: string
  parentSummary?: string
}

interface SessionCreateRequest {
  childId: string
  sessionDate: string
  duration: number
  sessionType: string
  notesWhatWasDone?: string
  notesWhatWasDiagnosed?: string
  notesWhatWillBeDone?: string
  isSharedWithParent?: boolean
}

interface SessionUpdateRequest {
  sessionDate?: string
  duration?: number
  sessionType?: string
  notesWhatWasDone?: string
  notesWhatWasDiagnosed?: string
  notesWhatWillBeDone?: string
  isSharedWithParent?: boolean
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

// Tipagens para Children baseadas no backend
interface ChildResponse {
  childId: string
  firstName: string
  lastName: string
  fullName: string
  dateOfBirth: string
  age: number
  gender: string
  diagnosis?: string
  onboardingDate: string
  isActive: boolean
  assignedPsychologistId: string
  psychologistName?: string
}

interface ChildCreateRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  diagnosis?: string
  primaryParentId: string
}

interface ChildUpdateRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  diagnosis?: string
  isActive: boolean
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

  // Children endpoints
  getChildren: (): Promise<ChildResponse[]> =>
    apiRequest('/Children'),

  getChild: (id: string): Promise<ChildResponse> =>
    apiRequest(`/Children/${id}`),

  createChild: (childData: ChildCreateRequest): Promise<ChildResponse> =>
    apiRequest('/Children', {
      method: 'POST',
      body: JSON.stringify(childData),
    }),

  updateChild: (id: string, childData: ChildUpdateRequest): Promise<ChildResponse> =>
    apiRequest(`/Children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(childData),
    }),

  deleteChild: (id: string): Promise<void> =>
    apiRequest(`/Children/${id}`, {
      method: 'DELETE',
    }),

  canAccessChild: (id: string): Promise<boolean> =>
    apiRequest(`/Children/${id}/can-access`),

  // Sessions endpoints
  getSession: (id: string): Promise<SessionResponse> =>
    apiRequest(`/Sessions/${id}`),

  getSessionsByChild: (childId: string): Promise<SessionResponse[]> =>
    apiRequest(`/Sessions/child/${childId}`),

  createSession: (sessionData: SessionCreateRequest): Promise<SessionResponse> =>
    apiRequest('/Sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    }),

  updateSession: (id: string, sessionData: SessionUpdateRequest): Promise<SessionResponse> =>
    apiRequest(`/Sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    }),

  deleteSession: (id: string): Promise<void> =>
    apiRequest(`/Sessions/${id}`, {
      method: 'DELETE',
    }),

  shareSessionWithParent: (id: string, share: boolean): Promise<{ message: string }> =>
    apiRequest(`/Sessions/${id}/share`, {
      method: 'PATCH',
      body: JSON.stringify(share),
    }),
}