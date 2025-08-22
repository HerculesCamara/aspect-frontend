"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuthStore } from "@/store/auth-store"
import { Loader2, Heart, Puzzle } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      if (user.tipo === "psicologo") {
        router.push("/dashboard")
      } else {
        router.push("/meus-filhos")
      }
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(email, password)
      toast.success("Login realizado com sucesso!")
    } catch (err) {
      setError("Credenciais inválidas. Tente novamente.")
      toast.error("Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo e Header */}
        <div className="text-center space-y-6">
          {/* Logo do Autismo */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Peça principal do quebra-cabeça */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg relative shadow-lg">
                <Puzzle className="w-12 h-12 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                {/* Coração pequeno */}
                <Heart className="w-4 h-4 text-red-400 absolute top-2 right-2" fill="currentColor" />
              </div>

              {/* Peças flutuantes */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded transform rotate-12 opacity-80">
                <Puzzle className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="absolute -bottom-1 -left-3 w-5 h-5 bg-purple-400 rounded transform -rotate-12 opacity-70">
                <Puzzle className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ASPCT Software
            </h1>
            <p className="text-lg text-gray-600 mt-2">Acompanhamento Especializado em TEA</p>
            <p className="text-sm text-gray-500 mt-1">"Cada criança é única, cada progresso é uma vitória"</p>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold text-gray-800">Entrar</CardTitle>
            <CardDescription className="text-gray-600">Faça login para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>

            {/* Informações de teste */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">Contas para teste:</p>
              <div className="space-y-2 text-xs text-blue-700">
                <div>
                  <strong>Psicólogo:</strong> ana.silva@exemplo.com / 123456
                </div>
                <div>
                  <strong>Pai/Responsável:</strong> carlos@exemplo.com / 123456
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 ASPCT Software. Desenvolvido com 💙 para inclusão.</p>
        </div>
      </div>
    </div>
  )
}
