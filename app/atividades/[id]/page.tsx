"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Clock, Target, BookOpen, Edit, CheckCircle2, Lightbulb } from "lucide-react"
import { useAtividadeStore } from "@/store/atividade-store"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AtividadeDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const { getAtividadePorId } = useAtividadeStore()
  const [atividade, setAtividade] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const id = Array.isArray(params.id) ? params.id[0] : params.id

  useEffect(() => {
    if (id) {
      const atividadeData = getAtividadePorId(id)
      if (atividadeData) {
        setAtividade(atividadeData)
      }
      setIsLoading(false)
    }
  }, [id, getAtividadePorId])

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

  if (!atividade) {
    return (
      <AppShell>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground" />
            <h2 className="mt-2 text-xl font-semibold">Atividade não encontrada</h2>
            <p className="mt-2 text-sm text-muted-foreground">Não foi possível encontrar os dados desta atividade.</p>
            <Button className="mt-4" variant="outline" onClick={() => router.push("/atividades")}>
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
            <Button variant="ghost" size="sm" onClick={() => router.push("/atividades")}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">{atividade.titulo}</h1>
            <Badge variant="outline">{atividade.categoria}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push(`/atividades/${atividade.id}/editar`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="default" onClick={() => router.push(`/atividades/${atividade.id}/aplicar`)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aplicar Atividade
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Descrição da Atividade</CardTitle>
              <CardDescription>
                Nível VB-MAPP: {atividade.nivelVBMAPP} • Duração: {atividade.duracao} minutos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{atividade.descricao}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Objetivos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {atividade.objetivos.map((objetivo: string, index: number) => (
                      <li key={index} className="text-sm">
                        {objetivo}
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-2">Materiais Necessários</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {atividade.materiais.map((material: string, index: number) => (
                      <li key={index} className="text-sm">
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-full justify-center py-1.5">
                    <Clock className="mr-2 h-4 w-4" />
                    Duração: {atividade.duracao} minutos
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-full justify-center py-1.5">
                    <Target className="mr-2 h-4 w-4" />
                    Nível VB-MAPP: {atividade.nivelVBMAPP}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="w-full justify-center py-1.5">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Categoria: {atividade.categoria}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="passos">
          <TabsList className="mb-4">
            <TabsTrigger value="passos">Passo a Passo</TabsTrigger>
            <TabsTrigger value="adaptacoes">Adaptações</TabsTrigger>
          </TabsList>

          <TabsContent value="passos">
            <Card>
              <CardHeader>
                <CardTitle>Passo a Passo</CardTitle>
                <CardDescription>Instruções detalhadas para aplicação da atividade</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal list-inside">
                  {atividade.passos.map((passo: string, index: number) => (
                    <li key={index} className="pl-2">
                      <span>{passo}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adaptacoes">
            <Card>
              <CardHeader>
                <CardTitle>Adaptações Possíveis</CardTitle>
                <CardDescription>Sugestões de adaptações para diferentes necessidades</CardDescription>
              </CardHeader>
              <CardContent>
                {atividade.adaptacoes && atividade.adaptacoes.length > 0 ? (
                  <ul className="space-y-2">
                    {atividade.adaptacoes.map((adaptacao: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                        <span>{adaptacao}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Nenhuma adaptação sugerida para esta atividade.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
