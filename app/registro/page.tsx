"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/auth-store"
import { registrationSchema, formatZodErrors } from "@/lib/validations/auth"
import { Loader2, Heart, Puzzle, UserPlus, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { formatPhoneNumber, unformatPhoneNumber } from "@/lib/utils/phone-formatter"

interface RegistroFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: 'Psychologist' | 'Parent'
  contactNumber: string

  // Campos específicos para Psicólogo
  licenseNumber: string
  specialization: string
  clinicName: string

  // Campos específicos para Parent
  childRelationship: string
}

export default function RegistroPage() {
  const [formData, setFormData] = useState<RegistroFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: 'Psychologist',
    contactNumber: "",
    licenseNumber: "",
    specialization: "",
    clinicName: "",
    childRelationship: "Father"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { register } = useAuthStore()
  const router = useRouter()

  const handleInputChange = (field: keyof RegistroFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRoleChange = (role: 'Psychologist' | 'Parent') => {
    setFormData(prev => ({ ...prev, role }))
  }

  const validateForm = (): string | null => {
    // Validação com Zod
    const result = registrationSchema.safeParse(formData)

    if (!result.success) {
      // Pegar primeiro erro para exibir
      const errors = formatZodErrors(result.error)
      const firstError = Object.values(errors)[0]
      return firstError || "Erro de validação"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // Preparar dados para API baseado no RegisterRequest
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        contactNumber: unformatPhoneNumber(formData.contactNumber.trim()) || undefined,

        // Campos específicos por role
        ...(formData.role === 'Psychologist' && {
          licenseNumber: formData.licenseNumber.trim() || undefined,
          specialization: formData.specialization.trim() || undefined,
          clinicName: formData.clinicName.trim() || undefined,
        }),

        ...(formData.role === 'Parent' && {
          childRelationship: formData.childRelationship,
        })
      }

      await register(registerData)
      toast.success("Conta criada com sucesso! Redirecionando...")

      // Redirecionar baseado no role após pequeno delay
      setTimeout(() => {
        if (formData.role === 'Psychologist') {
          router.push("/dashboard")
        } else {
          router.push("/meus-filhos")
        }
      }, 1000)

    } catch (err) {
      console.error("Erro no registro:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.")
      toast.error("Erro ao criar conta")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex items-center space-x-1">
              <Heart className="h-8 w-8 text-blue-600" />
              <Puzzle className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ASPCT Software
          </CardTitle>
          <CardDescription className="text-lg">
            Criar Nova Conta
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Seleção de Tipo de Conta */}
            <div className="space-y-3">
              <Label className="text-base font-semibold flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Tipo de Conta
              </Label>
              <RadioGroup
                value={formData.role}
                onValueChange={handleRoleChange}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Psychologist" id="psychologist" />
                  <Label htmlFor="psychologist" className="font-medium">Psicólogo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Parent" id="parent" />
                  <Label htmlFor="parent" className="font-medium">Pai/Responsável</Label>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Dados Pessoais */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Dados Pessoais</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Seu sobrenome"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Telefone</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      handleInputChange('contactNumber', formatted)
                    }}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados de Acesso */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Dados de Acesso</Label>
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="nome_usuario"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Campos específicos para Psicólogo */}
            {formData.role === 'Psychologist' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Dados Profissionais</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Número CRP (opcional)</Label>
                      <Input
                        id="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                        placeholder="CRP-XX/XXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Especialização (opcional)</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange('specialization', e.target.value)}
                        placeholder="TEA, ABA, etc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Nome da Clínica</Label>
                    <Input
                      id="clinicName"
                      value={formData.clinicName}
                      onChange={(e) => handleInputChange('clinicName', e.target.value)}
                      placeholder="Nome da sua clínica ou instituição"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Campos específicos para Parent */}
            {formData.role === 'Parent' && (
              <>
                <Separator />
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Relacionamento</Label>
                  <div className="space-y-2">
                    <Label htmlFor="childRelationship">Parentesco (opcional)</Label>
                    <Select
                      value={formData.childRelationship}
                      onValueChange={(value) => handleInputChange('childRelationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o parentesco" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Father">Pai</SelectItem>
                        <SelectItem value="Mother">Mãe</SelectItem>
                        <SelectItem value="Guardian">Responsável Legal</SelectItem>
                        <SelectItem value="Other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/login")}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Login
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar Conta
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-muted-foreground pt-4 border-t">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-500 font-medium hover:underline"
            >
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}