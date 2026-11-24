/**
 * backend/tests/contact.test.js
 * Pruebas automatizadas de recepción de contactos y subida de archivos
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');
const User = require('../src/models/User');
const ContactSubmission = require('../src/models/ContactSubmission');

let mongod;
let adminCookie;

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
  await ContactSubmission.deleteMany({});

  const admin = new User({
    name: 'Admin Contact Test',
    email: 'admin.contact@uvm.edu.ve',
    passwordHash: 'AdminPass123!',
    role: 'admin',
  });
  await admin.save();

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'admin.contact@uvm.edu.ve',
    password: 'AdminPass123!',
  });
  adminCookie = loginRes.headers['set-cookie'];
});

test('POST /api/contact debe recibir y persistir solicitud con los 5 campos requeridos y archivo adjunto válido', async () => {
  // Crear archivo temporal de prueba tipo PNG
  const tempFilePath = path.join(__dirname, 'test-attachment.png');
  fs.writeFileSync(tempFilePath, Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13]));

  try {
    const res = await request(app)
      .post('/api/contact')
      .field('name', 'Lic. Mariana Rojas')
      .field('email', 'mrojas@saludcomunitaria.org')
      .field('phone', '+58 414 7654321')
      .field('proposedDate', '2026-12-10')
      .field('estimatedParticipants', '50')
      .field('requestType', 'comunitaria')
      .field('message', 'Solicitud formal para impartir jornada médica formativa.')
      .attach('file', tempFilePath);

    assert.equal(res.status, 201);
    assert.equal(res.body.name, 'Lic. Mariana Rojas');
    assert.equal(res.body.hasAttachment, true);

    // Verificar en MongoDB
    const saved = await ContactSubmission.findById(res.body.submissionId);
    assert.ok(saved);
    assert.equal(saved.estimatedParticipants, 50);
    assert.equal(saved.requestType, 'comunitaria');
    assert.ok(saved.attachmentMetadata);
    assert.equal(saved.attachmentMetadata.mimeType, 'image/png');

    // Verificar que el archivo existe físicamente en uploads/
    assert.ok(fs.existsSync(saved.attachmentMetadata.storagePath));

    // Limpiar archivo subido
    fs.unlinkSync(saved.attachmentMetadata.storagePath);
  } finally {
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
});

test('POST /api/contact debe rechazar archivos no autorizados (.exe)', async () => {
  const tempExePath = path.join(__dirname, 'malicious.exe');
  fs.writeFileSync(tempExePath, 'MZ fake binary content');

  try {
    const res = await request(app)
      .post('/api/contact')
      .field('name', 'Test')
      .field('email', 'test@test.com')
      .field('phone', '12345')
      .field('proposedDate', '2026-12-01')
      .field('estimatedParticipants', '10')
      .field('requestType', 'academica')
      .field('message', 'Prueba de seguridad')
      .attach('file', tempExePath);

    assert.equal(res.status, 400);
    assert.ok(res.body.message.includes('Formato no permitido'));
  } finally {
    if (fs.existsSync(tempExePath)) {
      fs.unlinkSync(tempExePath);
    }
  }
});

test('GET /api/contact/admin debe devolver 401 si no hay sesión y 200 con sesión admin', async () => {
  // Sin autenticación
  const unauthRes = await request(app).get('/api/contact/admin');
  assert.equal(unauthRes.status, 401);

  // Con admin
  const authRes = await request(app).get('/api/contact/admin').set('Cookie', adminCookie);
  assert.equal(authRes.status, 200);
  assert.ok(Array.isArray(authRes.body.contacts));
});
