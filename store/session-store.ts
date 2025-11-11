// store/session-store.ts
import { create } from 'zustand'
import { api } from '@/lib/api'

// Estrutura de dados do frontend (baseada no que seria esperado na UI)
interface Sessao {
  id: string
  criancaId: string
  criancaNome: string
  psicologoId: string
  psicologoNome: string
  data: string
  duracao: number
  tipo: 'Individual' | 'Grupo' | 'Avaliação' | 'Seguimento'
  anotacoes: {
    oqueFoiFeito?: string
    diagnosticado?: string
    proximosPassos?: string
  }
  compartilhadoComPais: boolean
  resumoParaPais?: string
  criadoEm: string
  atualizadoEm?: string
}

// Dados mock para fallback
const mockSessoes: Sessao[] = [
  {
    id: "1",
    criancaId: "1",
    criancaNome: "João Silva",
    psicologoId: "psi1",
    psicologoNome: "Dra. Ana Silva",
    data: "2024-03-15T10:00:00Z",
    duracao: 60,
    tipo: "Individual",
    anotacoes: {
      oqueFoiFeito: "Sessão de comunicação funcional com cartões PECS. Trabalhamos pedidos de itens preferidos.",
      diagnosticado: "João demonstrou melhora na comunicação espontânea, fazendo 3 pedidos sem ajuda.",
      proximosPassos: "Continuar PECS nível 2, introduzir frases simples de 2 palavras."
    },
    compartilhadoComPais: true,
    resumoParaPais: "João teve uma ótima sessão hoje! Trabalhamos comunicação e ele fez pedidos sozinho 3 vezes.",
    criadoEm: "2024-03-15T10:00:00Z",
    atualizadoEm: "2024-03-15T11:00:00Z"
  },
  {
    id: "2",
    criancaId: "1",
    criancaNome: "João Silva",
    psicologoId: "psi1",
    psicologoNome: "Dra. Ana Silva",
    data: "2024-03-08T10:00:00Z",
    duracao: 45,
    tipo: "Individual",
    anotacoes: {
      oqueFoiFeito: "Atividades de integração sensorial e coordenação motora fina.",
      diagnosticado: "Dificuldade persistente em atividades que requerem coordenação bilateral.",
      proximosPassos: "Implementar exercícios específicos de coordenação bilateral na próxima sessão."
    },
    compartilhadoComPais: false,
    criadoEm: "2024-03-08T10:00:00Z"
  },
  {
    id: "3",
    criancaId: "2",
    criancaNome: "Maria Santos",
    psicologoId: "psi1",
    psicologoNome: "Dra. Ana Silva",
    data: "2024-03-10T14:00:00Z",
    duracao: 50,
    tipo: "Avaliação",
    anotacoes: {
      oqueFoiFeito: "Avaliação VB-MAPP completa - marcos de linguagem e comportamento social.",
      diagnosticado: "Progresso significativo em marcos de nível 2, especialmente em tato e listener responding.",
      proximosPassos: "Iniciar trabalho em marcos de nível 3, focar em intraverbais."
    },
    compartilhadoComPais: true,
    resumoParaPais: "Avaliação mostra que Maria está progredindo muito bem! Vamos começar atividades mais avançadas.",
    criadoEm: "2024-03-10T14:00:00Z"
  }
]

// Função para mapear SessionResponse (backend) para Sessao (frontend)
function mapSessionResponseToSessao(session: any): Sessao {
  // Mapear tipos de sessão
  const mapTipo = (sessionType: string): Sessao['tipo'] => {
    switch (sessionType.toLowerCase()) {
      case 'individual': return 'Individual'
      case 'group': return 'Grupo'
      case 'assessment': return 'Avaliação'
      case 'follow-up': return 'Seguimento'
      default: return 'Individual'
    }
  }

  return {
    id: session.sessionId,
    criancaId: session.childId,
    criancaNome: session.childName,
    psicologoId: session.psychologistId,
    psicologoNome: session.psychologistName,
    data: session.sessionDate,
    duracao: session.duration,
    tipo: mapTipo(session.sessionType),
    anotacoes: {
      oqueFoiFeito: session.notesWhatWasDone,
      diagnosticado: session.notesWhatWasDiagnosed,
      proximosPassos: session.notesWhatWillBeDone
    },
    compartilhadoComPais: session.isSharedWithParent,
    resumoParaPais: session.parentSummary,
    criadoEm: session.createdAt,
    atualizadoEm: session.updatedAt
  }
}

