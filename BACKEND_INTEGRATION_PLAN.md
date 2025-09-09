# ASPCT Software - Plano de Integração Frontend-Backend

## 📋 Visão Geral da Integração

Este documento detalha o planejamento completo para integrar o frontend React/Next.js com o backend .NET Core, substituindo os dados mock por endpoints reais e implementando funcionalidades avançadas.

### Status Atual
- **Frontend**: Sistema funcional com dados mock em Zustand stores
- **Backend**: API .NET completa com funcionalidades avançadas via Swagger
- **Objetivo**: Integração total mantendo UX existente e adicionando novas funcionalidades

---

## 🔍 Análise do Backend .NET

### Informações Técnicas
- **Base URL**: `http://localhost:5175`
- **Documentação**: `/swagger/index.html`
- **Autenticação**: JWT Bearer Token
- **Formato de Dados**: JSON com DTOs tipados
- **Versionamento**: API v1.0

### Controllers Disponíveis

#### 1. **Auth Controller** (`/api/Auth`)
- `POST /api/Auth/login` - Login do usuário
- `POST /api/Auth/register` - Registro de novos usuários
- `POST /api/Auth/validate-token` - Validação de token JWT

#### 2. **Users Controller** (`/api/Users`)
- `GET /api/Users/psychologists` - Lista psicólogos
- `GET /api/Users/me` - Dados do usuário atual

#### 3. **Children Controller** (`/api/Children`)
- `GET /api/Children` - Listar crianças
- `POST /api/Children` - Criar criança
- `GET /api/Children/{id}` - Buscar por ID
- `PUT /api/Children/{id}` - Atualizar criança
- `DELETE /api/Children/{id}` - Deletar criança
- `GET /api/Children/{id}/can-access` - Verificar permissão

#### 4. **InterventionPlans Controller** (`/api/InterventionPlans`)
- `GET /api/InterventionPlans/{id}` - Buscar plano por ID
- `PUT /api/InterventionPlans/{id}` - Atualizar plano
- `GET /api/InterventionPlans/child/{childId}` - Planos da criança
- `GET /api/InterventionPlans/child/{childId}/active` - Plano ativo
- `POST /api/InterventionPlans` - Criar novo plano
- `PATCH /api/InterventionPlans/{id}/archive` - Arquivar plano
- `POST /api/InterventionPlans/{id}/goals` - Adicionar objetivo
- `PUT /api/InterventionPlans/goals/{goalId}` - Atualizar objetivo

#### 5. **Assessments Controller** (`/api/Assessments`)
- `GET /api/Assessments/{id}` - Buscar avaliação
- `GET /api/Assessments/child/{childId}` - Avaliações da criança
- `GET /api/Assessments/child/{childId}/progress` - Progresso da criança
- `POST /api/Assessments/milestones` - Criar avaliação de marcos
- `POST /api/Assessments/barriers` - Criar avaliação de barreiras
- `POST /api/Assessments/transition` - Criar avaliação de transição

#### 6. **Reports Controller** (`/api/Reports`)
- `POST /api/Reports` - Gerar relatório
- `GET /api/Reports/child/{childId}` - Relatórios da criança
- `GET /api/Reports/{id}` - Buscar relatório por ID

#### 7. **Sessions Controller** (`/api/Sessions`)
- `POST /api/Sessions` - Criar sessão
- `GET /api/Sessions/{id}` - Buscar sessão
- `PUT /api/Sessions/{id}` - Atualizar sessão
- `GET /api/Sessions/child/{childId}` - Sessões da criança

#### 8. **Communication Controller** (`/api/Communication`)
- `POST /api/Communication/send` - Enviar mensagem
- `GET /api/Communication/child/{childId}` - Mensagens da criança
- `GET /api/Communication/conversation/{otherUserId}/child/{childId}` - Conversa
- `GET /api/Communication/unread` - Mensagens não lidas
- `PATCH /api/Communication/{messageId}/read` - Marcar como lida
- `GET /api/Communication/unread-count` - Contador não lidas

