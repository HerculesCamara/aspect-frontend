// Testar integração completa do módulo Reports
async function testReportsIntegration() {
  console.log('🧪 Testando integração Reports...');

  // Reutilizar dados de teste anteriores
  const psychologistData = {
    username: 'psicologo_reports',
    email: 'psicologo.reports@test.com',
    password: '123456',
    firstName: 'Dr.',
    lastName: 'ReportsTest',
    role: 'Psychologist',
    licenseNumber: 'CRP-REPORTS',
    specialization: 'TEA',
    clinicName: 'Clínica Reports Test'
  };

  const parentData = {
    username: 'pai_reports',
    email: 'pai.reports@test.com',
    password: '123456',
    firstName: 'José',
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
      firstName: 'Maria',
      lastName: 'Santos',
      dateOfBirth: '2019-05-20T00:00:00Z',
      gender: 'Feminino',
      diagnosis: 'TEA Nível 2',
      primaryParentId: parentAuthData.userId,
      medicalHistory: 'Criança para teste de relatórios'
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

    // 4. TESTAR REPORTS - Criar relatório
    console.log('📊 Testando criação de relatório...');
    const reportData = {
      childId: createdChild.childId,
      startPeriod: '2025-09-01T00:00:00Z',
      endPeriod: '2025-09-30T23:59:59Z',
      reportType: 'Mensal',
      summaryForParent: 'Maria apresentou progresso significativo na comunicação alternativa, usando PECS com mais independência.',
      clinicalNotes: 'Observou-se melhora na tolerância a estímulos sensoriais. Comportamentos repetitivos diminuíram 30%. Recomenda-se intensificar trabalho em interação social.',
      isSharedWithParent: false
    };

    const createReportResponse = await fetch('http://localhost:5175/api/Reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${psychAuthData.token}`
      },
      body: JSON.stringify(reportData)
    });

    console.log('📊 Status criação de relatório:', createReportResponse.status);

    if (createReportResponse.ok) {
      const createdReport = await createReportResponse.json();
      console.log('✅ SUCCESS! Relatório criado:', JSON.stringify(createdReport, null, 2));

      // 5. Testar GET de relatórios por criança
      console.log('🔍 Testando busca de relatórios por criança...');
      const getReportsResponse = await fetch(`http://localhost:5175/api/Reports/child/${createdChild.childId}`, {
        headers: {
          'Authorization': `Bearer ${psychAuthData.token}`
        }
      });

      if (getReportsResponse.ok) {
        const reports = await getReportsResponse.json();
        console.log('✅ SUCCESS! Relatórios encontrados:', reports.length);
        console.log('Primeiro relatório:', JSON.stringify(reports[0], null, 2));

        // 6. Testar compartilhamento com pais
        console.log('👨‍👩‍👧‍👦 Testando compartilhamento com pais...');
        const shareResponse = await fetch(`http://localhost:5175/api/Reports/${createdReport.reportId}/share`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${psychAuthData.token}`
          },
          body: JSON.stringify(true)
        });

        if (shareResponse.ok) {
          const shareResult = await shareResponse.json();
          console.log('✅ SUCCESS! Relatório compartilhado:', shareResult.message);

          // 7. Testar acesso dos pais
          console.log('👀 Testando acesso dos pais aos relatórios...');
          const parentReportsResponse = await fetch(`http://localhost:5175/api/Reports/child/${createdChild.childId}`, {
            headers: {
              'Authorization': `Bearer ${parentAuthData.token}`
            }
          });

          if (parentReportsResponse.ok) {
            const parentReports = await parentReportsResponse.json();
            console.log('✅ SUCCESS! Pais podem ver relatórios:', parentReports.length);
            if (parentReports.length > 0) {
              console.log('Relatório visto pelos pais:', {
                tipo: parentReports[0].reportType,
                periodo: `${parentReports[0].startPeriod} até ${parentReports[0].endPeriod}`,
                compartilhado: parentReports[0].isSharedWithParent,
                resumo: parentReports[0].summaryForParent,
                estatisticas: parentReports[0].statistics
              });
            }

            // 8. Testar download de PDF
            console.log('📄 Testando download de PDF...');
            const pdfResponse = await fetch(`http://localhost:5175/api/Reports/${createdReport.reportId}/pdf`, {
              headers: {
                'Authorization': `Bearer ${psychAuthData.token}`
              }
            });

            if (pdfResponse.ok) {
              const blob = await pdfResponse.blob();
              console.log('✅ SUCCESS! PDF gerado:', {
                tamanho: `${(blob.size / 1024).toFixed(2)} KB`,
                tipo: blob.type
              });

              console.log('🎉 TODOS OS TESTES DE REPORTS PASSARAM!');
              console.log('📋 Resumo dos testes realizados:');
              console.log('  ✅ Criar relatório');
              console.log('  ✅ Buscar relatórios por criança');
              console.log('  ✅ Compartilhar com pais');
              console.log('  ✅ Acesso dos pais aos relatórios');
              console.log('  ✅ Download de PDF');

            } else {
              const errorText = await pdfResponse.text();
              console.log('❌ Erro no download de PDF:', errorText);
            }

          } else {
            const errorText = await parentReportsResponse.text();
            console.log('❌ Erro no acesso dos pais:', errorText);
          }

        } else {
          const errorText = await shareResponse.text();
          console.log('❌ Erro no compartilhamento:', errorText);
        }

      } else {
        const errorText = await getReportsResponse.text();
        console.log('❌ Erro na busca de relatórios:', errorText);
      }

    } else {
      const errorText = await createReportResponse.text();
      console.log('❌ Erro na criação de relatório:', errorText);
    }

  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
  }
}

testReportsIntegration().catch(console.error);