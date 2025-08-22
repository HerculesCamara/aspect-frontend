"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import { useCriancaStore } from "@/store/crianca-store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
// Temporarily commenting out recharts to fix compatibility issues
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart as RechartsBarChart,
//   Bar,
//   Legend,
// } from "recharts"

export default function DashboardPage() {
  const router = useRouter()
  const { criancas, fetchCriancas } = useCriancaStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchCriancas()
      setIsLoading(false)
    }

    loadData()
  }, [fetchCriancas])

  // Dados para os gráficos
  const progressData = [
    { name: "Jan", linguagem: 30, social: 40, motor: 45 },
    { name: "Fev", linguagem: 35, social: 43, motor: 48 },
    { name: "Mar", linguagem: 40, social: 45, motor: 52 },
    { name: "Abr", linguagem: 45, social: 48, motor: 55 },
    { name: "Mai", linguagem: 50, social: 51, motor: 58 },
    { name: "Jun", linguagem: 55, social: 53, motor: 60 },
  ]

  const sessionsData = [
    { name: "Seg", sessoes: 4 },
    { name: "Ter", sessoes: 6 },
    { name: "Qua", sessoes: 5 },
    { name: "Qui", sessoes: 7 },
    { name: "Sex", sessoes: 4 },
    { name: "Sáb", sessoes: 2 },
    { name: "Dom", sessoes: 0 },
  ]

  const analyticsData = [
    { name: "Jan", linguagem: 30, social: 40, motor: 45 },
    { name: "Fev", linguagem: 35, social: 43, motor: 48 },
    { name: "Mar", linguagem: 40, social: 45, motor: 52 },
    { name: "Abr", linguagem: 45, social: 48, motor: 55 },
    { name: "Mai", linguagem: 50, social: 51, motor: 58 },
    { name: "Jun", linguagem: 55, social: 53, motor: 60 },
  ]

  // Calcular estatísticas
  const totalSessoes = sessionsData.reduce((acc, curr) => acc + curr.sessoes, 0)
  const criancasComAlerta = criancas.filter((c) => c.alertas && c.alertas.length > 0).length

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button onClick={() => router.push("/relatorios/novo")}>
              <FileText className="mr-2 h-4 w-4" />
              Novo Relatório
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análise</TabsTrigger>
            <TabsTrigger value="reports">Relatórios</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Sessões (Semana)</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalSessoes}</div>
                  <p className="text-xs text-muted-foreground">+2.1% em relação à semana anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Crianças em Acompanhamento</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{criancas.length}</div>
                  <p className="text-xs text-muted-foreground">+1 nova criança este mês</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <Progress value={68} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas de Regressão</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{criancasComAlerta}</div>
                  <p className="text-xs text-muted-foreground">-2 em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Evolução Geral</CardTitle>
                  <CardDescription>Progresso médio por área de desenvolvimento</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Temporarily replaced with placeholder */}
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Gráfico de evolução temporariamente indisponível</p>
                      <p className="text-sm">Em manutenção para compatibilidade com React 19</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Sessões por Dia</CardTitle>
                  <CardDescription>Distribuição de sessões na semana atual</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {/* Temporarily replaced with placeholder */}
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Gráfico de sessões temporariamente indisponível</p>
                      <p className="text-sm">Em manutenção para compatibilidade com React 19</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Crianças em Acompanhamento</CardTitle>
                  <CardDescription>Lista de crianças e seu progresso atual</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div>
                            <Skeleton className="h-8 w-16" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {criancas.map((crianca) => {
                        // Garantir que progresso existe com valores padrão
                        const progresso = crianca.progresso || { media: 0, tendencia: "up" }
                        const progressoMedia = progresso.media || 0
                        const progressoTendencia = progresso.tendencia || "up"

                        return (
                          <div key={crianca.id} className="flex items-center justify-between space-x-4">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    crianca.foto || `/placeholder.svg?height=40&width=40&text=${crianca.nome.charAt(0)}`
                                  }
                                  alt={crianca.nome}
                                />
                                <AvatarFallback>{crianca.nome.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{crianca.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  {crianca.idade} anos • Nível VB-MAPP: {crianca.nivelVBMAPP}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              {crianca.alertas && crianca.alertas.length > 0 && (
                                <Badge variant="destructive" className="flex items-center">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Alerta
                                </Badge>
                              )}
                              <div className="flex flex-col items-end">
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm font-medium">{progressoMedia}%</span>
                                  {progressoTendencia === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                                <Progress value={progressoMedia} className="h-2 w-24" />
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/criancas/${crianca.id}`)}>
                                Ver
                              </Button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Progresso</CardTitle>
                <CardDescription>Análise detalhada do progresso por domínio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {/* Temporarily replaced with placeholder */}
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Gráfico de análise temporariamente indisponível</p>
                      <p className="text-sm">Em manutenção para compatibilidade com React 19</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Recentes</CardTitle>
                <CardDescription>Últimos relatórios gerados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório Mensal - João Silva</p>
                        <p className="text-sm text-muted-foreground">Gerado em 01/05/2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Relatório
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório Trimestral - Maria Oliveira</p>
                        <p className="text-sm text-muted-foreground">Gerado em 28/04/2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Relatório
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Relatório de Progresso - Pedro Santos</p>
                        <p className="text-sm text-muted-foreground">Gerado em 15/04/2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Relatório
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
