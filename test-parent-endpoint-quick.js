/**
 * 🧪 Teste Rápido: Verificar se userId está no retorno do Parent endpoint
 */

const API_BASE = 'http://localhost:5175/api'

// INSTRUÇÕES:
// 1. Faça login como Psychologist e cole o token abaixo
// 2. Digite o email de um Parent cadastrado
// 3. Execute: node test-parent-endpoint-quick.js

const PSYCHOLOGIST_TOKEN = '' // ← Cole seu token aqui
const PARENT_EMAIL = '' // ← Digite o email de um Parent cadastrado

async function quickTest() {
  if (!PSYCHOLOGIST_TOKEN || !PARENT_EMAIL) {
    console.log('❌ Configure PSYCHOLOGIST_TOKEN e PARENT_EMAIL no arquivo primeiro!')
    console.log('\n📋 Como obter o token:')
    console.log('1. Abra o DevTools do navegador (F12)')
    console.log('2. Faça login como Psychologist em http://localhost:3000/login')
    console.log('3. Vá em Application > Local Storage > aspct_token')
    console.log('4. Copie o valor do token')
    return
  }

  console.log('🔍 Testando endpoint: GET /api/Parents/get-id-by-email')
  console.log('📧 Email:', PARENT_EMAIL)
  console.log('')

  try {
    const response = await fetch(
      `${API_BASE}/Parents/get-id-by-email?email=${encodeURIComponent(PARENT_EMAIL)}`,
      {
        headers: {
          'Authorization': `Bearer ${PSYCHOLOGIST_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.log('❌ Erro:', response.status, error)
      return
    }

    const data = await response.json()
    console.log('✅ Resposta recebida:\n')
    console.log(JSON.stringify(data, null, 2))
    console.log('')

    // VERIFICAÇÃO CRÍTICA
    if (data.userId) {
      console.log('🎉 SUCCESS! userId está presente:', data.userId)
      console.log('✅ O problema foi REALMENTE resolvido!')
      console.log('\n📊 Dados completos:')
      console.log('- userId:', data.userId)
      console.log('- parentId:', data.parentId)
      console.log('- Nome completo:', data.fullName)
      console.log('- Email:', data.email)
    } else {
      console.log('❌ PROBLEMA AINDA EXISTE!')
      console.log('userId NÃO está presente na resposta')
      console.log('\n📋 Campos retornados:', Object.keys(data).join(', '))
      console.log('\n⚠️ O backend ainda precisa ser corrigido')
    }

  } catch (error) {
    console.error('❌ Erro ao fazer requisição:', error.message)
    console.log('\n⚠️ Verifique se o backend está rodando em http://localhost:5175')
  }
}

quickTest()
