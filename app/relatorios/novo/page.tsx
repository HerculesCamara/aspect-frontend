"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Save, Calendar, Clock } from "lucide-react"
import { useRelatorioStore } from "@/store/relatorio-store"
import { useCriancaStore } from "@/store/crianca-store"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function NovoRelatorioPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const criancaIdParam = searchParams.get("criancaId")

  const { criancas, fetchCriancas } = useCriancaStore()
  const { gerarRelatorio } = useRelatorioStore()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "mensal",
    criancaId: criancaIdParam || "",
    resumo: "",
    marcosAlcancados: [] as string[],
    observacoes: "",
    recomendacoesCasa: "",
    recomendacoesEscola: "",
  })

  const [crianca, setCrianca] = useState<any>(null)
  const [marcosDisponiveis, setMarcosDisponiveis] = useState<string[]>([])
  const [novoMarco, setNovoMarco] = useState("")

  useEffect(() => {
    const loadData = async () => {
      await fetchCriancas()
      setIsLoading(false)

      if (criancaIdParam) {
        const criancaEncontrada = useCriancaStore.getState().getCriancaPorId(criancaIdParam)
        if (criancaEncontrada) {
          setCrianca(criancaEncontrada)

          // Definir marcos disponíveis com base no nível VB-MAPP da criança
          if (criancaEncontrada.nivelVBMAPP === 1) {
            setMarcosDisponiveis([
              "Contato visual durante interações",
              "Imitação motora simples",
              "Seguir instruções simples",
              "Apontar para objetos desejados",
              "Emitir sons para comunicar necessidades",
              "Reconhecer o próprio nome",
            ])
          } else if (criancaEncontrada.nivelVBMAPP === 2) {
            setMarcosDisponiveis([
              "Usar palavras para solicitar itens",
              "Identificar objetos comuns",
              "Seguir instruções de duas etapas",
              "Imitar ações com objetos",
              "Participar de brincadeiras simples",
              "Responder a perguntas simples",
            ])
          } else {
            setMarcosDisponiveis([
              "Construir frases de 3-4 palavras",
              "Fazer perguntas",
              "Descrever eventos passados",
              "Seguir instruções complexas",
              "Engajar-se em conversas simples",
              "Participar de jogos com regras",
            ])
          }

          // Preencher título automaticamente
          setFormData((prev) => ({
            ...prev,
            titulo: `Relatório Mensal - ${criancaEncontrada.nome}`,
          }))
        }
      }
    }

    loadData()
  }, [fetchCriancas, criancaIdParam])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Se a criança mudar, atualizar o título
    if (name === "criancaId") {
      const criancaSelecionada = criancas.find((c) => c.id === value)
      if (criancaSelecionada) {
        setCrianca(criancaSelecionada)
        setFormData((prev) => ({
          ...prev,
          titulo: `Relatório Mensal - ${criancaSelecionada.nome}`,
        }))
      }
    }
  }

  const handleMarcoToggle = (marco: string) => {
    setFormData((prev) => {
      const marcosAtuais = [...prev.marcosAlcancados]

      if (marcosAtuais.includes(marco)) {
        return {
          ...prev,
          marcosAlcancados: marcosAtuais.filter((m) => m !== marco),
        }
      } else {
        return {
          ...prev,
          marcosAlcancados: [...marcosAtuais, marco],
        }
      }
    })
  }

  const handleAddMarco = () => {
    if (novoMarco.trim()) {
      setMarcosDisponiveis((prev) => [...prev, novoMarco.trim()])
      setNovoMarco("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.criancaId) {
      toast.error("Selecione uma criança para gerar o relatório")
      return
    }

    if (!formData.titulo) {
      toast.error("O título do relatório é obrigatório")
      return
    }

    if (!formData.resumo) {
      toast.error("O resumo da evolução é obrigatório")
      return
    }

    setIsSaving(true)

    try {
      await gerarRelatorio({
        ...formData,
        data: new Date().toISOString().split("T")[0],
      })

      toast.success("Relatório gerado com sucesso!")
      router.push("/relatorios")
    } catch (error) {
      toast.error("Erro ao gerar relatório. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/relatorios")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Novo Relatório</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha as informações básicas do relatório</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="criancaId">Criança</Label>
                    <Select
                      value={formData.criancaId}
                      onValueChange={(value) => handleSelectChange("criancaId", value)}
                      disabled={!!criancaIdParam}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma criança" />
                      </SelectTrigger>
                      <SelectContent>
                        {criancas.map((crianca) => (
                          <SelectItem key={crianca.id} value={crianca.id}>
                            {crianca.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Relatório</Label>
                    <Select value={formData.tipo} onValueChange={(value) => handleSelectChange("tipo", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="trimestral">Trimestral</SelectItem>
                        <SelectItem value="semestral">Semestral</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="avaliacao">Avaliação Inicial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="titulo">Título do Relatório</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Relatório Mensal - João Silva"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumo">Resumo da Evolução</Label>
                  <Textarea
                    id="resumo"
                    name="resumo"
                    value={formData.resumo}
                    onChange={handleInputChange}
                    placeholder="Descreva um resumo geral da evolução da criança..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {crianca && (
              <Card>
                <CardHeader>
                  <CardTitle>Sessões Anteriores</CardTitle>
                  <CardDescription>Sessões recentes para referência</CardDescription>
                </CardHeader>
                <CardContent>
                  {crianca.sessoes && crianca.sessoes.length > 0 ? (
                    <div className="space-y-4">
                      {crianca.sessoes.slice(0, 3).map((sessao: any, index: number) => (
                        <div key={index} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{sessao.titulo}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="mr-1 h-4 w-4" />
                                  {sessao.data}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {sessao.duracao} minutos
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div>
                            <h4 className="text-sm font-medium mb-1">Atividades Realizadas</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {sessao.atividades.map((atividade: string, i: number) => (
                                <li key={i}>{atividade}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Nenhuma sessão registrada ainda.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="marcos">
              <TabsList className="mb-4">
                <TabsTrigger value="marcos">Marcos Alcançados</TabsTrigger>
                <TabsTrigger value="observacoes">Observações</TabsTrigger>
                <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
              </TabsList>

              <TabsContent value="marcos">
                <Card>
                  <CardHeader>
                    <CardTitle>Marcos Alcançados</CardTitle>
                    <CardDescription>Selecione os marcos de desenvolvimento alcançados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        {marcosDisponiveis.map((marco, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`marco-${index}`}
                              checked={formData.marcosAlcancados.includes(marco)}
                              onCheckedChange={() => handleMarcoToggle(marco)}
                            />
                            <label
                              htmlFor={`marco-${index}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {marco}
                            </label>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor="novoMarco">Adicionar Marco Personalizado</Label>
                          <Input
                            id="novoMarco"
                            value={novoMarco}
                            onChange={(e) => setNovoMarco(e.target.value)}
                            placeholder="Digite um novo marco..."
                          />
                        </div>
                        <Button type="button" variant="outline" onClick={handleAddMarco}>
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="observacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                    <CardDescription>Adicione observações detalhadas sobre o progresso</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Textarea
                        id="observacoes"
                        name="observacoes"
                        value={formData.observacoes}
                        onChange={handleInputChange}
                        placeholder="Descreva observações detalhadas sobre o comportamento, desafios e conquistas..."
                        rows={8}
                      />
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
                      <div className="space-y-2">
                        <Textarea
                          id="recomendacoesCasa"
                          name="recomendacoesCasa"
                          value={formData.recomendacoesCasa}
                          onChange={handleInputChange}
                          placeholder="Descreva as recomendações para os pais seguirem em casa..."
                          rows={8}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recomendações para Escola</CardTitle>
                      <CardDescription>Orientações para os professores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Textarea
                          id="recomendacoesEscola"
                          name="recomendacoesEscola"
                          value={formData.recomendacoesEscola}
                          onChange={handleInputChange}
                          placeholder="Descreva as recomendações para os professores seguirem na escola..."
                          rows={8}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <Card>
              <CardFooter className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={() => router.push("/relatorios")}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Gerar Relatório
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
