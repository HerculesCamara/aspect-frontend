// Testar criação de Parent e depois criação de Child
async function testCreateParentAndChild() {
  console.log('🧪 Testando fluxo: Criar Parent → Criar Child...');

  // 1. Primeiro, registrar um psicólogo
  const psychologistData = {
    username: 'psicologo_test2',
    email: 'psicologo2@test.com',
    password: '123456',
    firstName: 'Dr.',
    lastName: 'Teste2',
    role: 'Psychologist',
    licenseNumber: 'CRP-789012',
    specialization: 'TEA',
    clinicName: 'Clínica Teste 2'
  };

  console.log('📝 Registrando psicólogo:', JSON.stringify(psychologistData, null, 2));

  const psychRegistResponse = await fetch('http://localhost:5175/api/Auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(psychologistData)
  });

  if (!psychRegistResponse.ok) {
    const errorText = await psychRegistResponse.text();
    console.log('❌ Erro no registro do psicólogo:', errorText);
    return;
  }

  const psychAuthData = await psychRegistResponse.json();
  console.log('✅ Psicólogo registrado:', JSON.stringify(psychAuthData, null, 2));

  // 2. Registrar um usuário Parent
  const parentData = {
    username: 'pai_teste',
    email: 'pai@test.com',
    password: '123456',
    firstName: 'Carlos',
    lastName: 'Silva',
    role: 'Parent',
    contactNumber: '11999888777',
    childRelationship: 'Father'
  };

  console.log('👨‍👩‍👧‍👦 Registrando parent:', JSON.stringify(parentData, null, 2));

  const parentRegistResponse = await fetch('http://localhost:5175/api/Auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parentData)
  });

  console.log('📊 Status registro parent:', parentRegistResponse.status);

  if (!parentRegistResponse.ok) {
    const errorText = await parentRegistResponse.text();
    console.log('❌ Erro no registro do parent:', errorText);
    return;
  }

  const parentAuthData = await parentRegistResponse.json();
  console.log('✅ Parent registrado:', JSON.stringify(parentAuthData, null, 2));

  // 3. Agora tentar criar criança com primaryParentId válido
  console.log('👶 Criando criança com parent válido...');

  const childData = {
    firstName: 'João',
    lastName: 'Silva',
    dateOfBirth: '2020-03-15T00:00:00Z',
    gender: 'Masculino',
    diagnosis: 'TEA',
    primaryParentId: parentAuthData.userId,  // Usar userId do parent registrado
    medicalHistory: 'Sem histórico médico relevante'
  };

  console.log('👶 Dados da criança:', JSON.stringify(childData, null, 2));

  const createChildResponse = await fetch('http://localhost:5175/api/Children', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${psychAuthData.token}`  // Token do psicólogo
    },
    body: JSON.stringify(childData)
  });

  console.log('📊 Status criação de criança:', createChildResponse.status);

  if (createChildResponse.ok) {
    const createdChild = await createChildResponse.json();
    console.log('✅ SUCCESS! Criança criada:', JSON.stringify(createdChild, null, 2));

    // 4. Testar se psicólogo consegue ver a criança
    console.log('🔍 Testando GET /api/Children após criação...');

    const childrenResponse = await fetch('http://localhost:5175/api/Children', {
      headers: {
        'Authorization': `Bearer ${psychAuthData.token}`
      }
    });

    if (childrenResponse.ok) {
      const children = await childrenResponse.json();
      console.log('✅ SUCCESS! Psicólogo vê as crianças:', JSON.stringify(children, null, 2));
    } else {
      const errorText = await childrenResponse.text();
      console.log('❌ Erro ao buscar crianças:', errorText);
    }

    // 5. Testar se parent consegue ver a criança
    console.log('👨‍👩‍👧‍👦 Testando acesso do parent às crianças...');

    const parentChildrenResponse = await fetch('http://localhost:5175/api/Children', {
      headers: {
        'Authorization': `Bearer ${parentAuthData.token}`
      }
    });

    if (parentChildrenResponse.ok) {
      const parentChildren = await parentChildrenResponse.json();
      console.log('✅ SUCCESS! Parent vê suas crianças:', JSON.stringify(parentChildren, null, 2));
    } else {
      const errorText = await parentChildrenResponse.text();
      console.log('❌ Erro no acesso do parent:', errorText);
    }

  } else {
    const errorText = await createChildResponse.text();
    console.log('❌ Erro na criação de criança:', errorText);
  }
}

testCreateParentAndChild().catch(console.error);