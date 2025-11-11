// store/prontuario-store.ts
import { create } from 'zustand'
import {
  DadosProntuario,
  RegistroComportamento,
  criarIntervalosVazios,
  calcularEstatisticas
} from '@/types/prontuario'

interface ProntuarioStore {
  prontuarios: Map<string, DadosProntuario> // sessaoId -> prontuario
  isLoading: boolean
  isUsingMockData: boolean

  // Buscar prontuário por sessão
  getProntuarioBySessao: (sessaoId: string) => DadosProntuario | undefined

  // Salvar/atualizar prontuário
  saveProntuario: (sessaoId: string, registros: RegistroComportamento[]) => Promise<void>

  // Criar prontuário vazio
  createProntuarioVazio: (sessaoId: string, criancaId: string, criancaNome: string) => DadosProntuario
}

// Dados mock de exemplo
const mockProntuarios: Map<string, DadosProntuario> = new Map([
  [
    "1",
    {
      sessaoId: "1",
      criancaId: "1",
      criancaNome: "João Silva",
      data: "2024-03-15T10:00:00Z",
      duracaoTotal: 60,
      registros: [
        {
          id: "comportamento-1",
          tipo: "comportamento",
          nome: "Comportamento problema 1°",
          ordem: 1,
          intervalos: [
            { minutos: 5, acerto: 0, erro: 0 },
            { minutos: 10, acerto: 0, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 0, erro: 0 },
            { minutos: 25, acerto: 0, erro: 0 },
            { minutos: 30, acerto: 0, erro: 0 },
            { minutos: 35, acerto: 2, erro: 0 },
            { minutos: 40, acerto: 0, erro: 0 },
            { minutos: 45, acerto: 0, erro: 0 },
            { minutos: 50, acerto: 0, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 0, erro: 0 },
          ],
          totalAcertos: 2,
          totalErros: 0,
          totalTentativas: 2,
          porcentagemAcerto: 100
        },
        {
          id: "demanda-1",
          tipo: "demanda",
          nome: "Demanda 1°",
          ordem: 1,
          intervalos: [
            { minutos: 5, acerto: 0, erro: 0 },
            { minutos: 10, acerto: 1, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 0, erro: 0 },
            { minutos: 25, acerto: 0, erro: 0 },
            { minutos: 30, acerto: 1, erro: 0 },
            { minutos: 35, acerto: 0, erro: 0 },
            { minutos: 40, acerto: 0, erro: 0 },
            { minutos: 45, acerto: 0, erro: 0 },
            { minutos: 50, acerto: 1, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 0, erro: 0 },
          ],
          totalAcertos: 3,
          totalErros: 0,
          totalTentativas: 3,
          porcentagemAcerto: 100
        },
        {
          id: "demanda-2",
          tipo: "demanda",
          nome: "Demanda 2°",
          ordem: 2,
          intervalos: [
            { minutos: 5, acerto: 1, erro: 0 },
            { minutos: 10, acerto: 1, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 1, erro: 0 },
            { minutos: 25, acerto: 0, erro: 0 },
            { minutos: 30, acerto: 0, erro: 0 },
            { minutos: 35, acerto: 0, erro: 0 },
            { minutos: 40, acerto: 0, erro: 0 },
            { minutos: 45, acerto: 0, erro: 0 },
            { minutos: 50, acerto: 0, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 0, erro: 0 },
          ],
          totalAcertos: 3,
          totalErros: 0,
          totalTentativas: 3,
          porcentagemAcerto: 100
        },
        {
          id: "demanda-3",
          tipo: "demanda",
          nome: "Demanda 3°",
          ordem: 3,
          intervalos: [
            { minutos: 5, acerto: 1, erro: 0 },
            { minutos: 10, acerto: 1, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 1, erro: 0 },
            { minutos: 25, acerto: 1, erro: 0 },
            { minutos: 30, acerto: 1, erro: 0 },
            { minutos: 35, acerto: 1, erro: 0 },
            { minutos: 40, acerto: 0, erro: 0 },
            { minutos: 45, acerto: 0, erro: 0 },
            { minutos: 50, acerto: 0, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 0, erro: 0 },
          ],
          totalAcertos: 6,
          totalErros: 0,
          totalTentativas: 6,
          porcentagemAcerto: 100
        },
        {
          id: "demanda-4",
          tipo: "demanda",
          nome: "Demanda 4°",
          ordem: 4,
          intervalos: [
            { minutos: 5, acerto: 0, erro: 0 },
            { minutos: 10, acerto: 0, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 0, erro: 0 },
            { minutos: 25, acerto: 0, erro: 1 },
            { minutos: 30, acerto: 0, erro: 0 },
            { minutos: 35, acerto: 1, erro: 0 },
            { minutos: 40, acerto: 0, erro: 0 },
            { minutos: 45, acerto: 0, erro: 0 },
            { minutos: 50, acerto: 0, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 0, erro: 0 },
          ],
          totalAcertos: 1,
          totalErros: 1,
          totalTentativas: 2,
          porcentagemAcerto: 50
        },
        {
          id: "demanda-5",
          tipo: "demanda",
          nome: "Demanda 5°",
          ordem: 5,
          intervalos: [
            { minutos: 5, acerto: 0, erro: 0 },
            { minutos: 10, acerto: 0, erro: 0 },
            { minutos: 15, acerto: 0, erro: 0 },
            { minutos: 20, acerto: 0, erro: 0 },
            { minutos: 25, acerto: 0, erro: 0 },
            { minutos: 30, acerto: 0, erro: 0 },
            { minutos: 35, acerto: 0, erro: 0 },
            { minutos: 40, acerto: 1, erro: 0 },
            { minutos: 45, acerto: 1, erro: 0 },
            { minutos: 50, acerto: 1, erro: 0 },
            { minutos: 55, acerto: 0, erro: 0 },
            { minutos: 60, acerto: 1, erro: 0 },
          ],
          totalAcertos: 4,
          totalErros: 0,
          totalTentativas: 4,
          porcentagemAcerto: 100
        },
      ],
      observacoes: "Sessão produtiva, criança respondeu bem aos estímulos.",
      criadoEm: "2024-03-15T10:00:00Z",
      atualizadoEm: "2024-03-15T11:00:00Z"
    }
  ]
])

