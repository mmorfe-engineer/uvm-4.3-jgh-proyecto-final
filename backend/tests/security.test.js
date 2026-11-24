/**
 * backend/tests/security.test.js
 * Pruebas automatizadas de seguridad, sanitización y prevención de vulnerabilidades
 */
const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');

let mongod;

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
});

test('Seguridad: El registro público NO debe permitir escalar a rol admin', async () => {
  const res = await request(app).post('/api/auth/register').send({
    name: 'Intento Hacker',
    email: 'hacker@uvm.edu.ve',
    password: 'Password123!',
    role: 'admin', // Intento de inyección de rol
  });

  assert.equal(res.status, 201);
  assert.equal(res.body.user.role, 'participant'); // Debe mantenerse forzado en participant

  const dbUser = await User.findOne({ email: 'hacker@uvm.edu.ve' });
  assert.equal(dbUser.role, 'participant');
});

test('Seguridad: Ninguna consulta de usuario debe filtrar el hash de contraseña', async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Usuario Seguro',
    email: 'seguro@uvm.edu.ve',
    password: 'SuperSecretPassword!',
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'seguro@uvm.edu.ve',
    password: 'SuperSecretPassword!',
  });

  assert.equal(loginRes.status, 200);
  assert.equal(loginRes.body.user.passwordHash, undefined);
  assert.equal(loginRes.body.user.password, undefined);

  const meRes = await request(app)
    .get('/api/auth/me')
    .set('Cookie', loginRes.headers['set-cookie']);

  assert.equal(meRes.status, 200);
  assert.equal(meRes.body.user.passwordHash, undefined);
});

test('Seguridad: Participante normal recibe 403 al intentar acceder a rutas administrativas', async () => {
  const regRes = await request(app).post('/api/auth/register').send({
    name: 'Participante Ordinario',
    email: 'ordinario@uvm.edu.ve',
    password: 'Password123!',
  });
  const cookie = regRes.headers['set-cookie'];

  const adminContactsRes = await request(app)
    .get('/api/contact/admin')
    .set('Cookie', cookie);

  assert.equal(adminContactsRes.status, 403);
  assert.ok(adminContactsRes.body.error);
});
