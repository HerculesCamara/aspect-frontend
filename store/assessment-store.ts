// store/assessment-store.ts
import { create } from "zustand"
import { api } from "@/lib/api"

// Estrutura frontend para VB-MAPP Assessments
interface Assessment {
  id: string
  criancaId: string
  criancaNome?: string
  psicologoId?: string
  psicologoNome?: string
  data: string
  pontuacaoGeral?: number
  tipo: 'Milestones' | 'Barriers' | 'Transition'
  // Dados específicos por tipo
  dadosMarcos?: {
    nivel1?: number
    nivel2?: number
    nivel3?: number
    pontuacoes: Record<string, number> // Ex: { "Mand1": 2, "Tact1": 1, ... }
  }
  dadosBarreiras?: {
    pontuacoes: Record<string, number> // Ex: { "Barrier1": 3, "Barrier2": 2, ... }
    notasQualitativas?: string
  }
  dadosTransicao?: {
    pontuacoes: Record<string, number> // Ex: { "Classroom": 4, "Group": 3, ... }
    notasProntidao?: string
  }
  criadoEm: string
  atualizadoEm?: string
}

// Dados mock para desenvolvimento
const mockAssessments: Assessment[] = [
  {
    id: "a1",
    criancaId: "1",
    criancaNome: "João Silva",
    data: "2025-09-15T00:00:00Z",
    pontuacaoGeral: 85,
    tipo: "Milestones",
    dadosMarcos: {
      nivel1: 30,
      nivel2: 35,
      nivel3: 20,
      pontuacoes: {
        "Mand1": 2,
        "Mand2": 2,
        "Tact1": 1,
        "Tact2": 2,
        "Listener1": 2,
        "Listener2": 1
      }
    },
    criadoEm: "2025-09-15T10:00:00Z"
  },
  {
    id: "a2",
    criancaId: "1",
    criancaNome: "João Silva",
    data: "2025-09-15T00:00:00Z",
    tipo: "Barriers",
    dadosBarreiras: {
      pontuacoes: {
        "Barrier1": 2,
        "Barrier2": 1,
        "Barrier3": 3
      },
      notasQualitativas: "Criança apresenta dificuldades moderadas em atenção sustentada"
    },
    criadoEm: "2025-09-15T11:00:00Z"
  },
  {
    id: "a3",
    criancaId: "2",
    criancaNome: "Maria Santos",
    data: "2025-09-10T00:00:00Z",
    pontuacaoGeral: 45,
    tipo: "Milestones",
    dadosMarcos: {
      nivel1: 20,
      nivel2: 15,
      nivel3: 10,
      pontuacoes: {
        "Mand1": 1,
        "Mand2": 0,
        "Tact1": 1,
        "Tact2": 0,
        "Listener1": 1,
        "Listener2": 1
      }
    },
    criadoEm: "2025-09-10T14:00:00Z"
  }
]

// Mapeamento AssessmentResponse (backend) → Assessment (frontend)
function mapAssessmentResponseToAssessment(assessment: any): Assessment {
  const baseAssessment: Assessment = {
    id: assessment.assessmentId,
    criancaId: assessment.childId,
    criancaNome: assessment.childName,
    psicologoId: assessment.psychologistId,
    psicologoNome: assessment.psychologistName,
    data: assessment.assessmentDate,
    pontuacaoGeral: assessment.overallScore,
    tipo: assessment.assessmentType,
    criadoEm: assessment.createdAt,
    atualizadoEm: assessment.updatedAt
  }

  // O backend não retorna os dados detalhados por tipo no AssessmentResponse base
  // Eles viriam de entidades relacionadas que precisariam ser carregadas separadamente
  // Por enquanto, mantemos apenas os dados base

  return baseAssessment
}

// Mapeamento para requisições
function mapMilestonesAssessment(assessment: Omit<Assessment, 'id' | 'criadoEm'>): any {
  return {
    childId: assessment.criancaId,
    assessmentDate: assessment.data,
    assessmentType: 'Milestones',
    level1Score: assessment.dadosMarcos?.nivel1,
    level2Score: assessment.dadosMarcos?.nivel2,
    level3Score: assessment.dadosMarcos?.nivel3,
    milestoneScores: assessment.dadosMarcos?.pontuacoes || {}
  }
}

function mapBarriersAssessment(assessment: Omit<Assessment, 'id' | 'criadoEm'>): any {
  return {
    childId: assessment.criancaId,
    assessmentDate: assessment.data,
    assessmentType: 'Barriers',
    barrierScores: assessment.dadosBarreiras?.pontuacoes || {},
    qualitativeNotes: assessment.dadosBarreiras?.notasQualitativas
  }
}

function mapTransitionAssessment(assessment: Omit<Assessment, 'id' | 'criadoEm'>): any {
  return {
    childId: assessment.criancaId,
    assessmentDate: assessment.data,
    assessmentType: 'Transition',
    transitionScores: assessment.dadosTransicao?.pontuacoes || {},
    readinessNotes: assessment.dadosTransicao?.notasProntidao
  }
}

interface AssessmentState {
  assessments: Assessment[]
  progressData: Record<string, any> | null
  isUsingMockData: boolean

  // Actions
  fetchAssessmentsByCrianca: (criancaId: string) => Promise<void>
  fetchProgressData: (criancaId: string) => Promise<void>
  getAssessment: (id: string) => Promise<Assessment | null>
  createMilestonesAssessment: (data: Omit<Assessment, 'id' | 'criadoEm' | 'psicologoId' | 'psicologoNome'>) => Promise<void>
  createBarriersAssessment: (data: Omit<Assessment, 'id' | 'criadoEm' | 'psicologoId' | 'psicologoNome'>) => Promise<void>
  createTransitionAssessment: (data: Omit<Assessment, 'id' | 'criadoEm' | 'psicologoId' | 'psicologoNome'>) => Promise<void>
}

