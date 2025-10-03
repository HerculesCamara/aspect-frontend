/**
 * 🔒 Schemas de Validação - Autenticação
 *
 * Validações com Zod para formulários de registro e login
 */

import { z } from 'zod'

/**
 * Schema base para campos compartilhados
 */
const baseUserSchema = z.object({
  username: z.string()
    .min(3, 'Nome de usuário deve ter pelo menos 3 caracteres')
    .max(50, 'Nome de usuário deve ter no máximo 50 caracteres'),

  email: z.string()
    .email('Email inválido')
    .max(100, 'Email muito longo'),

  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),

  firstName: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome muito longo'),

  lastName: z.string()
    .min(2, 'Sobrenome deve ter pelo menos 2 caracteres')
    .max(50, 'Sobrenome muito longo'),

  contactNumber: z.string()
    .max(20, 'Número de telefone deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
})

/**
 * Schema para registro de Psicólogo
 */
export const psychologistRegistrationSchema = baseUserSchema.extend({
  role: z.literal('Psychologist'),

  licenseNumber: z.string()
    .max(50, 'Número de licença muito longo')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),

  specialization: z.string()
    .max(100, 'Especialização muito longa')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),

  clinicName: z.string()
    .max(100, 'Nome da clínica muito longo')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
})

/**
 * Schema para registro de Parent/Responsável
 */
export const parentRegistrationSchema = baseUserSchema.extend({
  role: z.literal('Parent'),

  childRelationship: z.enum(['Father', 'Mother', 'Guardian', 'Other'], {
    errorMap: () => ({ message: 'Selecione o tipo de relacionamento' })
  }),
})

/**
 * Schema unificado para registro (discriminated union)
 */
export const registrationSchema = z.discriminatedUnion('role', [
  psychologistRegistrationSchema,
  parentRegistrationSchema,
]).and(z.object({
  confirmPassword: z.string()
})).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword']
})

/**
 * Schema para login
 */
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

/**
 * Tipos TypeScript inferidos dos schemas
 */
export type PsychologistRegistrationInput = z.infer<typeof psychologistRegistrationSchema>
export type ParentRegistrationInput = z.infer<typeof parentRegistrationSchema>
export type RegistrationInput = z.infer<typeof registrationSchema>
export type LoginInput = z.infer<typeof loginSchema>

/**
 * Helper para formatar erros de validação Zod
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}

  error.errors.forEach(err => {
    const path = err.path.join('.')
    errors[path] = err.message
  })

  return errors
}
