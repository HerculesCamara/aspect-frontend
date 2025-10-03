/**
 * 🧪 Teste AGORA: Endpoint Parent com credenciais reais
 */

const API_BASE = 'http://localhost:5175/api'

async function loginAndTest() {
  console.log('🔐 ETAPA 1: Fazendo login como Psicólogo...\n')

  // Login como psicólogo
  const loginResponse = await fetch(`${API_BASE}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'testepsico@test.com',
      password: '123456'
    })
  })

  if (!loginResponse.ok) {
    console.log('❌ Erro no login:', await loginResponse.text())
    return
  }

  const loginData = await loginResponse.json()
  console.log('✅ Login bem-sucedido!')
  console.log('Token:', loginData.token.substring(0, 50) + '...')
  console.log('UserId:', loginData.userId)
  console.log('Role:', loginData.role)
  console.log('')

  // Testar endpoint de Parent
  console.log('📧 ETAPA 2: Buscando responsável testepai@test.com...\n')

  const parentResponse = await fetch(
    `${API_BASE}/Parents/get-id-by-email?email=testepai@test.com`,
    {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    }
  )

  console.log('Status da resposta:', parentResponse.status, parentResponse.statusText)
  console.log('')

  if (!parentResponse.ok) {
    const error = await parentResponse.text()
    console.log('❌ ERRO na busca de Parent:')
    console.log(error)
    console.log('')

    if (parentResponse.status === 404) {
      console.log('💡 POSSÍVEIS CAUSAS:')
      console.log('1. Parent não foi criado corretamente no backend')
      console.log('2. Email está diferente no banco')
      console.log('3. Role não é "Parent" (pode ser "Responsável" em PT-BR)')
      console.log('4. Endpoint não encontra Parent por algum motivo')
      console.log('')
      console.log('🔍 PRÓXIMO PASSO: Verificar no banco de dados se o Parent existe')
      console.log('   SELECT * FROM Users WHERE Email = \'testepai@test.com\'')
      console.log('   SELECT * FROM Parents WHERE UserId = \'[userId_do_user]\'')
    }
    return
  }

  const parentData = await parentResponse.json()
  console.log('✅ SUCESSO! Parent encontrado:\n')
  console.log(JSON.stringify(parentData, null, 2))
  console.log('')

  // Verificar userId
  if (parentData.userId) {
    console.log('🎉 PERFEITO! userId está presente:', parentData.userId)
    console.log('✅ O backend FOI corrigido!')
  } else {
    console.log('❌ PROBLEMA: userId ainda não está no retorno')
    console.log('📋 Campos retornados:', Object.keys(parentData).join(', '))
    console.log('⚠️ Backend precisa adicionar userId')
  }
}

loginAndTest().catch(err => {
  console.error('❌ Erro fatal:', err.message)
  console.log('\n⚠️ Verifique se o backend está rodando em http://localhost:5175')
})