#### 9. **VBMAPPAreas Controller** (`/api/VBMAPPAreas`)
- `GET /api/VBMAPPAreas` - Áreas VB-MAPP disponíveis

---

## 🎯 Mapeamento Frontend ↔ Backend

### Compatibilidade Direta

#### **auth-store.ts** ↔ **Auth Controller**
```typescript
// Frontend Mock → Backend Real
login(email, password) → POST /api/Auth/login
logout() → Client-side token removal
user: User → LoginResponse.user
```

**Estruturas de Dados:**
```typescript
// Frontend (atual)
interface User {
  id: string
  nome: string
  email: string
  tipo: "psicologo" | "pai"
  token?: string
}

// Backend (esperado)
interface LoginResponse {
  token: string
  user: {
    id: string        // UUID
    name: string      // → nome
    email: string
    role: UserRole    // 0=Psychologist, 1=Parent → tipo
    createdAt: string
  }
}
```

#### **crianca-store.ts** ↔ **Children Controller**
```typescript
// Frontend Mock → Backend Real
fetchCriancas() → GET /api/Children
addCrianca(crianca) → POST /api/Children
getCriancaById(id) → GET /api/Children/{id}
// Novos: updateCrianca(), deleteCrianca()
```

**Estruturas de Dados:**
```typescript
// Frontend (atual)
interface Crianca {
  id: string
  nome: string
  idade: number
  nivelVBMAPP: string
  progresso: Progresso
  alertas?: string[]
  dataNascimento?: string
  responsavel?: Responsavel
  informacoesMedicas?: InformacoesMedicas
}

// Backend (esperado) - Mapeamento necessário
interface ChildResponse {
  id: string                    // UUID
  name: string                  // → nome
  birthDate: string             // → calcular idade
  diagnosis: string             // → nivelVBMAPP
  medicalInformation: string    // → informacoesMedicas
  parentId?: string
  parent: UserResponse          // → responsavel
  createdAt: string
  updatedAt: string
  // progresso: vem de /api/Assessments/child/{childId}/progress
}
```

#### **relatorio-store.ts** ↔ **Reports Controller**
```typescript
// Frontend Mock → Backend Real
fetchRelatorios() → GET /api/Reports/child/{childId}
gerarRelatorio(dados) → POST /api/Reports
```

**Estruturas de Dados:**
```typescript
// Frontend (atual)
interface Relatorio {
  id: string
  criancaId: string
  titulo: string
  tipo: string
  data: string
  resumo: string
  marcosAlcancados: string[]
  observacoes: string
  recomendacoesCasa: string
  recomendacoesEscola: string
}

// Backend (esperado) - Adaptação necessária
interface ReportResponse {
  id: string
  childId: string              // → criancaId
  child: ChildResponse
  type: ReportType             // → tipo (enum)
  title: string                // → titulo
  content: string              // → resumo (JSON estruturado?)
  startDate?: string
  endDate?: string
  generatedAt: string          // → data
  createdAt: string
}
```

### Funcionalidades que Precisam de Adaptação

#### **atividade-store.ts** → **InterventionPlans Controller**
```typescript
// Frontend atual: Atividades simples
interface Atividade {
  id: string
  titulo: string
  descricao: string
  categoria: string
  nivelVBMAPP: number
  duracao: number
  objetivos: string[]
  materiais: string[]
  passos: string[]
  adaptacoes?: string[]
  criadoPor: string
}

// Backend: Planos de intervenção estruturados
interface InterventionPlanResponse {
  id: string
  childId: string
  child: ChildResponse
  goals: GoalResponse[]        // Objetivos estruturados
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface GoalResponse {
  id: string
  description: string          // Similar a objetivos
  targetCriteria: string
  priority: GoalPriority
  category: string             // Similar a categoria
  activities: string[]         // Similar a passos
  targetDate?: string
  isActive: boolean
}
```

