/**
 * 👶 Schemas de Validação - Crianças
 *
 * Validações com Zod para formulários de cadastro de crianças
 */

import { z } from 'zod'

/**
 * Schema para criação de criança
 */
export const createChildSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .refine(val => val.trim().split(' ').length >= 2, {
      message: 'Por favor, digite o nome completo (nome e sobrenome)'
    }),

  dataNascimento: z.string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine(val => {
      const date = new Date(val)
      return date <= new Date()
    }, 'Data de nascimento não pode ser no futuro')
    .refine(val => {
      const hoje = new Date()
      const nascimento = new Date(val)
      let idade = hoje.getFullYear() - nascimento.getFullYear()
      const mes = hoje.getMonth() - nascimento.getMonth()
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--
      }
      return idade <= 18
    }, 'Sistema voltado para crianças e adolescentes até 18 anos'),

  genero: z.enum(['Masculino', 'Feminino', 'Outro'], {
    errorMap: () => ({ message: 'Gênero é obrigatório' })
  }),

  primaryParentId: z.string()
    .min(1, 'Responsável é obrigatório')
    .uuid('ID do responsável inválido')
    .optional()
    .or(z.string().min(1)),

  informacoesMedicas: z.object({
    diagnostico: z.string()
      .max(200, 'Diagnóstico muito longo')
      .optional()
      .or(z.literal(''))
      .transform(val => val === '' ? 'TEA' : val),

    medicamentos: z.string()
      .max(500, 'Lista de medicamentos muito longa')
      .optional()
      .or(z.literal(''))
      .transform(val => val === '' ? undefined : val),

    alergias: z.string()
      .max(500, 'Lista de alergias muito longa')
      .optional()
      .or(z.literal(''))
      .transform(val => val === '' ? undefined : val),

    observacoes: z.string()
      .max(1000, 'Observações muito longas')
      .optional()
      .or(z.literal(''))
      .transform(val => val === '' ? undefined : val),
  }).optional()
})

/**
 * Schema para atualização de criança (campos opcionais)
 */
export const updateChildSchema = createChildSchema.partial()

/**
 * Tipos TypeScript inferidos
 */
export type CreateChildInput = z.infer<typeof createChildSchema>
export type UpdateChildInput = z.infer<typeof updateChildSchema>

/**
 * Helper para validar email de responsável
 */
export const parentEmailSchema = z.string()
  .email('Email inválido')
  .max(100, 'Email muito longo')
