/**
 * 🧪 Teste: Fluxo Completo de Cadastro de Criança
 *
 * Valida:
 * 1. Busca de Parent por email
 * 2. Verificação do userId no retorno
 * 3. Criação de criança com primaryParentId correto
 */

const API_BASE = 'http://localhost:5175/api'

// Token de um Psychologist válido (substitua pelo seu token)
const PSYCHOLOGIST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Substitua

// Email de um Parent cadastrado
const PARENT_EMAIL = 'joao.silva@example.com' // Substitua pelo email real

async function testCompleteFlow() {
  console.log('🚀 Iniciando teste de fluxo completo de cadastro de criança\n')

  try {
    // ETAPA 1: Buscar Parent por email
    console.log('📧 ETAPA 1: Buscando responsável por email...')
    const parentResponse = await fetch(
      `${API_BASE}/Parents/get-id-by-email?email=${encodeURIComponent(PARENT_EMAIL)}`,
      {
        headers: {
          'Authorization': `Bearer ${PSYCHOLOGIST_TOKEN}`
        }
      }
    )

    if (!parentResponse.ok) {
      const error = await parentResponse.text()
      throw new Error(`Erro ao buscar parent: ${parentResponse.status} - ${error}`)
    }

    const parentData = await parentResponse.json()
    console.log('✅ Responsável encontrado:')
    console.log(JSON.stringify(parentData, null, 2))

    // VALIDAÇÃO CRÍTICA: Verificar se userId está presente
    if (!parentData.userId) {
      console.log('\n❌ PROBLEMA: userId não está presente no retorno!')
      console.log('🔧 Solução: Backend precisa adicionar userId no retorno do endpoint')
      console.log('\nCampos retornados:', Object.keys(parentData))
      return
    }

    console.log('\n✅ userId encontrado:', parentData.userId)
    console.log('✅ parentId:', parentData.parentId)

    // ETAPA 2: Criar criança usando o userId
    console.log('\n👶 ETAPA 2: Criando criança com primaryParentId =', parentData.userId)

    const childData = {
      firstName: 'Maria',
      lastName: 'Silva Teste',
      dateOfBirth: '2020-05-15T00:00:00Z',
      gender: 'Feminino',
      diagnosis: 'TEA Nível 1',
      primaryParentId: parentData.userId // ← Usando userId do parent
    }

    console.log('📤 Enviando dados:')
    console.log(JSON.stringify(childData, null, 2))

    const createResponse = await fetch(`${API_BASE}/Children`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PSYCHOLOGIST_TOKEN}`
      },
      body: JSON.stringify(childData)
    })

    if (!createResponse.ok) {
      const error = await createResponse.text()
      console.log('\n❌ Erro ao criar criança:', createResponse.status)
      console.log('Resposta:', error)

      if (createResponse.status === 400) {
        console.log('\n⚠️ Possíveis causas:')
        console.log('1. primaryParentId inválido (usando parentId ao invés de userId)')
        console.log('2. Parent não existe no sistema')
        console.log('3. Validação de campos falhou')
      }
      return
    }

    const createdChild = await createResponse.json()
    console.log('\n✅ Criança criada com sucesso!')
    console.log(JSON.stringify(createdChild, null, 2))

    // ETAPA 3: Verificar se psicólogo consegue acessar a criança
    console.log('\n🔍 ETAPA 3: Verificando acesso à criança...')
    const accessResponse = await fetch(
      `${API_BASE}/Children/${createdChild.childId}/can-access`,
      {
        headers: {
          'Authorization': `Bearer ${PSYCHOLOGIST_TOKEN}`
        }
      }
    )

    const canAccess = await accessResponse.json()
    console.log('Pode acessar:', canAccess)

    if (canAccess) {
      console.log('\n🎉 SUCESSO TOTAL! Fluxo completo funcionando:')
      console.log('✅ Parent encontrado por email')
      console.log('✅ userId retornado corretamente')
      console.log('✅ Criança criada com relacionamento correto')
      console.log('✅ Psicólogo tem acesso à criança')
    } else {
      console.log('\n⚠️ Criança criada mas psicólogo não tem acesso')
      console.log('Verificar lógica de atribuição de criança ao psicólogo')
    }

  } catch (error) {
    console.error('\n❌ Erro no teste:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Instruções de uso
console.log('📋 INSTRUÇÕES:')
console.log('1. Substitua PSYCHOLOGIST_TOKEN pelo seu token JWT válido')
console.log('2. Substitua PARENT_EMAIL por um email de Parent cadastrado')
console.log('3. Execute: node test-create-child-flow.js')
console.log('=' .repeat(60))
console.log('')

// Descomentar para executar
// testCompleteFlow()

console.log('⚠️ Atualize os valores das variáveis e descomente a última linha para executar o teste')
