# 🧠 Metodologia Claude para Projeto ASPCT

## 📋 Padrões de Documentação e Raciocínio

Este documento define os **padrões de pensamento, documentação e abordagem** que estou seguindo no projeto ASPCT. Serve como **memória institucional** para manter consistência entre sessões e garantir que futuras interações mantenham o mesmo nível de qualidade e organização.

---

## 🎯 Filosofia de Abordagem

### **1. Análise Antes da Ação**
- ✅ **SEMPRE** ler arquivos relevantes antes de fazer modificações
- ✅ **SEMPRE** entender o contexto completo antes de sugerir soluções
- ✅ **SEMPRE** verificar estruturas existentes e seguir padrões estabelecidos
- ❌ **NUNCA** assumir sem verificar
- ❌ **NUNCA** criar novos padrões quando já existem

### **2. Estratégia "Híbrida API + Mock"**
```typescript
// Padrão que defini e mantenho em todos os stores:
async fetchData() {
  try {
    // 1. Tentar API real primeiro
    const realData = await api.getRealData()
    set({ data: realData, isUsingMockData: false })
  } catch (error) {
    console.warn("API failed, using mock data:", error)

    // 2. Fallback para dados mock
    set({ data: mockData, isUsingMockData: true })
  }
}
```

**Rationale:** Permite desenvolvimento contínuo sem quebrar, transição gradual, e melhor UX.

### **3. TodoWrite como Ferramenta Central**
- 🎯 **Uso proativo** para todas as tarefas com 3+ passos
- 🎯 **Atualização em tempo real** (in_progress → completed)
- 🎯 **Máximo 1 tarefa in_progress** por vez
- 🎯 **Descrições claras** com forms ativo/passivo

---

## 📁 Estrutura de Documentação Criada

### **1. CLAUDE.md** - Contexto Principal
- **Propósito**: Visão geral do projeto, stack, funcionalidades
- **Atualização**: A cada nova funcionalidade integrada
- **Foco**: Orientar desenvolvimento futuro e onboarding

### **2. BACKEND_ISSUES.md** - Rastreamento Técnico
- **Propósito**: Problemas, soluções, status de integração
- **Estrutura**:
  ```markdown
  ## 🚨 Problemas Encontrados
  ## ❓ Dúvidas Técnicas
  ## 📋 Estrutura da API Descoberta
  ## 🔄 Status dos Testes
  ## 📝 Próximos Passos
  ```
- **Rationale**: Memória técnica detalhada, útil para debugging

### **3. WORKFLOW_ATUAL.md** - Status Operacional
- **Propósito**: Estado atual do sistema, fluxos funcionando
- **Foco**: Visão executiva de "o que funciona agora"
- **Inclui**: Diagramas mermaid, tabelas de status, métricas

### **4. CLAUDE_METHODOLOGY.md** (este arquivo)
- **Propósito**: Metadocumentação sobre minha abordagem
- **Foco**: Garantir consistência entre sessões

---

## 🔍 Processo de Análise de Problemas

### **1. Investigação Sistemática**
```
1. Ler error logs/mensagens
2. Analisar código backend relacionado
3. Verificar estruturas de dados
4. Testar hipóteses com scripts
5. Documentar descobertas
6. Implementar solução
7. Testar solução
8. Atualizar documentação
```

### **2. Exemplo Real: "Psicólogo não encontrado"**
- **Erro identificado**: API retornando erro específico
- **Análise**: Leitura de AuthService.cs, User.cs, Psychologist.cs
- **Root cause**: Objects criados mas não salvos no DB
- **Solução**: Backend developer fix com context injection
- **Teste**: Scripts de validação criados
- **Documentação**: BACKEND_ISSUES.md atualizado

### **3. Padrão de Nomenclatura de Arquivos de Teste**
```
test-{funcionalidade}-{contexto}.js
- test-fixed-register.js
- test-create-parent-and-child.js
- test-create-child.js
- decode-jwt.js
```

