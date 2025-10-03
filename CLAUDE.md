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
│   ├── auth-store.ts              # Autenticação + Registro (NOVO)
│   ├── crianca-store.ts           # Gestão de crianças
│   ├── parent-store.ts            # Busca de responsáveis (NOVO - LGPD compliant)
│   ├── session-store.ts           # Sessões terapêuticas
│   ├── relatorio-store.ts         # Relatórios
│   ├── assessment-store.ts        # Avaliações VB-MAPP
│   ├── intervention-plan-store.ts # Planos de intervenção
│   ├── communication-store.ts     # Sistema de mensagens
│   └── atividade-store.ts         # Atividades (mock only)
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

### 1. auth-store.ts - ✅ 100% INTEGRADO
- **Estratégia híbrida**: API real com fallback para mock
- **Funções**: `login()`, `register()`, `logout()`, `initAuth()`
- **Estado**: `user`, `isUsingMockData`
- **Token**: Validação automática JWT + localStorage
- **Registro**: Sistema completo com validação de campos por role (Psychologist/Parent)

### 2. crianca-store.ts - ✅ 100% INTEGRADO
- **CRUD completo** com backend .NET
- Estrutura: `id`, `nome`, `idade`, `nivelVBMAPP`, `progresso`, `alertas`, `responsavel`, `informacoesMedicas`
- Funções: `fetchCriancas()`, `addCrianca()`, `updateCrianca()`, `deleteCrianca()`, `getCriancaById()`
- **Backend**: `/api/Children` (GET, POST, PUT, DELETE)
- Mapeamento bidirecional completo
- **Integração com parent-store**: Busca responsável por primaryParentId

### 3. parent-store.ts - ✅ NOVO - LGPD COMPLIANT
- **Busca por email**: Sistema de pesquisa de responsáveis sem listagem completa
- **Funções**: `searchParentByEmail()`, `fetchParents()`, `getParentById()`, `clearSearch()`
- **Estado**: `parents[]`, `searchedParent`, `isSearching`, `isUsingMockData`
- **LGPD**: Não exibe lista completa de pais, apenas busca por email específico
- **Debounce**: 500ms para evitar requisições excessivas
- **Mock data**: 3 responsáveis de exemplo para testes

### 4. session-store.ts - ✅ 100% INTEGRADO
- **CRUD de sessões** terapêuticas
- Notas estruturadas (o que foi feito, diagnosticado, próximos passos)
- Sistema de compartilhamento com pais
- **Backend**: `/api/Sessions`

### 4. relatorio-store.ts - ✅ 100% INTEGRADO
- **Geração automática** de relatórios
- Download de PDF pelo backend
- Estatísticas integradas (sessões, avaliações, metas)
- **Backend**: `/api/Reports`

### 5. assessment-store.ts - ✅ 100% INTEGRADO
- **Sistema VB-MAPP completo** (170 marcos)
- 3 tipos: Milestones, Barriers, Transition
- Progress data consolidado
- **Backend**: `/api/Assessments`

### 6. intervention-plan-store.ts - ✅ 100% INTEGRADO
- **Planos de intervenção** com metas
- Status e períodos
- **Backend**: `/api/InterventionPlans`

### 7. communication-store.ts - ✅ Frontend completo, ❌ Backend bloqueado
- **Sistema de mensagens** entre psicólogo e pais
- Contador de não lidas
- **Backend**: `/api/Communication` (erro crítico de acesso)
- Funciona 100% em modo mock

### 8. atividade-store.ts - 🔄 Apenas Mock
- **5 atividades terapêuticas** pré-definidas
- Categorias: cognitivo, linguagem, motor, social
- **Backend não existe** - 100% mock

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

### Status de Integração (Atualizado 24/09/2025):
- ✅ **Autenticação**: 100% integrado
- ✅ **Children**: 100% integrado
- ✅ **Sessions**: 100% integrado
- ✅ **Reports**: 100% integrado
- ✅ **Assessments**: 100% integrado (VB-MAPP completo)
- ✅ **InterventionPlans**: 100% integrado
- ❌ **Communication**: Backend bloqueado (acesso negado) - funciona em mock
- ❌ **Activities**: Backend não existe - funciona em mock

### Dados Mock (Fallback):
- **Nenhuma persistência real** - tudo reseta ao recarregar (apenas no modo mock)
- **Delays simulados** (1-1.5s) para simular requisições
- **Sistema híbrido**: API real quando disponível → fallback para mock

### Funcionalidades Incompletas:
- **Gráficos**: Recharts desabilitado (incompatibilidade React 19)
- **Communication**: Backend com erro de validação de acesso (funciona em mock)
- **Activities**: Backend não implementado (funciona em mock)
- **Upload**: Interfaces prontas mas não funcionais

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
Este é um **sistema de acompanhamento terapêutico** para crianças com TEA **~90% integrado** com backend .NET real.

### Estado Atual (24/09/2025):
- ✅ **Frontend**: Completo com dados mock + API integration
- ✅ **Backend**: API .NET totalmente funcional
- ✅ **Integração Completa (6 módulos)**:
  - Auth ✅
  - Children ✅
  - Sessions ✅
  - Reports ✅
  - Assessments ✅
  - InterventionPlans ✅