### Funcionalidades Novas no Backend (Não Implementadas no Frontend)

#### **VB-MAPP Assessments** (`/api/Assessments`)
- Sistema completo de avaliações VB-MAPP
- Três tipos: Milestones, Barriers, Transition
- Tracking de progresso por área
- Integração com relatórios

#### **Sessions Management** (`/api/Sessions`)
- Agendamento de sessões terapêuticas
- Status tracking (Scheduled, InProgress, Completed, Cancelled)
- Notas e atividades por sessão
- Duração real vs planejada

#### **Communication System** (`/api/Communication`)
- Sistema de mensagens entre psicólogo e pais
- Conversas específicas por criança
- Status de leitura
- Contador de mensagens não lidas

---

## 🚀 Estratégia de Implementação

### **Fase 1: Substituição de Mock Data (Essencial)**

#### 1.1 Criar Utilitários Base
```typescript
// lib/api-client.ts
class ApiClient {
  constructor(baseUrl: string)
  setAuthToken(token: string): void
  request<T>(endpoint: string, options?: RequestOptions): Promise<T>
  get<T>(endpoint: string): Promise<T>
  post<T>(endpoint: string, data: any): Promise<T>
  put<T>(endpoint: string, data: any): Promise<T>
  delete(endpoint: string): Promise<void>
}

// lib/api-endpoints.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    VALIDATE: '/api/Auth/validate-token'
  },
  CHILDREN: {
    LIST: '/api/Children',
    CREATE: '/api/Children',
    GET: (id: string) => `/api/Children/${id}`,
    UPDATE: (id: string) => `/api/Children/${id}`,
    DELETE: (id: string) => `/api/Children/${id}`
  },
  REPORTS: {
    CREATE: '/api/Reports',
    BY_CHILD: (childId: string) => `/api/Reports/child/${childId}`,
    GET: (id: string) => `/api/Reports/${id}`
  }
}
```

#### 1.2 Atualizar Auth Store
```typescript
// store/auth-store.ts
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.post<LoginResponse>('/api/Auth/login', {
        email,
        password
      })
      
      // Mapear resposta do backend para formato frontend
      const user: User = {
        id: response.user.id,
        nome: response.user.name,
        email: response.user.email,
        tipo: response.user.role === 0 ? 'psicologo' : 'pai',
        token: response.token
      }
      
      // Configurar token para próximas requests
      apiClient.setAuthToken(response.token)
      localStorage.setItem('aspct_token', response.token)
      
      set({ user, token: response.token, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  logout: () => {
    apiClient.setAuthToken('')
    localStorage.removeItem('aspct_token')
    set({ user: null, token: null })
  },

  validateToken: async () => {
    const token = localStorage.getItem('aspct_token')
    if (!token) return false
    
    try {
      const isValid = await apiClient.post<boolean>('/api/Auth/validate-token', token)
      if (isValid) {
        apiClient.setAuthToken(token)
        // Buscar dados do usuário
        const userData = await apiClient.get<UserResponse>('/api/Users/me')
        const user: User = {
          id: userData.id,
          nome: userData.name,
          email: userData.email,
          tipo: userData.role === 0 ? 'psicologo' : 'pai',
          token
        }
        set({ user, token })
        return true
      }
    } catch (error) {
      localStorage.removeItem('aspct_token')
    }
    
    return false
  }
}))
```

