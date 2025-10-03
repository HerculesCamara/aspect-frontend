import { create } from "zustand"
import { api } from "@/lib/api"

// Tipagens baseadas no backend
interface Parent {
  id: string  // userId (usado como primaryParentId)
  parentId?: string  // ParentId interno do backend
  firstName: string
  lastName: string
  fullName: string
  email: string
  contactNumber?: string
  childRelationship?: string
}

interface ParentState {
  parents: Parent[]
  searchedParent: Parent | null
  isLoading: boolean
  isSearching: boolean
  isUsingMockData: boolean
  fetchParents: () => Promise<void>
  searchParentByEmail: (email: string) => Promise<Parent | null>
  getParentById: (id: string) => Parent | undefined
  clearSearch: () => void
}

// Dados mock para fallback
const mockParents: Parent[] = [
  {
    id: "parent-1",
    firstName: "Maria",
    lastName: "Silva",
    fullName: "Maria Silva",
    email: "maria.silva@email.com",
    contactNumber: "(11) 99999-9999",
    childRelationship: "Mother"
  },
  {
    id: "parent-2",
    firstName: "Carlos",
    lastName: "Santos",
    fullName: "Carlos Santos",
    email: "carlos.santos@email.com",
    contactNumber: "(11) 88888-8888",
    childRelationship: "Father"
  },
  {
    id: "parent-3",
    firstName: "Ana",
    lastName: "Oliveira",
    fullName: "Ana Oliveira",
    email: "ana.oliveira@email.com",
    contactNumber: "(11) 77777-7777",
    childRelationship: "Guardian"
  }
]

// Store
export const useParentStore = create<ParentState>((set, get) => ({
  parents: [],
  searchedParent: null,
  isLoading: false,
  isSearching: false,
  isUsingMockData: false,

  fetchParents: async () => {
    set({ isLoading: true })

    try {
      // Estratégia: Buscar usuários registrados como Parents através do backend
      // Como não temos endpoint específico, vamos simular com dados conhecidos

      // Para demonstração, vamos usar um approach híbrido:
      // 1. Tentar buscar via API (se existir endpoint)
      // 2. Fallback para mock com dados realistas

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800))

      // Por enquanto, usar estratégia mock inteligente
      // TODO: Implementar busca real quando endpoint de Parents estiver disponível
      console.warn("Parent endpoint not available, using mock data")

      set({
        parents: mockParents,
        isLoading: false,
        isUsingMockData: true
      })

    } catch (error) {
      console.error("Error fetching parents:", error)

      // Fallback para dados mock
      set({
        parents: mockParents,
        isLoading: false,
        isUsingMockData: true
      })
    }
  },

  getParentById: (id: string) => {
    return get().parents.find(parent => parent.id === id)
  },

  searchParentByEmail: async (email: string): Promise<Parent | null> => {
    if (!email.trim()) {
      set({ searchedParent: null })
      return null
    }

    set({ isSearching: true, searchedParent: null })

    try {
      // ✅ SOLUÇÃO DEFINITIVA: Usar endpoint seguro do backend
      console.log(`🔍 Buscando responsável: ${email}`)

      const response = await api.getParentIdByEmail(email.trim())

      if (response && response.parentId) {
        console.log(`✅ Responsável encontrado: ${response.parentId}`)

        // ✅ Backend agora retorna userId corretamente
        // userId é usado como primaryParentId na criação de crianças
        if (!response.userId) {
          console.warn('⚠️ Backend não retornou userId, usando parentId como fallback')
        }

        const parent: Parent = {
          id: response.userId || response.parentId, // userId é necessário para criar crianças
          parentId: response.parentId,
          firstName: response.firstName,
          lastName: response.lastName,
          fullName: response.fullName,
          email: response.email,
          contactNumber: undefined,
          childRelationship: response.relationship
        }

        set({ searchedParent: parent, isSearching: false, isUsingMockData: false })
        return parent
      }

      // Se não encontrou no backend, não existe
      console.log("❌ Responsável não encontrado no sistema")
      set({ searchedParent: null, isSearching: false })
      return null

    } catch (error) {
      console.error("Error searching parent by email:", error)

      // Fallback: buscar nos dados mock (apenas para desenvolvimento)
      console.log("⚠️ Erro na API, tentando dados mock...")

      const foundParent = mockParents.find(parent =>
        parent.email.toLowerCase() === email.toLowerCase()
      )

      if (foundParent) {
        console.log("✅ Encontrado nos dados mock")
        set({ searchedParent: foundParent, isSearching: false, isUsingMockData: true })
        return foundParent
      }

      console.log("❌ Não encontrado em lugar nenhum")
      set({ searchedParent: null, isSearching: false })
      return null
    }
  },

  clearSearch: () => {
    set({ searchedParent: null })
  }
}))

// Função auxiliar para adicionar novo parent (quando um pai se registra)
export const addNewParent = (parentData: {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber?: string
  childRelationship?: string
}) => {
  const newParent: Parent = {
    ...parentData,
    fullName: `${parentData.firstName} ${parentData.lastName}`
  }

  useParentStore.setState(state => ({
    parents: [...state.parents, newParent]
  }))
}

// Função para sincronizar com registro de novos Parents
export const syncParentFromAuth = (authData: any) => {
  if (authData.role === "Parent") {
    addNewParent({
      id: authData.userId,
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
      contactNumber: undefined,
      childRelationship: undefined
    })
  }
}