// store/relatorio-store.ts
import { create } from "zustand"
import { api } from "@/lib/api"

// Estrutura frontend (mantém compatibilidade com UI existente)
interface Relatorio {
  id: string
  criancaId: string
  criancaNome?: string
  psicologoId?: string
  psicologoNome?: string
  titulo: string
  tipo: string
  data: string
  periodoInicio: string
  periodoFim: string
  resumo: string
  notasClinicas?: string
  marcosAlcancados: string[]
  observacoes: string
  recomendacoesCasa: string
  recomendacoesEscola: string
  compartilhadoComPais: boolean
  estatisticas?: {
    totalSessoes: number
    totalAvaliacoes: number
    avaliacoesPorTipo: Record<string, number>
    sessoesPorTipo: Record<string, number>
    metasAlcancadas: string[]
    metasAtivas: string[]
  }
}

// Dados mockados
const mockRelatorios: Relatorio[] = [
  {
    id: "r1",
    criancaId: "1",
    criancaNome: "João Silva",
    titulo: "Relatório Mensal - João Silva - Abril 2025",
    tipo: "mensal",
    data: "2025-04-30T00:00:00Z",
    periodoInicio: "2025-04-01T00:00:00Z",
    periodoFim: "2025-04-30T23:59:59Z",
    resumo:
      "João apresentou avanços significativos na área de linguagem, conseguindo formar frases de 3-4 palavras com maior frequência. Demonstra maior interesse em interações sociais com pares.",
    marcosAlcancados: [
      "Construir frases de 3-4 palavras",
      "Seguir instruções de duas etapas",
      "Participar de brincadeiras simples",
    ],
    observacoes:
      "João tem demonstrado maior interesse em atividades de grupo, embora ainda precise de suporte para manter a atenção por períodos prolongados. Sua capacidade de comunicação tem melhorado consistentemente.",
    recomendacoesCasa:
      "Estimular a comunicação verbal durante as refeições. Praticar a espera da vez em jogos de tabuleiro. Utilizar apoio visual para rotinas diárias.",
    recomendacoesEscola:
      "Oferecer suporte visual para instruções em sala. Proporcionar ambiente previsível com rotinas claras. Adaptar atividades em grupo para facilitar a participação.",
    compartilhadoComPais: true,
    estatisticas: {
      totalSessoes: 12,
      totalAvaliacoes: 3,
      avaliacoesPorTipo: { "VB-MAPP": 2, "Observação": 1 },
      sessoesPorTipo: { "Individual": 10, "Grupo": 2 },
      metasAlcancadas: ["Comunicação funcional", "Seguir instruções"],
      metasAtivas: ["Interação social", "Atenção sustentada"]
    }
  },
  {
    id: "r2",
    criancaId: "2",
    criancaNome: "Maria Oliveira",
    titulo: "Relatório de Avaliação Inicial - Maria Oliveira",
    tipo: "avaliacao",
    data: "2025-03-15T00:00:00Z",
    periodoInicio: "2025-03-01T00:00:00Z",
    periodoFim: "2025-03-15T23:59:59Z",
    resumo:
      "Maria apresenta comprometimento significativo na comunicação verbal, com ausência de fala funcional. Demonstra interesse restrito em objetos e atividades.",
    marcosAlcancados: ["Contato visual breve durante interações", "Apontar para objetos desejados"],
    observacoes:
      "Maria demonstra hipersensibilidade a estímulos sonoros e táteis, o que pode interferir em sua participação em atividades. Apresenta comportamentos repetitivos como balançar as mãos e girar objetos.",
    recomendacoesCasa:
      "Implementar sistema de comunicação por figuras. Oferecer escolhas limitadas durante atividades. Estabelecer rotina previsível com apoio visual.",
    recomendacoesEscola:
      "Utilizar sistema de comunicação alternativa. Adaptar ambiente para reduzir estímulos sensoriais. Oferecer atividades estruturadas com início e fim claros.",
    compartilhadoComPais: false,
    estatisticas: {
      totalSessoes: 4,
      totalAvaliacoes: 2,
      avaliacoesPorTipo: { "VB-MAPP": 1, "Observação": 1 },
      sessoesPorTipo: { "Avaliação": 4 },
      metasAlcancadas: [],
      metasAtivas: ["Comunicação alternativa", "Tolerância sensorial"]
    }
  },
  {
    id: "r3",
    criancaId: "3",
    criancaNome: "Pedro Santos",
    titulo: "Relatório Trimestral - Pedro Santos - 1º Trimestre 2025",
    tipo: "trimestral",
    data: "2025-03-31T00:00:00Z",
    periodoInicio: "2025-01-01T00:00:00Z",
    periodoFim: "2025-03-31T23:59:59Z",
    resumo:
      "Pedro apresenta excelente evolução em todas as áreas, com destaque para as habilidades de linguagem e motoras. Ainda necessita de suporte em situações sociais não estruturadas.",
    marcosAlcancados: [
      "Construir frases complexas",
      "Engajar-se em conversas simples",
      "Seguir instruções complexas",
      "Participar de jogos com regras",
    ],
    observacoes:
      "Pedro demonstra excelente capacidade cognitiva, com facilidade para aprender novos conceitos. Suas principais dificuldades estão relacionadas à flexibilidade cognitiva e à compreensão de pistas sociais sutis.",
    recomendacoesCasa:
      "Promover situações de interação social com pares. Praticar habilidades de conversação em contextos naturais. Incentivar autonomia em atividades diárias.",
    recomendacoesEscola:
      "Facilitar interações sociais durante o recreio. Oferecer suporte em transições entre atividades. Trabalhar habilidades de organização e planejamento.",
    compartilhadoComPais: true,
    estatisticas: {
      totalSessoes: 36,
      totalAvaliacoes: 9,
      avaliacoesPorTipo: { "VB-MAPP": 6, "Observação": 3 },
      sessoesPorTipo: { "Individual": 28, "Grupo": 8 },
      metasAlcancadas: ["Linguagem complexa", "Seguir regras"],
      metasAtivas: ["Flexibilidade cognitiva", "Pistas sociais"]
    }
  },
]

