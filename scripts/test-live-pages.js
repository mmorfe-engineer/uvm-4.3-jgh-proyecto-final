const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function testLive() {
  const evidenciasDir = path.resolve(__dirname, '../docs/evidencias/live_test');
  if (!fs.existsSync(evidenciasDir)) {
    fs.mkdirSync(evidenciasDir, { recursive: true });
  }

  console.log('[TestLive] Iniciando Chromium con /snap/bin/chromium...');
  const browser = await chromium.launch({
    executablePath: '/snap/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Contexto limpio sin caché ni storage previo
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  const requests = [];
  const errors = [];
  const consoleMessages = [];

  page.on('console', (msg) => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.error('  [Console Error]:', msg.text());
    }
  });

  page.on('request', (req) => {
    requests.push({ url: req.url(), method: req.method() });
    if (req.url().includes('/api/')) {
      console.warn('  [Network Request to /api/]:', req.method(), req.url());
    }
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      errors.push({ url: res.url(), status: res.status() });
      console.error(`  [HTTP ${res.status()}]: ${res.url()}`);
    }
  });

  const targetUrl = 'https://mmorfe-engineer.github.io/uvm-4.3-jgh-proyecto-final/';
  console.log(`[TestLive] Navegando a ${targetUrl}...`);
  await page.goto(targetUrl, { waitUntil: 'networkidle' });

  // 1. Home y Verificación de Banner / Identificador Discreto
  await page.screenshot({ path: path.join(evidenciasDir, 'live_01_home.png') });
  console.log('  ✓ live_01_home.png guardada');

  const hasStaticBanner = (await page.$$('.static-demo-banner')).length > 0;
  console.log('  -> ¿Banner invasivo (.static-demo-banner) eliminado?:', !hasStaticBanner);
  if (hasStaticBanner) {
    throw new Error('El banner invasivo .static-demo-banner todavía está presente en el DOM.');
  }

  const navText = await page.evaluate(() => document.querySelector('header nav')?.innerText || '');
  const hasSubtleDemoBadge = navText.includes('Vista demostrativa');
  console.log('  -> ¿Identificación sobria «Vista demostrativa» en Navbar?:', hasSubtleDemoBadge);

  // 2. Ir a Encuestas
  console.log('[TestLive] Clic en navegación a Encuestas...');
  await page.click('button:has-text("Encuestas")');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(evidenciasDir, 'live_02_surveys.png') });
  console.log('  ✓ live_02_surveys.png guardada');

  // Evaluar contenido visible en Surveys
  const surveyPageText = await page.evaluate(() => document.body.innerText);
  console.log('[TestLive] ¿Aparece texto de Error 404?:', surveyPageText.includes('404') || surveyPageText.includes('Error HTTP'));
  console.log('[TestLive] Cantidad de tarjetas (.card):', (await page.$$('.card')).length);
  const mentionsOfficialApproval = surveyPageText.includes('aprobado oficialmente') || surveyPageText.includes('canónicos');
  console.log('  -> ¿Libre de atribuciones de aprobación oficial no otorgada?:', !mentionsOfficialApproval);

  // 3. Probar Filtros Temáticos
  const topicButtons = ['Formación y Bioética', 'Evaluación Académica', 'Vinculación Comunitaria', 'Todos los Ejes'];
  for (const topic of topicButtons) {
    console.log(`[TestLive] Probando filtro: "${topic}"...`);
    await page.click(`button:has-text("${topic}")`);
    await page.waitForTimeout(600);
    const count = (await page.$$('.card')).length;
    console.log(`  -> Tarjetas visibles para "${topic}": ${count}`);
    const has404 = (await page.evaluate(() => document.body.innerText)).includes('404');
    console.log(`  -> ¿Error 404 tras clic?: ${has404}`);
  }
  await page.screenshot({ path: path.join(evidenciasDir, 'live_03_filtered.png') });

  // 4. Probar Buscador Dinámico
  console.log('[TestLive] Probando buscador dinámico...');
  const searchInput = await page.$('input[aria-label="Buscar consultas e instrumentos formativos"]');
  if (searchInput) {
    await searchInput.fill('Bioética');
    await page.waitForTimeout(600);
    console.log('  -> Tarjetas con búsqueda "Bioética":', (await page.$$('.card')).length);

    await searchInput.fill('termino_inexistente_xyz_123');
    await page.waitForTimeout(600);
    const emptyStateText = await page.evaluate(() => document.body.innerText);
    console.log('  -> ¿Aparece estado vacío?:', emptyStateText.includes('No se encontraron instrumentos'));

    await searchInput.fill('');
    await page.waitForTimeout(600);
  }

  // 5. Probar Detalle de Encuesta
  console.log('[TestLive] Abriendo detalle de encuesta...');
  const examinarBtn = await page.$('button:has-text("Examinar Instrumento")');
  if (examinarBtn) {
    await examinarBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(evidenciasDir, 'live_04_detail.png') });
    console.log('  ✓ live_04_detail.png guardada');

    const detailText = await page.evaluate(() => document.body.innerText);
    console.log('  -> ¿Aparece formulario y preguntas?:', detailText.includes('Responder Instrumento') && detailText.includes('Ítem #1'));
    console.log('  -> ¿Aparece Error 404 en detalle?:', detailText.includes('404'));
    console.log('  -> ¿Aparece nota contextual sobria?:', detailText.includes('permanecen únicamente en este navegador'));
    const mentionsRelational = detailText.toLowerCase().includes('persistencia relacional');
    console.log('  -> ¿Libre de error conceptual de persistencia relacional en MongoDB?:', !mentionsRelational);

    // 6. Probar Interacción y Envío de Respuesta de Prueba (Demo en localStorage)
    console.log('[TestLive] Probando selección de opción y respuesta breve...');
    const firstRadio = await page.$('input[type="radio"]');
    if (firstRadio) {
      await firstRadio.click();
      console.log('  ✓ Opción seleccionada');
    }
    const textareas = await page.$$('textarea');
    if (textareas.length > 0) {
      await textareas[0].fill('Aporte formativo y bioético de prueba académica desde navegador real Chromium.');
      console.log('  ✓ Respuesta cualitativa completada');
    }

    const submitBtn = await page.$('button[type="submit"]:has-text("Guardar Respuesta de Prueba"), button[type="submit"]:has-text("Enviar Respuestas")');
    if (submitBtn) {
      console.log('[TestLive] Enviando respuesta de prueba...');
      await submitBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(evidenciasDir, 'live_05_results.png') });
      console.log('  ✓ live_05_results.png guardada');

      const afterSubmitText = await page.evaluate(() => document.body.innerText);
      console.log('  -> ¿Aparece confirmación o resultados agregados?:', afterSubmitText.includes('Resultados de la Consulta') || afterSubmitText.includes('registrada') || afterSubmitText.includes('guardada'));
      console.log('  -> ¿Libre de errores rojos en el flujo de guardado?:', !afterSubmitText.includes('Error al guardar') && !afterSubmitText.includes('503'));
    }
  }

  // 7. Probar Modal de Autenticación
  console.log('[TestLive] Verificando modal de información institucional...');
  const loginNavBtn = await page.$('button:has-text("Acceso"), button:has-text("Iniciar Sesión")');
  if (loginNavBtn) {
    await loginNavBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(evidenciasDir, 'live_06_auth_modal.png') });
    console.log('  ✓ live_06_auth_modal.png guardada');

    const authModalText = await page.evaluate(() => document.body.innerText);
    const passwordInputs = await page.$$('.modal-content input[type="password"]');
    console.log('  -> ¿Modal muestra Información sobre el Acceso de Usuario?:', authModalText.includes('Información sobre el Acceso de Usuario'));
    console.log('  -> ¿Cero campos de contraseña en versión pública?:', passwordInputs.length === 0);
    if (passwordInputs.length > 0) {
      throw new Error('El modal en versión pública sigue solicitando contraseña.');
    }

    // Continuar explorando
    const exploreBtn = await page.$('button:has-text("Continuar Explorando Consultas")');
    if (exploreBtn) {
      await exploreBtn.click();
      await page.waitForTimeout(400);
      console.log('  ✓ Modal cerrado con "Continuar Explorando Consultas"');
    } else {
      const closeBtn = await page.$('.modal-content button');
      if (closeBtn) await closeBtn.click();
      await page.waitForTimeout(400);
    }
  }

  // 8. Probar Contacto y Vinculación
  console.log('[TestLive] Navegando a Contacto...');
  const contactNavBtn = await page.$('button:has-text("Contacto")');
  if (contactNavBtn) {
    await contactNavBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(evidenciasDir, 'live_07_contact.png') });
    console.log('  ✓ live_07_contact.png guardada');
  }

  console.log('\n=============================================');
  console.log('[TestLive] RESUMEN DE PETICIONES Y ERRORES:');
  console.log('Total peticiones de red:', requests.length);
  console.log('Peticiones HTTP >= 400:', errors);
  console.log('Errores en consola del navegador:', consoleMessages.filter((m) => m.type === 'error'));
  console.log('=============================================\n');

  if (errors.length > 0) {
    throw new Error(`Se detectaron ${errors.length} respuestas HTTP con código de error >= 400.`);
  }

  await browser.close();
}

testLive().catch((e) => {
  console.error('[TestLive] Error fatal:', e);
  process.exit(1);
});
