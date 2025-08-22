import { create } from "zustand"

// Tipos
interface Relatorio {
  id: string
  criancaId: string
  titulo: string
  tipo: string
  data: string
  resumo: string
  marcosAlcancados: string[]
  observacoes: string
  recomendacoesCasa: string
  recomendacoesEscola: string
}

interface RelatorioState {
  relatorios: Relatorio[]
  fetchRelatorios: () => Promise<void>
  gerarRelatorio: (dados: Omit<Relatorio, "id">) => Promise<void>
}

// Dados mockados
const mockRelatorios: Relatorio[] = [
  {
    id: "r1",
    criancaId: "1",
    titulo: "Relatório Mensal - João Silva - Abril 2025",
    tipo: "mensal",
    data: "30/04/2025",
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
  },
  {
    id: "r2",
    criancaId: "2",
    titulo: "Relatório de Avaliação Inicial - Maria Oliveira",
    tipo: "avaliacao",
    data: "15/03/2025",
    resumo:
      "Maria apresenta comprometimento significativo na comunicação verbal, com ausência de fala funcional. Demonstra interesse restrito em objetos e atividades.",
    marcosAlcancados: ["Contato visual breve durante interações", "Apontar para objetos desejados"],
    observacoes:
      "Maria demonstra hipersensibilidade a estímulos sonoros e táteis, o que pode interferir em sua participação em atividades. Apresenta comportamentos repetitivos como balançar as mãos e girar objetos.",
    recomendacoesCasa:
      "Implementar sistema de comunicação por figuras. Oferecer escolhas limitadas durante atividades. Estabelecer rotina previsível com apoio visual.",
    recomendacoesEscola:
      "Utilizar sistema de comunicação alternativa. Adaptar ambiente para reduzir estímulos sensoriais. Oferecer atividades estruturadas com início e fim claros.",
  },
  {
    id: "r3",
    criancaId: "3",
    titulo: "Relatório Trimestral - Pedro Santos - 1º Trimestre 2025",
    tipo: "trimestral",
    data: "31/03/2025",
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
  },
]

// Store
export const useRelatorioStore = create<RelatorioState>((set, get) => ({
  relatorios: [],

  fetchRelatorios: async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    set({ relatorios: mockRelatorios })
  },

  gerarRelatorio: async (dados) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const novoRelatorio: Relatorio = {
      ...dados,
      id: `r${Date.now()}`,
    }

    set((state) => ({
      relatorios: [...state.relatorios, novoRelatorio],
    }))
  },
}))
