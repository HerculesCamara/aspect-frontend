"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Save, Plus, X } from "lucide-react"
import { useAtividadeStore } from "@/store/atividade-store"
import { useAuthStore } from "@/store/auth-store"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NovaAtividadePage() {
  const router = useRouter()
  const { criarAtividade } = useAtividadeStore()
  const { user } = useAuthStore()

  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    nivelVBMAPP: 1,
    duracao: 15,
    objetivos: [""],
    materiais: [""],
    passos: [""],
    adaptacoes: [""],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayItemChange = (
    arrayName: "objetivos" | "materiais" | "passos" | "adaptacoes",
    index: number,
    value: string,
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[arrayName]]
      newArray[index] = value
      return {
        ...prev,
        [arrayName]: newArray,
      }
    })
  }

  const handleAddArrayItem = (arrayName: "objetivos" | "materiais" | "passos" | "adaptacoes") => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], ""],
    }))
  }

  const handleRemoveArrayItem = (arrayName: "objetivos" | "materiais" | "passos" | "adaptacoes", index: number) => {
    if (formData[arrayName].length <= 1) return

    setFormData((prev) => {
      const newArray = [...prev[arrayName]]
      newArray.splice(index, 1)
      return {
        ...prev,
        [arrayName]: newArray,
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.titulo) {
      toast.error("O título da atividade é obrigatório")
      return
    }

    if (!formData.descricao) {
      toast.error("A descrição da atividade é obrigatória")
      return
    }

    if (!formData.categoria) {
      toast.error("Selecione uma categoria para a atividade")
      return
    }

    // Remover itens vazios dos arrays
    const objetivosFiltrados = formData.objetivos.filter((item) => item.trim() !== "")
    const materiaisFiltrados = formData.materiais.filter((item) => item.trim() !== "")
    const passosFiltrados = formData.passos.filter((item) => item.trim() !== "")
    const adaptacoesFiltradas = formData.adaptacoes.filter((item) => item.trim() !== "")

    if (objetivosFiltrados.length === 0) {
      toast.error("Adicione pelo menos um objetivo para a atividade")
      return
    }

    if (materiaisFiltrados.length === 0) {
      toast.error("Adicione pelo menos um material necessário")
      return
    }

    if (passosFiltrados.length === 0) {
      toast.error("Adicione pelo menos um passo para a atividade")
      return
    }

    setIsSaving(true)

    try {
      await criarAtividade({
        ...formData,
        objetivos: objetivosFiltrados,
        materiais: materiaisFiltrados,
        passos: passosFiltrados,
        adaptacoes: adaptacoesFiltradas,
        criadoPor: user?.id || "desconhecido",
      })

      toast.success("Atividade criada com sucesso!")
      router.push("/atividades")
    } catch (error) {
      toast.error("Erro ao criar atividade. Tente novamente.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/atividades")}>
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Nova Atividade</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Preencha as informações básicas da atividade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Atividade</Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    placeholder="Ex: Pareamento de Imagens"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    placeholder="Descreva a atividade e seus objetivos gerais..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => handleSelectChange("categoria", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linguagem">Linguagem</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="motor">Motor</SelectItem>
                        <SelectItem value="cognitivo">Cognitivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nivelVBMAPP">Nível VB-MAPP</Label>
                    <Select
                      value={formData.nivelVBMAPP.toString()}
                      onValueChange={(value) => handleSelectChange("nivelVBMAPP", Number.parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Nível 1 (0-18 meses)</SelectItem>
                        <SelectItem value="2">Nível 2 (18-30 meses)</SelectItem>
                        <SelectItem value="3">Nível 3 (30-48 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (minutos)</Label>
                    <Input
                      id="duracao"
                      name="duracao"
                      type="number"
                      min={5}
                      max={120}
                      value={formData.duracao}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Objetivos</CardTitle>
                  <CardDescription>Adicione os objetivos específicos da atividade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.objetivos.map((objetivo, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={objetivo}
                          onChange={(e) => handleArrayItemChange("objetivos", index, e.target.value)}
                          placeholder={`Objetivo ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveArrayItem("objetivos", index)}
                          disabled={formData.objetivos.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleAddArrayItem("objetivos")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Objetivo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Materiais Necessários</CardTitle>
                  <CardDescription>Liste os materiais necessários para a atividade</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.materiais.map((material, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={material}
                          onChange={(e) => handleArrayItemChange("materiais", index, e.target.value)}
                          placeholder={`Material ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveArrayItem("materiais", index)}
                          disabled={formData.materiais.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleAddArrayItem("materiais")}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Material
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Passo a Passo</CardTitle>
                <CardDescription>Descreva os passos para aplicação da atividade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.passos.map((passo, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                        {index + 1}
                      </div>
                      <Input
                        value={passo}
                        onChange={(e) => handleArrayItemChange("passos", index, e.target.value)}
                        placeholder={`Passo ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArrayItem("passos", index)}
                        disabled={formData.passos.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddArrayItem("passos")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Passo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Adaptações Possíveis</CardTitle>
                <CardDescription>Sugira adaptações para diferentes necessidades (opcional)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {formData.adaptacoes.map((adaptacao, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={adaptacao}
                        onChange={(e) => handleArrayItemChange("adaptacoes", index, e.target.value)}
                        placeholder={`Adaptação ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveArrayItem("adaptacoes", index)}
                        disabled={formData.adaptacoes.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => handleAddArrayItem("adaptacoes")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Adaptação
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardFooter className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={() => router.push("/atividades")}>
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
                      Salvar Atividade
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
