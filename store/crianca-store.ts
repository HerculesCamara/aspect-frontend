import { create } from "zustand"

// Tipos
interface Progresso {
  linguagem: number
  social: number
  motor: number
  media: number
  tendencia: "up" | "down"
}

interface Crianca {
  id: string
  nome: string
  idade: number
  nivelVBMAPP: string
  progresso: Progresso
  alertas?: string[]
  foto?: string
  dataNascimento?: string
  responsavel?: {
    nome: string
    telefone: string
    email: string
    endereco: string
  }
  informacoesMedicas?: {
    medicamentos: string
    alergias: string
    observacoes: string
  }
}

interface CriancaState {
  criancas: Crianca[]
  fetchCriancas: () => Promise<void>
  addCrianca: (crianca: Omit<Crianca, "id">) => Promise<void>
  getCriancaById: (id: string) => Crianca | undefined
}

// Dados mockados
const mockCriancas: Crianca[] = [
  {
    id: "1",
    nome: "João Silva",
    idade: 5,
    nivelVBMAPP: "Nível 2",
    progresso: {
      linguagem: 65,
      social: 58,
      motor: 72,
      media: 65,
      tendencia: "up",
    },
    alertas: [],
    foto: "/images/criancas/joao.jpg",
    dataNascimento: "2019-03-15",
    responsavel: {
      nome: "Maria Silva",
      telefone: "(11) 99999-9999",
      email: "maria.silva@email.com",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
    },
    informacoesMedicas: {
      medicamentos: "Nenhum",
      alergias: "Lactose",
      observacoes: "Criança muito ativa e comunicativa",
    },
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    idade: 4,
    nivelVBMAPP: "Nível 1",
    progresso: {
      linguagem: 78,
      social: 82,
      motor: 75,
      media: 78,
      tendencia: "up",
    },
    alertas: [],
    foto: "/images/criancas/maria.jpg",
    dataNascimento: "2020-07-22",
    responsavel: {
      nome: "Carlos Oliveira",
      telefone: "(11) 88888-8888",
      email: "carlos.oliveira@email.com",
      endereco: "Av. Paulista, 456 - São Paulo, SP",
    },
    informacoesMedicas: {
      medicamentos: "Vitamina D",
      alergias: "Nenhuma",
      observacoes: "Progresso excelente na comunicação",
    },
  },
  {
    id: "3",
    nome: "Pedro Santos",
    idade: 6,
    nivelVBMAPP: "Nível 3",
    progresso: {
      linguagem: 45,
      social: 38,
      motor: 52,
      media: 45,
      tendencia: "down",
    },
    alertas: ["Regressão na linguagem", "Dificuldade de interação social"],
    foto: "/images/criancas/pedro.jpg",
    dataNascimento: "2018-11-08",
    responsavel: {
      nome: "Ana Santos",
      telefone: "(11) 77777-7777",
      email: "ana.santos@email.com",
      endereco: "Rua da Esperança, 789 - São Paulo, SP",
    },
    informacoesMedicas: {
      medicamentos: "Risperidona 0.5mg",
      alergias: "Corante amarelo",
      observacoes: "Necessita acompanhamento mais intensivo",
    },
  },
]

// Store
export const useCriancaStore = create<CriancaState>((set, get) => ({
  criancas: [],

  fetchCriancas: async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))
    set({ criancas: mockCriancas })
  },

  addCrianca: async (novaCrianca) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const criancaComId: Crianca = {
      ...novaCrianca,
      id: Date.now().toString(),
      progresso: novaCrianca.progresso || {
        linguagem: 0,
        social: 0,
        motor: 0,
        media: 0,
        tendencia: "up",
      },
    }

    set((state) => ({
      criancas: [...state.criancas, criancaComId],
    }))
  },

  getCriancaById: (id: string) => {
    return get().criancas.find((crianca) => crianca.id === id)
  },
}))
