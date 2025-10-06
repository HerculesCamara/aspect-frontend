"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSessionStore } from "@/store/session-store"
import { useCriancaStore } from "@/store/crianca-store"
import { useAuthStore } from "@/store/auth-store"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Calendar, Clock, FileText, Loader2, Save } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface EditSessionFormData {
  criancaId: string
  data: string
  horario: string
  duracao: string
  tipo: 'Individual' | 'Grupo' | 'Avaliação' | 'Seguimento'
  oqueFoiFeito: string
  diagnosticado: string
  proximosPassos: string
  compartilharComPais: boolean
  resumoParaPais: string
}

export default function EditarSessaoPage() {
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  const { getSessao, updateSessao } = useSessionStore()
  const { criancas, fetchCriancas } = useCriancaStore()
  const { user } = useAuthStore()

  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<EditSessionFormData>({
    criancaId: "",
    data: "",
    horario: "",
    duracao: "60",
    tipo: "Individual",
    oqueFoiFeito: "",
    diagnosticado: "",
    proximosPassos: "",
    compartilharComPais: false,
    resumoParaPais: "",
  })

  useEffect(() => {
    fetchCriancas()
    loadSession()
  }, [sessionId])

  const loadSession = async () => {
    setIsLoadingSession(true)
    try {
      const session = await getSessao(sessionId)

      if (!session) {
        toast.error("Sessão não encontrada")
        router.push("/sessoes")
        return
      }

      // Verificar se usuário tem permissão (apenas psicólogo que criou)
      if (user?.tipo !== "psicologo" || session.psicologoId !== user.id) {
        toast.error("Você não tem permissão para editar esta sessão")
        router.push("/sessoes")
        return
      }

      // Converter data ISO para formato do input
      const sessionDate = new Date(session.data)
      const dateStr = format(sessionDate, "yyyy-MM-dd")
      const timeStr = format(sessionDate, "HH:mm")

      setFormData({
        criancaId: session.criancaId,
        data: dateStr,
        horario: timeStr,
        duracao: session.duracao.toString(),
        tipo: session.tipo,
        oqueFoiFeito: session.anotacoes.oqueFoiFeito || "",
        diagnosticado: session.anotacoes.diagnosticado || "",
        proximosPassos: session.anotacoes.proximosPassos || "",
        compartilharComPais: session.compartilhadoComPais,
        resumoParaPais: session.resumoParaPais || "",
      })
    } catch (error) {
      console.error("Erro ao carregar sessão:", error)
      toast.error("Erro ao carregar sessão")
      router.push("/sessoes")
    } finally {
      setIsLoadingSession(false)
    }
  }

  const handleInputChange = (field: keyof EditSessionFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = (): string | null => {
    if (!formData.criancaId) return "Selecione uma criança"
    if (!formData.data) return "Data é obrigatória"
    if (!formData.horario) return "Horário é obrigatório"
    if (!formData.duracao || parseInt(formData.duracao) <= 0) {
      return "Duração deve ser maior que 0"
    }
    if (parseInt(formData.duracao) > 480) {
      return "Duração não pode ser maior que 480 minutos (8 horas)"
    }
    if (!formData.oqueFoiFeito.trim()) {
      return "Descreva o que foi feito na sessão"
    }
    if (formData.compartilharComPais && !formData.resumoParaPais.trim()) {
      return "Adicione um resumo para os pais"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      toast.error(validationError)
      return
    }

    setIsSaving(true)

    try {
      // Combinar data e horário
      const dataHora = new Date(`${formData.data}T${formData.horario}:00`)

      const dadosAtualizados = {
        data: dataHora.toISOString(),
        duracao: parseInt(formData.duracao),
        tipo: formData.tipo,
        anotacoes: {
          oqueFoiFeito: formData.oqueFoiFeito,
          diagnosticado: formData.diagnosticado || undefined,
          proximosPassos: formData.proximosPassos || undefined,
        },
        compartilhadoComPais: formData.compartilharComPais,
        resumoParaPais: formData.compartilharComPais ? formData.resumoParaPais : undefined,
      }

      await updateSessao(sessionId, dadosAtualizados)

      toast.success("Sessão atualizada com sucesso!")

      setTimeout(() => {
        router.push(`/sessoes/${sessionId}`)
      }, 1000)
    } catch (err) {
      console.error("Erro ao atualizar sessão:", err)
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar sessão"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingSession) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Editar Sessão</h1>
            <p className="text-muted-foreground">Atualize os detalhes da sessão terapêutica</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
              <CardDescription>Dados gerais da sessão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="criancaId">Criança *</Label>
                <Select
                  value={formData.criancaId}
                  onValueChange={(value) => handleInputChange('criancaId', value)}
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a criança" />
                  </SelectTrigger>
                  <SelectContent>
                    {criancas.map((crianca) => (
                      <SelectItem key={crianca.id} value={crianca.id}>
                        {crianca.nome} - {crianca.idade} anos
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  A criança não pode ser alterada após a criação da sessão
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="horario">Horário *</Label>
                  <Input
                    id="horario"
                    type="time"
                    value={formData.horario}
                    onChange={(e) => handleInputChange('horario', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (min) *</Label>
                  <Input
                    id="duracao"
                    type="number"
                    min="1"
                    max="480"
                    value={formData.duracao}
                    onChange={(e) => handleInputChange('duracao', e.target.value)}
                    placeholder="60"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Sessão *</Label>
                <Select value={formData.tipo} onValueChange={(value: any) => handleInputChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Grupo">Grupo</SelectItem>
                    <SelectItem value="Avaliação">Avaliação</SelectItem>
                    <SelectItem value="Seguimento">Seguimento</SelectItem>
                  </SelectContent>
                </Select>
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
              <CardDescription>Detalhes técnicos da sessão (uso interno)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oqueFoiFeito">O que foi feito *</Label>
                <Textarea
                  id="oqueFoiFeito"
                  value={formData.oqueFoiFeito}
                  onChange={(e) => handleInputChange('oqueFoiFeito', e.target.value)}
                  placeholder="Descreva as atividades realizadas durante a sessão..."
                  rows={4}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ex: Atividades de comunicação funcional com PECS, treino de habilidades sociais, etc.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosticado">Observações e Diagnóstico</Label>
                <Textarea
                  id="diagnosticado"
                  value={formData.diagnosticado}
                  onChange={(e) => handleInputChange('diagnosticado', e.target.value)}
                  placeholder="Observações sobre o comportamento, progresso, dificuldades..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="proximosPassos">Próximos Passos</Label>
                <Textarea
                  id="proximosPassos"
                  value={formData.proximosPassos}
                  onChange={(e) => handleInputChange('proximosPassos', e.target.value)}
                  placeholder="Planejamento para as próximas sessões..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Compartilhamento com Pais */}
          <Card>
            <CardHeader>
              <CardTitle>Compartilhar com os Pais</CardTitle>
              <CardDescription>Envie um resumo simplificado para os responsáveis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compartilharComPais"
                  checked={formData.compartilharComPais}
                  onCheckedChange={(checked) => handleInputChange('compartilharComPais', checked as boolean)}
                />
                <Label
                  htmlFor="compartilharComPais"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Compartilhar resumo desta sessão com os pais
                </Label>
              </div>

              {formData.compartilharComPais && (
                <div className="space-y-2">
                  <Label htmlFor="resumoParaPais">Resumo para os Pais *</Label>
                  <Textarea
                    id="resumoParaPais"
                    value={formData.resumoParaPais}
                    onChange={(e) => handleInputChange('resumoParaPais', e.target.value)}
                    placeholder="Escreva um resumo simplificado e positivo para os pais..."
                    rows={4}
                    required={formData.compartilharComPais}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use linguagem acessível e foque nos aspectos positivos e no progresso da criança.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
