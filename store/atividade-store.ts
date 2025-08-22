import { create } from "zustand"

// Tipos
interface Atividade {
  id: string
  titulo: string
  descricao: string
  categoria: string
  nivelVBMAPP: number
  duracao: number
  objetivos: string[]
  materiais: string[]
  passos: string[]
  adaptacoes?: string[]
  criadoPor: string
}

interface AtividadeState {
  atividades: Atividade[]
  fetchAtividades: () => Promise<void>
  getAtividadePorId: (id: string) => Atividade | undefined
  criarAtividade: (atividade: Omit<Atividade, "id">) => Promise<void>
}

// Dados mockados
const mockAtividades: Atividade[] = [
  {
    id: "a1",
    titulo: "Pareamento de Imagens",
    descricao:
      "Atividade de pareamento de imagens iguais para desenvolver habilidades de discriminação visual e atenção.",
    categoria: "cognitivo",
    nivelVBMAPP: 1,
    duracao: 15,
    objetivos: [
      "Desenvolver discriminação visual",
      "Melhorar atenção sustentada",
      "Estimular reconhecimento de padrões",
    ],
    materiais: ["Cartões com imagens duplicadas", "Bandeja compartimentada", "Reforçadores"],
    passos: [
      "Apresentar dois cartões diferentes à criança",
      "Mostrar um terceiro cartão idêntico a um dos anteriores",
      "Solicitar que a criança pareie o cartão com seu igual",
      "Fornecer ajuda física se necessário",
      "Reduzir gradualmente o suporte conforme a criança demonstra compreensão",
    ],
    adaptacoes: [
      "Utilizar imagens de interesse específico da criança",
      "Aumentar o contraste visual para crianças com dificuldades visuais",
      "Reduzir o número de estímulos para crianças com maior dificuldade de atenção",
    ],
    criadoPor: "psico123",
  },
  {
    id: "a2",
    titulo: "Caixa de Solicitação",
    descricao: "Atividade para estimular a comunicação funcional através da solicitação de itens desejados.",
    categoria: "linguagem",
    nivelVBMAPP: 1,
    duracao: 20,
    objetivos: [
      "Desenvolver comunicação funcional",
      "Estimular solicitação verbal ou por gestos",
      "Promover contato visual durante interações",
    ],
    materiais: ["Caixa transparente com tampa", "Itens de interesse da criança", "Cartões de comunicação (opcional)"],
    passos: [
      "Colocar um item de interesse da criança dentro da caixa transparente",
      "Posicionar a caixa ao alcance visual, mas não físico da criança",
      "Esperar que a criança demonstre interesse pelo item",
      "Modelar a forma de solicitação esperada (verbal, gesto ou cartão)",
      "Entregar o item imediatamente após a solicitação adequada",
    ],
    adaptacoes: [
      "Utilizar sistema de comunicação alternativa para crianças não-verbais",
      "Aceitar aproximações da forma de comunicação alvo",
    ],
    criadoPor: "psico123",
  },
  {
    id: "a3",
    titulo: "Circuito Motor",
    descricao:
      "Atividade com circuito de obstáculos para desenvolver habilidades motoras grossas e seguimento de instruções.",
    categoria: "motor",
    nivelVBMAPP: 2,
    duracao: 30,
    objetivos: [
      "Desenvolver coordenação motora grossa",
      "Melhorar equilíbrio e planejamento motor",
      "Estimular seguimento de instruções sequenciais",
    ],
    materiais: ["Cones", "Arcos", "Almofadas ou steps", "Túnel", "Bola"],
    passos: [
      "Montar o circuito com diferentes estações (pular, rastejar, equilibrar)",
      "Demonstrar o percurso completo para a criança",
      "Guiar a criança pelo circuito, oferecendo suporte físico se necessário",
      "Reduzir gradualmente o suporte conforme a criança demonstra autonomia",
      "Celebrar a conclusão de cada etapa e do circuito completo",
    ],
    adaptacoes: [
      "Simplificar o circuito para crianças com maior dificuldade motora",
      "Utilizar apoio visual (pegadas, setas) para indicar o percurso",
      "Adaptar a altura e distância dos obstáculos conforme necessidade",
    ],
    criadoPor: "psico123",
  },
  {
    id: "a4",
    titulo: "Jogo de Revezamento",
    descricao: "Atividade em grupo para desenvolver habilidades sociais de esperar a vez e compartilhar.",
    categoria: "social",
    nivelVBMAPP: 2,
    duracao: 25,
    objetivos: [
      "Desenvolver habilidade de esperar a vez",
      "Estimular atenção compartilhada",
      "Promover interação com pares",
    ],
    materiais: ["Bola ou objeto para passar", "Cadeiras dispostas em círculo", "Timer visual", "Música"],
    passos: [
      "Posicionar as crianças em círculo",
      "Explicar a regra de passar o objeto quando a música parar",
      "Iniciar a música e a passagem do objeto",
      "Pausar a música em intervalos aleatórios",
      "Orientar a criança que está com o objeto a realizar uma ação simples",
    ],
    adaptacoes: [
      "Utilizar apoio visual para indicar de quem é a vez",
      "Reduzir o tempo de espera para crianças com maior dificuldade",
      "Permitir que a criança escolha a ação a ser realizada",
    ],
    criadoPor: "psico123",
  },
  {
    id: "a5",
    titulo: "Construção de Narrativas",
    descricao: "Atividade para desenvolver habilidades de linguagem expressiva através da construção de histórias.",
    categoria: "linguagem",
    nivelVBMAPP: 3,
    duracao: 20,
    objetivos: [
      "Desenvolver linguagem expressiva",
      "Estimular sequenciamento lógico",
      "Promover criatividade e imaginação",
    ],
    materiais: ["Cartões com imagens sequenciais", "Fantoches ou bonecos", "Livro de histórias sem texto"],
    passos: [
      "Apresentar os cartões com imagens em sequência",
      "Modelar a construção de uma narrativa simples baseada nas imagens",
      "Solicitar que a criança continue a história ou crie sua própria",
      "Fazer perguntas abertas para estimular a expansão da narrativa",
      "Registrar a história criada pela criança",
    ],
    adaptacoes: [
      "Oferecer opções de escolha para crianças com dificuldade em iniciar",
      "Utilizar suporte visual mais detalhado",
      "Aceitar narrativas mais simples conforme o nível da criança",
    ],
    criadoPor: "psico123",
  },
]

// Store
export const useAtividadeStore = create<AtividadeState>((set, get) => ({
  atividades: [],

  fetchAtividades: async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1000))

    set({ atividades: mockAtividades })
  },

  getAtividadePorId: (id: string) => {
    return get().atividades.find((atividade) => atividade.id === id)
  },

  criarAtividade: async (atividade) => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const novaAtividade: Atividade = {
      ...atividade,
      id: `a${Date.now()}`,
    }

    set((state) => ({
      atividades: [...state.atividades, novaAtividade],
    }))
  },
}))