- ❌ **Communication**: Frontend pronto, backend bloqueado (erro de acesso)
- ❌ **Activities**: Backend não existe (funciona em mock)

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

## 🆕 Implementações Recentes

### **Sessão 03/10/2025 - Validações com Zod + Correção CORS**

#### 1. Sistema de Validação com Zod ✅
- **Arquivos criados**:
  - `lib/validations/auth.ts` - Schemas de autenticação
  - `lib/validations/child.ts` - Schemas de crianças
- **Benefícios**:
  - Código 50% mais limpo (20+ linhas → 11 linhas)
  - Type-safe com inferência automática
  - Mensagens de erro customizadas
  - Transform automático (string vazia → undefined)
  - Validação de contactNumber (máximo 20 caracteres)
- **Schemas implementados**:
  - `registrationSchema` - Registro de Psychologist/Parent
  - `createChildSchema` - Criação de crianças
  - `parentEmailSchema` - Validação de email

#### 2. Correção CORS Backend ✅
- **Problema**: Frontend rodando em porta 3001, CORS bloqueava requisições
- **Solução**: Adicionado `http://localhost:3001` em `Program.cs`
- **Status**: Resolvido - Frontend se comunica com backend sem erros

#### 3. Correção Bug contactNumber ✅
- **Problema**: Campo vazio enviava string `""` ao invés de `undefined`
- **Backend rejeitava**: Erro "ContactNumber must be maximum 20 characters"
- **Solução**: Transform em Zod + `.trim() || undefined`
- **Status**: Registros funcionando 100%

#### 4. Fluxo Completo Validado ✅
- ✅ Cadastro de Psicólogo com backend
- ✅ Cadastro de Parent com backend
- ✅ Busca de Parent por email
- ✅ Criação de criança vinculando Parent
- ✅ Token JWT funcionando corretamente

---

### **Sessão 27/09/2025 - Sistema de Registro**

#### 1. Sistema de Registro de Usuários
- **Arquivo**: `app/registro/page.tsx` (NOVO)
- **Funcionalidade**: Cadastro de novos usuários (Psychologist/Parent)
- **Integração**: `auth-store.ts` - função `register()` adicionada
- **Campos condicionais**: Campos específicos por role
- **Validação**: Email, senha, confirmação de senha

#### 2. Parent Store - Busca LGPD Compliant
- **Arquivo**: `store/parent-store.ts` (NOVO)
- **Funcionalidade**: Busca de responsáveis por email (sem listagem completa)
- **LGPD**: Não exibe lista de todos os pais por questões de privacidade
- **Debounce**: 500ms para evitar requisições excessivas
- **Mock Data**: 3 responsáveis de exemplo para testes

#### 3. Reformulação da Criação de Crianças
- **Arquivo**: `app/criancas/nova/page.tsx` (REESCRITO)
- **Mudança**: Dropdown de pais → Busca por email
- **Integração**: Com parent-store para busca de responsáveis
- **UX**: Validação em tempo real, feedback visual
- **Debounce**: 800ms para busca de responsáveis

## ✅ Sessão 30/09/2025 - Parent Endpoint: Integração Parcial

### Progresso:
1. **Endpoint `/api/Parents/get-id-by-email` implementado** ✅
   - Backend funcionando corretamente
   - Busca responsáveis por email (LGPD compliant)
   - Role "Parent" (EN) funcionando

2. **Frontend integrado** ✅
   - `lib/api.ts`: Tipagem completa do endpoint
   - `store/parent-store.ts`: Implementação limpa sem workarounds
   - `app/criancas/nova/page.tsx`: Busca de responsável com debounce

3. **Testes realizados** ✅
   - Registro de Parent: ✅ Funciona (cria User + Parent)
   - Busca por email: ✅ Funciona (retorna dados do responsável)
   - Criação de criança via API: ✅ Funciona (com userId correto)

### 🚨 Problema Identificado - BLOQUEIO CRÍTICO:

**Issue**: Endpoint retorna `parentId` mas `ChildService` precisa de `userId`

**Impacto**: Não é possível cadastrar crianças pela interface (frontend)

**Causa**:
- Backend retorna: `{ parentId, firstName, lastName, email, relationship, fullName }`
- Backend **NÃO retorna**: `userId`
- `ChildService.CreateChildAsync()` espera `primaryParentId` como **userId**, não parentId

**Solução pendente** (backend):
```csharp
// Controllers/ParentsController.cs (linha ~65)
return Ok(new {
    parentId = parent.ParentId,
    userId = parent.UserId,  // ← ADICIONAR
    // ... demais campos
});
```

**Nota**: `ParentService` JÁ busca o userId, apenas falta expor na API.

### Arquivos Modificados:
- `lib/api.ts` - Tipagem com `userId?: string` (preparado para correção)
- `store/parent-store.ts` - Interface `Parent` com `id` (userId) + `parentId`
- Documentação atualizada: `BACKEND_ISSUES.md`

### Status Final:
- ✅ **Backend endpoint**: Funcional (falta apenas userId no retorno)
- ✅ **Frontend**: Integrado e pronto
- 🔴 **Bloqueio**: Aguardando correção backend para cadastro de crianças
- ✅ **Workaround**: Criação via API direta funciona (com userId manual)