export const useProntuarioStore = create<ProntuarioStore>((set, get) => ({
  prontuarios: new Map(mockProntuarios),
  isLoading: false,
  isUsingMockData: true,

  getProntuarioBySessao: (sessaoId: string) => {
    const { prontuarios } = get()
    return prontuarios.get(sessaoId)
  },

  saveProntuario: async (sessaoId: string, registros: RegistroComportamento[]) => {
    set({ isLoading: true })

    try {
      // TODO: Integração com backend quando disponível
      // await api.saveProntuario(sessaoId, registros)

      // Mock: Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Calcular estatísticas para cada registro
      registros.forEach(registro => calcularEstatisticas(registro))

      // Atualizar no store
      const { prontuarios } = get()
      const prontuarioAtual = prontuarios.get(sessaoId)

      const novoProntuario: DadosProntuario = {
        sessaoId,
        criancaId: prontuarioAtual?.criancaId || '',
        criancaNome: prontuarioAtual?.criancaNome || '',
        data: prontuarioAtual?.data || new Date().toISOString(),
        duracaoTotal: prontuarioAtual?.duracaoTotal || 60,
        registros,
        criadoEm: prontuarioAtual?.criadoEm || new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }

      const novosProntuarios = new Map(prontuarios)
      novosProntuarios.set(sessaoId, novoProntuario)

      set({ prontuarios: novosProntuarios, isUsingMockData: true })
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  createProntuarioVazio: (sessaoId: string, criancaId: string, criancaNome: string) => {
    return {
      sessaoId,
      criancaId,
      criancaNome,
      data: new Date().toISOString(),
      duracaoTotal: 60,
      registros: [],
      criadoEm: new Date().toISOString()
    }
  }
}))
