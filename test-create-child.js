// Usar fetch nativo do Node.js 18+

async function testCreateChild() {
  console.log('🚀 Testando criação de criança...');

  // Primeiro fazer login
  const loginResponse = await fetch('http://localhost:5175/api/Auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'test@test.com',
      password: '123456'
    })
  });

  if (!loginResponse.ok) {
    console.error('❌ Erro no login:', loginResponse.status);
    return;
  }

  const authData = await loginResponse.json();
  console.log('✅ Login realizado:', JSON.stringify(authData, null, 2));

  // Agora criar uma criança
  const childData = {
    firstName: 'João',
    lastName: 'Silva',
    dateOfBirth: '2020-03-15T00:00:00Z',
    gender: 'Masculino',
    diagnosis: 'TEA',
    primaryParentId: "00000000-0000-0000-0000-000000000000" // Placeholder por enquanto
  };

  console.log('📝 Dados da criança a ser criada:', JSON.stringify(childData, null, 2));

  const createResponse = await fetch('http://localhost:5175/api/Children', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authData.token}`
    },
    body: JSON.stringify(childData)
  });

  console.log('📊 Status da criação:', createResponse.status);

  if (createResponse.ok) {
    const childResponse = await createResponse.json();
    console.log('✅ Criança criada:', JSON.stringify(childResponse, null, 2));

    // Agora testar GET /api/Children
    const getResponse = await fetch('http://localhost:5175/api/Children', {
      headers: {
        'Authorization': `Bearer ${authData.token}`
      }
    });

    console.log('📊 Status do GET Children:', getResponse.status);

    if (getResponse.ok) {
      const children = await getResponse.json();
      console.log('✅ Crianças encontradas:', JSON.stringify(children, null, 2));
    } else {
      const errorText = await getResponse.text();
      console.log('❌ Erro no GET Children:', errorText);
    }

  } else {
    const errorText = await createResponse.text();
    console.log('❌ Erro na criação:', errorText);
  }
}

testCreateChild().catch(console.error);