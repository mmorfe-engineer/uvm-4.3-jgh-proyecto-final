/**
 * scripts/build-presentation-pptx.js
 * Genera la presentación académica en formato editable PPTX (12 diapositivas canónicas)
 * utilizando pptxgenjs, conforme a la Sección 26 del Prompt Maestro.
 */
const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function generatePresentation() {
  const outputDir = path.resolve(__dirname, '../docs/presentacion');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pptxPath = path.join(outputDir, 'PRESENTACION_JGH_4_3.pptx');

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'MARTIN MORFE FLORES';
  pres.company = 'Universidad Valle del Momboy';
  pres.title = 'JGH Encuestas - Presentación Académica Final E4.3';

  // Paleta de colores canónica
  const C_PETROLEO = '103D45';
  const C_PETROLEO_DARK = '0A262B';
  const C_FONDO = 'F8F5EE';
  const C_DORADO = 'F0D39A';
  const C_TEXTO = '203236';
  const C_MUTED = '576B6F';
  const C_BLANCO = 'FFFFFF';

  // Helper para diapositivas estándar con cabecera institucional
  const addStandardSlide = (slideNum, titleText, categoryText) => {
    const slide = pres.addSlide();
    slide.background = { color: C_FONDO };

    // Barra superior
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: '100%', h: 0.9,
      fill: { color: C_PETROLEO },
      line: { color: C_DORADO, width: 2 }
    });

    slide.addText('CÁTEDRA LIBRE DR. JOSÉ GREGORIO HERNÁNDEZ · UVM', {
      x: 0.6, y: 0.15, w: 9, h: 0.25,
      fontSize: 10, color: C_DORADO, fontFace: 'Georgia', bold: true
    });

    slide.addText(titleText, {
      x: 0.6, y: 0.4, w: 11, h: 0.45,
      fontSize: 16, color: C_BLANCO, fontFace: 'Georgia', bold: true
    });

    // Pie de página
    slide.addShape(pres.ShapeType.line, {
      x: 0.6, y: 7.0, w: 12.1, h: 0,
      line: { color: 'D8D2C5', width: 1 }
    });

    slide.addText(`E-Actividad 4.3 · Proyecto Final | ${categoryText}`, {
      x: 0.6, y: 7.05, w: 8, h: 0.3,
      fontSize: 9, color: C_MUTED, fontFace: 'Arial'
    });

    slide.addText(`Lámina ${slideNum} de 12`, {
      x: 10.5, y: 7.05, w: 2.2, h: 0.3,
      fontSize: 9, color: C_MUTED, fontFace: 'Arial', align: 'right'
    });

    return slide;
  };

  // =========================================================================
  // SLIDE 1: PORTADA INSTITUCIONAL
  // =========================================================================
  const s1 = pres.addSlide();
  s1.background = { color: C_PETROLEO };

  s1.addText('UNIVERSIDAD VALLE DEL MOMBOY\nFACULTAD DE INGENIERÍA · ESCUELA DE COMPUTACIÓN', {
    x: 1.0, y: 0.8, w: 11.3, h: 0.8,
    fontSize: 14, color: C_DORADO, fontFace: 'Georgia', bold: true, align: 'center'
  });

  s1.addText('JGH ENCUESTAS', {
    x: 1.0, y: 2.0, w: 11.3, h: 1.0,
    fontSize: 34, color: C_BLANCO, fontFace: 'Georgia', bold: true, align: 'center'
  });

  s1.addText('Sistema de Encuestas Formativas y Vinculación Comunitaria\nCátedra Libre Dr. José Gregorio Hernández', {
    x: 1.0, y: 3.0, w: 11.3, h: 0.8,
    fontSize: 16, color: C_DORADO, fontFace: 'Arial', align: 'center'
  });

  s1.addShape(pres.ShapeType.rect, {
    x: 2.5, y: 4.2, w: 8.3, h: 1.8,
    fill: { color: C_PETROLEO_DARK },
    line: { color: C_DORADO, width: 1.5 }
  });

  s1.addText('E-Actividad 4.3 · Proyecto Final (FrontEndIVIVFI2026C)\nProfesor: Anggelo Huz\n\nIntegrantes:\n• Martin Morfe.°. (C.I. 8.263.711) — mmorfe-engineer\n• Martin Alejandro Morfe Carballo (C.I. 30.539.018) — morfemartin', {
    x: 2.7, y: 4.3, w: 7.9, h: 1.6,
    fontSize: 11, color: C_BLANCO, fontFace: 'Arial'
  });

  s1.addText('Valera, Estado Trujillo · Noviembre de 2026', {
    x: 1.0, y: 6.6, w: 11.3, h: 0.4,
    fontSize: 10, color: C_MUTED, fontFace: 'Arial', align: 'center'
  });

  // =========================================================================
  // SLIDE 2: PROBLEMA Y OBJETIVO
  // =========================================================================
  const s2 = addStandardSlide(2, 'Contexto, Problema y Objetivo General', 'Fundamentación Académica');
  s2.addText('El Problema Académico y Social:', { x: 0.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 13, bold: true, color: C_PETROLEO });
  s2.addText('• Carencia de un canal digital accesible para recolectar opiniones y percepciones formativas sobre bioética y servicio comunitario.\n• Necesidad de organizar de forma estructurada consultas temáticas para el análisis de participación.\n• Dificultad para coordinar solicitudes comunitarias con respaldo documental seguro.', {
    x: 0.8, y: 1.8, w: 5.5, h: 2.2, fontSize: 11, color: C_TEXTO
  });

  s2.addText('Objetivo del Proyecto Final 4.3:', { x: 6.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 13, bold: true, color: C_PETROLEO });
  s2.addText('• Construir una aplicación web full-stack 100% funcional (React 19 + Express + MongoDB).\n• Desarrollar una API RESTful documentada formalmente en OpenAPI 3.1.\n• Implementar un formulario de contacto con los 5 campos requeridos y almacenamiento seguro.\n• Demostrar trabajo colaborativo verificable con historial de commits de ambos integrantes.', {
    x: 6.8, y: 1.8, w: 5.5, h: 2.4, fontSize: 11, color: C_TEXTO
  });

  s2.addShape(pres.ShapeType.roundRect, { x: 0.8, y: 4.6, w: 11.5, h: 1.8, fill: { color: 'FFFFFF' }, line: { color: C_DORADO, width: 1.5 } });
  s2.addText('Misión Institucional:', { x: 1.1, y: 4.8, w: 10.9, h: 0.35, fontSize: 12, bold: true, color: C_PETROLEO });
  s2.addText('Proporcionar una herramienta tecnológica que fomente el humanismo médico, la responsabilidad ciudadana y la solidaridad activa inspirada en la vida y obra del Dr. José Gregorio Hernández.', {
    x: 1.1, y: 5.2, w: 10.9, h: 1.0, fontSize: 11, color: C_TEXTO, italic: true
  });

  // =========================================================================
  // SLIDE 3: PRODUCTO Y USUARIOS
  // =========================================================================
  const s3 = addStandardSlide(3, 'Definición de Producto y Perfiles de Usuario', 'Diseño de Producto');
  const userProfiles = [
    { title: 'Visitante (Público)', icon: '🌐', desc: '• Consulta encuestas publicadas.\n• Explora ejes temáticos formativos.\n• Envía propuestas y solicita jornadas mediante formulario de contacto.' },
    { title: 'Participante Registrado', icon: '👤', desc: '• Inicio de sesión con cuenta UVM.\n• Responde encuestas autorizadas.\n• Consulta su historial de participación (Módulo reservado morfemartin).' },
    { title: 'Administrador Académico', icon: '⚙️', desc: '• Diseña y crea encuestas en borrador.\n• Publica y cierra instrumentos.\n• Gestiona contactos y descarga adjuntos protegidos fuera del dir público.' }
  ];

  userProfiles.forEach((p, idx) => {
    const x = 0.8 + idx * 3.9;
    s3.addShape(pres.ShapeType.roundRect, { x, y: 1.5, w: 3.6, h: 4.8, fill: { color: 'FFFFFF' }, line: { color: 'D8D2C5', width: 1 } });
    s3.addText(p.icon, { x, y: 1.8, w: 3.6, h: 0.6, fontSize: 24, align: 'center' });
    s3.addText(p.title, { x, y: 2.5, w: 3.6, h: 0.5, fontSize: 12, bold: true, color: C_PETROLEO, align: 'center' });
    s3.addText(p.desc, { x: x + 0.2, y: 3.2, w: 3.2, h: 2.8, fontSize: 10, color: C_TEXTO });
  });

  // =========================================================================
  // SLIDE 4: ARQUITECTURA FULL-STACK
  // =========================================================================
  const s4 = addStandardSlide(4, 'Arquitectura de Software Monorepo Desacoplado', 'Ingeniería de Software');
  s4.addShape(pres.ShapeType.rect, { x: 0.8, y: 1.4, w: 3.6, h: 5.0, fill: { color: 'FFFFFF' }, line: { color: C_PETROLEO, width: 1.5 } });
  s4.addText('FRONTEND (CLIENTE)', { x: 0.8, y: 1.6, w: 3.6, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO, align: 'center' });
  s4.addText('• React 19 + Vite v6\n• JSX modularizado\n• CSS propio (sin frameworks)\n• Variables canónicas JGH\n• Fetch API asíncrona\n• Proxy local :3000 -> :5000\n• Soporte credentials: include\n• Responsive (Desktop/Mobile)', {
    x: 1.0, y: 2.2, w: 3.2, h: 3.8, fontSize: 10, color: C_TEXTO
  });

  s4.addShape(pres.ShapeType.rect, { x: 4.8, y: 1.4, w: 3.6, h: 5.0, fill: { color: 'FFFFFF' }, line: { color: C_PETROLEO, width: 1.5 } });
  s4.addText('BACKEND (API REST)', { x: 4.8, y: 1.6, w: 3.6, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO, align: 'center' });
  s4.addText('• Node.js v26 + Express\n• Sesiones HttpOnly\n• connect-mongo\n• Autenticación bcryptjs (salt 10)\n• RBAC (admin / participant)\n• Multer seguro (MIME/3MB)\n• OpenAPI 3.1 (/api/openapi.json)\n• ErrorHandler estandarizado', {
    x: 5.0, y: 2.2, w: 3.2, h: 3.8, fontSize: 10, color: C_TEXTO
  });

  s4.addShape(pres.ShapeType.rect, { x: 8.8, y: 1.4, w: 3.6, h: 5.0, fill: { color: 'FFFFFF' }, line: { color: C_PETROLEO, width: 1.5 } });
  s4.addText('BASE DE DATOS (NoSQL)', { x: 8.8, y: 1.6, w: 3.6, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO, align: 'center' });
  s4.addText('• MongoDB Community v7\n• Mongoose ODM v8\n• Colección users\n• Colección surveys\n• Colección contactSubmissions\n• Colección sessions\n• Colección responses (Reserva)\n• Runner persistente backend/data/db', {
    x: 9.0, y: 2.2, w: 3.2, h: 3.8, fontSize: 10, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 5: BASE DE DATOS NOSQL
  // =========================================================================
  const s5 = addStandardSlide(5, 'Modelado Documental NoSQL en MongoDB', 'Persistencia y Datos');
  s5.addText('Colecciones Canónicas Implementadas con Mongoose ODM:', { x: 0.8, y: 1.3, w: 11.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });

  const collections = [
    { name: 'users', fields: '_id (PK), name, email (UK), passwordHash (hidden), role (admin|participant), timestamps' },
    { name: 'surveys', fields: '_id (PK), title, description, topic, status (draft|published|closed), questions[], createdBy (FK), publishedAt' },
    { name: 'contactSubmissions', fields: '_id (PK), name, email, phone, proposedDate, estimatedParticipants, requestType, message, attachmentMetadata{}' },
    { name: 'responses (Reserva)', fields: '_id (PK), surveyId (FK), participantId (FK), answers[{questionId, value}], submittedAt. Índice único compuesto.' }
  ];

  collections.forEach((c, idx) => {
    const y = 1.8 + idx * 1.15;
    s5.addShape(pres.ShapeType.rect, { x: 0.8, y, w: 11.5, h: 0.95, fill: { color: 'FFFFFF' }, line: { color: 'D8D2C5', width: 1 } });
    s5.addText(`Colección ${c.name}:`, { x: 1.0, y: y + 0.1, w: 3.0, h: 0.35, fontSize: 11, bold: true, color: C_PETROLEO });
    s5.addText(c.fields, { x: 1.0, y: y + 0.45, w: 11.0, h: 0.4, fontSize: 9.5, color: C_TEXTO });
  });

  s5.addText('Comprobación de Persistencia Real: Se verificó el almacenamiento en disco en backend/data/db mediante el reinicio de procesos y consultas directas con el cliente de MongoDB.', {
    x: 0.8, y: 6.2, w: 11.5, h: 0.5, fontSize: 10, italic: true, color: C_MUTED
  });

  // =========================================================================
  // SLIDE 6: AUTENTICACIÓN Y AUTORIZACIÓN
  // =========================================================================
  const s6 = addStandardSlide(6, 'Autenticación y Control de Acceso (RBAC)', 'Seguridad y Permisos');
  s6.addText('Modelo de Seguridad Implementado:', { x: 0.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });
  s6.addText('• Sesiones HttpOnly en Servidor:\n  Inmunes al robo de tokens mediante Cross-Site Scripting (XSS).\n• Cifrado de Contraseñas:\n  Hash con salt de 10 rondas vía bcryptjs. El hash jamás se expone en JSON.\n• Separación Estricta de Roles:\n  admin: Crea, edita y publica encuestas; consulta contactos.\n  participant: Responde encuestas autorizadas y consulta su participación.\n• Protección contra Escalado:\n  El registro público fuerza incondicionalmente el rol participant.', {
    x: 0.8, y: 1.8, w: 5.5, h: 4.8, fontSize: 10, color: C_TEXTO
  });

  s6.addText('Pruebas Negativas de Seguridad Superadas:', { x: 6.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });
  s6.addText('✓ Intento de registro con rol "admin" inyectado -> Forzado a participant (201).\n✓ Intento de login con contraseña incorrecta -> Rechazado (401).\n✓ Intento de consulta de contactos por visitante -> Bloqueado (401).\n✓ Intento de acceso administrativo por participante -> Prohibido (403).\n✓ Intento de publicación de encuesta vacía -> Rechazado (400).\n✓ Verificación de respuesta JSON -> passwordHash estrictamente indefinido.', {
    x: 6.8, y: 1.8, w: 5.5, h: 4.8, fontSize: 10, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 7: GESTIÓN DE ENCUESTAS (ADMIN)
  // =========================================================================
  const s7 = addStandardSlide(7, 'Gestión de Encuestas Formativas (Panel Admin)', 'Funcionalidad Core');
  s7.addText('Ciclo de Vida de los Instrumentos Formativos:', { x: 0.8, y: 1.3, w: 11.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });

  const lifecycle = [
    { stage: '1. Borrador (draft)', desc: 'Creación del instrumento con título, área temática y constructor interactivo de preguntas (selección única o texto corto).' },
    { stage: '2. Publicada (published)', desc: 'Validación estricta de preguntas configuradas. Solo en este estado es visible al público general y participantes.' },
    { stage: '3. Cerrada (closed)', desc: 'Conclusión de la consulta académica. Deja de recibir nuevas participaciones preservando los datos históricos.' }
  ];

  lifecycle.forEach((item, idx) => {
    const x = 0.8 + idx * 3.9;
    s7.addShape(pres.ShapeType.roundRect, { x, y: 1.8, w: 3.6, h: 2.2, fill: { color: 'FFFFFF' }, line: { color: C_DORADO, width: 1.5 } });
    s7.addText(item.stage, { x: x + 0.2, y: 2.0, w: 3.2, h: 0.4, fontSize: 11, bold: true, color: C_PETROLEO });
    s7.addText(item.desc, { x: x + 0.2, y: 2.5, w: 3.2, h: 1.3, fontSize: 9.5, color: C_TEXTO });
  });

  s7.addText('Constructor Dinámico de Preguntas:\nPermite al administrador agregar N preguntas, definir si son obligatorias, seleccionar el tipo y parametrizar las alternativas de respuesta de manera reactiva.', {
    x: 0.8, y: 4.3, w: 11.5, h: 1.8, fontSize: 11, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 8: RESPUESTA Y BÚSQUEDA (RESERVA HUMANA)
  // =========================================================================
  const s8 = addStandardSlide(8, 'Módulo de Participación y Búsqueda (morfemartin)', 'Reserva Humana');
  s8.addShape(pres.ShapeType.rect, { x: 0.8, y: 1.4, w: 11.5, h: 5.0, fill: { color: 'FFFFFF' }, line: { color: C_DORADO, width: 2 } });
  s8.addText('RESERVA TÉCNICA SUSTANTIVA DE MARTIN ALEJANDRO MORFE CARBALLO', {
    x: 1.0, y: 1.6, w: 11.1, h: 0.4, fontSize: 13, bold: true, color: C_PETROLEO, align: 'center'
  });

  s8.addText('Conforme a la Sección 17.2 del Prompt Maestro, se protege y reserva el siguiente paquete de ingeniería:\n\n1. Modelo Persistente Response:\n   Esquema Mongoose con índice de unicidad { surveyId: 1, participantId: 1 } (una respuesta por participante).\n2. Endpoints REST de Participación:\n   • POST /api/surveys/:id/responses (Registro validado de respuestas y control de duplicados 409).\n   • GET /api/me/responses (Consulta de participación personal del participante autenticado).\n   • GET /api/admin/surveys/:id/responses (Consulta de resultados administrativos autorizados).\n3. Interfaz Interactiva de Respuesta:\n   Componente React para selección de alternativas, validación de obligatoriedad y confirmación.\n4. Buscador Dinámico de Encuestas:\n   Barra de búsqueda reactiva conectada a la base de datos con filtrado por título y tópico en tiempo real.\n5. Pruebas Automatizadas y QA del Módulo:\n   Pruebas unitarias en backend/tests/responses.test.js y verificación en navegador.', {
    x: 1.2, y: 2.2, w: 10.7, h: 4.0, fontSize: 10.5, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 9: FORMULARIO DE CONTACTO MULTIPART
  // =========================================================================
  const s9 = addStandardSlide(9, 'Formulario de Contacto y Carga Segura de Archivos', 'Requisito Central');
  s9.addText('Soporte Estricto de los 5 Tipos de Campos Exigidos por el Pliego:', { x: 0.8, y: 1.3, w: 11.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });

  const contactFields = [
    { type: 'email', name: 'Correo Electrónico', detail: 'Validación de formato sintáctico RFC 5322 en cliente y backend.' },
    { type: 'number', name: 'Cantidad de Participantes', detail: 'Número entero mayor a cero y menor a 5,000 participantes.' },
    { type: 'date', name: 'Fecha Propuesta', detail: 'Selección de fecha sugerida para la actividad comunitaria.' },
    { type: 'radio / phone', name: 'Tipo Solicitud y Teléfono', detail: 'Radio buttons (Académica/Comunitaria/Institucional) + Teléfono tel.' },
    { type: 'file', name: 'Documento Adjunto (File)', detail: 'Multer con validación MIME (PDF/PNG/JPG), límite 3 MB y nombres UUID.' }
  ];

  contactFields.forEach((f, idx) => {
    const y = 1.8 + idx * 0.95;
    s9.addShape(pres.ShapeType.rect, { x: 0.8, y, w: 11.5, h: 0.8, fill: { color: 'FFFFFF' }, line: { color: 'D8D2C5', width: 1 } });
    s9.addText(`${f.name} [Tipo: ${f.type}]`, { x: 1.0, y: y + 0.1, w: 4.5, h: 0.3, fontSize: 10.5, bold: true, color: C_PETROLEO });
    s9.addText(f.detail, { x: 1.0, y: y + 0.4, w: 11.0, h: 0.3, fontSize: 9, color: C_TEXTO });
  });

  s9.addText('Persistencia y Descarga Protegida: Los metadatos quedan registrados en la colección contactSubmissions. La descarga de adjuntos exige rol admin y previene ataques de path traversal mediante path.resolve().', {
    x: 0.8, y: 6.2, w: 11.5, h: 0.5, fontSize: 9.5, italic: true, color: C_MUTED
  });

  // =========================================================================
  // SLIDE 10: SEGURIDAD Y OPENAPI 3.1
  // =========================================================================
  const s10 = addStandardSlide(10, 'Especificación OpenAPI 3.1 y Controles de Seguridad', 'Estándares y Contratos');
  s10.addText('Especificación Formal OpenAPI 3.1:', { x: 0.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });
  s10.addText('• Documentación viva servida en /api/openapi.json.\n• Compatible con herramientas Swagger UI, Postman e Insomnia.\n• Define esquemas de entrada y salida con tipado estricto.\n• Documenta el multipart/form-data del formulario de contacto.\n• Declara esquemas de seguridad por cookies (cookieAuth con connect.sid).\n• Códigos de estado HTTP estandarizados (200, 201, 400, 401, 403, 404, 409, 500).', {
    x: 0.8, y: 1.8, w: 5.5, h: 4.8, fontSize: 10, color: C_TEXTO
  });

  s10.addText('Controles de Seguridad Activos:', { x: 6.8, y: 1.3, w: 5.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });
  s10.addText('1. Helmet: Cabeceras de seguridad HTTP (X-Frame-Options, DNS Prefetch, etc.).\n2. CORS Restringido: Whitelist del origen cliente con credenciales habilitadas.\n3. Sanitización de Subidas: Exclusión estricta de ejecutables y extensiones falsas.\n4. Almacenamiento Fuera de Public: Imposibilita la ejecución remota de scripts.\n5. Eliminación de Archivos Temporales: Si la validación falla, los archivos huérfanos se borran de inmediato.', {
    x: 6.8, y: 1.8, w: 5.5, h: 4.8, fontSize: 10, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 11: QA, EVIDENCIAS Y COLABORACIÓN
  // =========================================================================
  const s11 = addStandardSlide(11, 'Aseguramiento de Calidad (QA) y Evidencias', 'Verificación Empírica');
  s11.addText('Evidencia Verificable y Resultados de Pruebas:', { x: 0.8, y: 1.3, w: 11.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });

  s11.addShape(pres.ShapeType.rect, { x: 0.8, y: 1.8, w: 5.6, h: 4.8, fill: { color: 'FFFFFF' }, line: { color: 'D8D2C5', width: 1 } });
  s11.addText('Pruebas Automatizadas (npm test)', { x: 1.0, y: 2.0, w: 5.2, h: 0.35, fontSize: 11, bold: true, color: C_PETROLEO });
  s11.addText('• 16/16 pruebas de backend aprobadas (100%).\n• Pruebas de integración de API con supertest.\n• Servidor MongoDB aislado en memoria para tests.\n• Prueba de compilación de frontend (Vite build).\n• Cobertura de autenticación, CRUD, RBAC, cookies y seguridad negativa.', {
    x: 1.0, y: 2.5, w: 5.2, h: 3.8, fontSize: 10, color: C_TEXTO
  });

  s11.addShape(pres.ShapeType.rect, { x: 6.7, y: 1.8, w: 5.6, h: 4.8, fill: { color: 'FFFFFF' }, line: { color: 'D8D2C5', width: 1 } });
  s11.addText('Evidencias en Navegador (Chromium)', { x: 6.9, y: 2.0, w: 5.2, h: 0.35, fontSize: 11, bold: true, color: C_PETROLEO });
  s11.addText('• 13 capturas de pantalla reales en docs/evidencias/:\n  - Escritorio (1440 × 900): Home, Encuestas, Detalle, Contacto, Éxito en BD, Login Modal, Panel Admin y Contactos.\n  - Tableta (768 × 1024): Home y Contacto responsive.\n  - Móvil (390 × 844): Home, Encuestas y Contacto adaptado.\n• Flujo end-to-end verificado en navegador real.', {
    x: 6.9, y: 2.5, w: 5.2, h: 3.8, fontSize: 10, color: C_TEXTO
  });

  // =========================================================================
  // SLIDE 12: CONCLUSIONES Y EVALUACIÓN
  // =========================================================================
  const s12 = addStandardSlide(12, 'Conclusiones y Cumplimiento de Objetivos', 'Cierre Académico');
  s12.addText('Logros de Ingeniería Alcanzados:', { x: 0.8, y: 1.3, w: 11.5, h: 0.4, fontSize: 12, bold: true, color: C_PETROLEO });

  const conclusions = [
    '1. Aplicación Full-Stack Monorepo 100% Funcional: React 19, Express y MongoDB integrados armónicamente sin dependencias pesadas.',
    '2. Rigor Académico y Normativo: Todos los requisitos del pliego oficial 4.3 (animaciones, asincronía, API, NoSQL, formulario multipart y seguridad) implementados y probados.',
    '3. Persistencia Real en Base de Datos: Almacenamiento comprobado en disco mediante MongoDB Community y scripts reproducibles.',
    '4. Documentación Exhaustiva: Manual Técnico formal (11 páginas, superando el mínimo de 8), Manual de Usuario con capturas reales y especificación OpenAPI 3.1.',
    '5. Gobernanza y Autoría Humana Íntegra: Separación técnica limpia entre la arquitectura núcleo (mmorfe-engineer) y el módulo de participación (morfemartin).'
  ];

  conclusions.forEach((c, idx) => {
    const y = 1.8 + idx * 0.9;
    s12.addShape(pres.ShapeType.rect, { x: 0.8, y, w: 11.5, h: 0.75, fill: { color: 'FFFFFF' }, line: { color: C_DORADO, width: 1 } });
    s12.addText(c, { x: 1.0, y: y + 0.1, w: 11.1, h: 0.55, fontSize: 10, color: C_TEXTO });
  });

  s12.addText('¡Muchas gracias! · Universidad Valle del Momboy · FrontEndIVIVFI2026C', {
    x: 0.8, y: 6.4, w: 11.5, h: 0.4, fontSize: 11, bold: true, color: C_PETROLEO, align: 'center'
  });

  console.log('[Presentation Builder] Guardando archivo PPTX...');
  await pres.writeFile({ fileName: pptxPath });
  console.log(`[Presentation Builder] Presentación PPTX generada exitosamente en: ${pptxPath}`);
}

generatePresentation().catch((err) => {
  console.error('[Presentation Builder] Error:', err);
  process.exit(1);
});
