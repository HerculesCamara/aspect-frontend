"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { useAuthStore } from "@/store/auth-store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, FileText, Share2, User, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SessionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  const { getSessao, deleteSessao, compartilharComPais } = useSessionStore()
  const { user } = useAuthStore()

  const [sessao, setSessao] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggleSharing, setIsToggleSharing] = useState(false)

  useEffect(() => {
    loadSession()
  }, [sessionId])

  const loadSession = async () => {
    setIsLoading(true)
    try {
      const session = await getSessao(sessionId)
      if (session) {
        setSessao(session)
      } else {
        toast.error("Sessão não encontrada")
        router.push("/sessoes")
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error)
      toast.error("Erro ao carregar sessão")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteSessao(sessionId)
      toast.success("Sessão deletada com sucesso")
      router.push("/sessoes")
    } catch (error) {
      console.error("Erro ao deletar sessão:", error)
      toast.error("Erro ao deletar sessão")
      setIsDeleting(false)
    }
  }

  const handleToggleShare = async () => {
    if (!sessao) return

    setIsToggleSharing(true)
    try {
      await compartilharComPais(sessionId, !sessao.compartilhadoComPais)
      toast.success(
        sessao.compartilhadoComPais
          ? "Compartilhamento removido"
          : "Sessão compartilhada com os pais"
      )
      await loadSession()
    } catch (error) {
      console.error("Erro ao compartilhar sessão:", error)
      toast.error("Erro ao compartilhar sessão")
    } finally {
      setIsToggleSharing(false)
    }
  }

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

  const isPsicologo = user?.tipo === "psicologo"

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  if (!sessao) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Sessão não encontrada</p>
              <Button className="mt-4" onClick={() => router.push("/sessoes")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Sessões
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Detalhes da Sessão</h1>
              <p className="text-muted-foreground">
                {format(new Date(sessao.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          {isPsicologo && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/sessoes/${sessionId}/editar`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>

              <Button
                variant="outline"
                onClick={handleToggleShare}
                disabled={isToggleSharing}
              >
                <Share2 className="mr-2 h-4 w-4" />
                {sessao.compartilhadoComPais ? "Descompartilhar" : "Compartilhar"}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isDeleting}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deletar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja deletar esta sessão? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Deletar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>

        {/* Informações Principais */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{sessao.criancaNome}</CardTitle>
                <CardDescription className="text-base mt-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {sessao.psicologoNome}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <Badge className={getTipoBadgeColor(sessao.tipo)}>{sessao.tipo}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Data</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(sessao.data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duração</p>
                  <p className="text-sm text-muted-foreground">{sessao.duracao} minutos</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Compartilhamento</p>
                  <p className="text-sm text-muted-foreground">
                    {sessao.compartilhadoComPais ? "Compartilhado" : "Não compartilhado"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anotações Clínicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Anotações Clínicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessao.anotacoes.oqueFoiFeito && (
              <div>
                <h3 className="font-semibold mb-2">O que foi feito:</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {sessao.anotacoes.oqueFoiFeito}
                </p>
              </div>
            )}

            {sessao.anotacoes.diagnosticado && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Observações e Diagnóstico:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {sessao.anotacoes.diagnosticado}
                  </p>
                </div>
              </>
            )}

            {sessao.anotacoes.proximosPassos && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Próximos Passos:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {sessao.anotacoes.proximosPassos}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Resumo para Pais (se compartilhado) */}
        {sessao.compartilhadoComPais && sessao.resumoParaPais && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Share2 className="h-5 w-5" />
                Resumo Compartilhado com os Pais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {sessao.resumoParaPais}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Informações de Sistema */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>
                <strong>Criado em:</strong>{" "}
                {format(new Date(sessao.criadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
              {sessao.atualizadoEm && (
                <p>
                  <strong>Atualizado em:</strong>{" "}
                  {format(new Date(sessao.atualizadoEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