// Mapeamento ReportResponse (backend) → Relatorio (frontend)
function mapReportResponseToRelatorio(report: any): Relatorio {
  return {
    id: report.reportId,
    criancaId: report.childId,
    criancaNome: report.childName,
    psicologoId: report.psychologistId,
    psicologoNome: report.psychologistName,
    titulo: `Relatório ${report.reportType} - ${report.childName} - ${new Date(report.reportDate).toLocaleDateString('pt-BR')}`,
    tipo: report.reportType.toLowerCase(),
    data: report.reportDate,
    periodoInicio: report.startPeriod,
    periodoFim: report.endPeriod,
    resumo: report.summaryForParent || "",
    notasClinicas: report.clinicalNotes,
    marcosAlcancados: report.statistics?.achievedGoals || [],
    observacoes: report.clinicalNotes || "",
    recomendacoesCasa: report.summaryForParent || "",
    recomendacoesEscola: "",
    compartilhadoComPais: report.isSharedWithParent,
    estatisticas: report.statistics ? {
      totalSessoes: report.statistics.totalSessions,
      totalAvaliacoes: report.statistics.totalAssessments,
      avaliacoesPorTipo: report.statistics.assessmentsByType,
      sessoesPorTipo: report.statistics.sessionsByType,
      metasAlcancadas: report.statistics.achievedGoals,
      metasAtivas: report.statistics.activeGoals
    } : undefined
  }
}

// Mapeamento Relatorio (frontend) → ReportRequest (backend)
function mapRelatorioToReportRequest(relatorio: Omit<Relatorio, 'id' | 'psicologoId' | 'psicologoNome' | 'estatisticas' | 'titulo'>): any {
  return {
    childId: relatorio.criancaId,
    startPeriod: relatorio.periodoInicio,
    endPeriod: relatorio.periodoFim,
    reportType: relatorio.tipo,
    summaryForParent: relatorio.resumo || relatorio.recomendacoesCasa,
    clinicalNotes: relatorio.notasClinicas || relatorio.observacoes,
    isSharedWithParent: relatorio.compartilhadoComPais
  }
}

