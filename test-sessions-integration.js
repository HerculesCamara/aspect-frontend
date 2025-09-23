// Testar integração completa do módulo Sessions
async function testSessionsIntegration() {
  console.log('🧪 Testando integração Sessions...');

  // Usar dados dos testes anteriores que funcionaram
  const psychologistData = {
    username: 'psicologo_session',
    email: 'psicologo.session@test.com',
    password: '123456',
    firstName: 'Dr.',
    lastName: 'SessionTest',
    role: 'Psychologist',
    licenseNumber: 'CRP-SESSION',
    specialization: 'TEA',
    clinicName: 'Clínica Session Test'
  };

  const parentData = {
    username: 'pai_session',
    email: 'pai.session@test.com',
    password: '123456',
    firstName: 'João',
    lastName: 'Silva',
    role: 'Parent',
    contactNumber: '11999888555',
    childRelationship: 'Father'
  };

  try {
    // 1. Registrar psicólogo
    console.log('👨‍⚕️ Registrando psicólogo...');
    const psychRegistResponse = await fetch('http://localhost:5175/api/Auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(psychologistData)
    });

    if (!psychRegistResponse.ok) {
      throw new Error(`Erro no registro do psicólogo: ${psychRegistResponse.status}`);
    }

    const psychAuthData = await psychRegistResponse.json();
    console.log('✅ Psicólogo registrado:', psychAuthData.email);

    // 2. Registrar parent
    console.log('👨‍👩‍👧‍👦 Registrando parent...');
    const parentRegistResponse = await fetch('http://localhost:5175/api/Auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parentData)
    });

    if (!parentRegistResponse.ok) {
      throw new Error(`Erro no registro do parent: ${parentRegistResponse.status}`);
    }

    const parentAuthData = await parentRegistResponse.json();
    console.log('✅ Parent registrado:', parentAuthData.email);

    // 3. Criar criança
    console.log('👶 Criando criança...');
    const childData = {
      firstName: 'João',
      lastName: 'Silva',
      dateOfBirth: '2020-03-15T00:00:00Z',
      gender: 'Masculino',
      diagnosis: 'TEA',
      primaryParentId: parentAuthData.userId,
      medicalHistory: 'Criança para teste de sessões'
    };

    const createChildResponse = await fetch('http://localhost:5175/api/Children', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${psychAuthData.token}`
      },
      body: JSON.stringify(childData)
    });

    if (!createChildResponse.ok) {
      throw new Error(`Erro na criação da criança: ${createChildResponse.status}`);
    }

    const createdChild = await createChildResponse.json();
    console.log('✅ Criança criada:', createdChild.firstName, createdChild.lastName);

    // 4. TESTAR SESSIONS - Criar sessão
    console.log('📝 Testando criação de sessão...');
    const sessionData = {
      childId: createdChild.childId,
      sessionDate: new Date().toISOString(),
      duration: 60,
      sessionType: 'individual',
      notesWhatWasDone: 'Trabalho com comunicação funcional usando PECS',
      notesWhatWasDiagnosed: 'Criança demonstrou progresso em pedidos espontâneos',
      notesWhatWillBeDone: 'Continuar com PECS nível 2 na próxima sessão',
      isSharedWithParent: false
    };

    const createSessionResponse = await fetch('http://localhost:5175/api/Sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${psychAuthData.token}`
      },
      body: JSON.stringify(sessionData)
    });

    console.log('📊 Status criação de sessão:', createSessionResponse.status);

    if (createSessionResponse.ok) {
      const createdSession = await createSessionResponse.json();
      console.log('✅ SUCCESS! Sessão criada:', JSON.stringify(createdSession, null, 2));

      // 5. Testar GET de sessões por criança
      console.log('🔍 Testando busca de sessões por criança...');
      const getSessionsResponse = await fetch(`http://localhost:5175/api/Sessions/child/${createdChild.childId}`, {
        headers: {
          'Authorization': `Bearer ${psychAuthData.token}`
        }
      });

      if (getSessionsResponse.ok) {
        const sessions = await getSessionsResponse.json();
        console.log('✅ SUCCESS! Sessões encontradas:', sessions.length);
        console.log('Primeira sessão:', JSON.stringify(sessions[0], null, 2));

        // 6. Testar compartilhamento com pais
        console.log('👨‍👩‍👧‍👦 Testando compartilhamento com pais...');
        const shareResponse = await fetch(`http://localhost:5175/api/Sessions/${createdSession.sessionId}/share`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${psychAuthData.token}`
          },
          body: JSON.stringify(true)
        });

        if (shareResponse.ok) {
          const shareResult = await shareResponse.json();
          console.log('✅ SUCCESS! Sessão compartilhada:', shareResult.message);

          // 7. Testar acesso dos pais
          console.log('👀 Testando acesso dos pais às sessões...');
          const parentSessionsResponse = await fetch(`http://localhost:5175/api/Sessions/child/${createdChild.childId}`, {
            headers: {
              'Authorization': `Bearer ${parentAuthData.token}`
            }
          });

          if (parentSessionsResponse.ok) {
            const parentSessions = await parentSessionsResponse.json();
            console.log('✅ SUCCESS! Pais podem ver sessões:', parentSessions.length);
            if (parentSessions.length > 0) {
              console.log('Sessão vista pelos pais:', {
                data: parentSessions[0].sessionDate,
                tipo: parentSessions[0].sessionType,
                compartilhada: parentSessions[0].isSharedWithParent,
                resumo: parentSessions[0].parentSummary
              });
            }

            // 8. Testar atualização de sessão
            console.log('✏️ Testando atualização de sessão...');
            const updateData = {
              notesWhatWillBeDone: 'ATUALIZADO: Implementar exercícios de coordenação bilateral',
              duration: 45
            };

            const updateResponse = await fetch(`http://localhost:5175/api/Sessions/${createdSession.sessionId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${psychAuthData.token}`
              },
              body: JSON.stringify(updateData)
            });

            if (updateResponse.ok) {
              const updatedSession = await updateResponse.json();
              console.log('✅ SUCCESS! Sessão atualizada:', {
                id: updatedSession.sessionId,
                duracao: updatedSession.duration,
                proximosPassos: updatedSession.notesWhatWillBeDone
              });

              console.log('🎉 TODOS OS TESTES DE SESSIONS PASSARAM!');
              console.log('📋 Resumo dos testes realizados:');
              console.log('  ✅ Criar sessão');
              console.log('  ✅ Buscar sessões por criança');
              console.log('  ✅ Compartilhar com pais');
              console.log('  ✅ Acesso dos pais às sessões');
              console.log('  ✅ Atualizar sessão');

            } else {
              const errorText = await updateResponse.text();
              console.log('❌ Erro na atualização:', errorText);
            }

          } else {
            const errorText = await parentSessionsResponse.text();
            console.log('❌ Erro no acesso dos pais:', errorText);
          }

        } else {
          const errorText = await shareResponse.text();
          console.log('❌ Erro no compartilhamento:', errorText);
        }

      } else {
        const errorText = await getSessionsResponse.text();
        console.log('❌ Erro na busca de sessões:', errorText);
      }

    } else {
      const errorText = await createSessionResponse.text();
      console.log('❌ Erro na criação de sessão:', errorText);
    }

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
}

testSessionsIntegration().catch(console.error);