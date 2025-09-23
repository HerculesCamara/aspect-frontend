# 🔧 Backend Integration - Issues & Questions

## 🚨 Problemas Encontrados

### 1. Erro "Psicólogo não encontrado" - PERSISTENTE
- **Endpoint**: `GET /api/Children`
- **Erro**: `{"message":"Psicólogo não encontrado"}`
- **Context**: Usuário autenticado com role "Psychologist" mas sistema não reconhece
- **Status**: Ainda ocorre mesmo com token JWT válido
- **Análise baseada no PDF**:
  - Sistema diferencia `User` (auth) de `Psychologist` (perfil profissional)
  - PDF confirma: "Psicólogo responsável por onboarding da criança"
  - Estrutura: `User` → role "Psychologist" → precisa estar vinculado a entidade `Psychologist`
- **Hipóteses confirmadas pelo PDF**:
  - ✅ Sistema requer cadastro separado de perfil psicólogo após criar usuário
  - ✅ Usuário precisa ser associado a uma entidade Psychologist no banco
  - ✅ Falta endpoint para criar/associar perfil profissional (licenseNumber, specialization, etc.)
- **Próximos passos**:
  - Investigar se existe endpoint `/api/Psychologists` para criar perfil
  - Verificar se precisa de dados como licenseNumber, specialization, contactNumber

### 2. Validação de Role inconsistente
- **Problema**: Durante registro, role "Psicólogo" (PT-BR) falha mas "Psychologist" (EN) funciona
- **Erro**: `"The JSON value could not be converted to System.String"`
- **Solução temporária**: Usar roles em inglês

## ❓ Dúvidas Técnicas

### 1. Estrutura de Roles
- Quais são os valores exatos aceitos para o campo `role`?
- É "Psychologist"/"Parent" ou existe outra nomenclatura?
- Há algum enum definido no backend?

### 2. Relacionamento User x Psychologist
- O usuário com role "Psychologist" precisa de cadastro adicional?
- Existe endpoint específico para criar perfil de psicólogo?
- Como funciona a associação psicólogo-criança?

### 3. Estrutura de Children
- Como funciona a criação de crianças?
- Psicólogo precisa estar associado antes de criar crianças?
- Qual a estrutura exata do `ChildCreateRequest`?

### 4. Sistema de Permissões
- Como funciona o controle de acesso entre psicólogo e pais?
- Endpoint `/api/Children/{id}/can-access` - quando retorna true/false?

## 📋 Estrutura da API Descoberta

### Auth Endpoints
```
POST /api/Auth/register
- Body: { username, email, password, firstName, lastName, role }
- Response: { token, userId, username, email, role, firstName, lastName, expiresAt }

POST /api/Auth/login
- Body: { email, password }
- Response: { token, userId, username, email, role, firstName, lastName, expiresAt }

POST /api/Auth/validate-token
- Body: "token_string"
- Response: boolean
```

### Children Endpoints
```
GET /api/Children - Lista crianças
POST /api/Children - Criar criança
GET /api/Children/{id} - Buscar criança
PUT /api/Children/{id} - Atualizar criança
DELETE /api/Children/{id} - Deletar criança
GET /api/Children/{id}/can-access - Verificar acesso
```

### Outros Endpoints Importantes
- `/api/Assessments/*` - Sistema de avaliações VB-MAPP
- `/api/InterventionPlans/*` - Planos de intervenção
- `/api/Communication/*` - Sistema de mensagens
- `/api/Reports/*` - Relatórios

## 💬 Feedback do Desenvolvedor Backend

### Esclarecimentos Importantes:
1. **Tipos de Login**:
   - **Psicólogo**: Acesso restrito apenas às crianças atribuídas a ele
   - **Pais**: Registro normal, acesso aos próprios filhos

2. **Regra de Acesso**:
   - Psicólogo não tem acesso global a todas as crianças
   - Sistema funciona por atribuição: cada criança é vinculada a um psicólogo específico
   - ~~Se psicólogo não tem crianças → erro "Psicólogo não encontrado"~~ ✅ **RESOLVIDO**

3. **Fluxo Correto**:
   - Criar criança no sistema
   - Atribuir criança ao psicólogo (assignedPsychologistID)
   - Psicólogo consegue acessar `/api/Children`

## 🔄 Status dos Testes

### ✅ Funcionando
- Registro de usuário (com role em inglês) - Psychologist e Parent
- Login de usuário
- Autenticação via Bearer token
- Swagger documentation
- Store crianca-store.ts integrado com backend
- Mapeamento de dados Children (ChildResponse ↔ Crianca)
- Cálculo automático de idade e nível VB-MAPP
- ✅ **AuthService corrigido** - Psychologist agora é salvo no banco
- ✅ **GET /api/Children funcionando** - Retorna array vazio (correto)
- ✅ **Problema "Psicólogo não encontrado" RESOLVIDO**
- ✅ **Criação de crianças funcionando** - com Parent válido
- ✅ **Fluxo Psychologist-Parent-Child completo**
- ✅ **Controle de acesso** - Psicólogo vê só suas crianças, Parent vê só seus filhos
- ✅ **Módulo Sessions 100% integrado** - CRUD completo + compartilhamento
- ✅ **Sistema de notas estruturadas** - O que foi feito, diagnosticado, próximos passos
- ✅ **Controle de compartilhamento** - Psicólogo decide quais sessões pais veem
- ✅ **Módulo Reports 100% integrado** - Geração + PDF + estatísticas
- ✅ **Download de PDF automático** - Backend gera PDF de relatórios
- ✅ **Estatísticas integradas** - Sessões, avaliações, metas por período
- ✅ **Módulo Assessments 100% integrado** - VB-MAPP completo
- ✅ **3 tipos de avaliação** - Milestones, Barriers, Transition
- ✅ **Progress data endpoint** - Dados de progresso consolidados
- ✅ **Cálculo automático de scores** - Backend calcula overallScore

