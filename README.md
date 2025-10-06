# 🧩 ASPCT Software - Frontend

> Sistema de acompanhamento terapêutico para crianças com TEA (Transtorno do Espectro Autista)

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📋 Sobre o Projeto

O **ASPCT Software** é uma plataforma web completa para gestão de acompanhamento terapêutico de crianças com Transtorno do Espectro Autista (TEA), baseada no método **VB-MAPP** (Verbal Behavior Milestones Assessment and Placement Program).

### ✨ Principais Funcionalidades

- 🔐 **Sistema de Autenticação** - JWT com roles (Psicólogo/Responsável)
- 👶 **Gestão de Crianças** - CRUD completo com informações médicas e progresso
- 📊 **Avaliações VB-MAPP** - 170 marcos de desenvolvimento em 3 níveis
- 📝 **Sessões Terapêuticas** - Registro detalhado com notas estruturadas
- 📈 **Relatórios** - Geração automática com download em PDF
- 🎯 **Planos de Intervenção** - Metas e acompanhamento de progresso
- 💬 **Comunicação** - Sistema de mensagens entre psicólogo e responsáveis
- 🎨 **Atividades Terapêuticas** - Biblioteca de atividades por categoria

---

## 🏗️ Arquitetura

### Stack Tecnológico

- **Framework**: Next.js 15.2.4 (App Router)
- **Runtime**: React 19
- **Linguagem**: TypeScript (100% tipado)
- **Estilização**: Tailwind CSS + shadcn/ui (30+ componentes)
- **Estado**: Zustand (9 stores com estratégia híbrida API/Mock)
- **Validações**: Zod schemas
- **Tema**: next-themes (claro/escuro)
- **Notificações**: Sonner toast
- **Ícones**: Lucide React

### Integração Backend

**Status**: 🟢 **90% Integrado** com backend .NET

| Módulo | Status | Backend |
|--------|--------|---------|
| Autenticação | ✅ 100% | `/api/Auth` |
| Crianças | ✅ 100% | `/api/Children` |
| Responsáveis | ✅ 100% | `/api/Parents` |
| Sessões | ✅ 100% | `/api/Sessions` |
| Relatórios | ✅ 100% | `/api/Reports` |
| Avaliações | ✅ 100% | `/api/Assessments` |
| Planos de Intervenção | ✅ 100% | `/api/InterventionPlans` |
| Comunicação | 🔴 Bloqueado | `/api/Communication` (erro backend) |
| Atividades | ⚪ Mock | Sem backend |

**Estratégia Híbrida**: Sistema implementa fallback automático para dados mock quando API não está disponível, garantindo desenvolvimento contínuo.

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Backend .NET rodando em `http://localhost:5175` (opcional para desenvolvimento)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/aspect-frontend.git
cd aspect-frontend

# Instale as dependências
npm install

# Configure variáveis de ambiente (opcional)
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

### Build para Produção

```bash
npm run build
npm run start
```

---

## 📁 Estrutura do Projeto

```
aspect-frontend/
├── app/                      # App Router (Next.js 15)
│   ├── login/                # Sistema de autenticação
│   ├── registro/             # Cadastro de usuários
│   ├── dashboard/            # Dashboard do psicólogo
│   ├── criancas/             # CRUD de crianças
│   ├── meus-filhos/          # Vista dos responsáveis
│   └── ...
├── components/
│   ├── ui/                   # shadcn/ui components (30+)
│   └── layout/               # AppShell com navegação
├── store/                    # Zustand stores (9 módulos)
│   ├── auth-store.ts         # Autenticação + Registro
│   ├── crianca-store.ts      # Gestão de crianças
│   ├── parent-store.ts       # Busca de responsáveis
│   ├── session-store.ts      # Sessões terapêuticas
│   └── ...
├── lib/
│   ├── api.ts                # Cliente HTTP com tipagens
│   ├── validations/          # Schemas Zod
│   └── utils/                # Utilitários (formatadores, etc)
├── public/                   # Arquivos estáticos
└── styles/                   # CSS global
```

---

## 🎯 Funcionalidades Detalhadas

### Para Psicólogos

- ✅ Dashboard com métricas e progresso geral
- ✅ Gestão completa de crianças (CRUD)
- ✅ **Sistema de Sessões Diárias** (NOVO):
  - Registro detalhado de sessões terapêuticas
  - Anotações clínicas estruturadas
  - Compartilhamento opcional com pais
  - Estatísticas e busca avançada
