# ASPCT Software Frontend - Contexto para Claude

## 🔍 Visão Geral do Projeto
Sistema de acompanhamento terapêutico para crianças com TEA (Transtorno do Espectro Autista), desenvolvido em Next.js 15 com React 19. Aplicação frontend que simula um sistema completo de gestão terapêutica com dados mock.

## 📋 Stack Tecnológica
- **Framework**: Next.js 15.2.4 (App Router)
- **React**: v19 
- **TypeScript**: Totalmente tipado
- **Styling**: Tailwind CSS + shadcn/ui (30+ componentes)
- **Estado**: Zustand para gerenciamento global
- **UI**: Design system baseado em CSS variables
- **Tema**: Suporte claro/escuro (next-themes)
- **Ícones**: Lucide React
- **Notificações**: Sonner toast
- **Build**: Configuração otimizada para desenvolvimento (erros TS/ESLint ignorados)

## 🏗️ Estrutura de Pastas
```
├── app/                    # Pages (App Router)
│   ├── layout.tsx         # Layout raiz com providers
│   ├── page.tsx           # Redirect para /login
│   ├── login/             # Sistema de autenticação
│   ├── dashboard/         # Dashboard do psicólogo
│   ├── criancas/          # CRUD de crianças
│   ├── atividades/        # Sistema de atividades terapêuticas
│   ├── relatorios/        # Geração de relatórios
│   ├── meus-filhos/       # Vista dos pais
│   └── progresso/[id]/    # Progresso individual
├── components/
│   ├── ui/                # shadcn/ui components (30+)
│   ├── layout/            # AppShell (navegação + auth)
│   └── theme-provider.tsx # Provider de tema
├── store/                 # Stores Zustand
│   ├── auth-store.ts     # Autenticação
│   ├── crianca-store.ts  # Gestão de crianças
│   ├── atividade-store.ts # Atividades terapêuticas
│   └── relatorio-store.ts # Relatórios
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
└── styles/               # CSS global
```

## 🔐 Sistema de Autenticação
**Estado**: Implementado com dados mock via Zustand

### Usuários Disponíveis:
```typescript
// Psicólogo (acesso completo)
email: "ana.silva@exemplo.com"
senha: "123456"

// Pai/Responsável (acesso limitado) 
email: "carlos@exemplo.com"
senha: "123456"
```

### Fluxo de Autenticação:
1. Login → Store Zustand atualizado
2. `AppShell` verifica autenticação
3. Redirecionamento baseado em tipo de usuário:
   - Psicólogo → `/dashboard`
   - Pai → `/meus-filhos`
4. Proteção de rotas automática

## 📊 Gerenciamento de Estado (Zustand)

### 1. auth-store.ts
- Gerencia usuário logado
- Funções: `login()`, `logout()`
- Dados mock de 2 usuários

### 2. crianca-store.ts
- **3 crianças mockadas** com dados completos
- Estrutura: `id`, `nome`, `idade`, `nivelVBMAPP`, `progresso`, `alertas`, `responsavel`, `informacoesMedicas`
- Funções: `fetchCriancas()`, `addCrianca()`, `getCriancaById()`

### 3. atividade-store.ts  
- **5 atividades terapêuticas** pré-definidas
- Categorias: cognitivo, linguagem, motor, social
- Estrutura: objetivos, materiais, passos, adaptações, duração, nivelVBMAPP
- Funções: `fetchAtividades()`, `criarAtividade()`

### 4. relatorio-store.ts
- **3 relatórios de exemplo** (mensal, trimestral, avaliação)
- Estrutura: resumo, marcos alcançados, recomendações casa/escola
- Funções: `fetchRelatorios()`, `gerarRelatorio()`

## 🎯 Funcionalidades Principais

### Para Psicólogos:
- **Dashboard**: Métricas, progresso geral, alertas
- **Gestão de Crianças**: CRUD completo, filtros, busca
- **Atividades**: Biblioteca estruturada, criação/aplicação
- **Relatórios**: Geração por criança, diferentes tipos
- **Navegação**: Sidebar completa com todos os módulos

