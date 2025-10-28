// Script para testar registro em produção
const API_BASE = 'https://aspcts-backend.azurewebsites.net/api'

async function testRegister() {
  console.log('📝 Testando registro de usuário em produção...\n')

  try {
    const response = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'ana_silva',
        email: 'ana.silva@exemplo.com',
        password: '123456',
        firstName: 'Ana',
        lastName: 'Silva',
        role: 'Psychologist',
        contactNumber: '66992121234',
        licenseNumber: 'CRP-123456',
        specialization: 'ABA',
        clinicName: 'Clínica ASPCT'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Registro bem-sucedido!')
      console.log(`👤 Usuário: ${data.username}`)
      console.log(`📧 Email: ${data.email}`)
      console.log(`🎭 Role: ${data.role}`)
      console.log(`🔑 Token: ${data.token.substring(0, 30)}...`)
    } else {
      const error = await response.json()
      console.log(`❌ Falha no registro (${response.status})`)
      console.log('📝 Detalhes:', JSON.stringify(error, null, 2))
    }
  } catch (error) {
    console.log(`❌ Erro: ${error.message}`)
  }
}

testRegister()
