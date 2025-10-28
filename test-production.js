// Script de teste para validar backend em produção
const API_BASE = 'https://aspcts-backend.azurewebsites.net/api'

async function testProduction() {
  console.log('🔍 Testando backend em produção...\n')
  console.log(`📍 URL: ${API_BASE}\n`)

  // Teste 1: Health check básico
  console.log('1️⃣ Teste de conectividade básica')
  try {
    const response = await fetch(`${API_BASE}/Auth/login`, {
      method: 'OPTIONS'
    })
    console.log(`   ✅ Backend acessível (Status: ${response.status})`)
  } catch (error) {
    console.log(`   ❌ Erro de conectividade: ${error.message}`)
    return
  }

  // Teste 2: Login com usuário teste
  console.log('\n2️⃣ Teste de autenticação')
  try {
    const response = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'ana.silva@exemplo.com',
        password: '123456'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Login bem-sucedido`)
      console.log(`   👤 Usuário: ${data.username}`)
      console.log(`   📧 Email: ${data.email}`)
      console.log(`   🎭 Role: ${data.role}`)
      console.log(`   🔑 Token: ${data.token.substring(0, 20)}...`)

      // Teste 3: Buscar crianças com o token
      console.log('\n3️⃣ Teste de busca de crianças')
      const childrenResponse = await fetch(`${API_BASE}/Children`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      })

      if (childrenResponse.ok) {
        const children = await childrenResponse.json()
        console.log(`   ✅ Crianças encontradas: ${children.length}`)
        if (children.length > 0) {
          console.log(`   👶 Exemplo: ${children[0].fullName} (${children[0].age} anos)`)
        }
      } else {
        const error = await childrenResponse.text()
        console.log(`   ⚠️ Erro ao buscar crianças: ${childrenResponse.status}`)
        console.log(`   📝 Detalhes: ${error}`)
      }

    } else {
      const error = await response.text()
      console.log(`   ❌ Falha no login (${response.status})`)
      console.log(`   📝 Detalhes: ${error}`)
    }
  } catch (error) {
    console.log(`   ❌ Erro: ${error.message}`)
  }

  console.log('\n✅ Testes concluídos!')
}

testProduction()