---

## 🏗️ Padrões Arquiteturais

### **1. Integração Backend-Frontend**
```typescript
// Padrão de mapeamento bidirecional sempre implementado:
function mapBackendToFrontend(backendData): FrontendData { }
function mapFrontendToBackend(frontendData): BackendData { }
```

### **2. Estrutura de API Client**
```typescript
// lib/api.ts - Centralizado e tipado
export const api = {
  // Auth
  registerUser: (data: RegisterRequest): Promise<AuthResponse>
  loginUser: (data: LoginRequest): Promise<AuthResponse>

  // Children
  getChildren: (): Promise<ChildResponse[]>
  createChild: (data: ChildCreateRequest): Promise<ChildResponse>
  // ... etc
}
```

### **3. Stores Zustand com Estado Híbrido**
```typescript
interface StoreState {
  data: DataType[]
  isUsingMockData: boolean  // Flag para indicar source

  fetchData: () => Promise<void>  // Híbrido API+Mock
  addData: (item) => Promise<void>
  // ... etc
}
```

---

## 🎨 Padrões de Código e Estilo

### **1. TypeScript Rigoroso**
- ✅ Interfaces explícitas para todas as estruturas de dados
- ✅ Mapeamento de tipos backend ↔ frontend
- ✅ Evitar `any` exceto em mapeamentos temporários

### **2. Tratamento de Erros**
```typescript
// Padrão que sempre sigo:
try {
  const result = await api.call()
  // sucesso
} catch (error) {
  console.warn("API failed, using fallback:", error)
  // fallback strategy
}
```

### **3. Logging Consistente**
```javascript
// Em testes de API:
console.log('🧪 Testando funcionalidade...')
console.log('📝 Dados enviados:', data)
console.log('📊 Status response:', status)
console.log('✅ SUCCESS:', result)
console.log('❌ Erro:', error)
```

---

## 📊 Sistema de Status e Tracking

### **1. Emojis Padronizados**
- ✅ = Funcionando/Completo
- 🔄 = Em progresso/Mock data
- ❌ = Com problemas/Não funciona
- ⏳ = Não testado ainda
- 🎯 = Objetivo/Meta
- 🚨 = Problema crítico
- 📝 = Documentação/Notas

### **2. Tabelas de Status**
```markdown
| Módulo | Backend API | Frontend Store | UI Components | Status |
|--------|-------------|----------------|---------------|--------|
| Auth   | ✅          | ✅             | ✅            | 100%   |
```

### **3. Categorização de Problemas**
- **🚨 Problemas Encontrados**: Bugs ativos que impedem funcionalidade
- **❓ Dúvidas Técnicas**: Questões que precisam de esclarecimento
- **📋 Estrutura Descoberta**: Mapeamento de APIs e dados
- **🔄 Status dos Testes**: O que foi testado e resultado

---

## 🧪 Metodologia de Testes

### **1. Scripts de Teste Específicos**
- Criar arquivo .js para cada cenário de teste
- Testar fluxo completo (registro → login → operação)
- Logs verbosos com emojis para clareza
- Validar tanto success quanto error cases

### **2. Fluxo de Validação**
```
1. Testar endpoint isolado
2. Testar fluxo completo de usuário
3. Validar controle de acesso
4. Verificar mapeamento de dados
5. Confirmar fallback para mock
```

### **3. Documentação de Testes**
- Sempre atualizar BACKEND_ISSUES.md com resultados
- Categorizar: ✅ Funcionando, 🔄 Em Progresso, ❌ Com Problemas

---

## 🔄 Processo de Integração de Novos Módulos

### **1. Análise Prévia**
```
1. Ler swagger/documentação do endpoint
2. Analisar estruturas de dados backend
3. Verificar controllers e services relevantes
4. Mapear para estruturas frontend existentes
```

