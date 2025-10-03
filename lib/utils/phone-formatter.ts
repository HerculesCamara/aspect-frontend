/**
 * 📞 Formatador de Telefone
 *
 * Formata números de telefone automaticamente enquanto o usuário digita
 */

/**
 * Formata número de telefone brasileiro
 * Aceita: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 *
 * @param value - String do número de telefone
 * @returns String formatada
 */
export function formatPhoneNumber(value: string): string {
  if (!value) return ''

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')

  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limited = numbers.slice(0, 11)

  // Formata conforme o tamanho
  if (limited.length <= 2) {
    // (XX
    return limited.length > 0 ? `(${limited}` : ''
  }

  if (limited.length <= 6) {
    // (XX) XXXX
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
  }

  if (limited.length <= 10) {
    // (XX) XXXX-XXXX (telefone fixo)
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`
  }

  // (XX) XXXXX-XXXX (celular com 9 dígitos)
  return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`
}

/**
 * Remove formatação do número de telefone
 * Retorna apenas os números
 *
 * @param value - String formatada
 * @returns String apenas com números
 */
export function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, '')
}

/**
 * Valida se o número de telefone está completo
 *
 * @param value - String do telefone (formatada ou não)
 * @returns true se válido (10 ou 11 dígitos)
 */
export function isValidPhoneNumber(value: string): boolean {
  const numbers = unformatPhoneNumber(value)
  return numbers.length === 10 || numbers.length === 11
}
