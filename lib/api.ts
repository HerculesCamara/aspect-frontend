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
  contactNumber?: string

  // Campos específicos para Psicólogo
  licenseNumber?: string
  specialization?: string
  clinicName?: string

  // Campos específicos para Parent
  childRelationship?: string
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

// === REPORT TYPES ===
interface ReportStatistics {
  totalSessions: number
  totalAssessments: number
  assessmentsByType: Record<string, number>
  sessionsByType: Record<string, number>
  achievedGoals: string[]
  activeGoals: string[]
}

interface ReportResponse {
  reportId: string
  childId: string
  childName: string
  psychologistId: string
  psychologistName: string
  reportDate: string
  reportType: string
  filePath?: string
  summaryForParent?: string
  clinicalNotes?: string
  startPeriod: string
  endPeriod: string
  isSharedWithParent: boolean
  createdAt: string
  updatedAt?: string
  statistics: ReportStatistics
}

interface ReportRequest {
  childId: string
  startPeriod: string
  endPeriod: string
  reportType: string
  summaryForParent?: string
  clinicalNotes?: string
  isSharedWithParent?: boolean
}

// === ASSESSMENT TYPES ===
interface AssessmentResponse {
  assessmentId: string
  childId: string
  childName: string
  psychologistId: string
  psychologistName: string
  assessmentDate: string
  overallScore?: number
  assessmentType: 'Milestones' | 'Barriers' | 'Transition'
  createdAt: string
  updatedAt?: string
}

interface MilestonesAssessmentRequest {
  childId: string
  assessmentDate: string
  assessmentType: 'Milestones'
  level1Score?: number
  level2Score?: number
  level3Score?: number
  milestoneScores: Record<string, number>
}

interface BarriersAssessmentRequest {
  childId: string
  assessmentDate: string
  assessmentType: 'Barriers'
  barrierScores: Record<string, number>
  qualitativeNotes?: string
}

interface TransitionAssessmentRequest {
  childId: string
  assessmentDate: string
  assessmentType: 'Transition'
  transitionScores: Record<string, number>
  readinessNotes?: string
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

  // Reports endpoints
  getReport: (id: string): Promise<ReportResponse> =>
    apiRequest(`/Reports/${id}`),

  getReportsByChild: (childId: string): Promise<ReportResponse[]> =>
    apiRequest(`/Reports/child/${childId}`),

  createReport: (reportData: ReportRequest): Promise<ReportResponse> =>
    apiRequest('/Reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    }),

  shareReportWithParent: (id: string, share: boolean): Promise<{ message: string }> =>
    apiRequest(`/Reports/${id}/share`, {
      method: 'PATCH',
      body: JSON.stringify(share),
    }),

  downloadReportPdf: (id: string): Promise<Blob> =>
    apiRequest(`/Reports/${id}/pdf`).then(response => {
      // Para downloads de PDF, retornamos o blob
      if (response instanceof Response) {
        return response.blob()
      }
      return response
    }),

  // Assessments endpoints
  getAssessment: (id: string): Promise<AssessmentResponse> =>
    apiRequest(`/Assessments/${id}`),

  getAssessmentsByChild: (childId: string): Promise<AssessmentResponse[]> =>
    apiRequest(`/Assessments/child/${childId}`),

  getProgressData: (childId: string): Promise<Record<string, any>> =>
    apiRequest(`/Assessments/child/${childId}/progress`),

  createMilestonesAssessment: (data: MilestonesAssessmentRequest): Promise<AssessmentResponse> =>
    apiRequest('/Assessments/milestones', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createBarriersAssessment: (data: BarriersAssessmentRequest): Promise<AssessmentResponse> =>
    apiRequest('/Assessments/barriers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createTransitionAssessment: (data: TransitionAssessmentRequest): Promise<AssessmentResponse> =>
    apiRequest('/Assessments/transition', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}