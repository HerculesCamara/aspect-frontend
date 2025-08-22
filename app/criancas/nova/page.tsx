"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useCriancaStore } from "@/store/crianca-store"
import { toast } from "sonner"

export default function NovaCriancaPage() {
  const router = useRouter()
  const { addCrianca } = useCriancaStore()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    nivelVBMAPP: "",
    responsavel: {
      nome: "",
      telefone: "",
      email: "",
      endereco: "",
    },
    informacoesMedicas: {
      medicamentos: "",
      alergias: "",
      observacoes: "",
    },
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.dataNascimento || !formData.nivelVBMAPP) {
      toast.error("Por favor, preencha todos os campos obrigatórios")
      return
    }

    setIsLoading(true)

    try {
      const idade = calcularIdade(formData.dataNascimento)

      await addCrianca({
        nome: formData.nome,
        idade,
        nivelVBMAPP: formData.nivelVBMAPP,
        dataNascimento: formData.dataNascimento,
        responsavel: formData.responsavel,
        informacoesMedicas: formData.informacoesMedicas,
        progresso: {
          linguagem: 0,
          social: 0,
          motor: 0,
          media: 0,
          tendencia: "up",
        },
        alertas: [],
      })

      toast.success("Criança cadastrada com sucesso!")
      router.push("/criancas")
    } catch (error) {
      toast.error("Erro ao cadastrar criança")
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
                  <Label htmlFor="nivelVBMAPP">Nível VB-MAPP *</Label>
                  <Select
                    value={formData.nivelVBMAPP}
                    onValueChange={(value) => handleInputChange("nivelVBMAPP", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nível 1">Nível 1</SelectItem>
                      <SelectItem value="Nível 2">Nível 2</SelectItem>
                      <SelectItem value="Nível 3">Nível 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Responsável */}
            <Card>
              <CardHeader>
                <CardTitle>Dados do Responsável</CardTitle>
                <CardDescription>Informações de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavelNome">Nome do Responsável</Label>
                  <Input
                    id="responsavelNome"
                    value={formData.responsavel.nome}
                    onChange={(e) => handleInputChange("responsavel.nome", e.target.value)}
                    placeholder="Nome completo do responsável"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.responsavel.telefone}
                    onChange={(e) => handleInputChange("responsavel.telefone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.responsavel.email}
                    onChange={(e) => handleInputChange("responsavel.email", e.target.value)}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco">Endereço</Label>
                  <Textarea
                    id="endereco"
                    value={formData.responsavel.endereco}
                    onChange={(e) => handleInputChange("responsavel.endereco", e.target.value)}
                    placeholder="Endereço completo"
                    rows={3}
                  />
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
                  <Label htmlFor="medicamentos">Medicamentos</Label>
                  <Textarea
                    id="medicamentos"
                    value={formData.informacoesMedicas.medicamentos}
                    onChange={(e) => handleInputChange("informacoesMedicas.medicamentos", e.target.value)}
                    placeholder="Liste os medicamentos em uso"
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

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
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
