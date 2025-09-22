# 🔧 Backend Integration - Issues & Questions

## 🚨 Problemas Encontrados

### 1. Erro "Psicólogo não encontrado"
- **Endpoint**: `GET /api/Children`
- **Erro**: `{"message":"Psicólogo não encontrado"}`
- **Context**: Usuário autenticado com role "Psychologist" mas sistema não reconhece
- **Possível causa**: Talvez precise cadastrar perfil de psicólogo separadamente do usuário

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

## 🔄 Status dos Testes

### ✅ Funcionando
- Registro de usuário (com role em inglês)
- Login de usuário
- Autenticação via Bearer token
- Swagger documentation

### ❌ Com Problemas
- Acesso a endpoints protegidos (erro psicólogo não encontrado)
- Role validation (PT-BR não aceito)

### ⏳ Não Testado
- CRUD de crianças
- Sistema de avaliações
- Planos de intervenção
- Sistema de comunicação
- Relatórios

## 📝 Próximos Passos

1. **Resolver erro "Psicólogo não encontrado"**
   - Investigar se precisa cadastrar perfil separado
   - Verificar se há endpoint de setup inicial

2. **Mapear estruturas de dados completas**
   - ChildCreateRequest/Response
   - AssessmentRequest/Response
   - InterventionPlanRequest/Response

3. **Integrar autenticação no frontend**
   - Atualizar auth-store para usar API real
   - Manter fallback para dados mock

4. **Testar fluxo completo**
   - Registro → Login → Acesso a recursos protegidos