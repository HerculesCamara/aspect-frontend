# 📊 VB-MAPP - Especificação Técnica de Implementação

**Data**: 03/10/2025
**Versão**: 1.0
**Status**: Planejamento

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Estrutura Completa do VB-MAPP](#2-estrutura-completa-do-vb-mapp)
3. [Sistema de Pontuação](#3-sistema-de-pontuação)
4. [As 24 Barreiras](#4-as-24-barreiras)
5. [Registro de Sessões Diárias](#5-registro-de-sessões-diárias)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [Fluxo de Trabalho UX](#7-fluxo-de-trabalho-ux)
8. [Plano de Implementação](#8-plano-de-implementação)
9. [Referências](#9-referências)

---

## 1. Visão Geral

### 1.1 O que é VB-MAPP?

**VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program)** é um sistema de avaliação baseado em marcos para crianças com autismo e outras deficiências de desenvolvimento.

### 1.2 Os 5 Componentes

| Componente | Descrição | Quantidade |
|------------|-----------|------------|
| **Milestones** | Avaliação de marcos de desenvolvimento | 170 marcos |
| **Barriers** | Barreiras de aprendizagem | 24 barreiras |
| **Transition** | Prontidão para ambientes educacionais | 18 áreas |
| **Task Analysis** | Decomposição de habilidades | ~900 passos |
| **Placement** | Sugestões de metas e IEP | Templates |

### 1.3 Integração com Terapia ABA

VB-MAPP não substitui ABA, mas fornece:
- **Avaliação estruturada** de onde a criança está
- **Direcionamento** de quais habilidades ensinar
- **Medição** de progresso ao longo do tempo
- **Sugestões** de intervenções específicas

---

## 2. Estrutura Completa do VB-MAPP

### 2.1 Os 170 Marcos - Organização por Níveis

#### **Nível 1: 0-18 meses (85 marcos)**

**9 Domínios:**
1. **Mand** (Pedidos) - 5 marcos
2. **Tact** (Nomeação) - 5 marcos
3. **Listener Responding** (Compreensão) - 10 marcos
4. **Visual Perceptual/MTS** (Percepção Visual) - 5 marcos
5. **Independent Play** (Brincadeira Independente) - 5 marcos
6. **Social Skills** (Habilidades Sociais) - 5 marcos
7. **Motor Imitation** (Imitação Motora) - 10 marcos
8. **Echoic** (Repetição Vocal) - 5 marcos
9. **Spontaneous Vocal Behavior** (Comportamento Vocal Espontâneo) - 35 marcos

**Total Nível 1**: 85 marcos

#### **Nível 2: 18-30 meses (50 marcos)**

**8 Domínios:**
1. **Mand** - 7 marcos
2. **Tact** - 5 marcos
3. **Listener Responding** - 10 marcos
4. **Visual Perceptual/MTS** - 5 marcos
5. **LRFFC** (Listener por Função/Característica/Classe) - 5 marcos
6. **Intraverbal** (Conversação) - 5 marcos
7. **Classroom Routines/Group Skills** (Rotinas de Sala) - 5 marcos
8. **Linguistic Structure** (Estrutura Linguística) - 8 marcos

**Removidos**: Spontaneous Vocal Behavior
**Total Nível 2**: 50 marcos

#### **Nível 3: 30-48 meses (35 marcos)**

**11 Domínios:**
1. **Mand** - 3 marcos
2. **Tact** - 5 marcos
3. **Listener Responding** - 5 marcos
4. **Visual Perceptual/MTS** - 5 marcos
5. **LRFFC** - 5 marcos
6. **Intraverbal** - 5 marcos
7. **Classroom Routines/Group Skills** - 3 marcos
8. **Linguistic Structure** - 2 marcos
9. **Reading** (Leitura) - 2 marcos **[NOVO]**
10. **Writing** (Escrita) - 2 marcos **[NOVO]**
11. **Math** (Matemática) - 3 marcos **[NOVO]**

**Removidos**: Motor Imitation, Echoic
**Total Nível 3**: 35 marcos

**TOTAL GERAL**: 170 marcos

### 2.2 Detalhamento de Domínios Chave

#### MAND (Pedidos Funcionais)

**Progressão:**
- **L1-M1**: Emits 2 words/signs/PECS (pode requerer prompts)
- **L1-M5**: Mands for 20 different missing items in contrived situations
- **L2-M10**: Emits 15 different mands without prompts (exemplars across 2 prompt levels)
- **L2-M12**: Politely mands to stop or remove aversive stimuli 5x
- **L3-M15**: Mands for others to attend to intraverbal/social behavior 5x

**Característica**: Inicia com pedidos simples, evolui para pedidos complexos com múltiplas palavras e funções sociais.

#### TACT (Nomeação)

**Progressão:**
- **L1-T1**: Tacts 2 items (pessoas, pets, objetos favoritos)
- **L1-T5**: Tacts 10 items (objetos comuns, partes do corpo, imagens)
- **L2-T10**: Tacts 200 nouns AND/OR verbs total
- **L3-T12**: Tacts for others (shows and tacts items to peers)
- **L3-T15**: Tacts 4 different adjectives, prepositions, pronouns, etc. (15 total)

**Característica**: De nomeação básica para descrição complexa com múltiplas características.

#### LISTENER RESPONDING (Compreensão de Instruções)

**Progressão:**
- **L1-LR1**: Attends to speaker's voice by orienting towards speaker 5x
- **L1-LR5**: Selects correct item from array of 4 for 20 different objects/pictures
- **L2-LR10**: Discriminates 50+ objects/pictures in generalized settings
- **L3-LR12**: Follows 3-component directions 10x

**Característica**: De atenção básica para execução de instruções multi-componentes.

#### LRFFC (Listener por Função/Característica/Classe)

**Presente em**: Níveis 2 e 3

**Exemplos:**
- **Função**: "You eat with..." → criança seleciona garfo
- **Característica**: "Which one is red?" → seleciona objeto vermelho
- **Classe**: "Show me an animal" → seleciona qualquer animal

**Progressão L2→L3:**
- **L2-LRFFC6**: Selects 5 foods/drinks from array of 5 + 4 non-foods
- **L2-LRFFC8**: Answers 25 verb-noun LRFFC questions ("What do you ride?")
- **L3-LRFFC11**: 1000+ different LRFFC responses (acumulado)

---

## 3. Sistema de Pontuação

### 3.1 Milestones - Escala 0/0.5/1.0

```typescript
type MilestoneScore = 0 | 0.5 | 1.0;

interface ScoringCriteria {
  score: MilestoneScore;
  description: string;
  clinicalMeaning: string;
  examples: string[];
}

const MILESTONE_SCORING: ScoringCriteria[] = [
  {
    score: 0,
    description: "Marco não desenvolvido / sem resposta",
    clinicalMeaning: "Ausência completa da habilidade",
    examples: [
      "Criança não demonstra a habilidade mesmo com prompts completos",
      "Sem progresso observado em tentativas anteriores"
    ]
  },
  {
    score: 0.5,
    description: "Marco parcialmente desenvolvido",
    clinicalMeaning: "Habilidade emergente, requer assistência/prompts",
    examples: [
      "Criança executa com prompts verbais ou gestuais",
      "Resposta correta em 50-80% das tentativas",
      "Demonstra habilidade em contextos limitados"
    ]
  },
  {
    score: 1.0,
    description: "Marco totalmente desenvolvido",
    clinicalMeaning: "Resposta independente e precisa",
    examples: [
      "Criança executa sem prompts em 80%+ das tentativas",
      "Generaliza habilidade para diferentes contextos",
      "Mantém habilidade ao longo do tempo"
    ]
  }
];
```

**Critério Geral de Maestria**: 80% de acertos em 2-3 sessões consecutivas sem prompts.

### 3.2 Barriers - Escala 0-4

```typescript
type BarrierScore = 0 | 1 | 2 | 3 | 4;

interface BarrierScoringCriteria {
  score: BarrierScore;
  severity: string;
  intervention: string;
  priority: string;
}

const BARRIER_SCORING: BarrierScoringCriteria[] = [
  {
    score: 0,
    severity: "Sem barreira / não observado",
    intervention: "Monitoramento apenas",
    priority: "Nenhuma"
  },
  {
    score: 1,
    severity: "Barreira leve / ocasional",
    intervention: "Intervenção mínima / preventiva",
    priority: "Baixa"
  },
  {
    score: 2,
    severity: "Barreira moderada / frequente",
    intervention: "Intervenção regular necessária",
    priority: "Média"
  },
  {
    score: 3,
    severity: "Barreira severa / muito frequente",
    intervention: "Intervenção intensiva imediata",
    priority: "Alta"
  },
  {
    score: 4,
    severity: "Barreira crítica / constante",
    intervention: "Foco primário do plano de intervenção",
    priority: "Crítica"
  }
];
```

### 3.3 Transition - Escala 1-5

Avalia prontidão para ambientes educacionais:
- **1**: Não demonstra habilidade
- **2**: Habilidade emergente
- **3**: Demonstra com suporte
- **4**: Demonstra de forma independente
- **5**: Generaliza e mantém

---

## 4. As 24 Barreiras - Lista Completa

### 4.1 Categorização

#### **Grupo 1: Comportamentais (4 barreiras)**
- **B1**: Problemas de comportamento
- **B2**: Controle instrucional insuficiente
- **B21**: Comportamento obsessivo-compulsivo
- **B24**: Comportamento hiperativo

#### **Grupo 2: Operantes Verbais Defeituosos (5 barreiras)**
- **B3**: Mands defeituosos
- **B4**: Tacts defeituosos
- **B5**: Echoic defeituoso
- **B9**: Intraverbal defeituoso
- **B20**: Articulação defeituosa

#### **Grupo 3: Percepção e Discriminação (5 barreiras)**
- **B7**: Percepção visual/MTS defeituosa
- **B8**: Habilidades de ouvinte defeituosas
- **B13**: Scanning defeituoso
- **B14**: Discriminações condicionais defeituosas
- **B23**: Falha em fazer contato visual

#### **Grupo 4: Habilidades Sociais e Motoras (2 barreiras)**
- **B6**: Imitação defeituosa
- **B10**: Habilidades sociais defeituosas

#### **Grupo 5: Generalização e Aprendizagem (3 barreiras)**
- **B11**: Dependência de prompt
- **B12**: Scrolling (repetição de respostas)
- **B15**: Falha em generalizar

#### **Grupo 6: Motivação e Reforço (3 barreiras)**
- **B16**: Motivadores fracos
- **B17**: Requisito de resposta enfraquece MO
- **B18**: Dependência de reforçadores

#### **Grupo 7: Sensorial (2 barreiras)**
- **B19**: Autoestimulação
- **B22**: Defensividade sensorial

### 4.2 Barreiras Críticas - Detalhamento

#### **B11 - DEPENDÊNCIA DE PROMPT**

**Definição**: Criança só responde com ajuda constante

**Sinais**:
- Espera prompts antes de responder
- Não inicia respostas independentemente
- Regride quando prompts são removidos

**Exemplos Práticos**:
- Terapeuta: "O que é isso?" → Criança espera
- Terapeuta: "É uma..." → Criança completa "bola"
- Sem prompt inicial, não responde

**Intervenção**:
1. **Fading sistemático**: Reduzir prompts gradualmente
2. **Transfer trials**: Prompt completo → Prompt parcial → Independente
3. **Time delay**: Aumentar tempo antes do prompt
4. **Reforço diferencial**: Maior reforço para respostas independentes

---

#### **B12 - SCROLLING**

**Definição**: Repetição de múltiplas respostas até acertar

**Sinais**:
- Emite várias respostas em sequência
- Não aguarda confirmação
- Não discrimina qual resposta é correta

**Exemplos Práticos**:
- Terapeuta: "Que cor é essa?"
- Criança: "Azul... vermelho... verde... amarelo..." (continua até acertar)

**Intervenção**:
1. Ensinar "wait" ou "I don't know"
2. Reforçar apenas primeira resposta
3. Correção de erro se primeira resposta errada
4. Ensino de pausa reflexiva

---

#### **B15 - FALHA EM GENERALIZAR**

**Definição**: Habilidade não transfere para novos contextos

**Sinais**:
- Responde apenas com materiais de treino
- Não transfere para ambiente natural
- Regride quando pessoas/locais mudam

**Exemplos Práticos**:
- Nomeia "cachorro" apenas com imagem específica usada no treino
- Não reconhece cachorros reais ou outras imagens
- Manda "cookie" apenas na sala de terapia

**Intervenção**:
1. **Multiple exemplar training**: Usar variados exemplos desde início
2. **NET (Natural Environment Teaching)**: Ensinar em ambientes naturais
3. **Loose teaching**: Variar instruções, pessoas, materiais
4. **Generalization probes**: Testar regularmente em novos contextos

---

## 5. Registro de Sessões Diárias

### 5.1 Estrutura SOAP

**S - Subjective** (Subjetivo)
- Relatos de pais/cuidadores
- Estado emocional da criança
- Fatores contextuais (sono, alimentação, eventos)

**O - Objective** (Objetivo)
- O que foi feito (atividades, programas)
- O que foi diagnosticado (observações clínicas)
- Dados coletados (trials, comportamentos)

**A - Assessment** (Avaliação)
- Análise de progresso
- Padrões identificados
- Barreiras observadas

**P - Plan** (Plano)
- O que será feito na próxima sessão
- Ajustes no plano de intervenção
- Recomendações para casa

### 5.2 Discrete Trial Training (DTT) - Coleta de Dados

```typescript
interface DTTTrial {
  trialNumber: number;
  targetSkill: string;

  // Apresentação (Antecedent)
  sd: string; // Discriminative Stimulus (instrução)
  materials: string[];

  // Resposta (Behavior)
  response: "+" | "P" | "-" | "NR" | "A";
  latency: number; // segundos
  promptLevel: 0 | 1 | 2 | 3 | 4 | 5;

  // Consequência
  consequence: "R+" | "R+D" | "C" | "N" | "RD";
  reinforcer?: string;

  // Contexto
  timestamp: DateTime;
  environment: "table" | "natural" | "group";
}
```

**Legendas**:
- **Resposta**:
  - `+`: Correto independente
  - `P`: Correto com prompt
  - `-`: Incorreto
  - `NR`: Sem resposta (No Response)
  - `A`: Aproximação (parcialmente correto)

- **Prompt Level**:
  - `0`: Independente (sem ajuda)
  - `1`: Gestual (apontamento, gesto)
  - `2`: Verbal (dica verbal)
  - `3`: Model (demonstração)
  - `4`: Partial Physical (toque leve, guia parcial)
  - `5`: Full Physical (hand-over-hand completo)

- **Consequência**:
  - `R+`: Reforço imediato
  - `R+D`: Reforço atrasado
  - `C`: Correção (error correction)
  - `N`: Neutral (sem consequência)
  - `RD`: Redirecionamento

### 5.3 Tipos de Dados Coletados

#### **A. Aquisição de Habilidades**
- % de acertos
- Acertos consecutivos
- Acertos independentes (sem prompt)
- Trials até maestria
- Generalização (novos contextos)
- Manutenção (retenção ao longo do tempo)

#### **B. Comportamentos**
- **Frequência**: Contagem de ocorrências
- **Duração**: Tempo total do comportamento
- **Latência**: Tempo até primeira ocorrência
- **Intensidade**: Escala 1-5
- **ABC Data**: Antecedent → Behavior → Consequence

#### **C. Progresso em Marcos VB-MAPP**
- Score anterior vs atual
- Data de mudança
- Componentes parcialmente dominados (se 0.5)
- Task analysis steps concluídos

---

## 6. Modelo de Dados

### 6.1 TypeScript Interfaces

```typescript
// ========== MILESTONES ==========

interface Milestone {
  milestoneId: string; // "M-L1-Mand-1"
  level: 1 | 2 | 3;
  domain: MilestoneDomain;
  orderNumber: number;
  description: string;
  scoringCriteria: string;
  ageRange: string;
}

type MilestoneDomain =
  | "Mand"
  | "Tact"
  | "Listener Responding"
  | "Visual Perceptual/MTS"
  | "LRFFC"
  | "Intraverbal"
  | "Echoic"
  | "Motor Imitation"
  | "Independent Play"
  | "Social Skills"
  | "Classroom Routines/Group"
  | "Linguistic Structure"
  | "Spontaneous Vocal"
  | "Reading"
  | "Writing"
  | "Math";

interface MilestonesAssessment {
  assessmentId: string;
  childId: string;
  psychologistId: string;
  assessmentDate: Date;

  // Scores agregados
  level1Score: number;
  level2Score: number;
  level3Score: number;
  totalScore: number;

  // Scores individuais
  milestoneScores: Record<string, 0 | 0.5 | 1.0>;

  // Dados qualitativos
  partiallyMetDetails?: Record<string, string[]>; // {milestoneId: [componentes]}
  notes?: string;
}

// ========== BARRIERS ==========

interface Barrier {
  barrierId: string; // "B1", "B11"
  name: string;
  description: string;
  category: BarrierCategory;
  interventionGuidelines: string;
}

type BarrierCategory =
  | "Behavioral"
  | "Verbal Operants"
  | "Perceptual/Discrimination"
  | "Social/Motor"
  | "Generalization"
  | "Motivation"
  | "Sensory";

interface BarriersAssessment {
  assessmentId: string;
  childId: string;
  psychologistId: string;
  assessmentDate: Date;
  barrierScores: Record<string, 0 | 1 | 2 | 3 | 4>;
  criticalBarriers: string[]; // Barreiras com score 3-4
  notes?: string;
}

// ========== TASK ANALYSIS ==========

interface TaskAnalysisStep {
  stepId: string;
  milestoneId: string;
  stepNumber: number;
  description: string;
  status: "not_started" | "emerging" | "mastered";
  masteryDate?: Date;
  trialsData?: DTTTrial[];
}

interface SupportingSkill {
  skillId: string;
  name: string;
  description: string;
  domain: string;
  linkedMilestones: string[];
}

// ========== SESSIONS & DTT ==========

interface Session {
  sessionId: string;
  childId: string;
  psychologistId: string;
  sessionDate: Date;
  durationMinutes: number;
  sessionType: "assessment" | "intervention" | "NET" | "DTT" | "mixed";

  // SOAP Notes
  subjective?: string;
  objective: {
    whatWasDone: string;
    whatWasDiagnosed: string;
    dataCollected: string;
  };
  assessment?: string;
  plan: string; // whatWillBeDone

  // Parent Communication
  isSharedWithParent: boolean;
  parentSummary?: string;

  // Structured Data
  dttTrials?: DTTTrial[];
  behaviorIncidents?: BehaviorIncident[];
  milestonesWorked?: string[]; // Array de milestoneIds

  createdAt: Date;
}

interface DTTTrial {
  trialId: string;
  sessionId: string;
  goalId: string;
  milestoneId?: string; // Vinculado a marco VB-MAPP
  trialNumber: number;

  sd: string; // Discriminative stimulus
  response: "+" | "P" | "-" | "NR" | "A";
  latencySeconds: number;
  promptLevel: 0 | 1 | 2 | 3 | 4 | 5;
  consequence: "R+" | "R+D" | "C" | "N" | "RD";
  reinforcer?: string;

  environment: "table" | "natural" | "group";
  materials?: string;
  timestamp: Date;
}

interface BehaviorIncident {
  incidentId: string;
  childId: string;
  sessionId?: string;

  // ABC Data
  antecedent: string;
  behavior: string;
  consequence: string;

  // Measurements
  frequency?: number;
  durationMinutes?: number;
  latencySeconds?: number;
  intensity?: 1 | 2 | 3 | 4 | 5;

  setting: string;
  occurredAt: Date;
  notes?: string;
}

// ========== INTERVENTION ==========

interface InterventionGoal {
  goalId: string;
  planId: string;
  milestoneId?: string; // Vinculado a marco VB-MAPP
  description: string;
  targetBehavior: string;
  measurementCriteria: string;
  masteryCriteria: {
    criterion: "80%" | "90%" | "100%";
    consecutiveSessions: 2 | 3 | 4;
    probeSuccessRequired: boolean;
  };
  currentProgress: number; // Percentage
  status: "not_started" | "in_progress" | "mastered" | "on_hold";
  progressNotes?: string;
}
```

---

## 7. Fluxo de Trabalho UX

### 7.1 Avaliação VB-MAPP

```
1. INÍCIO DA AVALIAÇÃO
   ├─ Selecionar criança
   ├─ Tipo de avaliação (Milestones/Barriers/Transition)
   └─ Revisar última avaliação (se existir)

2. INTERFACE DE PONTUAÇÃO (Milestones)
   ├─ Navegação por nível/domínio
   │  ├─ [Nível 1] → [Mand] → M1, M2, M3, M4, M5
   │  ├─ [Nível 1] → [Tact] → T1, T2, T3, T4, T5
   │  └─ ... (continua)
   │
   ├─ Por cada marco:
   │  ├─ Exibir descrição completa
   │  ├─ Mostrar critérios de pontuação
   │  ├─ Botões: [0] [0.5] [1.0]
   │  ├─ Se 0.5: Campo "Componentes parcialmente dominados"
   │  └─ Campo de notas qualitativas
   │
   └─ Progresso visual
       ├─ Barra de progresso (% concluído)
       ├─ Score parcial por nível
       └─ Indicador de marcos faltantes

3. VISUALIZAÇÃO AUTOMÁTICA
   ├─ Gráfico radar (scores por domínio)
   ├─ Gráfico de linha (progresso temporal)
   ├─ Heat map (pontos fortes/fracos)
   └─ Lista de marcos-alvo sugeridos

4. SUGESTÕES DE INTERVENÇÃO
   ├─ Sistema analisa scores
   ├─ Identifica marcos próximos (scores 0.5)
   ├─ Sugere Task Analysis para marcos-alvo
   └─ Gera draft de plano de intervenção
```

### 7.2 Registro de Sessão com DTT

```
DURANTE A SESSÃO:

1. QUICK DATA ENTRY
   ├─ Tela simplificada (tablet-friendly)
   ├─ Por cada trial:
   │  ├─ Tap no objetivo (seleção rápida)
   │  ├─ Botões grandes: [+] [P] [-] [NR] [A]
   │  ├─ Se P: Quick select prompt level (0-5)
   │  └─ Auto-incrementa trial number
   │
   └─ Modo offline (sync depois)

2. ANÁLISE EM TEMPO REAL
   ├─ % correto atualiza automaticamente
   ├─ Gráfico de tendência (últimos 10 trials)
   ├─ Alerta se < 50% correto (sugerir break)
   └─ Contador de maestria (se atingir critério)

PÓS-SESSÃO:

3. COMPLETAR NOTAS SOAP
   ├─ Dados DTT já coletados (Objective)
   ├─ Preencher campos:
   │  ├─ Subjective (estado da criança)
   │  ├─ Objective - O que foi feito (texto)
   │  ├─ Objective - O que foi diagnosticado
   │  ├─ Assessment (análise)
   │  └─ Plan (próximos passos)
   │
   └─ [Opcional] Compartilhar com pais
       ├─ Sistema gera resumo automático
       ├─ Terapeuta edita/simplifica
       └─ Publica no portal dos pais
```

### 7.3 Dashboard Analítico

```
VISÃO GERAL DA CRIANÇA:

├─ Progresso VB-MAPP
│  ├─ Score total (L1 + L2 + L3)
│  ├─ Gráfico de evolução temporal
│  ├─ Comparação com faixa etária
│  └─ Marcos alcançados recentemente
│
├─ Metas Ativas
│  ├─ % de progresso por meta
│  ├─ Trials até maestria
│  ├─ Alertas (estagnação/regressão)
│  └─ Sugestões de ajuste
│
├─ Barreiras Identificadas
│  ├─ Score por barreira
│  ├─ Barreiras críticas (3-4)
│  └─ Plano de intervenção específico
│
└─ Comportamentos
    ├─ Frequência de comportamentos-alvo
    ├─ Frequência de comportamentos desafiadores
    ├─ Gráficos ABC (padrões)
    └─ Eficácia de intervenções
```

---

## 8. Plano de Implementação

### Fase 1: Foundation (Atual → 2 semanas)
- [x] Estrutura básica de sessões
- [ ] Adicionar campo `milestonesWorked` em Session
- [ ] Seed data: 170 marcos VB-MAPP
- [ ] Seed data: 24 barreiras
- [ ] Interface básica de avaliação de Milestones

### Fase 2: Core DTT (2-4 semanas)
- [ ] Modelo de dados DTT completo
- [ ] Interface de entrada rápida de trials
- [ ] Cálculos automáticos (% correto, tendências)
- [ ] Vinculação Session ↔ DTT Trials
- [ ] Critérios de maestria

### Fase 3: Task Analysis (4-6 semanas)
- [ ] Seed data: ~900 passos de task analysis
- [ ] Interface de breakdown de marcos
- [ ] Tracking granular de etapas
- [ ] Supporting Skills management

### Fase 4: Barriers & Transition (6-8 semanas)
- [ ] Interface de avaliação de barreiras
- [ ] Transition assessment
- [ ] Alertas automáticos (barreiras críticas)
- [ ] Sugestões de intervenção

### Fase 5: Analytics & Reports (8-12 semanas)
- [ ] Dashboard analítico completo
- [ ] Gráficos de progresso VB-MAPP
- [ ] Relatórios profissionais (PDF)
- [ ] Comparação temporal (avaliações)
- [ ] Detecção de padrões (platôs, regressões)

### Fase 6: Advanced (12+ semanas)
- [ ] Mobile app (entrada offline)
- [ ] Video upload/analysis
- [ ] Predictive analytics
- [ ] Token economy digital
- [ ] Integração com EHR

---

## 9. Referências

### Documentação Oficial
- **VB-MAPP Official**: https://marksundberg.com/vb-mapp/
- **AVB Press**: https://avbpress.com/
- **VB-MAPP App**: https://www.vbmappapp.com/

### Artigos Científicos
- "Implementing the VB-MAPP: Teaching Assessment Techniques" (PMC4883535)
- "Evaluating VB-MAPP Scores Using Principal Components Analysis" (PMC11385427)
- "Content Validity Evidence for VB-MAPP" (PMC7808702)
- "Mastery Criteria and Maintenance" (PMC7314871, PMC9120273, PMC5843573)

### Sistemas Existentes
- Motivity
- Alpaca Health
- Rethink BH
- Data Makes the Difference (VB-MAPP App)

---

**Última atualização**: 03/10/2025
**Próxima revisão**: Após Fase 1 completa
