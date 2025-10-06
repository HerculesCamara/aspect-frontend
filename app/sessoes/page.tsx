"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { useCriancaStore } from "@/store/crianca-store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, Clock, Plus, Search, Users, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function SessoesPage() {
  const router = useRouter()
  const { sessoes, isLoading, fetchSessoes } = useSessionStore()
  const { criancas, fetchCriancas } = useCriancaStore()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchSessoes()
    fetchCriancas()
  }, [fetchSessoes, fetchCriancas])

  const filteredSessoes = sessoes.filter((sessao) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      sessao.criancaNome.toLowerCase().includes(searchLower) ||
      sessao.tipo.toLowerCase().includes(searchLower)
    )
  })

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "Individual":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Grupo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Avaliação":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Seguimento":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sessões Terapêuticas</h1>
            <p className="text-muted-foreground">
              Registre e acompanhe as sessões com as crianças
            </p>
          </div>
          <Button onClick={() => router.push("/sessoes/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Sessão
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por criança ou tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Sessões</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessoes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessoes.filter(s => {
                  const sessaoDate = new Date(s.data)
                  const now = new Date()
                  return sessaoDate.getMonth() === now.getMonth() &&
                         sessaoDate.getFullYear() === now.getFullYear()
                }).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Crianças Atendidas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(sessoes.map(s => s.criancaId)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duração Total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sessoes.reduce((acc, s) => acc + s.duracao, 0)}min
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Sessões */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading skeleton
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[150px]" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSessoes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  {searchTerm
                    ? "Nenhuma sessão encontrada com esses critérios."
                    : "Nenhuma sessão registrada ainda."}
                </p>
                {!searchTerm && (
                  <Button className="mt-4" onClick={() => router.push("/sessoes/nova")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar Primeira Sessão
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredSessoes.map((sessao) => (
              <Card
                key={sessao.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => router.push(`/sessoes/${sessao.id}`)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{sessao.criancaNome}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(sessao.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {sessao.duracao} minutos
                          </span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className={getTipoBadgeColor(sessao.tipo)}>
                      {sessao.tipo}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sessao.anotacoes.oqueFoiFeito && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          O que foi feito:
                        </p>
                        <p className="text-sm line-clamp-2">{sessao.anotacoes.oqueFoiFeito}</p>
                      </div>
                    )}
                    {sessao.compartilhadoComPais && (
                      <Badge variant="outline" className="text-xs">
                        Compartilhado com os pais
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppShell>
  )
}