interface RelatorioState {
  relatorios: Relatorio[]
  isUsingMockData: boolean

  // Actions
  fetchRelatorios: () => Promise<void>
  fetchRelatoriosByCrianca: (criancaId: string) => Promise<void>
  getRelatorio: (id: string) => Promise<Relatorio | null>
  gerarRelatorio: (dados: Omit<Relatorio, 'id' | 'psicologoId' | 'psicologoNome' | 'estatisticas' | 'titulo'>) => Promise<void>
  compartilharComPais: (id: string, compartilhar: boolean) => Promise<void>
  downloadPdf: (id: string) => Promise<void>
}

// Store
export const useRelatorioStore = create<RelatorioState>((set, get) => ({
  relatorios: [],
  isUsingMockData: false,

  fetchRelatorios: async () => {
    try {
      // Buscar todos os relatórios (backend pode ter endpoint getAllReports)
      // Por enquanto, usar dados mock
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({ relatorios: mockRelatorios, isUsingMockData: true })
    } catch (error) {
      console.warn("API fetchRelatorios failed, using mock data:", error)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({ relatorios: mockRelatorios, isUsingMockData: true })
    }
  },

  fetchRelatoriosByCrianca: async (criancaId: string) => {
    try {
      // Tentar API real primeiro
      const reports = await api.getReportsByChild(criancaId)
      const relatoriosMapeados = reports.map(mapReportResponseToRelatorio)

      set({ relatorios: relatoriosMapeados, isUsingMockData: false })
    } catch (error) {
      console.warn("API getReportsByChild failed, using mock data:", error)

      // Fallback para dados mock filtrados por criança
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const relatoriosFiltrados = mockRelatorios.filter(r => r.criancaId === criancaId)
      set({ relatorios: relatoriosFiltrados, isUsingMockData: true })
    }
  },

  getRelatorio: async (id: string) => {
    try {
      // Tentar API real primeiro
      const report = await api.getReport(id)
      return mapReportResponseToRelatorio(report)
    } catch (error) {
      console.warn("API getReport failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))
      return mockRelatorios.find(r => r.id === id) || null
    }
  },

  gerarRelatorio: async (dados) => {
    try {
      // Tentar API real primeiro
      const reportRequest = mapRelatorioToReportRequest(dados)
      const reportResponse = await api.createReport(reportRequest)
      const relatorioMapeado = mapReportResponseToRelatorio(reportResponse)

      set((state) => ({
        relatorios: [...state.relatorios, relatorioMapeado],
      }))
    } catch (error) {
      console.warn("API createReport failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const novoRelatorio: Relatorio = {
        ...dados,
        id: `r${Date.now()}`,
        titulo: `Relatório ${dados.tipo} - ${dados.criancaNome || 'Criança'} - ${new Date(dados.data).toLocaleDateString('pt-BR')}`
      }

      set((state) => ({
        relatorios: [...state.relatorios, novoRelatorio],
        isUsingMockData: true
      }))
    }
  },

  compartilharComPais: async (id: string, compartilhar: boolean) => {
    try {
      // Tentar API real primeiro
      await api.shareReportWithParent(id, compartilhar)

      set((state) => ({
        relatorios: state.relatorios.map(r =>
          r.id === id ? { ...r, compartilhadoComPais: compartilhar } : r
        )
      }))
    } catch (error) {
      console.warn("API shareReportWithParent failed, using mock data:", error)

      // Fallback para dados mock
      await new Promise((resolve) => setTimeout(resolve, 500))

      set((state) => ({
        relatorios: state.relatorios.map(r =>
          r.id === id ? { ...r, compartilhadoComPais: compartilhar } : r
        ),
        isUsingMockData: true
      }))
    }
  },

  downloadPdf: async (id: string) => {
    try {
      // Tentar API real primeiro
      const blob = await api.downloadReportPdf(id)

      // Criar URL temporária e fazer download
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `relatorio_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.warn("API downloadReportPdf failed:", error)

      // Mock: Não temos PDF real, apenas avisa
      alert("Download de PDF disponível apenas com backend conectado")
    }
  }
}))