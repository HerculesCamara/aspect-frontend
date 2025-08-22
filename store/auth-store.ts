import { create } from "zustand"

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
}

// Dados mockados
const mockUsers = [
  {
    id: "psico123",
    nome: "Dr. Ana Silva",
    email: "ana.silva@exemplo.com",
    senha: "123456",
    tipo: "psicologo" as UserType,
    token: "token-psicologo-123",
  },
  {
    id: "pai456",
    nome: "Carlos Oliveira",
    email: "carlos@exemplo.com",
    senha: "123456",
    tipo: "pai" as UserType,
    token: "token-pai-456",
  },
]

// Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (email: string, password: string) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email && u.senha === password)

    if (!user) {
      throw new Error("Credenciais inválidas")
    }

    const { senha, ...userWithoutPassword } = user

    set({ user: userWithoutPassword })

    return
  },

  logout: () => {
    set({ user: null })
  },
}))
