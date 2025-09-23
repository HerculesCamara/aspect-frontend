// Testar se a correção do AuthService resolveu o problema
async function testFixedRegister() {
  console.log('🧪 Testando correção do registro...');

  // 1. Primeiro, registrar um NOVO usuário psicólogo
  const registerData = {
    username: 'psicologo_test',
    email: 'psicologo@test.com',
    password: '123456',
    firstName: 'Dr.',
    lastName: 'Teste',
    role: 'Psychologist',
    licenseNumber: 'CRP-123456',
    specialization: 'TEA',
    clinicName: 'Clínica Teste'
  };

  console.log('📝 Registrando novo psicólogo:', JSON.stringify(registerData, null, 2));

  const registerResponse = await fetch('http://localhost:5175/api/Auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData)
  });

  console.log('📊 Status do registro:', registerResponse.status);

  if (!registerResponse.ok) {
    const errorText = await registerResponse.text();
    console.log('❌ Erro no registro:', errorText);
    return;
  }

  const authData = await registerResponse.json();
  console.log('✅ Registro realizado:', JSON.stringify(authData, null, 2));

  // 2. Agora testar se consegue acessar /api/Children
  console.log('🔍 Testando acesso a /api/Children...');

  const childrenResponse = await fetch('http://localhost:5175/api/Children', {
    headers: {
      'Authorization': `Bearer ${authData.token}`
    }
  });

  console.log('📊 Status do GET Children:', childrenResponse.status);

  if (childrenResponse.ok) {
    const children = await childrenResponse.json();
    console.log('✅ SUCCESS! Children endpoint funcionando:', JSON.stringify(children, null, 2));

    // 3. Testar criação de criança
    console.log('👶 Testando criação de criança...');

    const childData = {
      firstName: 'João',
      lastName: 'Silva',
      dateOfBirth: '2020-03-15T00:00:00Z',
      gender: 'Masculino',
      diagnosis: 'TEA',
      primaryParentId: "00000000-0000-0000-0000-000000000000"
    };

    const createChildResponse = await fetch('http://localhost:5175/api/Children', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.token}`
      },
      body: JSON.stringify(childData)
    });

    console.log('📊 Status da criação de criança:', createChildResponse.status);

    if (createChildResponse.ok) {
      const createdChild = await createChildResponse.json();
      console.log('✅ SUCCESS! Criança criada:', JSON.stringify(createdChild, null, 2));
    } else {
      const errorText = await createChildResponse.text();
      console.log('❌ Erro na criação de criança:', errorText);
    }

  } else {
    const errorText = await childrenResponse.text();
    console.log('❌ Ainda com erro no GET Children:', errorText);
  }
}

testFixedRegister().catch(console.error);