#### 1.3 Atualizar Children Store
```typescript
// store/crianca-store.ts
export const useCriancaStore = create<CriancaState>((set, get) => ({
  criancas: [],
  isLoading: false,
  error: null,

  fetchCriancas: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.get<ChildResponse[]>('/api/Children')
      
      // Mapear resposta do backend para formato frontend
      const criancas: Crianca[] = await Promise.all(
        response.map(async (child) => {
          // Buscar progresso separadamente
          const progresso = await apiClient.get<any>(`/api/Assessments/child/${child.id}/progress`)
          
          return {
            id: child.id,
            nome: child.name,
            idade: calculateAge(child.birthDate),
            nivelVBMAPP: child.diagnosis,
            progresso: mapProgressoFromApi(progresso),
            dataNascimento: child.birthDate,
            responsavel: child.parent ? {
              nome: child.parent.name,
              email: child.parent.email,
              telefone: '', // Não disponível na API
              endereco: ''  // Não disponível na API
            } : undefined,
            informacoesMedicas: {
              medicamentos: '',
              alergias: '',
              observacoes: child.medicalInformation
            }
          }
        })
      )
      
      set({ criancas, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  addCrianca: async (novaCrianca: Omit<Crianca, 'id'>) => {
    set({ isLoading: true })
    try {
      // Mapear dados do frontend para formato da API
      const childCreateRequest: ChildCreateRequest = {
        name: novaCrianca.nome,
        birthDate: novaCrianca.dataNascimento || new Date().toISOString(),
        diagnosis: novaCrianca.nivelVBMAPP,
        medicalInformation: novaCrianca.informacoesMedicas?.observacoes || ''
      }
      
      const response = await apiClient.post<ChildResponse>('/api/Children', childCreateRequest)
      
      // Adicionar à lista local
      const crianca: Crianca = {
        id: response.id,
        nome: response.name,
        idade: calculateAge(response.birthDate),
        nivelVBMAPP: response.diagnosis,
        progresso: { linguagem: 0, social: 0, motor: 0, media: 0, tendencia: 'up' },
        dataNascimento: response.birthDate,
        informacoesMedicas: {
          medicamentos: '',
          alergias: '',
          observacoes: response.medicalInformation
        }
      }
      
      set(state => ({ 
        criancas: [...state.criancas, crianca],
        isLoading: false 
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  }
}))
```

#### 1.4 Atualizar Reports Store
```typescript
// store/relatorio-store.ts
export const useRelatorioStore = create<RelatorioState>((set) => ({
  relatorios: [],
  isLoading: false,
  error: null,

  fetchRelatorios: async (childId?: string) => {
    set({ isLoading: true, error: null })
    try {
      let response: ReportResponse[]
      
      if (childId) {
        response = await apiClient.get<ReportResponse[]>(`/api/Reports/child/${childId}`)
      } else {
        // Se não especificar criança, buscar do usuário atual (parent)
        const { user } = useAuthStore.getState()
        if (user?.tipo === 'pai') {
          // Buscar crianças do pai e seus relatórios
          const children = await apiClient.get<ChildResponse[]>('/api/Children')
          response = []
          for (const child of children) {
            const childReports = await apiClient.get<ReportResponse[]>(`/api/Reports/child/${child.id}`)
            response.push(...childReports)
          }
        } else {
          // Psicólogo pode ver todos os relatórios - implementar endpoint específico
          response = []
        }
      }
      
      // Mapear para formato frontend
      const relatorios: Relatorio[] = response.map(report => ({
        id: report.id,
        criancaId: report.childId,
        titulo: report.title,
        tipo: mapReportType(report.type),
        data: formatDate(report.generatedAt),
        resumo: report.content,
        marcosAlcancados: [], // Extrair do content se estruturado
        observacoes: '',
        recomendacoesCasa: '',
        recomendacoesEscola: ''
      }))
      
      set({ relatorios, isLoading: false })
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  gerarRelatorio: async (dados: Omit<Relatorio, 'id'>) => {
    set({ isLoading: true })
    try {
      const request: ReportGenerationRequest = {
        childId: dados.criancaId,
        type: mapReportTypeToEnum(dados.tipo),
        title: dados.titulo,
        content: JSON.stringify({
          resumo: dados.resumo,
          marcosAlcancados: dados.marcosAlcancados,
          observacoes: dados.observacoes,
          recomendacoesCasa: dados.recomendacoesCasa,
          recomendacoesEscola: dados.recomendacoesEscola
        })
      }
      
      const response = await apiClient.post<ReportResponse>('/api/Reports', request)
      
      const novoRelatorio: Relatorio = {
        id: response.id,
        criancaId: response.childId,
        titulo: response.title,
        tipo: mapReportType(response.type),
        data: formatDate(response.generatedAt),
        resumo: dados.resumo,
        marcosAlcancados: dados.marcosAlcancados,
        observacoes: dados.observacoes,
        recomendacoesCasa: dados.recomendacoesCasa,
        recomendacoesEscola: dados.recomendacoesEscola
      }
      
      set(state => ({
        relatorios: [...state.relatorios, novoRelatorio],
        isLoading: false
      }))
    } catch (error) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  }
}))
```

