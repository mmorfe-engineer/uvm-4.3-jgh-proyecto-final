/**
 * backend/tests/responses.test.js
 * Pruebas automatizadas del módulo de participación y respuestas
 * Autoría reservada: Martin Alejandro Morfe Carballo <morfecarballoma@uvm.edu.ve>
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Survey = require('../src/models/Survey');
const Response = require('../src/models/Response');

let mongod;
let participantCookie;
let participantId;
let secondParticipantCookie;
let publishedSurveyId;
let draftSurveyId;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Survey.deleteMany({});
  await Response.deleteMany({});

  // 1. Crear usuario admin para autoría de encuesta
  const admin = new User({
    name: 'Admin JGH',
    email: 'admin.jgh@uvm.edu.ve',
    passwordHash: 'HashFake123!',
    role: 'admin',
  });
  await admin.save();

  // 2. Crear participante 1
  const part1Res = await request(app).post('/api/auth/register').send({
    name: 'Participante Uno',
    email: 'part1@uvm.edu.ve',
    password: 'Password123!*',
  });
  const login1 = await request(app).post('/api/auth/login').send({
    email: 'part1@uvm.edu.ve',
    password: 'Password123!*',
  });
  participantCookie = login1.headers['set-cookie'];
  participantId = part1Res.body.user.id;

  // 3. Crear participante 2
  await request(app).post('/api/auth/register').send({
    name: 'Participante Dos',
    email: 'part2@uvm.edu.ve',
    password: 'Password123!*',
  });
  const login2 = await request(app).post('/api/auth/login').send({
    email: 'part2@uvm.edu.ve',
    password: 'Password123!*',
  });
  secondParticipantCookie = login2.headers['set-cookie'];

  // 4. Crear encuesta publicada
  const publishedSurvey = new Survey({
    title: 'Diagnóstico de Necesidades Bioéticas',
    topic: 'Bioética y Salud',
    objective: 'Determinar áreas prioritarias en bioética médica',
    targetAudience: 'Estudiantes y Docentes',
    description: 'Instrumento para recolectar opiniones.',
    status: 'published',
    createdBy: admin._id,
    publishedAt: new Date(),
    questions: [
      {
        id: 'q1',
        text: '¿Considera fundamental la bioética?',
        type: 'single_choice',
        required: true,
        options: ['Totalmente de acuerdo', 'En desacuerdo'],
      },
      {
        id: 'q2',
        text: 'Sugerencias adicionales:',
        type: 'short_text',
        required: false,
      },
    ],
  });
  await publishedSurvey.save();
  publishedSurveyId = publishedSurvey._id.toString();

  // 5. Crear encuesta en borrador
  const draftSurvey = new Survey({
    title: 'Encuesta en Borrador',
    topic: 'Educación',
    status: 'draft',
    createdBy: admin._id,
    questions: [
      {
        id: 'q_draft_1',
        text: 'Pregunta borrador',
        type: 'single_choice',
        required: true,
        options: ['Sí', 'No'],
      },
    ],
  });
  await draftSurvey.save();
  draftSurveyId = draftSurvey._id.toString();
});

test('POST /api/surveys/:id/responses debe registrar respuesta válidamente para participante autenticado', async () => {
  const payload = {
    answers: [
      { questionId: 'q1', value: 'Totalmente de acuerdo' },
      { questionId: 'q2', value: 'Taller práctico sobre consentimiento informado' },
    ],
  };

  const res = await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send(payload);

  assert.equal(res.status, 201);
  assert.ok(res.body.responseId);

  // Verificar en MongoDB
  const saved = await Response.findById(res.body.responseId);
  assert.ok(saved);
  assert.equal(saved.surveyId.toString(), publishedSurveyId);
  assert.equal(saved.answers.length, 2);
});

test('POST /api/surveys/:id/responses debe rechazar intento de respuesta duplicada con código 409 Conflict', async () => {
  const payload = {
    answers: [{ questionId: 'q1', value: 'Totalmente de acuerdo' }],
  };

  // Primera respuesta (exitosa)
  const firstRes = await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send(payload);
  assert.equal(firstRes.status, 201);

  // Segundo intento (duplicado)
  const duplicateRes = await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send(payload);

  assert.equal(duplicateRes.status, 409);
  assert.match(duplicateRes.body.error, /duplicada/i);
});

test('POST /api/surveys/:id/responses debe rechazar envío sin sesión con código 401', async () => {
  const payload = {
    answers: [{ questionId: 'q1', value: 'Totalmente de acuerdo' }],
  };

  const res = await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .send(payload);

  assert.equal(res.status, 401);
});

test('POST /api/surveys/:id/responses debe rechazar si la encuesta está en estado draft con 400', async () => {
  const payload = {
    answers: [{ questionId: 'q_draft_1', value: 'Sí' }],
  };

  const res = await request(app)
    .post(`/api/surveys/${draftSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send(payload);

  assert.equal(res.status, 400);
});

test('POST /api/surveys/:id/responses debe validar que las preguntas obligatorias tengan respuesta', async () => {
  const payloadIncompleto = {
    answers: [{ questionId: 'q2', value: 'Solo texto sin responder la obligatoria q1' }],
  };

  const res = await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send(payloadIncompleto);

  assert.equal(res.status, 400);
  assert.match(res.body.error, /obligatoria/i);
});

test('GET /api/surveys/:id/results debe calcular frecuencias y porcentajes sobre respuestas reales', async () => {
  // Participante 1 responde 'Totalmente de acuerdo'
  await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send({ answers: [{ questionId: 'q1', value: 'Totalmente de acuerdo' }] });

  // Participante 2 responde 'En desacuerdo'
  await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', secondParticipantCookie)
    .send({ answers: [{ questionId: 'q1', value: 'En desacuerdo' }] });

  const resultsRes = await request(app).get(`/api/surveys/${publishedSurveyId}/results`);

  assert.equal(resultsRes.status, 200);
  assert.equal(resultsRes.body.totalResponses, 2);

  const q1Results = resultsRes.body.questions.find((q) => q.questionId === 'q1');
  assert.ok(q1Results);
  assert.equal(q1Results.counts['Totalmente de acuerdo'], 1);
  assert.equal(q1Results.percentages['Totalmente de acuerdo'], 50);
  assert.equal(q1Results.counts['En desacuerdo'], 1);
  assert.equal(q1Results.percentages['En desacuerdo'], 50);
});

test('GET /api/surveys/:id/responses/check debe informar si el usuario ha respondido', async () => {
  // Antes de responder
  const checkBefore = await request(app)
    .get(`/api/surveys/${publishedSurveyId}/responses/check`)
    .set('Cookie', participantCookie);
  assert.equal(checkBefore.status, 200);
  assert.equal(checkBefore.body.hasResponded, false);

  // Responder
  await request(app)
    .post(`/api/surveys/${publishedSurveyId}/responses`)
    .set('Cookie', participantCookie)
    .send({ answers: [{ questionId: 'q1', value: 'Totalmente de acuerdo' }] });

  // Después de responder
  const checkAfter = await request(app)
    .get(`/api/surveys/${publishedSurveyId}/responses/check`)
    .set('Cookie', participantCookie);
  assert.equal(checkAfter.status, 200);
  assert.equal(checkAfter.body.hasResponded, true);
});

test('GET /api/surveys?search=... debe filtrar encuestas dinámicamente por término', async () => {
  const searchMatch = await request(app).get('/api/surveys?search=Bioética');
  assert.equal(searchMatch.status, 200);
  assert.equal(searchMatch.body.count, 1);
  assert.equal(searchMatch.body.surveys[0].title, 'Diagnóstico de Necesidades Bioéticas');

  const searchNoMatch = await request(app).get('/api/surveys?search=InexistenteTerminoXYZ');
  assert.equal(searchNoMatch.status, 200);
  assert.equal(searchNoMatch.body.count, 0);
});
