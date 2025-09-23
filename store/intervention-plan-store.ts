import { create } from 'zustand'
import { api } from '@/lib/api'

interface InterventionGoal {
  id: string
  descricao: string
  comportamentoAlvo?: string
  criterioMedicao?: string
  notasProgresso?: string
  dataAlvo?: string
  alcancado: boolean
}

interface InterventionPlan {
  id: string
  criancaId: string
  criancaNome?: string
  psicologoId?: string
  psicologoNome?: string
  dataInicio: string
  dataFim?: string
  objetivosGerais?: string
  status?: string
  metas: InterventionGoal[]
  criadoEm: string
  atualizadoEm?: string
}

const mockPlans: InterventionPlan[] = [
  {
    id: 'plan1',
    criancaId: '1',
    criancaNome: 'João Silva',
    psicologoId: 'psi1',
    psicologoNome: 'Dra. Ana Silva',
    dataInicio: '2025-09-01T00:00:00Z',
    dataFim: '2025-12-31T00:00:00Z',
    objetivosGerais: 'Desenvolver comunicação funcional e habilidades sociais básicas',
    status: 'Ativo',
    metas: [
      {
        id: 'goal1',
        descricao: 'Aumentar pedidos verbais espontâneos',
        comportamentoAlvo: 'Fazer pedidos usando frases de 2-3 palavras',
        criterioMedicao: '80% de acertos em 3 sessões consecutivas',
        notasProgresso: 'Progredindo bem, atualmente em 65%',
        dataAlvo: '2025-10-15T00:00:00Z',
        alcancado: false
      },
      {
        id: 'goal2',
        descricao: 'Melhorar contato visual durante interações',
        comportamentoAlvo: 'Manter contato visual por 3-5 segundos',
        criterioMedicao: '5 ocorrências por sessão',
        notasProgresso: 'Meta alcançada!',
        dataAlvo: '2025-09-30T00:00:00Z',
        alcancado: true
      }
    ],
    criadoEm: '2025-09-01T10:00:00Z',
    atualizadoEm: '2025-09-15T14:30:00Z'
  },
  {
    id: 'plan2',
    criancaId: '2',
    criancaNome: 'Maria Santos',
    psicologoId: 'psi1',
    psicologoNome: 'Dra. Ana Silva',
    dataInicio: '2025-08-15T00:00:00Z',
    objetivosGerais: 'Implementar sistema de comunicação alternativa e reduzir comportamentos desafiadores',
    status: 'Ativo',
    metas: [
      {
        id: 'goal3',
        descricao: 'Utilizar PECS para fazer 10 pedidos diferentes',
        comportamentoAlvo: 'Trocar cartão PECS por item desejado',
        criterioMedicao: '10 pedidos diferentes ao longo de uma semana',
        notasProgresso: 'Atualmente consegue 6 pedidos consistentes',
        dataAlvo: '2025-10-30T00:00:00Z',
        alcancado: false
      }
    ],
    criadoEm: '2025-08-15T09:00:00Z'
  }
]

function mapInterventionPlanResponseToPlan(plan: any): InterventionPlan {
  return {
    id: plan.planId,
    criancaId: plan.childId,
    criancaNome: plan.childName,
    psicologoId: plan.psychologistId,
    psicologoNome: plan.psychologistName,
    dataInicio: plan.startDate,
    dataFim: plan.endDate,
    objetivosGerais: plan.goals,
    status: plan.status || 'Ativo',
    metas: plan.interventionGoals?.map((goal: any) => ({
      id: goal.goalId,
      descricao: goal.description,
      comportamentoAlvo: goal.targetBehavior,
      criterioMedicao: goal.measurementCriteria,
      notasProgresso: goal.progressNotes,
      dataAlvo: goal.targetDate,
      alcancado: goal.isAchieved
    })) || [],
    criadoEm: plan.createdAt,
    atualizadoEm: plan.updatedAt
  }
}

function mapPlanToInterventionPlanRequest(plan: Omit<InterventionPlan, 'id' | 'criadoEm' | 'atualizadoEm' | 'psicologoId' | 'psicologoNome' | 'criancaNome'>): any {
  return {
    childId: plan.criancaId,
    startDate: plan.dataInicio,
    endDate: plan.dataFim,
    goals: plan.objetivosGerais,
    interventionGoals: plan.metas.map(meta => ({
      description: meta.descricao,
      targetBehavior: meta.comportamentoAlvo,
      measurementCriteria: meta.criterioMedicao,
      progressNotes: meta.notasProgresso,
      targetDate: meta.dataAlvo
    }))
  }
}

