"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, AlertTriangle, Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCriancaStore } from "@/store/crianca-store"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CriancasPage() {
  const router = useRouter()
  const { criancas, fetchCriancas } = useCriancaStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCriancas, setFilteredCriancas] = useState(criancas)
  const [isLoading, setIsLoading] = useState(true)
  const [filterNivel, setFilterNivel] = useState("todos")

  useEffect(() => {
    const loadData = async () => {
      await fetchCriancas()
      setIsLoading(false)
    }

    loadData()
  }, [fetchCriancas])

  useEffect(() => {
    let filtered = criancas

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter((crianca) => crianca.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filtrar por nível VB-MAPP
    if (filterNivel !== "todos") {
      filtered = filtered.filter((crianca) => crianca.nivelVBMAPP === Number.parseInt(filterNivel))
    }

    setFilteredCriancas(filtered)
  }, [criancas, searchTerm, filterNivel])

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Crianças</h1>
          <Button onClick={() => router.push("/criancas/nova")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Criança
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Buscar criança..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="flex items-center gap-2">
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
            <TabsTrigger value="table">Tabela</TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCriancas.map((crianca) => (
                <Card key={crianca.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{crianca.nome}</CardTitle>
                      {crianca.alertas && crianca.alertas.length > 0 && (
                        <Badge variant="destructive" className="flex items-center">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Alerta
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {crianca.idade} anos • Nível VB-MAPP: {crianca.nivelVBMAPP}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Linguagem</span>
                          <span className="font-medium">{crianca.progresso.linguagem}%</span>
                        </div>
                        <Progress value={crianca.progresso.linguagem} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Social</span>
                          <span className="font-medium">{crianca.progresso.social}%</span>
                        </div>
                        <Progress value={crianca.progresso.social} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Motor</span>
                          <span className="font-medium">{crianca.progresso.motor}%</span>
                        </div>
                        <Progress value={crianca.progresso.motor} className="h-2" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Última sessão: {crianca.ultimaSessao}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/criancas/${crianca.id}`)}>
                      Ver Detalhes
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/sessoes/nova?criancaId=${crianca.id}`)}
                      >
                        Nova Sessão
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/relatorios/novo?criancaId=${crianca.id}`)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="table">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b transition-colors hover:bg-muted/50">
                        <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Idade</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Nível VB-MAPP</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Progresso</th>
                        <th className="h-12 px-4 text-left align-middle font-medium">Última Sessão</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCriancas.map((crianca) => (
                        <tr key={crianca.id} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              {crianca.nome}
                              {crianca.alertas && crianca.alertas.length > 0 && (
                                <Badge variant="destructive" className="flex items-center">
                                  <AlertTriangle className="mr-1 h-3 w-3" />
                                  Alerta
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4 align-middle">{crianca.idade} anos</td>
                          <td className="p-4 align-middle">{crianca.nivelVBMAPP}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              <Progress value={crianca.progresso.media} className="h-2 w-24" />
                              <span>{crianca.progresso.media}%</span>
                              {crianca.progresso.tendencia === "up" ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-4 align-middle">{crianca.ultimaSessao}</td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/criancas/${crianca.id}`)}>
                                Ver
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/sessoes/nova?criancaId=${crianca.id}`)}
                              >
                                Sessão
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/relatorios/novo?criancaId=${crianca.id}`)}
                              >
                                <FileText className="h-4 w-4" />
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
