/**
 * scripts/build-manual-tecnico-pdf.js
 * Compila scripts/manual_tecnico_template.html a docs/manuales/MANUAL_TECNICO.pdf
 * utilizando Chromium / Playwright y verifica que cumpla el mínimo de 8 páginas oficiales.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

async function generateManualTecnicoPdf() {
  const outputDir = path.resolve(__dirname, '../docs/manuales');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pdfPath = path.join(outputDir, 'MANUAL_TECNICO.pdf');
  const templatePath = path.join(__dirname, 'manual_tecnico_template.html');

  console.log('[PDF Builder] Leyendo plantilla HTML:', templatePath);
  const htmlContent = fs.readFileSync(templatePath, 'utf8');

  console.log('[PDF Builder] Lanzando Chromium...');
  const browser = await chromium.launch({
    executablePath: fs.existsSync('/snap/bin/chromium') ? '/snap/bin/chromium' : undefined,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    console.log('[PDF Builder] Renderizando documento formal a PDF...');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: '<div style="font-family: sans-serif; font-size: 8pt; width: 100%; text-align: right; padding-right: 15mm; color: #78909c;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>',
      margin: {
        top: '15mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
    });

    console.log(`[PDF Builder] PDF generado exitosamente en: ${pdfPath}`);

    // Verificar número de páginas con pdfinfo
    const pdfInfoOutput = execSync(`pdfinfo "${pdfPath}"`).toString();
    const pagesMatch = pdfInfoOutput.match(/Pages:\s+(\d+)/);
    const pageCount = pagesMatch ? parseInt(pagesMatch[1], 10) : 0;

    console.log(`\n======================================================`);
    console.log(`[PDF Builder] Verificación de Paginación Formal`);
    console.log(`[PDF Builder] Total de páginas generadas: ${pageCount}`);
    console.log(`[PDF Builder] Requisito oficial (mínimo 8 páginas): ${pageCount >= 8 ? 'CUMPLE ESTRICTAMENTE' : 'NO CUMPLE'}`);
    console.log(`======================================================\n`);

    if (pageCount < 8) {
      console.error('[PDF Builder] ERROR: El manual técnico no alcanza las 8 páginas mínimas exigidas.');
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

generateManualTecnicoPdf().catch((err) => {
  console.error('[PDF Builder] Error generando PDF:', err);
  process.exit(1);
});