interface InterventionPlanState {
  plans: InterventionPlan[]
  isUsingMockData: boolean

  fetchPlansByCrianca: (criancaId: string) => Promise<void>
  getPlan: (id: string) => Promise<InterventionPlan | null>
  createPlan: (plan: Omit<InterventionPlan, 'id' | 'criadoEm' | 'atualizadoEm' | 'psicologoId' | 'psicologoNome' | 'criancaNome'>) => Promise<void>
  updatePlan: (id: string, updates: Partial<InterventionPlan>) => Promise<void>
  deletePlan: (id: string) => Promise<void>
}

export const useInterventionPlanStore = create<InterventionPlanState>((set, get) => ({
  plans: [],
  isUsingMockData: false,

  fetchPlansByCrianca: async (criancaId: string) => {
    try {
      const plans = await api.getInterventionPlansByChild(criancaId)
      const plansMapeados = plans.map(mapInterventionPlanResponseToPlan)

      set({ plans: plansMapeados, isUsingMockData: false })
    } catch (error) {
      console.warn("API getInterventionPlansByChild failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 800))
      const plansFiltrados = mockPlans.filter(p => p.criancaId === criancaId)
      set({ plans: plansFiltrados, isUsingMockData: true })
    }
  },

  getPlan: async (id: string) => {
    try {
      const plan = await api.getInterventionPlan(id)
      return mapInterventionPlanResponseToPlan(plan)
    } catch (error) {
      console.warn("API getInterventionPlan failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockPlans.find(p => p.id === id) || null
    }
  },

  createPlan: async (novoPlan) => {
    try {
      const planRequest = mapPlanToInterventionPlanRequest(novoPlan)
      const planResponse = await api.createInterventionPlan(planRequest)
      const planMapeado = mapInterventionPlanResponseToPlan(planResponse)

      set((state) => ({
        plans: [...state.plans, planMapeado],
      }))
    } catch (error) {
      console.warn("API createInterventionPlan failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const planComId: InterventionPlan = {
        ...novoPlan,
        id: `plan${Date.now()}`,
        criadoEm: new Date().toISOString(),
      }

      set((state) => ({
        plans: [...state.plans, planComId],
        isUsingMockData: true
      }))
    }
  },

  updatePlan: async (id: string, updates: Partial<InterventionPlan>) => {
    try {
      const planAtual = get().plans.find(p => p.id === id)
      if (!planAtual) throw new Error("Plano não encontrado")

      const planCompleto = { ...planAtual, ...updates }
      const updateRequest = mapPlanToInterventionPlanRequest(planCompleto)

      const planResponse = await api.updateInterventionPlan(id, updateRequest)
      const planAtualizado = mapInterventionPlanResponseToPlan(planResponse)

      set((state) => ({
        plans: state.plans.map(p => p.id === id ? planAtualizado : p)
      }))
    } catch (error) {
      console.warn("API updateInterventionPlan failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 800))

      set((state) => ({
        plans: state.plans.map(p =>
          p.id === id
            ? { ...p, ...updates, atualizadoEm: new Date().toISOString() }
            : p
        ),
        isUsingMockData: true
      }))
    }
  },

  deletePlan: async (id: string) => {
    try {
      await api.deleteInterventionPlan(id)

      set((state) => ({
        plans: state.plans.filter(p => p.id !== id)
      }))
    } catch (error) {
      console.warn("API deleteInterventionPlan failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 600))

      set((state) => ({
        plans: state.plans.filter(p => p.id !== id),
        isUsingMockData: true
      }))
    }
  }
}))

export const useInterventionPlanUtils = () => {
  return {
    calcularProgresso: (plan: InterventionPlan) => {
      if (plan.metas.length === 0) return 0
      const metasAlcancadas = plan.metas.filter(m => m.alcancado).length
      return Math.round((metasAlcancadas / plan.metas.length) * 100)
    },

    isAtivo: (plan: InterventionPlan) => {
      if (!plan.dataFim) return true
      return new Date(plan.dataFim) > new Date()
    },

    formatarStatus: (plan: InterventionPlan) => {
      if (plan.status) return plan.status
      return useInterventionPlanUtils().isAtivo(plan) ? 'Ativo' : 'Concluído'
    }
  }
}