#### 1.5 Tratamento de Erros e Loading States
```typescript
// hooks/use-api-error.ts
export function useApiError() {
  const handleError = (error: any) => {
    if (error.status === 401) {
      // Token expirado
      useAuthStore.getState().logout()
      window.location.href = '/login'
    } else if (error.status === 403) {
      toast.error('Acesso negado')
    } else if (error.status === 404) {
      toast.error('Recurso não encontrado')
    } else {
      toast.error(error.message || 'Erro interno do servidor')
    }
  }

  return { handleError }
}

// components/ui/loading-spinner.tsx
export function LoadingSpinner() {
  return <div className="animate-spin">...</div>
}
```

### **Fase 2: Funcionalidades Melhoradas**

#### 2.1 Substituir Atividades por InterventionPlans
```typescript
// store/intervention-plan-store.ts (novo)
interface InterventionPlanState {
  plans: InterventionPlanResponse[]
  activePlan: InterventionPlanResponse | null
  fetchPlansByChild: (childId: string) => Promise<void>
  getActivePlan: (childId: string) => Promise<void>
  createPlan: (plan: InterventionPlanRequest) => Promise<void>
  addGoalToPlan: (planId: string, goal: GoalRequest) => Promise<void>
  updateGoal: (goalId: string, goal: GoalRequest) => Promise<void>
}
```

#### 2.2 Implementar Sistema de Assessments
```typescript
// store/assessment-store.ts (novo)
interface AssessmentState {
  assessments: AssessmentResponse[]
  childProgress: Record<string, any> // Por criança
  fetchAssessmentsByChild: (childId: string) => Promise<void>
  getChildProgress: (childId: string) => Promise<void>
  createMilestonesAssessment: (data: MilestonesAssessmentRequest) => Promise<void>
  createBarriersAssessment: (data: BarriersAssessmentRequest) => Promise<void>
  createTransitionAssessment: (data: TransitionAssessmentRequest) => Promise<void>
}
```

#### 2.3 Implementar Sessions Management
```typescript
// store/session-store.ts (novo)
interface SessionState {
  sessions: SessionResponse[]
  fetchSessionsByChild: (childId: string) => Promise<void>
  createSession: (session: SessionCreateRequest) => Promise<void>
  updateSession: (id: string, session: SessionUpdateRequest) => Promise<void>
  completeSession: (id: string) => Promise<void>
}
```

### **Fase 3: Funcionalidades Avançadas**

#### 3.1 Sistema de Comunicação
```typescript
// store/communication-store.ts (novo)
interface CommunicationState {
  conversations: Record<string, MessageResponse[]> // Por criança
  unreadCount: number
  sendMessage: (message: MessageRequest) => Promise<void>
  getConversation: (otherUserId: string, childId: string) => Promise<void>
  markAsRead: (messageId: string) => Promise<void>
  fetchUnreadCount: () => Promise<void>
}
```

