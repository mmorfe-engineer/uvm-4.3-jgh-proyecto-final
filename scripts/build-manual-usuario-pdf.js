/**
 * scripts/build-manual-usuario-pdf.js
 * Compila el Manual de Usuario a PDF con capturas de pantalla reales embebidas
 * utilizando Chromium / Playwright.
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function generateManualUsuarioPdf() {
  const outputDir = path.resolve(__dirname, '../docs/manuales');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const evidenciasDir = path.resolve(__dirname, '../docs/evidencias');
  const pdfPath = path.join(outputDir, 'MANUAL_USUARIO.pdf');

  // Helper para convertir imagen a base64 Data URI
  const getImgBase64 = (filename) => {
    const filePath = path.join(evidenciasDir, filename);
    if (!fs.existsSync(filePath)) return '';
    const ext = path.extname(filename).replace('.', '');
    const b64 = fs.readFileSync(filePath).toString('base64');
    return `data:image/${ext};base64,${b64}`;
  };

  const imgHome = getImgBase64('01_desktop_home.png');
  const imgSurveys = getImgBase64('02_desktop_surveys.png');
  const imgDetail = getImgBase64('03_desktop_survey_detail.png');
  const imgContact = getImgBase64('04_desktop_contact.png');
  const imgContactSuccess = getImgBase64('05_desktop_contact_success.png');
  const imgAuth = getImgBase64('06_desktop_auth_modal.png');
  const imgAdmin = getImgBase64('07_desktop_admin_dashboard.png');
  const imgAdminContacts = getImgBase64('08_desktop_admin_contacts.png');

  console.log('[User Manual Builder] Generando HTML con capturas de pantalla...');

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: #203236;
      line-height: 1.5;
      font-size: 9.5pt;
      margin: 0;
      padding: 0;
    }

    .page {
      page-break-after: always;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .page:last-child {
      page-break-after: auto;
    }

    h1, h2, h3 {
      font-family: 'Cinzel', serif;
      color: #103D45;
      margin-top: 0;
    }

    h1 { font-size: 20pt; line-height: 1.2; }
    h2 { font-size: 14pt; border-bottom: 2px solid #F0D39A; padding-bottom: 3px; margin-bottom: 10px; margin-top: 10px; }
    h3 { font-size: 11pt; color: #18525D; margin-bottom: 6px; margin-top: 8px; }

    p { margin-bottom: 8px; text-align: justify; }

    .screenshot-box {
      border: 1px solid #D8D2C5;
      border-radius: 6px;
      padding: 6px;
      background: #FFFCF6;
      margin: 8px 0 12px 0;
      text-align: center;
      box-shadow: 0 2px 6px rgba(16, 61, 69, 0.06);
    }

    .screenshot-box img {
      max-width: 100%;
      max-height: 260px;
      border-radius: 4px;
      border: 1px solid #eee;
    }

    .screenshot-caption {
      font-size: 8pt;
      color: #576B6F;
      margin-top: 4px;
      font-style: italic;
    }

    .step-list {
      padding-left: 20px;
      margin-bottom: 10px;
    }

    .step-list li {
      margin-bottom: 4px;
    }

    .cover {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      height: 100%;
      border: 4px double #103D45;
      padding: 30px;
      background: #FFFCF6;
      box-sizing: border-box;
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1: PORTADA -->
  <div class="page">
    <div class="cover">
      <div style="font-family: 'Cinzel', serif; font-size: 13pt; font-weight: 700; color: #103D45; margin-bottom: 6px;">
        Universidad Valle del Momboy
      </div>
      <div style="font-size: 11pt; color: #576B6F; margin-bottom: 40px; text-transform: uppercase;">
        Facultad de Ingeniería · Escuela de Computación
      </div>
      <div style="font-size: 32pt; margin: 15px 0;">📖</div>
      <h1 style="font-size: 24pt; color: #103D45; margin-bottom: 12px;">MANUAL DE USUARIO</h1>
      <div style="font-size: 13pt; color: #B88930; font-weight: 600; margin-bottom: 40px;">
        Guía Ilustrada de Operación y Funcionalidades
      </div>

      <div style="background: #F8F5EE; border: 1px solid #D8D2C5; border-radius: 8px; padding: 20px; width: 85%; margin-bottom: 40px; text-align: left; font-size: 9.5pt;">
        <p><strong>Cátedra Libre:</strong> Dr. José Gregorio Hernández</p>
        <p><strong>Asignatura:</strong> FrontEndIVIVFI2026C — Taller Front End</p>
        <p><strong>Profesor:</strong> Anggelo Huz</p>
        <p><strong>Equipo Autoral:</strong></p>
        <ul>
          <li><strong>Martin Morfe.°.</strong> (C.I. 8.263.711) — <code>mmorfe-engineer</code></li>
          <li><strong>Martin Alejandro Morfe Carballo</strong> (C.I. 30.539.018) — <code>morfemartin</code></li>
        </ul>
      </div>

      <div style="font-size: 9pt; color: #576B6F;">
        Valera, Trujillo, Venezuela · Noviembre de 2026
      </div>
    </div>
  </div>

  <!-- PÁGINA 2: INICIO Y NAVEGACIÓN -->
  <div class="page">
    <h2>1. Acceso y Pantalla de Inicio (Home)</h2>
    <p>
      Al ingresar a <code>http://localhost:3000</code>, el usuario accede a la vista principal del sistema. En ella se exponen los ejes de acción de la Cátedra Libre Dr. José Gregorio Hernández, métricas de persistencia y accesos rápidos a las funciones principales.
    </p>

    <div class="screenshot-box">
      ${imgHome ? `<img src="${imgHome}" alt="Pantalla de Inicio">` : '<p>[Captura de Inicio]</p>'}
      <div class="screenshot-caption">Figura 1: Vista principal institucional de la aplicación web en resolución de escritorio.</div>
    </div>

    <h3>Elementos Destacados:</h3>
    <ul class="step-list">
      <li><strong>Barra Superior:</strong> Menú de navegación accesible, enlace a la Cátedra e indicador de conectividad de la base de datos (punto verde activo).</li>
      <li><strong>Ejes Formativos:</strong> Bloques conceptuales dedicados a Bioética, Valores Ciudadanos y Formación Universitaria.</li>
      <li><strong>Contador Dinámico:</strong> Indicador conectado a la API que refleja en tiempo real la cantidad de encuestas disponibles.</li>
    </ul>
  </div>

  <!-- PÁGINA 3: LISTADO Y DETALLE DE ENCUESTAS -->
  <div class="page">
    <h2>2. Exploración y Consulta de Encuestas</h2>
    <p>
      En la sección <strong>Encuestas</strong>, los usuarios pueden examinar los instrumentos de consulta activos, filtrarlos por área temática o acceder a la ficha técnica completa de preguntas.
    </p>

    <div class="screenshot-box">
      ${imgSurveys ? `<img src="${imgSurveys}" alt="Listado de Encuestas">` : '<p>[Captura de Encuestas]</p>'}
      <div class="screenshot-caption">Figura 2: Catálogo de encuestas publicadas con filtros temáticos por botones.</div>
    </div>

    <div class="screenshot-box">
      ${imgDetail ? `<img src="${imgDetail}" alt="Detalle de Encuesta">` : '<p>[Captura de Detalle]</p>'}
      <div class="screenshot-caption">Figura 3: Detalle de encuesta con desglose de preguntas obligatorias y opciones configuradas.</div>
    </div>
  </div>

  <!-- PÁGINA 4: FORMULARIO DE CONTACTO Y ADJUNTO -->
  <div class="page">
    <h2>3. Formulario de Contacto y Solicitudes Formativas</h2>
    <p>
      El canal de vinculación permite a instituciones y estudiantes coordinar actividades formativas, cumpliendo estrictamente con los 5 tipos de datos requeridos por el pliego (email, number, date, radio/phone y file).
    </p>

    <div class="screenshot-box">
      ${imgContact ? `<img src="${imgContact}" alt="Formulario de Contacto">` : '<p>[Captura de Contacto]</p>'}
      <div class="screenshot-caption">Figura 4: Formulario de contacto con validación reactiva y zona de carga de archivos.</div>
    </div>

    <div class="screenshot-box">
      ${imgContactSuccess ? `<img src="${imgContactSuccess}" alt="Confirmación de Contacto">` : '<p>[Captura de Éxito]</p>'}
      <div class="screenshot-caption">Figura 5: Confirmación animada de persistencia tras registrar la solicitud en MongoDB.</div>
    </div>
  </div>

  <!-- PÁGINA 5: AUTENTICACIÓN Y PANEL DE CONTROL -->
  <div class="page">
    <h2>4. Autenticación y Panel Administrativo</h2>
    <p>
      El sistema cuenta con un modal de autenticación segura y un panel exclusivo para administradores académicos con gestión de encuestas y revisión de adjuntos.
    </p>

    <div class="screenshot-box">
      ${imgAuth ? `<img src="${imgAuth}" alt="Modal de Autenticación">` : '<p>[Captura de Login]</p>'}
      <div class="screenshot-caption">Figura 6: Modal de autenticación con botones de autocompletado rápido para demostración académica.</div>
    </div>

    <div class="screenshot-box">
      ${imgAdmin ? `<img src="${imgAdmin}" alt="Panel de Administración">` : '<p>[Captura de Admin]</p>'}
      <div class="screenshot-caption">Figura 7: Panel administrativo con tabla de encuestas y acciones de publicación y cierre.</div>
    </div>
  </div>

  <!-- PÁGINA 6: BANDEJA DE CONTACTOS Y ADJUNTOS -->
  <div class="page">
    <h2>5. Gestión de Solicitudes y Descarga Segura</h2>
    <p>
      Los administradores disponen de una bandeja de entrada protegida donde pueden revisar las solicitudes recibidas y descargar los documentos adjuntos validados:
    </p>

    <div class="screenshot-box">
      ${imgAdminContacts ? `<img src="${imgAdminContacts}" alt="Bandeja de Contactos">` : '<p>[Captura de Bandeja de Contactos]</p>'}
      <div class="screenshot-caption">Figura 8: Bandeja de solicitudes de contacto con enlace a descarga protegida de archivos PDF/PNG.</div>
    </div>

    <h3>Procedimiento de Descarga Segura:</h3>
    <ol class="step-list">
      <li>El administrador pulsa el enlace <code>📎 NombreArchivo</code> en la tabla de solicitudes.</li>
      <li>El backend intercepta la solicitud en <code>/api/contact/admin/:id/attachment</code> y valida que el usuario posea rol <code>admin</code>.</li>
      <li>Se comprueba que la ruta física resida dentro del directorio <code>backend/uploads</code> (prevención de traversal).</li>
      <li>El archivo se transmite directamente al navegador para su lectura o almacenamiento local.</li>
    </ol>

    <div style="margin-top: 35px; border-top: 1px solid #D8D2C5; padding-top: 10px; font-size: 8pt; color: #576B6F; text-align: center;">
      Manual de Usuario · E-Actividad 4.3 Proyecto Final · Cátedra Libre Dr. José Gregorio Hernández · UVM 2026
    </div>
  </div>

</body>
</html>
`;

  console.log('[User Manual Builder] Lanzando Chromium...');
  const browser = await chromium.launch({
    executablePath: fs.existsSync('/snap/bin/chromium') ? '/snap/bin/chromium' : undefined,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle' });

    console.log('[User Manual Builder] Renderizando MANUAL_USUARIO.pdf...');
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

    console.log(`[User Manual Builder] PDF de Manual de Usuario generado en: ${pdfPath}`);
  } finally {
    await browser.close();
  }
}

generateManualUsuarioPdf().catch((err) => {
  console.error('[User Manual Builder] Error:', err);
  process.exit(1);
});