### **2. Implementação**
```
1. Adicionar interfaces TypeScript
2. Implementar chamadas API em lib/api.ts
3. Criar funções de mapeamento
4. Atualizar store com padrão híbrido
5. Testar com scripts específicos
```

### **3. Validação**
```
1. Testar cenários de sucesso
2. Testar cenários de erro
3. Validar fallback para mock
4. Verificar controle de acesso
5. Atualizar documentação
```

---

## 📋 Checklist de Qualidade

### **Antes de Implementar:**
- [ ] Li e entendi o código existente
- [ ] Identifiquei padrões arquiteturais em uso
- [ ] Verifiquei estruturas de dados relacionadas
- [ ] Criei TodoWrite se tarefa tem 3+ passos

### **Durante Implementação:**
- [ ] Segui padrões TypeScript estabelecidos
- [ ] Implementei estratégia híbrida API+Mock
- [ ] Criei funções de mapeamento bidirecionais
- [ ] Mantive logs consistentes e claros

### **Após Implementação:**
- [ ] Criei scripts de teste específicos
- [ ] Testei cenários de sucesso e erro
- [ ] Atualizei BACKEND_ISSUES.md com status
- [ ] Atualizei WORKFLOW_ATUAL.md se necessário
- [ ] Marquei todos os TODOs como completed

### **Para Documentação:**
- [ ] Usei emojis padronizados
- [ ] Mantive estrutura consistente entre arquivos
- [ ] Incluí rationale para decisões técnicas
- [ ] Adicionei métricas e status claros

---

## 🎯 Princípios Fundamentais

### **1. Consistência Acima de Tudo**
- Manter padrões mesmo que sejam imperfeitos
- Evoluir gradualmente, não revolucionar
- Documentar todas as decisões técnicas

### **2. Transparência Total**
- Documentar problemas e limitações
- Explicar rationale por trás de soluções
- Manter status real, não otimista

### **3. Experiência do Desenvolvedor**
- Código deve ser autodocumentado
- Logs devem ser claros e úteis
- Estrutura deve ser intuitiva

### **4. Robustez**
- Sempre implementar fallbacks
- Tratar erros graciosamente
- Validar entradas e saídas

---

## 💡 Meta-aprendizados do Projeto

### **1. Integração Backend Gradual**
- Estratégia híbrida permitiu progresso contínuo
- Fallbacks para mock evitaram bloqueios
- Testes específicos aceleraram debugging

### **2. Documentação como Código**
- Documentos estruturados aceleram onboarding
- Status tracking previne retrabalho
- Metodologia documentada garante consistência

### **3. Análise Sistemática**
- Investigar antes de implementar economiza tempo
- Entender root causes evita soluções superficiais
- Scripts de teste são investimento que se paga

---

## 🚀 Para Futuras Sessões

### **Ao Iniciar Nova Sessão:**
1. Ler CLAUDE.md para contexto geral
2. Ler WORKFLOW_ATUAL.md para status atual
3. Ler BACKEND_ISSUES.md para problemas conhecidos
4. Ler este CLAUDE_METHODOLOGY.md para manter consistência

### **Durante o Trabalho:**
- Manter TodoWrite sempre atualizado
- Seguir padrões arquiteturais estabelecidos
- Usar emojis padronizados na comunicação
- Atualizar documentação em tempo real

### **Ao Finalizar:**
- Marcar TODOs como completed
- Atualizar status nos documentos relevantes
- Documentar qualquer nova descoberta ou padrão

---

## 🎯 Objetivo Final

Manter **continuidade e consistência** entre sessões, fazendo com que o projeto evolua de forma **coerente e organizada**, independentemente de qual sessão Claude está trabalhando.

Esta metodologia garante que:
- ✅ Não perdemos contexto entre sessões
- ✅ Mantemos qualidade técnica consistente
- ✅ Evitamos refatorações desnecessárias
- ✅ Aceleramos desenvolvimento futuro
- ✅ Facilitamos onboarding de novos desenvolvedores

**A documentação É parte do código, não um extra opcional.**