// Função para mapear Sessao (frontend) para SessionCreateRequest (backend)
function mapSessaoToSessionCreateRequest(sessao: Omit<Sessao, 'id' | 'criadoEm' | 'atualizadoEm' | 'psicologoId' | 'psicologoNome' | 'resumoParaPais'>): any {
  // Mapear tipos para o backend
  const mapTipoToBackend = (tipo: Sessao['tipo']): string => {
    switch (tipo) {
      case 'Individual': return 'individual'
      case 'Grupo': return 'group'
      case 'Avaliação': return 'assessment'
      case 'Seguimento': return 'follow-up'
      default: return 'individual'
    }
  }

  return {
    childId: sessao.criancaId,
    sessionDate: sessao.data,
    duration: sessao.duracao,
    sessionType: mapTipoToBackend(sessao.tipo),
    notesWhatWasDone: sessao.anotacoes.oqueFoiFeito,
    notesWhatWasDiagnosed: sessao.anotacoes.diagnosticado,
    notesWhatWillBeDone: sessao.anotacoes.proximosPassos,
    isSharedWithParent: sessao.compartilhadoComPais
  }
}

// Função para mapear dados de update
function mapSessaoToSessionUpdateRequest(sessao: Partial<Sessao>): any {
  const mapTipoToBackend = (tipo?: Sessao['tipo']): string | undefined => {
    if (!tipo) return undefined
    switch (tipo) {
      case 'Individual': return 'individual'
      case 'Grupo': return 'group'
      case 'Avaliação': return 'assessment'
      case 'Seguimento': return 'follow-up'
      default: return 'individual'
    }
  }

  return {
    sessionDate: sessao.data,
    duration: sessao.duracao,
    sessionType: mapTipoToBackend(sessao.tipo),
    notesWhatWasDone: sessao.anotacoes?.oqueFoiFeito,
    notesWhatWasDiagnosed: sessao.anotacoes?.diagnosticado,
    notesWhatWillBeDone: sessao.anotacoes?.proximosPassos,
    isSharedWithParent: sessao.compartilhadoComPais
  }
}

// State do store
interface SessionState {
  sessoes: Sessao[]
  isLoading: boolean
  isUsingMockData: boolean

  // Actions
  fetchSessoes: () => Promise<void>
  fetchSessoesByCrianca: (criancaId: string) => Promise<void>
  getSessao: (id: string) => Promise<Sessao | null>
  getSessaoById: (id: string) => Sessao | undefined
  addSessao: (novaSessao: Omit<Sessao, 'id' | 'criadoEm' | 'atualizadoEm' | 'psicologoId' | 'psicologoNome' | 'resumoParaPais'>) => Promise<void>
  updateSessao: (id: string, dadosAtualizados: Partial<Sessao>) => Promise<void>
  deleteSessao: (id: string) => Promise<void>
  compartilharComPais: (id: string, compartilhar: boolean) => Promise<void>
}

