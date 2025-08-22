"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Clock, Target, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAtividadeStore } from "@/store/atividade-store"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AtividadesPage() {
  const router = useRouter()
  const { atividades, fetchAtividades } = useAtividadeStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredAtividades, setFilteredAtividades] = useState(atividades)
  const [isLoading, setIsLoading] = useState(true)
  const [filterCategoria, setFilterCategoria] = useState("todas")
  const [filterNivel, setFilterNivel] = useState("todos")

  useEffect(() => {
    const loadData = async () => {
      await fetchAtividades()
      setIsLoading(false)
    }

    loadData()
  }, [fetchAtividades])

  useEffect(() => {
    let filtered = atividades

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (atividade) =>
          atividade.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          atividade.descricao.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoria
    if (filterCategoria !== "todas") {
      filtered = filtered.filter((atividade) => atividade.categoria === filterCategoria)
    }

    // Filtrar por nível
    if (filterNivel !== "todos") {
      filtered = filtered.filter((atividade) => atividade.nivelVBMAPP === Number.parseInt(filterNivel))
    }

    setFilteredAtividades(filtered)
  }, [atividades, searchTerm, filterCategoria, filterNivel])

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
          <Button onClick={() => router.push("/atividades/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Atividade
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Buscar atividade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as categorias</SelectItem>
                <SelectItem value="linguagem">Linguagem</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="motor">Motor</SelectItem>
                <SelectItem value="cognitivo">Cognitivo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterNivel} onValueChange={setFilterNivel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por nível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os níveis</SelectItem>
                <SelectItem value="1">Nível 1 (0-18 meses)</SelectItem>
                <SelectItem value="2">Nível 2 (18-30 meses)</SelectItem>
                <SelectItem value="3">Nível 3 (30-48 meses)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAtividades.map((atividade) => (
                <Card key={atividade.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{atividade.titulo}</CardTitle>
                      <Badge variant="outline">{atividade.categoria}</Badge>
                    </div>
                    <CardDescription>Nível VB-MAPP: {atividade.nivelVBMAPP}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <p className="text-sm line-clamp-3">{atividade.descricao}</p>

                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          {atividade.duracao} min
                        </div>
                        <div className="flex items-center">
                          <Target className="mr-1 h-4 w-4" />
                          {atividade.objetivos.length} objetivos
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="mr-1 h-4 w-4" />
                          {atividade.materiais.length} materiais
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/atividades/${atividade.id}`)}>
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push(`/atividades/${atividade.id}/aplicar`)}
                    >
                      Aplicar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lista">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Título</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Categoria</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Nível</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Duração</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAtividades.map((atividade) => (
                        <tr key={atividade.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{atividade.titulo}</td>
                          <td className="p-4 align-middle">
                            <Badge variant="outline">{atividade.categoria}</Badge>
                          </td>
                          <td className="p-4 align-middle">{atividade.nivelVBMAPP}</td>
                          <td className="p-4 align-middle">{atividade.duracao} min</td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/atividades/${atividade.id}`)}
                              >
                                Ver
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => router.push(`/atividades/${atividade.id}/aplicar`)}
                              >
                                Aplicar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
