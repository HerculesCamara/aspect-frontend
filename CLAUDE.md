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
**Estado**: ✅ **INTEGRADO COM BACKEND** - Sistema híbrido com fallback para mock

### Integração Backend:
- **API Client**: `lib/api.ts` com tipagens TypeScript completas
- **Endpoints**: `/api/Auth/login`, `/api/Auth/register`, `/api/Auth/validate-token`
- **Estratégia**: Tenta API real primeiro → fallback automático para dados mock
- **Autenticação**: JWT Bearer tokens persistidos no localStorage
- **Mapeamento**: Backend roles (Psychologist/Parent) → Frontend (psicologo/pai)

### Usuários Disponíveis:
```typescript
// API Real (Backend .NET)
email: "test@test.com"
senha: "123456"
role: "Psychologist"

// Mock Fallback
email: "ana.silva@exemplo.com" | "carlos@exemplo.com"
senha: "123456"
tipos: "psicologo" | "pai"
```

### Fluxo de Autenticação:
1. **Login**: API real → Store Zustand atualizado → Token salvo
2. **Fallback**: Se API falha → Usa dados mock transparentemente
3. **Inicialização**: `AuthProvider` valida token ao carregar página
4. **Redirecionamento**: Baseado em tipo de usuário
   - Psicólogo → `/dashboard`
   - Pai → `/meus-filhos`
5. **Proteção**: Rotas protegidas automaticamente

## 📊 Gerenciamento de Estado (Zustand)

### 1. auth-store.ts - ✅ INTEGRADO
- **Estratégia híbrida**: API real com fallback para mock
- **Funções**: `login()`, `logout()`, `initAuth()`
- **Estado**: `user`, `isUsingMockData`
- **Token**: Validação automática JWT + localStorage

### 2. crianca-store.ts - 🔄 PRÓXIMO PARA INTEGRAÇÃO
- **3 crianças mockadas** com dados completos
- Estrutura: `id`, `nome`, `idade`, `nivelVBMAPP`, `progresso`, `alertas`, `responsavel`, `informacoesMedicas`
- Funções: `fetchCriancas()`, `addCrianca()`, `getCriancaById()`
- **Backend disponível**: `/api/Children` (GET, POST, PUT, DELETE)

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

## 🧩 Conceitos Terapêuticos (VB-MAPP) - Sistema Completo

### Sistema VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program):
- **170 marcos de desenvolvimento** organizados em 3 níveis
- **Avaliação de 24 barreiras** de aprendizagem comuns
- **Análise de 18 áreas de transição** para ambientes educacionais
- **Análise de tarefas** para cada marco não desenvolvido
- **Habilidades de apoio** para acelerar o aprendizado

### Níveis de Desenvolvimento:
- **Nível 1**: 0-18 meses de desenvolvimento (marcos 1-85)
- **Nível 2**: 18-30 meses de desenvolvimento (marcos 86-135)
- **Nível 3**: 30-48 meses de desenvolvimento (marcos 136-170)

### Domínios de Avaliação (12 domínios):
1. **Mand** - Comunicação funcional/pedidos
2. **Tact** - Nomeação e descrição
3. **Listener Responding** - Compreensão de instruções
4. **Visual Perceptual/MTS** - Percepção visual e matching
5. **LRFFC** - Responder por função, característica e classe
6. **Intraverbal** - Conversação e resposta verbal
7. **Group & Motor** - Habilidades motoras e de grupo
8. **Echoic & Motor** - Imitação vocal e motora
9. **Spontaneous Vocal Behavior** - Comportamento vocal espontâneo
10. **Reading** - Leitura (Nível 3)
11. **Writing** - Escrita (Nível 3)
12. **Math** - Matemática (Nível 3)

### Sistema de Pontuação:
- **0**: Marco não desenvolvido
- **0.5**: Marco parcialmente desenvolvido
- **1**: Marco totalmente desenvolvido

### Avaliação de Barreiras (B1-B24):
- **Escala 0-4**: Severidade da barreira
- **Exemplos**: Problemas de comportamento, déficits de imitação, prompt dependence, etc.
- **Impacto**: Identifica obstáculos para aprendizagem

### Análise de Transição (18 áreas):
- **Classroom**: Habilidades para sala de aula
- **Play**: Habilidades de brincar
- **Social**: Interação social
- **Academic**: Habilidades acadêmicas
- **Self-care**: Autocuidado

### Sistema de Alertas Avançado:
- **Regressão**: Perda de marcos anteriormente dominados
- **Estagnação**: Ausência de progresso por período prolongado
- **Barreiras críticas**: Pontuação alta em barreiras (3-4)
- **Déficits por domínio**: Identificação de áreas específicas
- **Inconsistências**: Padrões atípicos de desenvolvimento

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

### Status de Integração:
- ✅ **Autenticação**: Integrada com backend .NET
- 🔄 **Children**: Próximo para integração (endpoints disponíveis)
- ⏳ **Activities**: Aguardando integração
- ⏳ **Reports**: Aguardando integração
- ⏳ **Assessments**: Aguardando integração

### Dados Mock (Fallback):
- **Nenhuma persistência real** - tudo reseta ao recarregar (apenas no modo mock)
- **Delays simulados** (1-1.5s) para simular requisições
- **Sistema híbrido**: API real quando disponível → fallback para mock

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
Este é um **sistema de acompanhamento terapêutico** para crianças com TEA **70% integrado** com backend .NET real.

### Estado Atual:
- ✅ **Frontend**: Completo com dados mock + API integration
- ✅ **Backend**: API .NET totalmente funcional
- ✅ **Integração**: Auth + Children 100% integrados
- 🔄 **Restante**: Atividades, Relatórios, Avaliações ainda em mock

### Arquivos de Documentação:
- **CLAUDE_METHODOLOGY.md**: Padrões e metodologia de desenvolvimento Claude
- **BACKEND_ISSUES.md**: Rastreamento técnico de problemas e soluções
- **WORKFLOW_ATUAL.md**: Status operacional atual do sistema
- **test-*.js**: Scripts de validação de integração backend
- `lib/api.ts`: Cliente API com tipagens para integração
- `Criação de software para VBMAP_.pdf`: Especificação completa do sistema VB-MAPP

### Estratégia Híbrida:
Implementada em todos os stores - tenta API real primeiro, com fallback automático para dados mock se a API falhar.

### ⚠️ Importante - Integração com Backend:
**O PDF serve como referência conceitual do VB-MAPP, mas o backend é sempre a fonte de verdade.**
- Usar o PDF para tirar dúvidas sobre conceitos terapêuticos
- Integrar apenas o que o backend realmente oferece via API
- Seguir padrões estabelecidos em CLAUDE_METHODOLOGY.md para consistência
- Manter abordagem incremental: testar → documentar → integrar