// Store
export const useSessionStore = create<SessionState>((set, get) => ({
  sessoes: [],
  isLoading: false,
  isUsingMockData: false,

  fetchSessoes: async () => {
    set({ isLoading: true })

    try {
      // Backend não possui endpoint GET /api/Sessions
      // Solução: Buscar crianças do psicólogo e depois buscar sessões de cada uma
      const { api } = await import('@/lib/api')

      // 1. Buscar crianças do psicólogo
      const children = await api.getChildren()

      if (children.length === 0) {
        set({ sessoes: [], isLoading: false, isUsingMockData: false })
        return
      }

      // 2. Buscar sessões de cada criança
      const sessoesPorCrianca = await Promise.all(
        children.map(child => api.getSessionsByChild(child.childId))
      )

      // 3. Consolidar todas as sessões
      const todasSessoes = sessoesPorCrianca.flat()
      const sessoesMapeadas = todasSessoes.map(mapSessionResponseToSessao)

      // 4. Ordenar por data (mais recente primeiro)
      sessoesMapeadas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

      set({ sessoes: sessoesMapeadas, isLoading: false, isUsingMockData: false })
    } catch (error) {
      console.warn("API fetchSessoes failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 800))
      set({ sessoes: mockSessoes, isLoading: false, isUsingMockData: true })
    }
  },

  fetchSessoesByCrianca: async (criancaId: string) => {
    set({ isLoading: true })
    try {
      // Tentar API real primeiro
      const sessions = await api.getSessionsByChild(criancaId)
      const sessoesMapeadas = sessions.map(mapSessionResponseToSessao)

      set({ sessoes: sessoesMapeadas, isLoading: false, isUsingMockData: false })
    } catch (error) {
      console.warn("API getSessionsByChild failed, using mock data:", error)

      // Fallback para dados mock filtrados por criança
      await new Promise((resolve) => setTimeout(resolve, 800))
      const sessoesFiltradas = mockSessoes.filter(s => s.criancaId === criancaId)
      set({ sessoes: sessoesFiltradas, isLoading: false, isUsingMockData: true })
    }
  },

  getSessao: async (id: string) => {
    try {
      // Tentar API real primeiro
      const session = await api.getSession(id)
      return mapSessionResponseToSessao(session)
    } catch (error) {
      console.warn("API getSession failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockSessoes.find(s => s.id === id) || null
    }
  },

  getSessaoById: (id: string) => {
    const { sessoes } = get()
    return sessoes.find(s => s.id === id)
  },

  addSessao: async (novaSessao) => {
    try {
      // Tentar API real primeiro
      const sessionRequest = mapSessaoToSessionCreateRequest(novaSessao)
      const sessionResponse = await api.createSession(sessionRequest)
      const sessaoMapeada = mapSessionResponseToSessao(sessionResponse)

      set((state) => ({
        sessoes: [...state.sessoes, sessaoMapeada],
      }))
    } catch (error) {
      console.warn("API createSession failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sessaoComId: Sessao = {
        ...novaSessao,
        id: Date.now().toString(),
        psicologoId: "psi1", // Mock ID
        psicologoNome: "Dra. Ana Silva", // Mock name
        criadoEm: new Date().toISOString(),
      }

      set((state) => ({
        sessoes: [...state.sessoes, sessaoComId],
        isUsingMockData: true
      }))
    }
  },

  updateSessao: async (id: string, dadosAtualizados) => {
    try {
      // Tentar API real primeiro
      const updateRequest = mapSessaoToSessionUpdateRequest(dadosAtualizados)
      const sessionResponse = await api.updateSession(id, updateRequest)
      const sessaoAtualizada = mapSessionResponseToSessao(sessionResponse)

      set((state) => ({
        sessoes: state.sessoes.map(s => s.id === id ? sessaoAtualizada : s)
      }))
    } catch (error) {
      console.warn("API updateSession failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => ({
        sessoes: state.sessoes.map(s =>
          s.id === id
            ? { ...s, ...dadosAtualizados, atualizadoEm: new Date().toISOString() }
            : s
        ),
        isUsingMockData: true
      }))
    }
  },

  deleteSessao: async (id: string) => {
    try {
      // Tentar API real primeiro
      await api.deleteSession(id)

      set((state) => ({
        sessoes: state.sessoes.filter(s => s.id !== id)
      }))
    } catch (error) {
      console.warn("API deleteSession failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 600))

      set((state) => ({
        sessoes: state.sessoes.filter(s => s.id !== id),
        isUsingMockData: true
      }))
    }
  },

  compartilharComPais: async (id: string, compartilhar: boolean) => {
    try {
      // Tentar API real primeiro
      await api.shareSessionWithParent(id, compartilhar)

      set((state) => ({
        sessoes: state.sessoes.map(s =>
          s.id === id ? { ...s, compartilhadoComPais: compartilhar } : s
        )
      }))
    } catch (error) {
      console.warn("API shareSessionWithParent failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => ({
        sessoes: state.sessoes.map(s =>
          s.id === id ? { ...s, compartilhadoComPais: compartilhar } : s
        ),
        isUsingMockData: true
      }))
    }
  }
}))

// Funções utilitárias para componentes
export const useSessionUtils = () => {
  return {
    // Filtrar sessões por período
    filtrarPorPeriodo: (sessoes: Sessao[], diasAtras: number) => {
      const dataLimite = new Date()
      dataLimite.setDate(dataLimite.getDate() - diasAtras)

      return sessoes.filter(s => new Date(s.data) >= dataLimite)
    },

    // Calcular estatísticas
    calcularEstatisticas: (sessoes: Sessao[]) => {
      return {
        total: sessoes.length,
        compartilhadas: sessoes.filter(s => s.compartilhadoComPais).length,
        duracaoMedia: sessoes.length > 0
          ? Math.round(sessoes.reduce((acc, s) => acc + s.duracao, 0) / sessoes.length)
          : 0,
        tiposFrequentes: sessoes.reduce((acc, s) => {
          acc[s.tipo] = (acc[s.tipo] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    },

    // Formatar duração
    formatarDuracao: (minutos: number) => {
      if (minutos < 60) return `${minutos}min`
      const horas = Math.floor(minutos / 60)
      const mins = minutos % 60
      return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`
    }
  }
}