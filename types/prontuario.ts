// Tipos para sistema de prontuário de sessão (DTT - Discrete Trial Training)

export type ResultadoTentativa = 'acerto' | 'erro' | null

export type TipoRegistro = 'comportamento' | 'demanda' | 'evento'

export interface IntervaloTempo {
  minutos: number // 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60
  acerto: number // Quantidade de acertos neste intervalo
  erro: number // Quantidade de erros neste intervalo
}

export interface RegistroComportamento {
  id: string
  tipo: TipoRegistro
  nome: string // Ex: "Comportamento problema 1°", "Demanda 1°"
  ordem: number // Para ordenação (1, 2, 3...)
  intervalos: IntervaloTempo[]
  totalAcertos: number
  totalErros: number
  totalTentativas: number
  porcentagemAcerto: number
}

export interface DadosProntuario {
  sessaoId: string
  criancaId: string
  criancaNome: string
  data: string
  registros: RegistroComportamento[]
  duracaoTotal: number // Duração da sessão em minutos
  observacoes?: string
  criadoEm: string
  atualizadoEm?: string
}

export interface EstatisticasProntuario {
  totalTentativas: number
  totalAcertos: number
  totalErros: number
  porcentagemAcertoGeral: number
  comportamentosProblema: number
  demandasTrabalhadas: number
}

// Helpers para intervalos de tempo
export const INTERVALOS_PADRAO = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]

export function criarIntervalosVazios(): IntervaloTempo[] {
  return INTERVALOS_PADRAO.map(minutos => ({
    minutos,
    acerto: 0,
    erro: 0
  }))
}

export function calcularEstatisticas(registro: RegistroComportamento): void {
  registro.totalAcertos = registro.intervalos.reduce((sum, i) => sum + i.acerto, 0)
  registro.totalErros = registro.intervalos.reduce((sum, i) => sum + i.erro, 0)
  registro.totalTentativas = registro.totalAcertos + registro.totalErros
  registro.porcentagemAcerto = registro.totalTentativas > 0
    ? Math.round((registro.totalAcertos / registro.totalTentativas) * 100)
    : 0
}