### Para Pais/Responsáveis:
- **Meus Filhos**: Lista filtrada por responsável
- **Progresso**: Visualização read-only do desenvolvimento
- **Relatórios**: Acesso aos relatórios dos filhos
- **Navegação**: Menu simplificado

## 🧩 Conceitos Terapêuticos (VB-MAPP)

### Níveis de Desenvolvimento:
- **Nível 1**: 0-18 meses de desenvolvimento
- **Nível 2**: 18-30 meses de desenvolvimento  
- **Nível 3**: 30-48 meses de desenvolvimento

### Domínios de Progresso:
- **Linguagem**: Comunicação verbal e não-verbal
- **Social**: Interação e habilidades sociais
- **Motor**: Desenvolvimento motor grosso e fino

### Sistema de Alertas:
- Detecta possível regressão no desenvolvimento
- Exibido com badges vermelhas
- Integrado ao dashboard e listagens

## 🎨 Padrões de UI/UX

### Design System:
- **Cards**: Padrão para exibição de dados
- **Tabs**: Organização de conteúdo complexo
- **Tables + Cards**: Views alternativas para listas
- **Progress Bars**: Visualização de progresso
- **Badges**: Status e categorização
- **Filtros**: Select dropdowns para busca

### Navegação:
- **AppShell**: Layout consistente com sidebar
- **Breadcrumbs**: Navegação hierárquica
- **Mobile**: Sheet sidebar para responsividade

### Estados:
- **Loading**: Skeletons e spinners
- **Empty States**: Placeholders informativos
- **Error States**: Tratamento com redirecionamento

## ⚠️ Limitações e Observações Importantes

### Dados Mock:
- **Nenhuma persistência real** - tudo reseta ao recarregar
- **Delays simulados** (1-1.5s) para simular requisições
- **Dados estáticos** - não há API backend

### Funcionalidades Incompletas:
- **Gráficos**: Recharts desabilitado (incompatibilidade React 19)
- **Sessões**: Referenciadas mas não implementadas
- **Upload**: Interfaces prontas mas não funcionais
- **Relatórios PDF**: Não implementado

### Configuração de Build:
- ESLint/TypeScript errors **ignorados** durante build
- Imagens **não otimizadas**
- Foco em desenvolvimento/prototipagem

## 🚀 Comandos Principais

```bash
# Desenvolvimento
npm run dev          # Inicia servidor local (porta 3000)

# Build e Deploy  
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Executa linting (configurado mas ignorado no build)
```

## 🔧 Configurações Importantes

### next.config.mjs:
- Build errors ignorados para desenvolvimento
- Imagens não otimizadas
- ESLint desabilitado no build

### tailwind.config.ts:
- Design tokens customizados
- Suporte a modo escuro
- Animações personalizadas

### components.json:
- Configuração shadcn/ui
- Path aliases configurados
- Lucide como biblioteca de ícones

## 📝 Como Executar Modificações

### Para adicionar novas funcionalidades:
1. **Sempre verificar os stores** para entender os dados disponíveis
2. **Seguir padrões existentes** de UI/UX
3. **Usar componentes shadcn/ui** já disponíveis
4. **Implementar loading/error states** consistentes
5. **Testar com dados mock** existentes

### Para modificar dados:
1. **Editar os arrays mock** nos stores correspondentes
2. **Manter estrutura TypeScript** existente
3. **Simular delays de rede** para realismo

### Para adicionar páginas:
1. **Usar App Router** (pasta app/)
2. **Implementar AppShell** para navegação
3. **Seguir padrão de loading/error** 
4. **Configurar proteção de rota** se necessário

## 🎯 Contexto de Uso
Este é um **sistema de prototipagem/demonstração** para acompanhamento terapêutico de crianças com TEA. Foco na experiência do usuário e validação de conceitos, com dados mock realistas. Pronto para ser conectado a um backend real mantendo toda a estrutura frontend.