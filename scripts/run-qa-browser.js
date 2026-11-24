/**
 * scripts/run-qa-browser.js
 * Automatización QA en navegador real (Chromium) con Playwright
 * Ejecuta pruebas funcionales end-to-end y captura evidencias fotográficas en 3 viewports:
 * - Escritorio: 1440 × 900
 * - Tableta: 768 × 1024
 * - Móvil: 390 × 844
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runQa() {
  const evidenciasDir = path.resolve(__dirname, '../docs/evidencias');
  if (!fs.existsSync(evidenciasDir)) {
    fs.mkdirSync(evidenciasDir, { recursive: true });
  }

  // Crear archivo adjunto de prueba para el formulario de contacto
  const samplePdfPath = path.resolve(__dirname, 'sample-documento-comunitario.pdf');
  fs.writeFileSync(samplePdfPath, '%PDF-1.4\n% JGH Encuestas Documento Oficial\n%%EOF');

  console.log('[QA Browser] Lanzando Chromium...');
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: fs.existsSync('/snap/bin/chromium') ? '/snap/bin/chromium' : undefined,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (e) {
    console.log('[QA Browser] Fallback a chromium bundled de Playwright...');
    browser = await chromium.launch({ headless: true });
  }

  try {
    // =========================================================================
    // 1. ESCRITORIO (1440 x 900)
    // =========================================================================
    console.log('\n[QA Browser] Iniciando pruebas en Escritorio (1440 x 900)...');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await desktopContext.newPage();

    // 1.1 Home
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.site-header');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '01_desktop_home.png') });
    console.log('  ✓ 01_desktop_home.png');

    // 1.2 Encuestas
    await page.click('button:has-text("Encuestas")');
    await page.waitForSelector('.card');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '02_desktop_surveys.png') });
    console.log('  ✓ 02_desktop_surveys.png');

    // 1.3 Detalle de Encuesta
    await page.click('button:has-text("Ver Contenido de la Encuesta")');
    await page.waitForSelector('h1');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '03_desktop_survey_detail.png') });
    console.log('  ✓ 03_desktop_survey_detail.png');

    // 1.4 Contacto
    await page.click('button:has-text("Contacto")');
    await page.waitForSelector('form');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '04_desktop_contact.png') });
    console.log('  ✓ 04_desktop_contact.png');

    // 1.5 Llenar y enviar formulario de contacto con los 5 campos requeridos
    await page.fill('#name', 'Dra. Carmen Teresa Sosa');
    await page.fill('#email', 'csosa@saludvallemomboy.edu.ve');
    await page.fill('#phone', '+58 416 8877665');
    await page.fill('#proposedDate', '2026-12-15');
    await page.fill('#estimatedParticipants', '75');
    await page.check('input[value="academica"]');
    await page.fill('#message', 'Propuesta formal de ciclo de conferencias sobre el humanismo médico del Dr. José Gregorio Hernández.');
    
    // Adjuntar archivo PDF
    const fileInput = await page.$('#fileUpload');
    await fileInput.setInputFiles(samplePdfPath);

    await page.waitForTimeout(400);
    await page.click('button:has-text("Enviar Solicitud de Contacto")');
    
    // Esperar mensaje de éxito de persistencia
    await page.waitForSelector('.alert-success');
    await page.screenshot({ path: path.join(evidenciasDir, '05_desktop_contact_success.png') });
    console.log('  ✓ 05_desktop_contact_success.png');

    // 1.6 Modal de Autenticación
    await page.click('button:has-text("Iniciar Sesión")');
    await page.waitForSelector('.modal-content');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(evidenciasDir, '06_desktop_auth_modal.png') });
    console.log('  ✓ 06_desktop_auth_modal.png');

    // Iniciar sesión con Admin demo
    await page.click('button:has-text("Autocompletar Admin")');
    await page.click('button:has-text("Ingresar al Sistema")');
    await page.waitForSelector('.role-tag.admin');
    console.log('  ✓ Sesión iniciada como Admin exitosamente.');

    // 1.7 Panel de Administración
    await page.click('button:has-text("Administración")');
    await page.waitForSelector('table');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '07_desktop_admin_dashboard.png') });
    console.log('  ✓ 07_desktop_admin_dashboard.png');

    // Ver contactos recibidos en panel admin
    await page.click('button:has-text("Solicitudes de Contacto")');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(evidenciasDir, '08_desktop_admin_contacts.png') });
    console.log('  ✓ 08_desktop_admin_contacts.png');

    await desktopContext.close();

    // =========================================================================
    // 2. TABLETA (768 x 1024)
    // =========================================================================
    console.log('\n[QA Browser] Iniciando pruebas en Tableta (768 x 1024)...');
    const tabletContext = await browser.newContext({
      viewport: { width: 768, height: 1024 },
    });
    const tabletPage = await tabletContext.newPage();

    await tabletPage.goto('http://localhost:3000');
    await tabletPage.waitForSelector('.site-header');
    await tabletPage.waitForTimeout(500);
    await tabletPage.screenshot({ path: path.join(evidenciasDir, '09_tablet_home.png') });
    console.log('  ✓ 09_tablet_home.png');

    await tabletPage.click('button:has-text("Contacto")');
    await tabletPage.waitForSelector('form');
    await tabletPage.waitForTimeout(500);
    await tabletPage.screenshot({ path: path.join(evidenciasDir, '10_tablet_contact.png') });
    console.log('  ✓ 10_tablet_contact.png');

    await tabletContext.close();

    // =========================================================================
    // 3. MÓVIL (390 x 844)
    // =========================================================================
    console.log('\n[QA Browser] Iniciando pruebas en Móvil (390 x 844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.goto('http://localhost:3000');
    await mobilePage.waitForSelector('.site-header');
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(evidenciasDir, '11_mobile_home.png') });
    console.log('  ✓ 11_mobile_home.png');

    await mobilePage.click('button:has-text("Encuestas")');
    await mobilePage.waitForSelector('.card');
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(evidenciasDir, '12_mobile_surveys.png') });
    console.log('  ✓ 12_mobile_surveys.png');

    await mobilePage.click('button:has-text("Contacto")');
    await mobilePage.waitForSelector('form');
    await mobilePage.waitForTimeout(500);
    await mobilePage.screenshot({ path: path.join(evidenciasDir, '13_mobile_contact.png') });
    console.log('  ✓ 13_mobile_contact.png');

    await mobileContext.close();

    console.log('\n[QA Browser] ¡Pruebas en navegador completadas exitosamente con evidencias generadas!');
  } finally {
    await browser.close();
    if (fs.existsSync(samplePdfPath)) {
      fs.unlinkSync(samplePdfPath);
    }
  }
}

runQa().catch((err) => {
  console.error('[QA Browser] Error ejecutando suite en navegador:', err);
  process.exit(1);
});
