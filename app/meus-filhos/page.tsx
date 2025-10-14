"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, BarChart, Calendar, User, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCriancaStore } from "@/store/crianca-store"
import { useAuthStore } from "@/store/auth-store"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function MeusFilhosPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { criancas, fetchCriancas } = useCriancaStore()
  const [meusFilhos, setMeusFilhos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      await fetchCriancas()

      // Filtrar apenas os filhos do usuário logado (pai)
      // Comparar primaryParentId da criança com o userId do usuário logado
      const filhosDoUsuario = useCriancaStore
        .getState()
        .criancas.filter((crianca) => crianca.primaryParentId === user?.id)

      setMeusFilhos(filhosDoUsuario)
      setIsLoading(false)
    }

    if (user?.id) {
      loadData()
    } else {
      setIsLoading(false)
    }
  }, [fetchCriancas, user?.id])

  return (
    <AppShell>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Meus Filhos</h1>
        </div>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
            </div>
          </div>
        ) : meusFilhos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {meusFilhos.map((filho) => (
              <Card key={filho.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle>{filho.nome}</CardTitle>
                    {filho.alertas && filho.alertas.length > 0 && (
                      <Badge variant="destructive" className="flex items-center">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Alerta
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    {filho.idade} anos • Nível VB-MAPP: {filho.nivelVBMAPP}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={filho.foto} />
                      <AvatarFallback>{filho.nome.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        {filho.informacoesMedicas?.diagnostico || "TEA"}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {filho.dataNascimento
                            ? new Date(filho.dataNascimento).toLocaleDateString('pt-BR')
                            : 'Data não informada'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>Progresso Geral</span>
                        <div className="flex items-center">
                          <span className="font-medium">{filho.progresso?.media || 0}%</span>
                          {filho.progresso?.tendencia === "up" ? (
                            <TrendingUp className="ml-1 h-4 w-4 text-green-500" />
                          ) : filho.progresso?.tendencia === "down" ? (
                            <TrendingDown className="ml-1 h-4 w-4 text-red-500" />
                          ) : null}
                        </div>
                      </div>
                      <Progress value={filho.progresso?.media || 0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/progresso/${filho.id}`)}>
                    <BarChart className="mr-2 h-4 w-4" />
                    Ver Progresso
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/criancas/${filho.id}`)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Ver Relatórios
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-muted-foreground">
              <User className="h-12 w-12" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Nenhum filho cadastrado</h2>
            <p className="mt-2 text-sm text-muted-foreground">Você ainda não possui filhos cadastrados no sistema.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Entre em contato com o terapeuta responsável para solicitar o cadastro.
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
