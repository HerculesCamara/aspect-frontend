"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Calendar, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { useCriancaStore } from "@/store/crianca-store"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProgressoPage() {
  const params = useParams()
  const router = useRouter()
  const { getCriancaPorId } = useCriancaStore()
  const [crianca, setCrianca] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const id = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (id) {
      const criancaData = getCriancaPorId(id)
      if (criancaData) {
        setCrianca(criancaData)
      }
      setIsLoading(false)
    }
  }, [id, getCriancaPorId])

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  if (!crianca) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-destructive" />
            <h2 className="mt-2 text-xl font-semibold">Criança não encontrada</h2>
            <p className="mt-2 text-sm text-muted-foreground">Não foi possível encontrar os dados desta criança.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push("/meus-filhos")}>
              Voltar para lista
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }


  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push("/meus-filhos")}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Progresso de {crianca.nome}</h1>
            {crianca.alertas && crianca.alertas.length > 0 && (
              <Badge variant="destructive" className="ml-2 flex items-center">
                <AlertTriangle className="mr-1 h-3 w-3" />
                Alerta de Regressão
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={`/placeholder.svg?height=96&width=96&text=${crianca.nome.charAt(0)}`} />
                  <AvatarFallback className="text-2xl">{crianca.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{crianca.nome}</h2>
                <p className="text-sm text-muted-foreground">{crianca.idade} anos</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Diagnóstico</h3>
                  <p>{crianca.diagnostico}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Nível VB-MAPP</h3>
                  <p>Nível {crianca.nivelVBMAPP}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Terapeuta</h3>
                  <p>{crianca.terapeuta}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Última Sessão</h3>
                  <p>{crianca.ultimaSessao}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Progresso Geral</CardTitle>
              <CardDescription>Níveis atuais de desenvolvimento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Linguagem</span>
                    <div className="flex items-center">
                      <span className="font-medium">{crianca.progresso.linguagem}%</span>
                      {crianca.progresso.linguagem > 45 ? (
                        <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={crianca.progresso.linguagem} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Social</span>
                    <div className="flex items-center">
                      <span className="font-medium">{crianca.progresso.social}%</span>
                      {crianca.progresso.social > 48 ? (
                        <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={crianca.progresso.social} className="h-2" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>Motor</span>
                    <div className="flex items-center">
                      <span className="font-medium">{crianca.progresso.motor}%</span>
                      {crianca.progresso.motor > 55 ? (
                        <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={crianca.progresso.motor} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="marcos">
          <TabsList className="mb-4">
            <TabsTrigger value="marcos">Marcos de Desenvolvimento</TabsTrigger>
            <TabsTrigger value="sessoes">Histórico de Sessões</TabsTrigger>
            <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
          </TabsList>

          <TabsContent value="marcos">
            <Card>
              <CardHeader>
                <CardTitle>Marcos de Desenvolvimento</CardTitle>
                <CardDescription>Progresso nos principais marcos do VB-MAPP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Marcos Alcançados</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Contato visual durante interações</li>
                        <li>Imitação motora simples</li>
                        <li>Seguir instruções simples</li>
                        <li>Apontar para objetos desejados</li>
                      </ul>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Próximos Marcos</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Usar palavras para solicitar itens</li>
                        <li>Identificar objetos comuns</li>
                        <li>Seguir instruções de duas etapas</li>
                        <li>Participar de brincadeiras simples</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessoes">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Sessões</CardTitle>
                <CardDescription>Registro das últimas sessões terapêuticas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crianca.sessoes && crianca.sessoes.length > 0 ? (
                    crianca.sessoes.map((sessao: any, index: number) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{sessao.titulo}</h3>
                              <Badge variant="outline">{sessao.tipo}</Badge>
                            </div>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {sessao.data}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-1">Atividades Realizadas</h4>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {sessao.atividades.map((atividade: string, i: number) => (
                              <li key={i}>{atividade}</li>
                            ))}
                          </ul>
                        </div>

                        {sessao.observacoes && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">Observações</h4>
                            <p className="text-sm">{sessao.observacoes}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma sessão registrada ainda.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recomendacoes">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recomendações para Casa</CardTitle>
                  <CardDescription>Orientações para os pais</CardDescription>
                </CardHeader>
                <CardContent>
                  {crianca.recomendacoesCasa && crianca.recomendacoesCasa.length > 0 ? (
                    <ul className="space-y-2">
                      {crianca.recomendacoesCasa.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma recomendação disponível.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recomendações para Escola</CardTitle>
                  <CardDescription>Orientações para os professores</CardDescription>
                </CardHeader>
                <CardContent>
                  {crianca.recomendacoesEscola && crianca.recomendacoesEscola.length > 0 ? (
                    <ul className="space-y-2">
                      {crianca.recomendacoesEscola.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">Nenhuma recomendação disponível.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