#### 3.2 Novas Páginas/Componentes
- `/app/assessments/` - Sistema VB-MAPP
- `/app/sessions/` - Gestão de sessões
- `/app/messages/` - Sistema de comunicação
- Componentes para cada funcionalidade nova

---

## 🔧 Configurações e Utilitários

### Configuração da API
```typescript
// lib/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5175',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
}
```

### Utilitários de Mapeamento
```typescript
// lib/mappers.ts
export function mapUserRole(role: UserRole): 'psicologo' | 'pai' {
  return role === 0 ? 'psicologo' : 'pai'
}

export function calculateAge(birthDate: string): number {
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR')
}
```

### Middleware de Autenticação
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('aspct_token')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

---

## 📝 Checklist de Implementação

### Fase 1 - Básico ✅
- [ ] Criar `lib/api-client.ts` com classe base
- [ ] Criar `lib/api-endpoints.ts` com endpoints
- [ ] Atualizar `store/auth-store.ts` para usar API real
- [ ] Atualizar `store/crianca-store.ts` para usar API real  
- [ ] Atualizar `store/relatorio-store.ts` para usar API real
- [ ] Implementar tratamento de erros global
- [ ] Adicionar estados de loading em componentes
- [ ] Configurar interceptors para token JWT
- [ ] Implementar refresh token se necessário
- [ ] Testar todos os fluxos básicos

### Fase 2 - Melhorias ⏳
- [ ] Criar `store/intervention-plan-store.ts`
- [ ] Substituir páginas de atividades por intervention plans
- [ ] Criar `store/assessment-store.ts`
- [ ] Implementar páginas de VB-MAPP assessments
- [ ] Criar `store/session-store.ts`
- [ ] Implementar páginas de sessões
- [ ] Adicionar filtros e paginação
- [ ] Melhorar UX com skeleton loading
- [ ] Implementar cache local com React Query/SWR
- [ ] Adicionar validação de formulários com Zod

### Fase 3 - Avançado ⏳
- [ ] Criar `store/communication-store.ts`
- [ ] Implementar sistema de mensagens
- [ ] Adicionar notificações real-time (SignalR?)
- [ ] Implementar upload de arquivos
- [ ] Adicionar exportação de relatórios em PDF
- [ ] Implementar gráficos com dados reais
- [ ] Adicionar testes unitários
- [ ] Implementar PWA features
- [ ] Adicionar monitoramento de erros
- [ ] Deploy e configuração de produção

---

## 🚨 Considerações Importantes

### Segurança
- ✅ JWT tokens com expiração adequada
- ✅ Validação de permissões no frontend e backend
- ✅ Sanitização de dados de entrada
- ✅ HTTPS em produção
- ✅ Headers de segurança adequados

### Performance
- ✅ Lazy loading de páginas
- ✅ Memoização de componentes pesados
- ✅ Virtualização para listas grandes
- ✅ Otimização de imagens
- ✅ Code splitting adequado

### UX/UI
- ✅ Estados de loading consistentes
- ✅ Tratamento de erros amigável
- ✅ Feedback visual para ações
- ✅ Responsividade mantida
- ✅ Acessibilidade adequada

### Manutenibilidade
- ✅ Tipagem TypeScript completa
- ✅ Documentação de APIs
- ✅ Testes automatizados
- ✅ Logs estruturados
- ✅ Monitoramento de performance

---

## 📊 Estimativa de Tempo

| Fase | Escopo | Estimativa | Prioridade |
|------|--------|------------|------------|
| Fase 1 | API Integration Básica | 3-5 dias | Alta |
| Fase 2 | Funcionalidades Melhoradas | 5-7 dias | Média |
| Fase 3 | Funcionalidades Avançadas | 7-10 dias | Baixa |

**Total**: 15-22 dias de desenvolvimento

---

Este documento serve como guia completo para a integração. Recomenda-se seguir as fases sequencialmente, validando cada etapa antes de prosseguir para a próxima.