// Store
export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessments: [],
  progressData: null,
  isUsingMockData: false,

  fetchAssessmentsByCrianca: async (criancaId: string) => {
    try {
      // Tentar API real primeiro
      const assessments = await api.getAssessmentsByChild(criancaId)
      const assessmentsMapeados = assessments.map(mapAssessmentResponseToAssessment)

      set({ assessments: assessmentsMapeados, isUsingMockData: false })
    } catch (error) {
      console.warn("API getAssessmentsByChild failed, using mock data:", error)

      // Fallback para dados mock filtrados por criança
      await new Promise((resolve) => setTimeout(resolve, 800))
      const assessmentsFiltrados = mockAssessments.filter(a => a.criancaId === criancaId)
      set({ assessments: assessmentsFiltrados, isUsingMockData: true })
    }
  },

  fetchProgressData: async (criancaId: string) => {
    try {
      // Tentar API real primeiro
      const progressData = await api.getProgressData(criancaId)

      set({ progressData, isUsingMockData: false })
    } catch (error) {
      console.warn("API getProgressData failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 600))
      const mockProgress = {
        totalAssessments: mockAssessments.filter(a => a.criancaId === criancaId).length,
        latestScores: {
          milestones: 85,
          barriers: 0,
          transition: 0
        },
        progressTrend: "improving"
      }
      set({ progressData: mockProgress, isUsingMockData: true })
    }
  },

  getAssessment: async (id: string) => {
    try {
      // Tentar API real primeiro
      const assessment = await api.getAssessment(id)
      return mapAssessmentResponseToAssessment(assessment)
    } catch (error) {
      console.warn("API getAssessment failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockAssessments.find(a => a.id === id) || null
    }
  },

  createMilestonesAssessment: async (data) => {
    try {
      // Tentar API real primeiro
      const assessmentRequest = mapMilestonesAssessment(data)
      const assessmentResponse = await api.createMilestonesAssessment(assessmentRequest)
      const assessmentMapeado = mapAssessmentResponseToAssessment(assessmentResponse)

      set((state) => ({
        assessments: [...state.assessments, assessmentMapeado],
      }))
    } catch (error) {
      console.warn("API createMilestonesAssessment failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoAssessment: Assessment = {
        ...data,
        id: `a${Date.now()}`,
        tipo: 'Milestones',
        criadoEm: new Date().toISOString(),
      }

      set((state) => ({
        assessments: [...state.assessments, novoAssessment],
        isUsingMockData: true
      }))
    }
  },

  createBarriersAssessment: async (data) => {
    try {
      // Tentar API real primeiro
      const assessmentRequest = mapBarriersAssessment(data)
      const assessmentResponse = await api.createBarriersAssessment(assessmentRequest)
      const assessmentMapeado = mapAssessmentResponseToAssessment(assessmentResponse)

      set((state) => ({
        assessments: [...state.assessments, assessmentMapeado],
      }))
    } catch (error) {
      console.warn("API createBarriersAssessment failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoAssessment: Assessment = {
        ...data,
        id: `a${Date.now()}`,
        tipo: 'Barriers',
        criadoEm: new Date().toISOString(),
      }

      set((state) => ({
        assessments: [...state.assessments, novoAssessment],
        isUsingMockData: true
      }))
    }
  },

  createTransitionAssessment: async (data) => {
    try {
      // Tentar API real primeiro
      const assessmentRequest = mapTransitionAssessment(data)
      const assessmentResponse = await api.createTransitionAssessment(assessmentRequest)
      const assessmentMapeado = mapAssessmentResponseToAssessment(assessmentResponse)

      set((state) => ({
        assessments: [...state.assessments, assessmentMapeado],
      }))
    } catch (error) {
      console.warn("API createTransitionAssessment failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const novoAssessment: Assessment = {
        ...data,
        id: `a${Date.now()}`,
        tipo: 'Transition',
        criadoEm: new Date().toISOString(),
      }

      set((state) => ({
        assessments: [...state.assessments, novoAssessment],
        isUsingMockData: true
      }))
    }
  }
}))

// Utilitários para componentes
export const useAssessmentUtils = () => {
  return {
    // Calcular progresso geral
    calcularProgressoGeral: (assessments: Assessment[]) => {
      const milestones = assessments.filter(a => a.tipo === 'Milestones')
      if (milestones.length === 0) return 0

      const total = milestones.reduce((sum, a) => sum + (a.pontuacaoGeral || 0), 0)
      return Math.round(total / milestones.length)
    },

    // Identificar áreas que precisam atenção
    identificarAreasCriticas: (assessments: Assessment[]) => {
      const barriers = assessments.filter(a => a.tipo === 'Barriers')
      const areas: string[] = []

      barriers.forEach(b => {
        if (b.dadosBarreiras) {
          Object.entries(b.dadosBarreiras.pontuacoes).forEach(([key, value]) => {
            if (value >= 3) { // Pontuação alta em barreira indica problema
              areas.push(key)
            }
          })
        }
      })

      return [...new Set(areas)] // Remove duplicatas
    },

    // Formatar tipo de assessment para exibição
    formatarTipo: (tipo: string) => {
      const tipos = {
        'Milestones': 'Marcos de Desenvolvimento',
        'Barriers': 'Barreiras ao Aprendizado',
        'Transition': 'Prontidão para Transição'
      }
      return tipos[tipo as keyof typeof tipos] || tipo
    }
  }
}