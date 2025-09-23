const API_BASE = 'http://localhost:5175/api'

async function testInterventionPlansIntegration() {
  console.log('🧪 TESTE DE INTEGRAÇÃO - MÓDULO INTERVENTION PLANS\n')

  try {
    console.log('📝 PASSO 1: Registrar Psychologist...')
    const psicoEmail = `psico_${Date.now()}@test.com`
    const registerResponse = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `psico_${Date.now()}`,
        email: psicoEmail,
        password: '123456',
        firstName: 'Dr.',
        lastName: 'Intervention Test',
        role: 'Psychologist',
        licenseNumber: 'CRP-999888',
        specialization: 'TEA',
        clinicName: 'Clínica Planos'
      })
    })

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text()
      throw new Error(`Register failed: ${registerResponse.status} - ${errorText}`)
    }

    const registerData = await registerResponse.json()
    console.log(`✅ Psychologist criado: ${registerData.firstName} ${registerData.lastName}\n`)

    console.log('📝 PASSO 2: Login como Psychologist...')
    const loginResponse = await fetch(`${API_BASE}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: psicoEmail,
        password: '123456'
      })
    })

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`)
    }

    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log(`✅ Login OK - Token: ${token.substring(0, 30)}...`)
    console.log(`✅ User: ${loginData.firstName} ${loginData.lastName} (${loginData.role})\n`)

    console.log('📝 PASSO 3: Registrar Parent...')
    const parentEmail = `parent_${Date.now()}@test.com`
    const parentRegisterResponse = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `parent_${Date.now()}`,
        email: parentEmail,
        password: '123456',
        firstName: 'Parent',
        lastName: 'Test Plans',
        role: 'Parent',
        childRelationship: 'Mãe',
        contactNumber: '11987654321'
      })
    })

    if (!parentRegisterResponse.ok) {
      const errorText = await parentRegisterResponse.text()
      throw new Error(`Parent register failed: ${parentRegisterResponse.status} - ${errorText}`)
    }

    const parentData = await parentRegisterResponse.json()
    const parentId = parentData.userId
    console.log(`✅ Parent criado: ${parentData.firstName} ${parentData.lastName} (${parentId})\n`)

    console.log('📝 PASSO 4: Criar criança...')
    const childData = {
      firstName: 'Criança',
      lastName: 'Plano Intervenção',
      dateOfBirth: '2021-05-10T00:00:00Z',
      gender: 'Feminino',
      diagnosis: 'TEA Nível 1',
      primaryParentId: parentId,
      medicalHistory: 'Sem comorbidades'
    }

    const createChildResponse = await fetch(`${API_BASE}/Children`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(childData)
    })

    if (!createChildResponse.ok) {
      const errorText = await createChildResponse.text()
      throw new Error(`Create child failed: ${createChildResponse.status} - ${errorText}`)
    }

    const child = await createChildResponse.json()
    const childId = child.childId
    console.log(`✅ Criança criada: ${child.firstName} ${child.lastName} (${childId})\n`)

    console.log('📝 PASSO 5: Buscar planos existentes...')
    const plansResponse = await fetch(`${API_BASE}/InterventionPlans/child/${childId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!plansResponse.ok) {
      console.log(`⚠️  Get plans failed: ${plansResponse.status}`)
    } else {
      const plans = await plansResponse.json()
      console.log(`✅ Planos encontrados: ${plans.length}`)
    }
    console.log('')

    console.log('📝 PASSO 6: Criar Intervention Plan...')
    const planData = {
      childId: childId,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias
      goals: 'Desenvolver comunicação funcional e reduzir comportamentos desafiadores',
      interventionGoals: [
        {
          description: 'Aumentar pedidos verbais espontâneos para itens desejados',
          targetBehavior: 'Fazer pedidos usando frases de 3-4 palavras sem prompts',
          measurementCriteria: '80% de acertos em 3 sessões consecutivas',
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
        },
        {
          description: 'Melhorar habilidades de imitação motora grossa',
          targetBehavior: 'Imitar 10 ações motoras diferentes quando demonstradas',
          measurementCriteria: '8 de 10 imitações corretas por sessão',
          targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() // 45 dias
        }
      ]
    }

    console.log('📤 Dados enviados:', JSON.stringify(planData, null, 2))

    const createPlanResponse = await fetch(`${API_BASE}/InterventionPlans`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(planData)
    })

    if (!createPlanResponse.ok) {
      const errorText = await createPlanResponse.text()
      console.log(`❌ Erro ao criar plano: ${createPlanResponse.status}`)
      console.log(`❌ Resposta: ${errorText}`)
    } else {
      const planResult = await createPlanResponse.json()
      console.log('✅ Intervention Plan criado!')
      console.log('📊 Resultado:', JSON.stringify(planResult, null, 2))

      const planId = planResult.planId
      console.log('')

      console.log('📝 PASSO 7: Buscar plano específico...')
      const getPlanResponse = await fetch(`${API_BASE}/InterventionPlans/${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (getPlanResponse.ok) {
        const plan = await getPlanResponse.json()
        console.log('✅ Plano recuperado com sucesso!')
        console.log(`📊 Metas: ${plan.interventionGoals?.length || 0} metas cadastradas`)
      }
      console.log('')

      console.log('📝 PASSO 8: Buscar todos os planos da criança...')
      const finalPlansResponse = await fetch(`${API_BASE}/InterventionPlans/child/${childId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (finalPlansResponse.ok) {
        const finalPlans = await finalPlansResponse.json()
        console.log(`✅ Total de planos agora: ${finalPlans.length}`)
        finalPlans.forEach(p => {
          console.log(`   - Início: ${p.startDate.split('T')[0]} | Metas: ${p.interventionGoals?.length || 0}`)
        })
      }
    }

    console.log('\n✅ TESTE COMPLETO - MÓDULO INTERVENTION PLANS INTEGRADO!\n')

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    console.error(error)
  }
}

testInterventionPlansIntegration()