### 🔄 Em Progresso
- Atividades Terapêuticas (backend não existe endpoint)

### ❌ Com Problemas
- Role validation (PT-BR não aceito) - usar sempre roles em inglês
- primaryParentId: ✅ **IDENTIFICADO E RESOLVIDO** - requer Parent válido no sistema

### ⏳ Não Testado
- Planos de intervenção
- Sistema de comunicação

## 📊 Estrutura VB-MAPP Descoberta (baseada no PDF)

### Entidades Principais:
- **User**: Autenticação (userId, username, email, role)
- **Psychologist**: Perfil profissional (psychologistID, licenseNumber, specialization, contactNumber, clinicName)
- **Parent**: Perfil dos pais (parentID, childRelationship, contactNumber)
- **Child**: Criança (childID, assignedPsychologistID, parentID)

### Relacionamentos Críticos:
```
User (role="Psychologist") → Psychologist (perfil profissional)
Child → assignedPsychologistID (FK para Psychologist)
Child → parentID (FK para Parent)
```

### Sistema VB-MAPP Completo (170 marcos):
- **Nível 1**: 0-18 meses (marcos 1-85)
- **Nível 2**: 18-30 meses (marcos 86-135)
- **Nível 3**: 30-48 meses (marcos 136-170)
- **12 domínios**: Mand, Tact, Listener, Visual/MTS, LRFFC, Intraverbal, Group/Motor, Echoic/Motor, Vocal, Reading, Writing, Math
- **24 barreiras**: Escala 0-4 de severidade
- **18 áreas de transição**: Para ambientes educacionais

## 📝 Próximos Passos

1. **✅ RESOLVIDO - Erro "Psicólogo não encontrado"**
   - **Root cause**: AuthService criava objetos Psychologist mas não salvava no banco
   - **Solução**: Backend corrigido para injetar ApplicationDbContext e salvar registros
   - **Status**: Totalmente funcional

2. **✅ RESOLVIDO - Erro "Responsável principal não encontrado"**
   - **Root cause**: primaryParentId inválido (GUID zerado)
   - **Solução**: Sistema requer Parent válido registrado no sistema
   - **Fluxo correto**: Registrar Parent → Usar seu userId como primaryParentId
   - **Status**: Testado e funcionando

3. **✅ COMPLETADO - Fluxo completo integrado**
   - Registro Psychologist ✅
   - Registro Parent ✅
   - Criação Child com relacionamentos corretos ✅
   - Controle de acesso funcionando ✅
   - Mapeamento frontend-backend ✅

4. **✅ COMPLETADO - Módulo Assessments (VB-MAPP)**
   - **Data**: 23/09/2025
   - **Endpoints integrados**:
     - `GET /api/Assessments/{id}` - Buscar assessment específico
     - `GET /api/Assessments/child/{childId}` - Buscar por criança
     - `GET /api/Assessments/child/{childId}/progress` - Dados de progresso
     - `POST /api/Assessments/milestones` - Criar avaliação de marcos
     - `POST /api/Assessments/barriers` - Criar avaliação de barreiras
     - `POST /api/Assessments/transition` - Criar avaliação de transição
   - **3 tipos de avaliação**:
     - **Milestones**: 170 marcos em 3 níveis (Level 1, 2, 3)
     - **Barriers**: 24 barreiras ao aprendizado (escala 0-4)
     - **Transition**: Prontidão para transição educacional
   - **Mapeamento completo**: `AssessmentResponse ↔ Assessment`
   - **Cálculo automático**: Backend calcula `overallScore`
   - **Store híbrido**: `assessment-store.ts` com padrão API + mock
   - **Teste validado**: `test-assessments-integration.js` ✅

5. **✅ COMPLETADO - Módulo InterventionPlans**
   - **Data**: 23/09/2025
   - **Endpoints integrados**:
     - `GET /api/InterventionPlans` - Listar todos os planos
     - `GET /api/InterventionPlans/{id}` - Buscar plano específico
     - `GET /api/InterventionPlans/child/{childId}` - Buscar por criança
     - `POST /api/InterventionPlans` - Criar plano de intervenção
     - `PUT /api/InterventionPlans/{id}` - Atualizar plano
     - `DELETE /api/InterventionPlans/{id}` - Deletar plano
   - **Estrutura completa**:
     - Plano com período (startDate, endDate)
     - Objetivos gerais (goals)
     - Metas individuais (interventionGoals)
     - Status do plano (Active, Completed)
   - **Mapeamento completo**: `InterventionPlanResponse ↔ InterventionPlan`
   - **Store híbrido**: `intervention-plan-store.ts` com padrão API + mock
   - **Teste validado**: `test-intervention-plans-integration.js` ✅
   - **⚠️ Observação**: InterventionGoals enviadas mas não retornam populadas na resposta (possível eager loading pendente no backend)

## 🚀 Próximas Funcionalidades para Integrar

1. **Sistema de Comunicação**
   - Endpoints `/api/Communication/*`
   - Mensagens entre psicólogo e pais
   - Notificações

4. **Relatórios**
   - Endpoints `/api/Reports/*`
   - Relatórios de progresso
   - Exportação de dados