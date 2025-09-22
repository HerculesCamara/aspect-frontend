const { chromium } = require('playwright');

async function testLogin() {
  console.log('🚀 Iniciando teste de login...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Interceptar requests de rede
  page.on('request', request => {
    if (request.url().includes('/api/Auth/login')) {
      console.log('🌐 Request para API:', request.url());
      console.log('📝 Body:', request.postData());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/Auth/login')) {
      console.log('✅ Response da API:', response.status());
    }
  });

  // Ir para a página de login
  await page.goto('http://localhost:3000/login');
  console.log('📄 Página de login carregada');

  // Aguardar o formulário aparecer
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });

  // Preencher formulário com credenciais da API real
  console.log('✏️ Preenchendo formulário...');
  await page.fill('input[type="email"]', 'test@test.com');
  await page.fill('input[type="password"]', '123456');

  // Clicar no botão de login
  console.log('🔄 Fazendo login...');
  await page.click('button[type="submit"]');

  // Aguardar resposta
  await page.waitForTimeout(3000);

  // Verificar localStorage
  const localStorage = await page.evaluate(() => {
    return {
      token: localStorage.getItem('aspct_token'),
      usingMock: localStorage.getItem('aspct_using_mock'),
      mockUser: localStorage.getItem('aspct_mock_user')
    };
  });

  console.log('💾 LocalStorage:', JSON.stringify(localStorage, null, 2));

  // Verificar URL atual
  const currentUrl = page.url();
  console.log('📍 URL atual:', currentUrl);

  // Verificar se há mensagens de erro na página
  const errorMessages = await page.$$eval('[role="alert"], .error, .text-red-500', elements =>
    elements.map(el => el.textContent)
  );

  if (errorMessages.length > 0) {
    console.log('❌ Erros encontrados:', errorMessages);
  }

  console.log('⏸️ Navegador aberto - verifique manualmente e feche quando terminar');

  // Aguardar fechamento manual
  await page.waitForTimeout(60000);

  await browser.close();
}

testLogin().catch(console.error);