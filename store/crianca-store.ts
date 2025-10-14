import { create } from "zustand"
import { api } from "@/lib/api"

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
  genero?: string
  primaryParentId?: string
  responsavel?: {
    nome: string
    telefone: string
    email: string
    endereco: string
  }
  informacoesMedicas?: {
    diagnostico?: string
    medicamentos?: string
    alergias?: string
    observacoes?: string
  }
}

interface CriancaState {
  criancas: Crianca[]
  isUsingMockData: boolean
  fetchCriancas: () => Promise<void>
  addCrianca: (crianca: Omit<Crianca, "id">) => Promise<void>
  getCriancaById: (id: string) => Crianca | undefined
  updateCrianca: (id: string, crianca: Partial<Crianca>) => Promise<void>
  deleteCrianca: (id: string) => Promise<void>
}

// Dados mockados
const mockCriancas: Crianca[] = [
  {
    id: "1",
    nome: "João Silva",
    idade: 5,
    nivelVBMAPP: "Nível 2",
    primaryParentId: "2", // Carlos Santos (pai mock)
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
    genero: "Masculino",
    responsavel: {
      nome: "Carlos Santos",
      telefone: "(11) 99999-9999",
      email: "carlos@exemplo.com",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
    },
    informacoesMedicas: {
      diagnostico: "TEA Nível 1",
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
    primaryParentId: "2", // Carlos Santos (pai mock) - segundo filho
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
    genero: "Feminino",
    responsavel: {
      nome: "Carlos Santos",
      telefone: "(11) 88888-8888",
      email: "carlos@exemplo.com",
      endereco: "Av. Paulista, 456 - São Paulo, SP",
    },
    informacoesMedicas: {
      diagnostico: "TEA Leve",
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
    primaryParentId: "999", // Outro responsável (não aparecerá para Carlos)
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
    genero: "Masculino",
    responsavel: {
      nome: "Ana Santos",
      telefone: "(11) 77777-7777",
      email: "ana.santos@email.com",
      endereco: "Rua da Esperança, 789 - São Paulo, SP",
    },
    informacoesMedicas: {
      diagnostico: "TEA Nível 3",
      medicamentos: "Risperidona 0.5mg",
      alergias: "Corante amarelo",
      observacoes: "Necessita acompanhamento mais intensivo",
    },
  },
]

// Função para mapear ChildResponse (backend) para Crianca (frontend)
function mapChildResponseToCrianca(child: any): Crianca {
  // Calcular idade baseada na data de nascimento
  const calcularIdade = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0
    const nascimento = new Date(dateOfBirth)
    const hoje = new Date()
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mesAniversario = hoje.getMonth() - nascimento.getMonth()
    if (mesAniversario < 0 || (mesAniversario === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  // Determinar nível VB-MAPP baseado na idade (referência do PDF)
  const determinarNivelVBMAPP = (idade: number): string => {
    if (idade <= 1.5) return "Nível 1" // 0-18 meses
    if (idade <= 2.5) return "Nível 2" // 18-30 meses
    return "Nível 3" // 30-48+ meses
  }

  const idadeCalculada = child.age || calcularIdade(child.dateOfBirth)

  return {
    id: child.childId,
    nome: child.fullName || `${child.firstName} ${child.lastName}`,
    idade: idadeCalculada,
    nivelVBMAPP: determinarNivelVBMAPP(idadeCalculada),
    progresso: {
      linguagem: 50, // TODO: calcular quando endpoints de Assessment estiverem disponíveis
      social: 50,
      motor: 50,
      media: 50,
      tendencia: "up",
    },
    alertas: [], // TODO: implementar lógica de alertas baseada em assessments
    foto: undefined,
    dataNascimento: child.dateOfBirth?.split('T')[0],
    genero: child.gender,
    primaryParentId: child.primaryParentId, // ID do responsável
    responsavel: {
      nome: "Responsável", // TODO: buscar via primaryParentId quando endpoint estiver disponível
      telefone: "",
      email: "",
      endereco: "",
    },
    informacoesMedicas: {
      diagnostico: child.diagnosis || "TEA",
      medicamentos: "",
      alergias: "",
      observacoes: `Cadastrado em: ${child.onboardingDate?.split('T')[0] || 'N/A'}`,
    },
  }
}

// Função para mapear Crianca (frontend) para ChildCreateRequest (backend)
function mapCriancaToChildCreateRequest(crianca: any): any {
  const [firstName, ...lastNameParts] = crianca.nome.split(' ')

  // Converter data nascimento para ISO format se disponível
  const dateOfBirth = crianca.dataNascimento
    ? crianca.dataNascimento + 'T00:00:00Z'
    : new Date().toISOString() // Fallback para hoje se não informado

  return {
    firstName: firstName || 'Nome',
    lastName: lastNameParts.join(' ') || 'Sobrenome',
    dateOfBirth: dateOfBirth,
    gender: crianca.genero || 'Não informado',
    diagnosis: crianca.informacoesMedicas?.diagnostico || 'TEA',
    primaryParentId: crianca.primaryParentId, // Agora vem do frontend
    // Removido medicalHistory pois não está no ChildCreateRequest da API
  }
}

// Store
export const useCriancaStore = create<CriancaState>((set, get) => ({
  criancas: [],
  isUsingMockData: false,

  fetchCriancas: async () => {
    try {
      // Tentar API real primeiro
      const children = await api.getChildren()
      const criancasMapeadas = children.map(mapChildResponseToCrianca)

      set({ criancas: criancasMapeadas, isUsingMockData: false })
    } catch (error) {
      console.warn("API getChildren failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({ criancas: mockCriancas, isUsingMockData: true })
    }
  },

  addCrianca: async (novaCrianca) => {
    try {
      // Tentar API real primeiro
      const childRequest = mapCriancaToChildCreateRequest(novaCrianca)
      const childResponse = await api.createChild(childRequest)
      const criancaMapeada = mapChildResponseToCrianca(childResponse)

      set((state) => ({
        criancas: [...state.criancas, criancaMapeada],
      }))
    } catch (error) {
      console.warn("API createChild failed, using mock data:", error)

      // Fallback para dados mock
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
        isUsingMockData: true,
      }))
    }
  },

  updateCrianca: async (id: string, dadosAtualizados: Partial<Crianca>) => {
    try {
      // Tentar API real primeiro
      const criancaAtual = get().criancas.find(c => c.id === id)
      if (!criancaAtual) throw new Error("Criança não encontrada")

      const criancaCompleta = { ...criancaAtual, ...dadosAtualizados }
      const [firstName, ...lastNameParts] = criancaCompleta.nome.split(' ')

      const updateRequest = {
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        dateOfBirth: criancaCompleta.dataNascimento + 'T00:00:00Z',
        gender: 'Não informado',
        diagnosis: criancaCompleta.informacoesMedicas?.medicamentos || '',
        isActive: true,
      }

      const childResponse = await api.updateChild(id, updateRequest)
      const criancaMapeada = mapChildResponseToCrianca(childResponse)

      set((state) => ({
        criancas: state.criancas.map(c => c.id === id ? criancaMapeada : c),
      }))
    } catch (error) {
      console.warn("API updateChild failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => ({
        criancas: state.criancas.map(c =>
          c.id === id ? { ...c, ...dadosAtualizados } : c
        ),
        isUsingMockData: true,
      }))
    }
  },

  deleteCrianca: async (id: string) => {
    try {
      // Tentar API real primeiro
      await api.deleteChild(id)

      set((state) => ({
        criancas: state.criancas.filter(c => c.id !== id),
      }))
    } catch (error) {
      console.warn("API deleteChild failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => ({
        criancas: state.criancas.filter(c => c.id !== id),
        isUsingMockData: true,
      }))
    }
  },

  getCriancaById: (id: string) => {
    return get().criancas.find((crianca) => crianca.id === id)
  },
}))
