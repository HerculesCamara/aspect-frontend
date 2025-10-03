/**
 * 🧪 Teste: Verificar se usuário existe
 */

const API_BASE = 'http://localhost:5175/api'

async function testUserExists(email, password) {
  console.log(`🔍 Testando login para: ${email}`)
  console.log(`🔑 Senha: ${password}`)
  console.log('')

  try {
    const response = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ USUÁRIO EXISTE E LOGIN FUNCIONOU!')
      console.log('')
      console.log('📋 Dados do usuário:')
      console.log('- UserID:', data.userId)
      console.log('- Username:', data.username)
      console.log('- Email:', data.email)
      console.log('- Role:', data.role)
      console.log('- Nome:', data.firstName, data.lastName)
      console.log('')
      console.log('🎫 Token JWT gerado com sucesso')
      return true
    } else {
      const error = await response.text()
      console.log('❌ LOGIN FALHOU!')
      console.log('Status:', response.status)
      console.log('Erro:', error)
      console.log('')

      if (response.status === 401 || response.status === 400) {
        console.log('💡 POSSÍVEIS CAUSAS:')
        console.log('1. Email não existe no sistema')
        console.log('2. Senha incorreta')
        console.log('3. Usuário não foi cadastrado corretamente')
      }
      return false
    }
  } catch (error) {
    console.error('❌ Erro ao conectar com o backend:', error.message)
    console.log('\n⚠️ Verifique se o backend está rodando em http://localhost:5175')
    return false
  }
}

// Testar com as credenciais fornecidas
testUserExists('testepai@test.com', '123546')