- ✅ Avaliações VB-MAPP (170 marcos em 3 níveis)
- ✅ Criação de planos de intervenção com metas
- ✅ Geração de relatórios automáticos (PDF)
- ✅ Biblioteca de atividades terapêuticas
- 🔴 Sistema de mensagens (bloqueado - aguardando fix backend)

### Para Responsáveis

- ✅ Visualização dos filhos cadastrados
- ✅ Acompanhamento de progresso (VB-MAPP)
- ✅ Acesso a relatórios terapêuticos
- ✅ Histórico de sessões compartilhadas
- 🔴 Mensagens com psicólogo (bloqueado - aguardando fix backend)

### Sistema VB-MAPP

- **170 marcos de desenvolvimento** organizados em 3 níveis
- **24 barreiras de aprendizagem** avaliadas
- **18 áreas de transição** para ambientes educacionais
- **12 domínios**: Mand, Tact, Listener Responding, Visual Perceptual, LRFFC, Intraverbal, Group & Motor, Echoic & Motor, Spontaneous Vocal, Reading, Writing, Math
- **Sistema de alertas** para regressão, estagnação e barreiras críticas

---

## 🔒 Autenticação e Segurança

### Sistema de Login

```typescript
// Credenciais de teste (backend)
Psicólogo: test@test.com / 123456
Pai: (criar via /registro)

// Credenciais mock (desenvolvimento)
Psicólogo: ana.silva@exemplo.com / 123456
Pai: carlos@exemplo.com / 123456
```

### Segurança Implementada

- ✅ JWT Bearer tokens
- ✅ Proteção de rotas por role
- ✅ Tokens persistidos em localStorage
- ✅ Validação de token ao carregar aplicação
- ✅ Redirecionamento automático por tipo de usuário
- ✅ LGPD Compliant (busca de responsáveis sem listagem completa)

---

## ✅ Validações e UX

### Validações com Zod

```typescript
// Registro com validação por role
const registrationSchema = z.discriminatedUnion('role', [
  psychologistRegistrationSchema,
  parentRegistrationSchema,
])

// Validação de criança
const createChildSchema = z.object({
  nome: z.string().min(2).refine(/* nome completo */),
  dataNascimento: z.string().refine(/* idade válida */),
  // ...
})
```

### Formatação Automática

- ✅ **Telefone**: `(XX) XXXXX-XXXX` (Brasil)
- ✅ **Data**: `DD/MM/YYYY`
- ✅ **CPF**: `XXX.XXX.XXX-XX` (futuro)

### Feedback Visual

- ✅ Loading states com Skeleton
- ✅ Toast notifications (Sonner)
- ✅ Validação em tempo real
- ✅ Estados de erro bem definidos
- ✅ Indicadores de progresso

---

## 📚 Documentação Técnica

Para desenvolvedores que querem contribuir ou entender o projeto em profundidade:

- **[CLAUDE.md](./CLAUDE.md)** - Contexto completo do projeto, stack tecnológica, padrões de código
- **[BACKEND_ISSUES.md](./BACKEND_ISSUES.md)** - Rastreamento de problemas de integração backend
- **[WORKFLOW_ATUAL.md](./WORKFLOW_ATUAL.md)** - Status operacional e fluxos do sistema

---

## 🐛 Problemas Conhecidos

### 🔴 Críticos

1. **Communication endpoint bloqueado** - Sistema de mensagens inoperante (erro backend)
2. **Gráficos desabilitados** - Recharts incompatível com React 19 (migração para Tremor pendente)

### 🟡 Melhorias Planejadas

1. Endpoint `/api/Auth/me` para dados completos após refresh
2. Validação em tempo real em todos os formulários
3. Integração de dados completos de responsável em listagens
4. Sistema de refresh token
5. Testes unitários (Vitest)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: manutenção
```

---

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.

---

## 👥 Equipe

- **Frontend**: Desenvolvido com Next.js 15 + React 19
- **Backend**: .NET Core com SQL Server
- **Metodologia**: Desenvolvimento ágil com Claude Code assistance

---

## 📞 Contato

Para dúvidas ou sugestões sobre o projeto, entre em contato através dos issues do GitHub.

---

<div align="center">

**🧩 ASPCT Software** - Transformando o acompanhamento terapêutico de crianças com TEA

![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)
![Powered by React](https://img.shields.io/badge/Powered%20by-React%2019-blue?style=for-the-badge&logo=react)

</div>
