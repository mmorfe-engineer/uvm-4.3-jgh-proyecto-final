/**
 * backend/tests/surveys.test.js
 * Pruebas automatizadas de gestión de encuestas
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const Survey = require('../src/models/Survey');

let mongod;
let adminCookie;
let participantCookie;
let adminId;

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

  // Crear usuario admin
  const admin = new User({
    name: 'Admin Test',
    email: 'admin.test@uvm.edu.ve',
    passwordHash: 'AdminPass123!',
    role: 'admin',
  });
  await admin.save();
  adminId = admin._id;

  // Login admin y obtener cookie
  const adminRes = await request(app).post('/api/auth/login').send({
    email: 'admin.test@uvm.edu.ve',
    password: 'AdminPass123!',
  });
  adminCookie = adminRes.headers['set-cookie'];

  // Crear participante
  await request(app).post('/api/auth/register').send({
    name: 'Part Test',
    email: 'part.test@uvm.edu.ve',
    password: 'PartPass123!',
  });
  const partRes = await request(app).post('/api/auth/login').send({
    email: 'part.test@uvm.edu.ve',
    password: 'PartPass123!',
  });
  participantCookie = partRes.headers['set-cookie'];
});

test('GET /api/surveys para público debe devolver exclusivamente encuestas publicadas', async () => {
  // Crear una publicada y una borrador
  await Survey.create({
    title: 'Encuesta Publicada',
    topic: 'Salud',
    status: 'published',
    publishedAt: new Date(),
    createdBy: adminId,
    questions: [{ id: 'q1', text: '¿Pregunta?', type: 'single_choice', options: ['A', 'B'] }],
  });

  await Survey.create({
    title: 'Encuesta Borrador Oculta',
    topic: 'Valores',
    status: 'draft',
    createdBy: adminId,
    questions: [{ id: 'q2', text: '¿Pregunta 2?', type: 'single_choice', options: ['A'] }],
  });

  // Consulta sin autenticación
  const res = await request(app).get('/api/surveys');
  assert.equal(res.status, 200);
  assert.equal(res.body.count, 1);
  assert.equal(res.body.surveys[0].title, 'Encuesta Publicada');
});

test('POST /api/surveys debe permitir crear encuesta a administrador con rol admin', async () => {
  const res = await request(app)
    .post('/api/surveys')
    .set('Cookie', adminCookie)
    .send({
      title: 'Nueva Encuesta Cátedra JGH',
      description: 'Descripción de prueba',
      topic: 'Bioética',
      questions: [
        { text: '¿Está de acuerdo?', type: 'single_choice', options: ['Sí', 'No'] },
      ],
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.survey.title, 'Nueva Encuesta Cátedra JGH');
  assert.equal(res.body.survey.status, 'draft');
});

test('POST /api/surveys debe rechazar creación si el usuario es participante (403)', async () => {
  const res = await request(app)
    .post('/api/surveys')
    .set('Cookie', participantCookie)
    .send({
      title: 'Encuesta No Autorizada',
      topic: 'General',
    });

  assert.equal(res.status, 403);
});

test('PATCH /api/surveys/:id debe publicar encuesta si tiene preguntas válidas', async () => {
  const survey = await Survey.create({
    title: 'Encuesta para publicar',
    topic: 'Ética',
    status: 'draft',
    createdBy: adminId,
    questions: [{ id: 'q1', text: 'Pregunta obligatoria', type: 'single_choice', options: ['1', '2'] }],
  });

  const res = await request(app)
    .patch(`/api/surveys/${survey._id}`)
    .set('Cookie', adminCookie)
    .send({ status: 'published' });

  assert.equal(res.status, 200);
  assert.equal(res.body.survey.status, 'published');
  assert.ok(res.body.survey.publishedAt);
});

test('PATCH /api/surveys/:id debe rechazar publicación si la encuesta no contiene preguntas (400)', async () => {
  const survey = await Survey.create({
    title: 'Encuesta vacía',
    topic: 'General',
    status: 'draft',
    createdBy: adminId,
    questions: [],
  });

  const res = await request(app)
    .patch(`/api/surveys/${survey._id}`)
    .set('Cookie', adminCookie)
    .send({ status: 'published' });

  assert.equal(res.status, 400);
  assert.ok(res.body.message.includes('al menos una pregunta'));
});
