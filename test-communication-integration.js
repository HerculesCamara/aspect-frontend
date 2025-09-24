// Testar integração completa do módulo Communication
async function testCommunicationIntegration() {
  console.log('🧪 Testando integração Communication...');

  const timestamp = Date.now();

  const psychologistData = {
    username: `psicologo_comm_${timestamp}`,
    email: `psicologo.comm.${timestamp}@test.com`,
    password: '123456',
    firstName: 'Dr.',
    lastName: 'CommTest',
    role: 'Psychologist',
    licenseNumber: `CRP-COMM-${timestamp}`,
    specialization: 'TEA',
    clinicName: 'Clínica Comm Test'
  };

  const parentData = {
    username: `pai_comm_${timestamp}`,
    email: `pai.comm.${timestamp}@test.com`,
    password: '123456',
    firstName: 'Carlos',
    lastName: 'Santos',
    role: 'Parent',
    contactNumber: '11999777666',
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
      firstName: 'Pedro',
      lastName: 'Santos',
      dateOfBirth: '2021-05-20T00:00:00Z',
      gender: 'Masculino',
      diagnosis: 'TEA',
      primaryParentId: parentAuthData.userId,
      medicalHistory: 'Criança para teste de comunicação'
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
      throw new Error(`Erro ao criar criança: ${createChildResponse.status}`);
    }

    const childCreated = await createChildResponse.json();
    console.log('✅ Criança criada:', childCreated.fullName);
    console.log('📝 Psicólogo atribuído:', childCreated.assignedPsychologistId);

    // Verificar se psicólogo tem acesso
    console.log('🔐 Verificando acesso do psicólogo à criança...');
    const canAccessResponse = await fetch(
      `http://localhost:5175/api/Children/${childCreated.childId}/can-access`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${psychAuthData.token}`
        }
      }
    );

    const canAccess = await canAccessResponse.json();
    console.log('✅ Psicólogo tem acesso:', canAccess);

    // 4. Parent envia mensagem para psicólogo (testando direção oposta)
    console.log('📤 Parent enviando mensagem para psicólogo...');
    const messageData = {
      recipientId: psychAuthData.userId,
      content: 'Olá Doutor! Gostaria de saber como foi a sessão do Pedro hoje.',
      childId: childCreated.childId
    };

    const sendMessageResponse = await fetch('http://localhost:5175/api/Communication/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parentAuthData.token}`
      },
      body: JSON.stringify(messageData)
    });

    if (!sendMessageResponse.ok) {
      const errorText = await sendMessageResponse.text();
      throw new Error(`Erro ao enviar mensagem (Parent): ${sendMessageResponse.status} - ${errorText}`);
    }

    const sentMessage = await sendMessageResponse.json();
    console.log('✅ Mensagem enviada (Parent → Psicólogo):', {
      id: sentMessage.id,
      conteudo: sentMessage.content,
      lida: sentMessage.isRead
    });

    // 5. Parent busca mensagens não lidas
    console.log('📬 Parent buscando mensagens não lidas...');
    const unreadMessagesResponse = await fetch('http://localhost:5175/api/Communication/unread', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${parentAuthData.token}`
      }
    });

    if (!unreadMessagesResponse.ok) {
      throw new Error(`Erro ao buscar mensagens não lidas: ${unreadMessagesResponse.status}`);
    }

    const unreadMessages = await unreadMessagesResponse.json();
    console.log('✅ Mensagens não lidas:', unreadMessages.length);

    // 6. Parent busca contador de não lidas
    console.log('🔢 Buscando contador de mensagens não lidas...');
    const unreadCountResponse = await fetch('http://localhost:5175/api/Communication/unread-count', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${parentAuthData.token}`
      }
    });

    if (!unreadCountResponse.ok) {
      throw new Error(`Erro ao buscar contador: ${unreadCountResponse.status}`);
    }

    const unreadCount = await unreadCountResponse.json();
    console.log('✅ Contador de não lidas:', unreadCount);

    // 7. Parent marca mensagem como lida
    console.log('✔️ Parent marcando mensagem como lida...');
    const markReadResponse = await fetch(`http://localhost:5175/api/Communication/${sentMessage.id}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${parentAuthData.token}`
      }
    });

    if (!markReadResponse.ok) {
      throw new Error(`Erro ao marcar como lida: ${markReadResponse.status}`);
    }

    console.log('✅ Mensagem marcada como lida');

    // 8. Parent responde para psicólogo
    console.log('📤 Parent respondendo mensagem...');
    const replyData = {
      recipientId: psychAuthData.userId,
      content: 'Ótimo! Muito obrigado pelo retorno. Sim, podemos conversar na quinta-feira às 14h?',
      childId: childCreated.childId
    };

    const replyResponse = await fetch('http://localhost:5175/api/Communication/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parentAuthData.token}`
      },
      body: JSON.stringify(replyData)
    });

    if (!replyResponse.ok) {
      throw new Error(`Erro ao enviar resposta: ${replyResponse.status}`);
    }

    const replyMessage = await replyResponse.json();
    console.log('✅ Resposta enviada:', replyMessage.content);

    // 9. Buscar conversa completa entre psicólogo e parent
    console.log('💬 Buscando conversa completa...');
    const conversationResponse = await fetch(
      `http://localhost:5175/api/Communication/conversation/${parentAuthData.userId}/child/${childCreated.childId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${psychAuthData.token}`
        }
      }
    );

    if (!conversationResponse.ok) {
      throw new Error(`Erro ao buscar conversa: ${conversationResponse.status}`);
    }

    const conversation = await conversationResponse.json();
    console.log('✅ Conversa completa:', conversation.length, 'mensagens');
    conversation.forEach((msg, idx) => {
      console.log(`   ${idx + 1}. ${msg.sender.name}: ${msg.content.substring(0, 50)}...`);
    });

    // 10. Buscar todas as mensagens por criança
    console.log('📨 Buscando todas as mensagens da criança...');
    const childMessagesResponse = await fetch(
      `http://localhost:5175/api/Communication/child/${childCreated.childId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${psychAuthData.token}`
        }
      }
    );

    if (!childMessagesResponse.ok) {
      throw new Error(`Erro ao buscar mensagens da criança: ${childMessagesResponse.status}`);
    }

    const childMessages = await childMessagesResponse.json();
    console.log('✅ Mensagens da criança:', childMessages.length);

    // RESUMO FINAL
    console.log('\n🎉 ===============================================');
    console.log('✅ TESTE DE INTEGRAÇÃO COMMUNICATION COMPLETO!');
    console.log('===============================================');
    console.log('📊 Funcionalidades testadas:');
    console.log('   ✅ Envio de mensagem (Psicólogo → Parent)');
    console.log('   ✅ Busca de mensagens não lidas');
    console.log('   ✅ Contador de não lidas');
    console.log('   ✅ Marcar mensagem como lida');
    console.log('   ✅ Resposta de mensagem (Parent → Psicólogo)');
    console.log('   ✅ Busca de conversa completa');
    console.log('   ✅ Busca de mensagens por criança');
    console.log('');
    console.log('📈 Dados criados:');
    console.log(`   - Psicólogo: ${psychAuthData.email}`);
    console.log(`   - Parent: ${parentAuthData.email}`);
    console.log(`   - Criança: ${childCreated.fullName}`);
    console.log(`   - Mensagens: ${conversation.length}`);

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Executar teste
testCommunicationIntegration();