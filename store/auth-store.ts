import { create } from "zustand"
import { api } from "@/lib/api"

// Tipos
type UserType = "psicologo" | "pai"

interface User {
  id: string
  nome: string
  email: string
  tipo: UserType
  token?: string
}

interface AuthState {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  initAuth: () => Promise<void>
  isUsingMockData: boolean
}

// Dados mock para fallback
const mockUsers = [
  {
    id: "1",
    nome: "Ana Silva",
    email: "ana.silva@exemplo.com",
    tipo: "psicologo" as UserType,
    senha: "123456",
  },
  {
    id: "2",
    nome: "Carlos Santos",
    email: "carlos@exemplo.com",
    tipo: "pai" as UserType,
    senha: "123456",
  },
]

// Store
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isUsingMockData: false,

  login: async (email: string, password: string) => {
    try {
      // Tentar API real primeiro
      const response = await api.login(email, password)

      // Mapear resposta do backend para formato frontend
      const user: User = {
        id: response.userId,
        nome: `${response.firstName} ${response.lastName}`,
        email: response.email,
        tipo: response.role === "Psychologist" ? "psicologo" : "pai",
        token: response.token,
      }

      // Salvar token para próximas requests
      localStorage.setItem("aspct_token", response.token)
      localStorage.setItem("aspct_using_mock", "false")

      set({ user, isUsingMockData: false })
    } catch (error) {
      console.warn("API login failed, trying mock data:", error)

      // Fallback para dados mock
      const mockUser = mockUsers.find(
        (u) => u.email === email && u.senha === password
      )

      if (!mockUser) {
        throw new Error("Credenciais inválidas")
      }

      const user: User = {
        id: mockUser.id,
        nome: mockUser.nome,
        email: mockUser.email,
        tipo: mockUser.tipo,
      }

      localStorage.setItem("aspct_mock_user", JSON.stringify(user))
      localStorage.setItem("aspct_using_mock", "true")

      set({ user, isUsingMockData: true })
    }
  },

  logout: () => {
    localStorage.removeItem("aspct_token")
    localStorage.removeItem("aspct_mock_user")
    localStorage.removeItem("aspct_using_mock")
    set({ user: null, isUsingMockData: false })
  },

  // Função para recuperar login ao recarregar página
  initAuth: async () => {
    const usingMock = localStorage.getItem("aspct_using_mock") === "true"

    if (usingMock) {
      // Recuperar dados mock
      const mockUserData = localStorage.getItem("aspct_mock_user")
      if (mockUserData) {
        try {
          const user = JSON.parse(mockUserData)
          set({ user, isUsingMockData: true })
          return
        } catch (error) {
          localStorage.removeItem("aspct_mock_user")
          localStorage.removeItem("aspct_using_mock")
        }
      }
    } else {
      // Tentar validar token da API real
      const token = localStorage.getItem("aspct_token")
      if (!token) return

      try {
        const isValid = await api.validateToken(token)
        if (isValid) {
          // Token válido, mas precisamos dos dados do usuário
          // Por enquanto, usar dados básicos (pode melhorar depois com endpoint /me)
          const userData = {
            id: "temp",
            nome: "Usuário",
            email: "",
            tipo: "psicologo" as UserType,
            token,
          }
          set({ user: userData, isUsingMockData: false })
        } else {
          localStorage.removeItem("aspct_token")
          localStorage.removeItem("aspct_using_mock")
        }
      } catch (error) {
        console.warn("Token validation failed, clearing auth:", error)
        localStorage.removeItem("aspct_token")
        localStorage.removeItem("aspct_using_mock")
      }
    }
  },
}))
