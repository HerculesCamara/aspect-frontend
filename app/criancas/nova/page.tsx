"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, User } from "lucide-react"
import { useCriancaStore } from "@/store/crianca-store"
import { useParentStore } from "@/store/parent-store"
import { createChildSchema, parentEmailSchema } from "@/lib/validations/child"
import { toast } from "sonner"

export default function NovaCriancaPage() {
  const router = useRouter()
  const { addCrianca } = useCriancaStore()
  const { searchParentByEmail, searchedParent, isSearching, clearSearch } = useParentStore()
  const [isLoading, setIsLoading] = useState(false)
  const [parentEmail, setParentEmail] = useState("")
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
  }>({ isValid: false, message: "" })

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    genero: "",
    primaryParentId: "",
    informacoesMedicas: {
      diagnostico: "",
      medicamentos: "",
      alergias: "",
      observacoes: "",
    },
  })

  // Buscar parent por email com debounce
  useEffect(() => {
    const searchParent = async () => {
      if (!parentEmail.trim()) {
        clearSearch()
        setEmailValidation({ isValid: false, message: "" })
        setFormData(prev => ({ ...prev, primaryParentId: "" }))
        return
      }

      // Validação de email com Zod
      const emailValidation = parentEmailSchema.safeParse(parentEmail)
      if (!emailValidation.success) {
        setEmailValidation({ isValid: false, message: emailValidation.error.errors[0].message })
        return
      }

      // Buscar parent
      const foundParent = await searchParentByEmail(parentEmail)

      if (foundParent) {
        setEmailValidation({ isValid: true, message: "Responsável encontrado!" })
        setFormData(prev => ({ ...prev, primaryParentId: foundParent.id }))
      } else {
        setEmailValidation({ isValid: false, message: "Responsável não encontrado no sistema" })
        setFormData(prev => ({ ...prev, primaryParentId: "" }))
      }
    }

    // Debounce de 800ms
    const timeoutId = setTimeout(searchParent, 800)
    return () => clearTimeout(timeoutId)
  }, [parentEmail, searchParentByEmail, clearSearch])

  const calcularIdade = (dataNascimento: string) => {
    if (!dataNascimento) return 0
    const hoje = new Date()
    const nascimento = new Date(dataNascimento)
    let idade = hoje.getFullYear() - nascimento.getFullYear()
    const mes = hoje.getMonth() - nascimento.getMonth()
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--
    }
    return idade
  }

  const validateForm = () => {
    const errors: string[] = []

    // Validação com Zod
    const result = createChildSchema.safeParse(formData)

    if (!result.success) {
      result.error.errors.forEach(err => {
        errors.push(err.message)
      })
    }

    // Validações adicionais não cobertas pelo schema
    if (!parentEmail.trim()) errors.push("Email do responsável é obrigatório")
    if (!emailValidation.isValid) errors.push("Responsável deve estar cadastrado no sistema")
    if (!searchedParent) errors.push("Responsável não encontrado")

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]) // Mostrar primeiro erro
      return
    }

    setIsLoading(true)

    try {
      const idade = calcularIdade(formData.dataNascimento)

      await addCrianca({
        nome: formData.nome.trim(),
        idade,
        dataNascimento: formData.dataNascimento,
        genero: formData.genero,
        primaryParentId: formData.primaryParentId,
        responsavel: searchedParent ? {
          nome: searchedParent.fullName,
          telefone: searchedParent.contactNumber || "",
          email: searchedParent.email,
          endereco: "",
        } : undefined,
        informacoesMedicas: {
          diagnostico: formData.informacoesMedicas.diagnostico.trim() || "TEA",
          medicamentos: formData.informacoesMedicas.medicamentos.trim(),
          alergias: formData.informacoesMedicas.alergias.trim(),
          observacoes: formData.informacoesMedicas.observacoes.trim(),
        },
        progresso: {
          linguagem: 0,
          social: 0,
          motor: 0,
          media: 0,
          tendencia: "up" as const,
        },
        alertas: [],
      })

      toast.success("Criança cadastrada com sucesso!")
      router.push("/criancas")
    } catch (error) {
      toast.error("Erro ao cadastrar criança. Verifique os dados e tente novamente.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nova Criança</h1>
            <p className="text-muted-foreground">Cadastre uma nova criança no sistema</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Dados principais da criança</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) => handleInputChange("dataNascimento", e.target.value)}
                    required
                  />
                  {formData.dataNascimento && (
                    <p className="text-sm text-muted-foreground">
                      Idade: {calcularIdade(formData.dataNascimento)} anos
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genero">Gênero *</Label>
                  <Select
                    value={formData.genero}
                    onValueChange={(value) => handleInputChange("genero", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Masculino">Masculino</SelectItem>
                      <SelectItem value="Feminino">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Busca de Responsável */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Responsável Legal
                </CardTitle>
                <CardDescription>
                  Digite o email do responsável cadastrado no sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Email do Responsável *</Label>
                  <div className="relative">
                    <Input
                      id="parentEmail"
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="responsavel@email.com"
                      className={`pr-10 ${
                        emailValidation.message
                          ? emailValidation.isValid
                            ? "border-green-500 focus:border-green-500"
                            : "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Feedback de Validação */}
                  {emailValidation.message && (
                    <p className={`text-sm ${
                      emailValidation.isValid ? "text-green-600" : "text-red-600"
                    }`}>
                      {emailValidation.message}
                    </p>
                  )}

                  {/* Responsável Encontrado */}
                  {searchedParent && emailValidation.isValid && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm font-medium text-green-900">
                          Responsável confirmado:
                        </p>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Nome:</strong> {searchedParent.fullName}</p>
                        <p><strong>Email:</strong> {searchedParent.email}</p>
                        {searchedParent.contactNumber && (
                          <p><strong>Telefone:</strong> {searchedParent.contactNumber}</p>
                        )}
                        {searchedParent.childRelationship && (
                          <p><strong>Parentesco:</strong> {searchedParent.childRelationship}</p>
                        )}
                        {searchedParent.id.startsWith('temp-') && (
                          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                            ⚠️ <strong>Dados básicos:</strong> Usuário confirmado no sistema mas sem dados completos.
                            O sistema utilizará o email para vinculação.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dica de LGPD */}
                  <div className="text-xs text-muted-foreground p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p>🔒 <strong>Privacidade:</strong> Por questões de LGPD, não exibimos lista de todos os responsáveis.</p>
                    <p>Digite o email exato do responsável que deseja vincular à criança.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações Médicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Médicas</CardTitle>
              <CardDescription>Dados médicos relevantes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Input
                    id="diagnostico"
                    value={formData.informacoesMedicas.diagnostico}
                    onChange={(e) => handleInputChange("informacoesMedicas.diagnostico", e.target.value)}
                    placeholder="Ex: TEA Nível 1, TEA Nível 2..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicamentos">Medicamentos</Label>
                  <Textarea
                    id="medicamentos"
                    value={formData.informacoesMedicas.medicamentos}
                    onChange={(e) => handleInputChange("informacoesMedicas.medicamentos", e.target.value)}
                    placeholder="Liste medicamentos em uso"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alergias">Alergias</Label>
                  <Textarea
                    id="alergias"
                    value={formData.informacoesMedicas.alergias}
                    onChange={(e) => handleInputChange("informacoesMedicas.alergias", e.target.value)}
                    placeholder="Liste alergias conhecidas"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Gerais</Label>
                <Textarea
                  id="observacoes"
                  value={formData.informacoesMedicas.observacoes}
                  onChange={(e) => handleInputChange("informacoesMedicas.observacoes", e.target.value)}
                  placeholder="Observações importantes sobre a criança"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Indicador de Estado do Formulário */}
          {(formData.nome || formData.dataNascimento || parentEmail) && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Status do formulário:</span>
                  <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${formData.nome && formData.dataNascimento && formData.genero ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-blue-700">
                      {formData.nome && formData.dataNascimento && formData.genero ? 'Dados básicos OK' : 'Dados básicos pendentes'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Responsável:</span>
                  <div className="flex gap-2">
                    <div className={`w-2 h-2 rounded-full ${emailValidation.isValid && searchedParent ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-blue-700">
                      {emailValidation.isValid && searchedParent ? 'Responsável confirmado' : 'Aguardando responsável'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !emailValidation.isValid || !searchedParent}
              className={`${emailValidation.isValid && searchedParent ? '' : 'opacity-50 cursor-not-allowed'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Criança
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}