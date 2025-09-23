// Script de teste para integração do módulo Assessments
const API_BASE = 'http://localhost:5175/api'

// Testar fluxo completo: Login → Child → Assessment
async function testAssessmentsIntegration() {
  console.log('🧪 TESTE DE INTEGRAÇÃO - MÓDULO ASSESSMENTS\n')

  try {
    // === PASSO 1: REGISTRAR PSYCHOLOGIST ===
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
        lastName: 'Assessment Test',
        role: 'Psychologist',
        licenseNumber: 'CRP-123456',
        specialization: 'TEA',
        clinicName: 'Clínica Teste'
      })
    })

    if (!registerResponse.ok) {
      const errorText = await registerResponse.text()
      throw new Error(`Register failed: ${registerResponse.status} - ${errorText}`)
    }

    const registerData = await registerResponse.json()
    console.log(`✅ Psychologist criado: ${registerData.firstName} ${registerData.lastName}\n`)

    // === PASSO 2: LOGIN ===
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

    // === PASSO 3: CRIAR PARENT ===
    console.log('📝 PASSO 3: Registrar Parent para criar criança...')
    const parentEmail = `parent_${Date.now()}@test.com`
    const parentRegisterResponse = await fetch(`${API_BASE}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `parent_${Date.now()}`,
        email: parentEmail,
        password: '123456',
        firstName: 'Parent',
        lastName: 'Test',
        role: 'Parent',
        childRelationship: 'Pai',
        contactNumber: '11999999999'
      })
    })

    if (!parentRegisterResponse.ok) {
      const errorText = await parentRegisterResponse.text()
      throw new Error(`Parent register failed: ${parentRegisterResponse.status} - ${errorText}`)
    }

    const parentData = await parentRegisterResponse.json()
    const parentId = parentData.userId
    console.log(`✅ Parent criado: ${parentData.firstName} ${parentData.lastName} (${parentId})\n`)

    // === PASSO 4: CRIAR CHILD ===
    console.log('📝 PASSO 4: Criar criança para testar assessments...')
    const childData = {
      firstName: 'Criança',
      lastName: 'Teste Assessment',
      dateOfBirth: '2020-01-15T00:00:00Z',
      gender: 'Masculino',
      diagnosis: 'TEA Nível 2',
      primaryParentId: parentId,
      medicalHistory: 'Nenhum histórico relevante'
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

    // === PASSO 5: BUSCAR ASSESSMENTS EXISTENTES ===
    console.log('📝 PASSO 5: Buscar assessments da criança...')
    const assessmentsResponse = await fetch(`${API_BASE}/Assessments/child/${childId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!assessmentsResponse.ok) {
      throw new Error(`Get assessments failed: ${assessmentsResponse.status}`)
    }

    const assessments = await assessmentsResponse.json()
    console.log(`✅ Assessments encontrados: ${assessments.length}`)
    if (assessments.length > 0) {
      console.log('📊 Assessments existentes:')
      assessments.forEach(a => {
        console.log(`   - ${a.assessmentType} | Data: ${a.assessmentDate.split('T')[0]} | Score: ${a.overallScore || 'N/A'}`)
      })
    }
    console.log('')

    // === PASSO 6: BUSCAR PROGRESS DATA ===
    console.log('📝 PASSO 6: Buscar dados de progresso...')
    const progressResponse = await fetch(`${API_BASE}/Assessments/child/${childId}/progress`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!progressResponse.ok) {
      console.log(`⚠️  Progress data não disponível: ${progressResponse.status}`)
    } else {
      const progressData = await progressResponse.json()
      console.log('✅ Progress data:', JSON.stringify(progressData, null, 2))
    }
    console.log('')

    // === PASSO 7: CRIAR MILESTONES ASSESSMENT ===
    console.log('📝 PASSO 7: Criar Milestones Assessment...')
    const milestonesData = {
      childId: childId,
      assessmentDate: new Date().toISOString(),
      assessmentType: 'Milestones',
      level1Score: 30,
      level2Score: 25,
      level3Score: 15,
      milestoneScores: {
        "Mand1": 2,
        "Mand2": 1,
        "Tact1": 2,
        "Tact2": 1,
        "Listener1": 2,
        "Listener2": 1
      }
    }

    console.log('📤 Dados enviados:', JSON.stringify(milestonesData, null, 2))

    const createMilestonesResponse = await fetch(`${API_BASE}/Assessments/milestones`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(milestonesData)
    })

    if (!createMilestonesResponse.ok) {
      const errorText = await createMilestonesResponse.text()
      console.log(`❌ Erro ao criar Milestones: ${createMilestonesResponse.status}`)
      console.log(`❌ Resposta: ${errorText}`)
    } else {
      const milestonesResult = await createMilestonesResponse.json()
      console.log('✅ Milestones Assessment criado!')
      console.log('📊 Resultado:', JSON.stringify(milestonesResult, null, 2))
    }
    console.log('')

    // === PASSO 8: CRIAR BARRIERS ASSESSMENT ===
    console.log('📝 PASSO 8: Criar Barriers Assessment...')
    const barriersData = {
      childId: childId,
      assessmentDate: new Date().toISOString(),
      assessmentType: 'Barriers',
      barrierScores: {
        "Barrier1": 2,
        "Barrier2": 1,
        "Barrier3": 3,
        "Barrier4": 2
      },
      qualitativeNotes: 'Criança apresenta dificuldades moderadas em atenção sustentada e seguimento de instruções'
    }

    console.log('📤 Dados enviados:', JSON.stringify(barriersData, null, 2))

    const createBarriersResponse = await fetch(`${API_BASE}/Assessments/barriers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(barriersData)
    })

    if (!createBarriersResponse.ok) {
      const errorText = await createBarriersResponse.text()
      console.log(`❌ Erro ao criar Barriers: ${createBarriersResponse.status}`)
      console.log(`❌ Resposta: ${errorText}`)
    } else {
      const barriersResult = await createBarriersResponse.json()
      console.log('✅ Barriers Assessment criado!')
      console.log('📊 Resultado:', JSON.stringify(barriersResult, null, 2))
    }
    console.log('')

    // === PASSO 9: CRIAR TRANSITION ASSESSMENT ===
    console.log('📝 PASSO 9: Criar Transition Assessment...')
    const transitionData = {
      childId: childId,
      assessmentDate: new Date().toISOString(),
      assessmentType: 'Transition',
      transitionScores: {
        "Classroom": 4,
        "Group": 3,
        "Play": 4,
        "Social": 3
      },
      readinessNotes: 'Criança demonstra boa prontidão para ambiente de sala de aula estruturada'
    }

    console.log('📤 Dados enviados:', JSON.stringify(transitionData, null, 2))

    const createTransitionResponse = await fetch(`${API_BASE}/Assessments/transition`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transitionData)
    })

    if (!createTransitionResponse.ok) {
      const errorText = await createTransitionResponse.text()
      console.log(`❌ Erro ao criar Transition: ${createTransitionResponse.status}`)
      console.log(`❌ Resposta: ${errorText}`)
    } else {
      const transitionResult = await createTransitionResponse.json()
      console.log('✅ Transition Assessment criado!')
      console.log('📊 Resultado:', JSON.stringify(transitionResult, null, 2))
    }
    console.log('')

    // === PASSO 10: BUSCAR ASSESSMENTS NOVAMENTE ===
    console.log('📝 PASSO 10: Verificar assessments após criação...')
    const finalAssessmentsResponse = await fetch(`${API_BASE}/Assessments/child/${childId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (finalAssessmentsResponse.ok) {
      const finalAssessments = await finalAssessmentsResponse.json()
      console.log(`✅ Total de assessments agora: ${finalAssessments.length}`)
      finalAssessments.forEach(a => {
        console.log(`   - ${a.assessmentType} | Data: ${a.assessmentDate.split('T')[0]} | Score: ${a.overallScore || 'N/A'}`)
      })
    }

    console.log('\n✅ TESTE COMPLETO - MÓDULO ASSESSMENTS INTEGRADO!\n')

  } catch (error) {
    console.error('\n❌ ERRO NO TESTE:', error.message)
    console.error(error)
  }
}

// Executar teste
testAssessmentsIntegration()