/**
 * scripts/test-fullstack-local.js
 * Verificación integral E2E de Modalidad B (Full-Stack Real Local)
 * Comprueba:
 * - Persistencia real en MongoDB
 * - Cifrado de contraseñas con bcrypt
 * - Autenticación con cookies HttpOnly y sesión de servidor
 * - Control estricto de unicidad de respuestas (prevención de duplicados con 409)
 * - Agregación descriptiva matemática real (frecuencias y porcentajes)
 * - Control de acceso basado en roles (RBAC: participante vs admin)
 * - Recepción y persistencia de solicitudes de contacto con anexos
 */
process.env.NODE_ENV = 'test';
const path = require('path');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');

// Dependencias locales del backend
const backendModules = path.resolve(__dirname, '../backend/node_modules');
const { MongoMemoryServer } = require(path.join(backendModules, 'mongodb-memory-server'));
const app = require('../backend/src/app');
const User = require('../backend/src/models/User');
const Survey = require('../backend/src/models/Survey');
const Response = require('../backend/src/models/Response');
const ContactSubmission = require('../backend/src/models/ContactSubmission');

async function runFullStackVerification() {
  console.log('\n===============================================================');
  console.log('  VERIFICACIÓN E2E DE MODALIDAD B (FULL-STACK LOCAL REAL)');
  console.log('  Cátedra Libre Dr. José Gregorio Hernández - UVM');
  console.log('===============================================================\n');

  // 1. Iniciar servidor MongoDB en memoria
  console.log('[1/12] Iniciando motor de base de datos MongoDB...');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log(`  ✓ Conectado a MongoDB en ${uri}`);

  // Limpiar colecciones
  await User.deleteMany({});
  await Survey.deleteMany({});
  await Response.deleteMany({});
  await ContactSubmission.deleteMany({});

  // 2. Crear usuario Administrador Institucional
  console.log('[2/12] Creando cuenta administrativa institucional...');
  const admin = await User.create({
    name: 'Prof. Anggelo Huz (Coordinador)',
    email: 'ahuz@uvm.edu.ve',
    passwordHash: '$2b$10$w850c9hG7mQY/4f3.V2rYeN7qXb4jI8Z6L9o0u2p1w.testHashDummy',
    role: 'admin',
  });
  console.log(`  ✓ Administrador creado: ${admin.email} (rol: ${admin.role})`);

  // 3. Crear Encuesta Canónica Activa
  console.log('[3/12] Publicando consulta canónica institucional...');
  const survey = await Survey.create({
    title: 'Percepción Estudiantil sobre el Legado Humanista de José Gregorio Hernández',
    description: 'Instrumento formativo para evaluar el impacto de la cátedra.',
    topic: 'Formación y Bioética',
    objective: 'Determinar el nivel de apropiación ética y humanista.',
    targetAudience: 'Estudiantes de todas las facultades UVM',
    status: 'published',
    createdBy: admin._id,
    publishedAt: new Date(),
    questions: [
      {
        id: 'q1',
        text: '¿Considera que los valores de solidaridad de JGH son aplicables en su carrera?',
        type: 'single_choice',
        options: ['Totalmente de acuerdo', 'De acuerdo', 'En desacuerdo'],
        required: true,
      },
      {
        id: 'q2',
        text: '¿Cómo evalúa la pertinencia comunitaria de las actividades formativas?',
        type: 'single_choice',
        options: ['Excelente', 'Buena', 'Regular'],
        required: true,
      },
      {
        id: 'q3',
        text: 'Aporte u observación para fortalecer la vinculación social de la Cátedra:',
        type: 'short_text',
        required: false,
      },
    ],
  });
  console.log(`  ✓ Encuesta publicada: "${survey.title}" (ID: ${survey._id})`);

  // 4. Registro de Participante Real
  console.log('[4/12] Registrando participante real mediante POST /api/auth/register...');
  const regRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Estudiante Mariana Rivas',
      email: 'mrivas@estudiante.uvm.edu.ve',
      password: 'ClaveSegura2026!*',
    });

  assert.equal(regRes.status, 201, 'El registro debe retornar 201 Created');
  assert.equal(regRes.body.user.role, 'participant', 'Rol asignado debe ser participant');
  assert.equal(regRes.body.user.passwordHash, undefined, 'Nunca debe exponerse el hash');
  console.log(`  ✓ Participante registrado exitosamente: ${regRes.body.user.email}`);

  // Verificar en MongoDB el hash bcrypt
  const savedUser = await User.findOne({ email: 'mrivas@estudiante.uvm.edu.ve' }).select('+passwordHash');
  assert.ok(savedUser, 'El usuario debe existir en MongoDB');
  assert.ok(savedUser.passwordHash.startsWith('$2'), 'La contraseña debe estar cifrada con bcrypt');
  console.log(`  ✓ Persistencia verificada en MongoDB con hash bcrypt: ${savedUser.passwordHash.substring(0, 15)}...`);

  // 5. Rechazo de correo duplicado
  console.log('[5/12] Verificando rechazo de duplicados en registro (409 Conflict)...');
  const dupRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Intento Duplicado',
      email: 'mrivas@estudiante.uvm.edu.ve',
      password: 'OtraPassword123!',
    });
  assert.equal(dupRes.status, 409, 'Debe responder 409 Conflict ante email duplicado');
  console.log('  ✓ Rechazo correcto con código HTTP 409 Conflict');

  // 6. Autenticación Real y Cookie HttpOnly
  console.log('[6/12] Autenticando participante mediante POST /api/auth/login...');
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'mrivas@estudiante.uvm.edu.ve',
      password: 'ClaveSegura2026!*',
    });

  assert.equal(loginRes.status, 200, 'El login debe retornar 200 OK');
  const cookies = loginRes.headers['set-cookie'];
  assert.ok(cookies, 'Debe devolver cabecera Set-Cookie');
  const sessionCookie = cookies.find((c) => c.includes('connect.sid'));
  assert.ok(sessionCookie, 'Debe contener cookie connect.sid');
  assert.ok(sessionCookie.includes('HttpOnly'), 'La cookie DEBE ser HttpOnly');
  console.log(`  ✓ Sesión iniciada con cookie HttpOnly: ${sessionCookie.split(';')[0]}`);

  // 7. Verificación de Sesión Activa (GET /api/auth/me)
  console.log('[7/12] Comprobando sesión con GET /api/auth/me...');
  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Cookie', sessionCookie);
  assert.equal(meRes.status, 200);
  assert.equal(meRes.body.user.email, 'mrivas@estudiante.uvm.edu.ve');
  console.log(`  ✓ Sesión activa confirmada para: ${meRes.body.user.name}`);

  // 8. Envío de Respuesta Real Persistida en MongoDB
  console.log('[8/12] Enviando respuesta a encuesta mediante POST /api/surveys/:id/responses...');
  const responsePayload = {
    answers: [
      { questionId: 'q1', value: 'Totalmente de acuerdo' },
      { questionId: 'q2', value: 'Excelente' },
      { questionId: 'q3', value: 'Excelente iniciativa para vincular la medicina con la ética.' },
    ],
  };

  const submitRes = await request(app)
    .post(`/api/surveys/${survey._id}/responses`)
    .set('Cookie', sessionCookie)
    .send(responsePayload);

  assert.equal(submitRes.status, 201, 'Debe responder 201 Created');
  console.log(`  ✓ Respuesta registrada en MongoDB con ID: ${submitRes.body.responseId}`);

  // Verificar persistencia exacta en MongoDB
  const savedResponse = await Response.findOne({ surveyId: survey._id, participantId: savedUser._id });
  assert.ok(savedResponse, 'La respuesta DEBE estar persistida en MongoDB');
  assert.equal(savedResponse.answers.length, 3);
  console.log('  ✓ Persistencia verificada en la colección Response de MongoDB');

  // 9. Control Estricto de Unicidad: Rechazo de Respuesta Duplicada (409)
  console.log('[9/12] Intentando responder por segunda vez la misma encuesta...');
  const dupSubmitRes = await request(app)
    .post(`/api/surveys/${survey._id}/responses`)
    .set('Cookie', sessionCookie)
    .send(responsePayload);

  assert.equal(dupSubmitRes.status, 409, 'Debe rechazar con 409 Conflict');
  assert.ok(dupSubmitRes.body.message.includes('Ya has participado'));
  console.log('  ✓ Control estricto de unicidad cumplido: 409 Conflict devuelto');

  // 10. Agregación Descriptiva Matemática Real
  console.log('[10/12] Verificando agregación descriptiva real en GET /api/surveys/:id/results...');
  const resultsRes = await request(app).get(`/api/surveys/${survey._id}/results`);
  assert.equal(resultsRes.status, 200);
  assert.equal(resultsRes.body.totalResponses, 1);
  const q1Results = resultsRes.body.questions.find((q) => q.questionId === 'q1');
  assert.equal(q1Results.counts['Totalmente de acuerdo'], 1);
  assert.equal(q1Results.percentages['Totalmente de acuerdo'], 100);
  console.log('  ✓ Agregación estadística correcta: 1 respuesta (100% Totalmente de acuerdo)');

  // 11. Formulario de Contacto y Vinculación (POST /api/contact)
  console.log('[11/12] Probando recepción y persistencia de contacto institucional...');
  const tempFilePath = path.join(__dirname, 'test-attachment-fullstack.png');
  const fs = require('fs');
  fs.writeFileSync(tempFilePath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13]));

  try {
    const contactRes = await request(app)
      .post('/api/contact')
      .field('name', 'Lic. Carlos Delgado')
      .field('email', 'cdelgado@comunidad.org')
      .field('phone', '+58 414 1234567')
      .field('proposedDate', '2026-12-15')
      .field('estimatedParticipants', '45')
      .field('requestType', 'comunitaria')
      .field('message', 'Solicitamos coordinar una jornada médica y formativa en conjunto con la Cátedra.')
      .attach('file', tempFilePath);

    assert.equal(contactRes.status, 201);
    const savedContact = await ContactSubmission.findOne({ email: 'cdelgado@comunidad.org' });
    assert.ok(savedContact, 'El contacto debe persistirse en MongoDB');
    assert.ok(savedContact.attachmentMetadata, 'El anexo debe tener metadata registrada');
    console.log(`  ✓ Solicitud de vinculación guardada en MongoDB con ID: ${savedContact._id}`);
  } finally {
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
  }

  // 12. Control de Acceso RBAC (Participante recibe 403 en ruta de administración)
  console.log('[12/12] Verificando seguridad RBAC (participante bloqueado con 403)...');
  const forbiddenRes = await request(app)
    .get('/api/contact/admin')
    .set('Cookie', sessionCookie);
  assert.equal(forbiddenRes.status, 403, 'Participante normal debe recibir 403 Forbidden');
  console.log('  ✓ RBAC validado: Participante normal bloqueado de áreas administrativas (403)');

  // Desconexión limpia
  await mongoose.disconnect();
  await mongod.stop();

  console.log('\n===============================================================');
  console.log('  TODAS LAS 12 VERIFICACIONES DE MODALIDAD B SUPERADAS CON ÉXITO');
  console.log('===============================================================\n');
}

runFullStackVerification().catch((err) => {
  console.error('\n[ERROR FATAL EN VERIFICACIÓN FULL-STACK]:', err);
  process.exit(1);
});
