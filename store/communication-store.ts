import { create } from 'zustand'
import { api } from '@/lib/api'

// Estrutura de dados do frontend
interface Usuario {
  id: string
  nome: string
  email: string
  tipo: 'psicologo' | 'pai'
}

interface Mensagem {
  id: string
  remetenteId: string
  remetente: Usuario
  destinatarioId: string
  destinatario: Usuario
  conteudo: string
  criancaId: string
  criancaNome: string
  lida: boolean
  enviadaEm: string
}

// Dados mock para fallback
const mockMensagens: Mensagem[] = [
  {
    id: "1",
    remetenteId: "psi1",
    remetente: {
      id: "psi1",
      nome: "Dra. Ana Silva",
      email: "ana.silva@exemplo.com",
      tipo: "psicologo"
    },
    destinatarioId: "pai1",
    destinatario: {
      id: "pai1",
      nome: "Carlos Santos",
      email: "carlos@exemplo.com",
      tipo: "pai"
    },
    conteudo: "Olá Carlos! João teve uma excelente sessão hoje. Gostaria de marcar uma conversa para discutir o progresso dele?",
    criancaId: "1",
    criancaNome: "João Silva",
    lida: false,
    enviadaEm: "2024-03-15T14:30:00Z"
  },
  {
    id: "2",
    remetenteId: "pai1",
    remetente: {
      id: "pai1",
      nome: "Carlos Santos",
      email: "carlos@exemplo.com",
      tipo: "pai"
    },
    destinatarioId: "psi1",
    destinatario: {
      id: "psi1",
      nome: "Dra. Ana Silva",
      email: "ana.silva@exemplo.com",
      tipo: "psicologo"
    },
    conteudo: "Ótimo! Obrigado pelo retorno. Podemos conversar na quinta-feira?",
    criancaId: "1",
    criancaNome: "João Silva",
    lida: true,
    enviadaEm: "2024-03-15T15:00:00Z"
  }
]

// Função para mapear MessageResponse (backend) para Mensagem (frontend)
function mapMessageResponseToMensagem(message: any): Mensagem {
  const mapUsuario = (user: any): Usuario => ({
    id: user.id,
    nome: user.name || 'Usuário',
    email: user.email || '',
    tipo: user.role === 'Psychologist' ? 'psicologo' : 'pai'
  })

  return {
    id: message.id,
    remetenteId: message.senderId,
    remetente: mapUsuario(message.sender),
    destinatarioId: message.recipientId,
    destinatario: mapUsuario(message.recipient),
    conteudo: message.content || '',
    criancaId: message.childId,
    criancaNome: message.child?.fullName || message.child?.firstName || 'Criança',
    lida: message.isRead,
    enviadaEm: message.sentAt
  }
}

// Função para mapear dados frontend para MessageRequest (backend)
function mapToMessageRequest(data: { destinatarioId: string; conteudo: string; criancaId: string }): any {
  return {
    recipientId: data.destinatarioId,
    content: data.conteudo,
    childId: data.criancaId
  }
}

interface CommunicationState {
  mensagens: Mensagem[]
  naoLidas: Mensagem[]
  contadorNaoLidas: number
  isUsingMockData: boolean

  fetchMensagensPorCrianca: (criancaId: string) => Promise<void>
  fetchConversa: (outroUsuarioId: string, criancaId: string) => Promise<void>
  fetchMensagensNaoLidas: () => Promise<void>
  fetchContadorNaoLidas: () => Promise<void>
  enviarMensagem: (destinatarioId: string, conteudo: string, criancaId: string) => Promise<void>
  marcarComoLida: (mensagemId: string) => Promise<void>
}

