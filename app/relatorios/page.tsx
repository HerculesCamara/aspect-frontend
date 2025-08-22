"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, Download, Calendar, Filter } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRelatorioStore } from "@/store/relatorio-store"
import { useCriancaStore } from "@/store/crianca-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function RelatoriosPage() {
  const router = useRouter()
  const { relatorios, fetchRelatorios } = useRelatorioStore()
  const { criancas, fetchCriancas } = useCriancaStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredRelatorios, setFilteredRelatorios] = useState(relatorios)
  const [isLoading, setIsLoading] = useState(true)
  const [filterCrianca, setFilterCrianca] = useState("todos")
  const [filterPeriodo, setFilterPeriodo] = useState("todos")

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRelatorios(), fetchCriancas()])
      setIsLoading(false)
    }

    loadData()
  }, [fetchRelatorios, fetchCriancas])

  useEffect(() => {
    let filtered = relatorios

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (relatorio) =>
          relatorio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          relatorio.resumo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por criança
    if (filterCrianca !== "todos") {
      filtered = filtered.filter((relatorio) => relatorio.criancaId === filterCrianca)
    }

    // Filtrar por período
    if (filterPeriodo !== "todos") {
      const hoje = new Date()
      const dataLimite = new Date()

      if (filterPeriodo === "7dias") {
        dataLimite.setDate(hoje.getDate() - 7)
      } else if (filterPeriodo === "30dias") {
        dataLimite.setDate(hoje.getDate() - 30)
      } else if (filterPeriodo === "90dias") {
        dataLimite.setDate(hoje.getDate() - 90)
      }

      filtered = filtered.filter((relatorio) => {
        const dataRelatorio = new Date(relatorio.data)
        return dataRelatorio >= dataLimite
      })
    }

    setFilteredRelatorios(filtered)
  }, [relatorios, searchTerm, filterCrianca, filterPeriodo])

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <Button onClick={() => router.push("/relatorios/novo")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Buscar relatório..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterCrianca} onValueChange={setFilterCrianca}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por criança" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as crianças</SelectItem>
                {criancas.map((crianca) => (
                  <SelectItem key={crianca.id} value={crianca.id}>
                    {crianca.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os períodos</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Relatórios Gerados</CardTitle>
            <CardDescription>Lista de relatórios de avaliação e progresso</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Carregando relatórios...</p>
                </div>
              </div>
            ) : filteredRelatorios.length > 0 ? (
              <div className="space-y-4">
                {filteredRelatorios.map((relatorio) => {
                  const crianca = criancas.find((c) => c.id === relatorio.criancaId)

                  return (
                    <div key={relatorio.id} className="rounded-lg border p-4">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{relatorio.titulo}</h3>
                            <Badge variant="outline">{relatorio.tipo}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm font-medium">{crianca?.nome}</p>
                            <span className="text-sm text-muted-foreground">•</span>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              {relatorio.data}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/relatorios/${relatorio.id}`)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Filter className="h-4 w-4" />
                                <span className="sr-only">Ações</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => router.push(`/relatorios/${relatorio.id}/editar`)}>
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem>Compartilhar</DropdownMenuItem>
                                <DropdownMenuItem>Arquivar</DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <Separator className="my-3" />

                      <div>
                        <h4 className="text-sm font-medium mb-1">Resumo</h4>
                        <p className="text-sm">{relatorio.resumo}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Nenhum relatório encontrado</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Não foram encontrados relatórios com os filtros selecionados.
                </p>
                <Button className="mt-4" onClick={() => router.push("/relatorios/novo")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Novo Relatório
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