// Store
export const useCommunicationStore = create<CommunicationState>((set, get) => ({
  mensagens: [],
  naoLidas: [],
  contadorNaoLidas: 0,
  isUsingMockData: false,

  fetchMensagensPorCrianca: async (criancaId: string) => {
    try {
      const messages = await api.getMessagesByChild(criancaId)
      const mensagensMapeadas = messages.map(mapMessageResponseToMensagem)

      set({ mensagens: mensagensMapeadas, isUsingMockData: false })
    } catch (error) {
      console.warn("API getMessagesByChild failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 500))
      const mensagensFiltradas = mockMensagens.filter(m => m.criancaId === criancaId)
      set({ mensagens: mensagensFiltradas, isUsingMockData: true })
    }
  },

  fetchConversa: async (outroUsuarioId: string, criancaId: string) => {
    try {
      const messages = await api.getConversation(outroUsuarioId, criancaId)
      const mensagensMapeadas = messages.map(mapMessageResponseToMensagem)

      set({ mensagens: mensagensMapeadas, isUsingMockData: false })
    } catch (error) {
      console.warn("API getConversation failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 500))
      const conversaFiltrada = mockMensagens.filter(
        m => (m.remetenteId === outroUsuarioId || m.destinatarioId === outroUsuarioId) && m.criancaId === criancaId
      )
      set({ mensagens: conversaFiltrada, isUsingMockData: true })
    }
  },

  fetchMensagensNaoLidas: async () => {
    try {
      const messages = await api.getUnreadMessages()
      const mensagensMapeadas = messages.map(mapMessageResponseToMensagem)

      set({ naoLidas: mensagensMapeadas, contadorNaoLidas: mensagensMapeadas.length, isUsingMockData: false })
    } catch (error) {
      console.warn("API getUnreadMessages failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 500))
      const mensagensNaoLidas = mockMensagens.filter(m => !m.lida)
      set({ naoLidas: mensagensNaoLidas, contadorNaoLidas: mensagensNaoLidas.length, isUsingMockData: true })
    }
  },

  fetchContadorNaoLidas: async () => {
    try {
      const count = await api.getUnreadCount()

      set({ contadorNaoLidas: count, isUsingMockData: false })
    } catch (error) {
      console.warn("API getUnreadCount failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 300))
      const count = mockMensagens.filter(m => !m.lida).length
      set({ contadorNaoLidas: count, isUsingMockData: true })
    }
  },

  enviarMensagem: async (destinatarioId: string, conteudo: string, criancaId: string) => {
    try {
      const requestData = mapToMessageRequest({ destinatarioId, conteudo, criancaId })
      const message = await api.sendMessage(requestData)
      const mensagemMapeada = mapMessageResponseToMensagem(message)

      set((state) => ({
        mensagens: [...state.mensagens, mensagemMapeada],
        isUsingMockData: false
      }))
    } catch (error) {
      console.warn("API sendMessage failed, using mock data:", error)

      await new Promise((resolve) => setTimeout(resolve, 500))

      const novaMensagem: Mensagem = {
        id: Date.now().toString(),
        remetenteId: "current-user",
        remetente: {
          id: "current-user",
          nome: "Você",
          email: "user@exemplo.com",
          tipo: "psicologo"
        },
        destinatarioId,
        destinatario: {
          id: destinatarioId,
          nome: "Destinatário",
          email: "",
          tipo: "pai"
        },
        conteudo,
        criancaId,
        criancaNome: "Criança",
        lida: false,
        enviadaEm: new Date().toISOString()
      }

      set((state) => ({
        mensagens: [...state.mensagens, novaMensagem],
        isUsingMockData: true
      }))
    }
  },

  marcarComoLida: async (mensagemId: string) => {
    try {
      await api.markMessageAsRead(mensagemId)

      set((state) => ({
        mensagens: state.mensagens.map(m =>
          m.id === mensagemId ? { ...m, lida: true } : m
        ),
        naoLidas: state.naoLidas.filter(m => m.id !== mensagemId),
        contadorNaoLidas: Math.max(0, state.contadorNaoLidas - 1)
      }))
    } catch (error) {
      console.warn("API markMessageAsRead failed, using mock behavior:", error)

      await new Promise((resolve) => setTimeout(resolve, 300))

      set((state) => ({
        mensagens: state.mensagens.map(m =>
          m.id === mensagemId ? { ...m, lida: true } : m
        ),
        naoLidas: state.naoLidas.filter(m => m.id !== mensagemId),
        contadorNaoLidas: Math.max(0, state.contadorNaoLidas - 1),
        isUsingMockData: true
      }))
    }
  }
}))