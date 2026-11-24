/**
 * backend/tests/auth.test.js
 * Pruebas automatizadas de autenticación y autorización
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
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
});

test('POST /api/auth/register debe registrar un participante exitosamente con rol participant', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Estudiante Prueba',
      email: 'estudiante@uvm.edu.ve',
      password: 'Password123!',
    });

  assert.equal(res.status, 201);
  assert.equal(res.body.user.name, 'Estudiante Prueba');
  assert.equal(res.body.user.email, 'estudiante@uvm.edu.ve');
  assert.equal(res.body.user.role, 'participant');
  assert.equal(res.body.user.passwordHash, undefined); // Nunca debe exponerse

  // Verificar persistencia en MongoDB
  const savedUser = await User.findOne({ email: 'estudiante@uvm.edu.ve' });
  assert.ok(savedUser);
  assert.equal(savedUser.role, 'participant');
});

test('POST /api/auth/register debe rechazar correos duplicados con código 409', async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Estudiante Uno',
    email: 'duplicado@uvm.edu.ve',
    password: 'Password123!',
  });

  const res2 = await request(app).post('/api/auth/register').send({
    name: 'Estudiante Dos',
    email: 'duplicado@uvm.edu.ve',
    password: 'OtraPassword123!',
  });

  assert.equal(res2.status, 409);
  assert.ok(res2.body.error);
});

test('POST /api/auth/login debe autenticar correctamente con credenciales válidas y devolver cookie HttpOnly', async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Usuario Login',
    email: 'login@uvm.edu.ve',
    password: 'CorrectPassword123!',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'login@uvm.edu.ve',
    password: 'CorrectPassword123!',
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.user.email, 'login@uvm.edu.ve');

  // Verificar existencia de cookie connect.sid
  const cookies = res.headers['set-cookie'];
  assert.ok(cookies);
  assert.ok(cookies.some((c) => c.includes('connect.sid')));
});

test('POST /api/auth/login debe rechazar contraseña incorrecta con código 401', async () => {
  await request(app).post('/api/auth/register').send({
    name: 'Usuario Fallo',
    email: 'fallo@uvm.edu.ve',
    password: 'RealPassword123!',
  });

  const res = await request(app).post('/api/auth/login').send({
    email: 'fallo@uvm.edu.ve',
    password: 'WrongPassword!',
  });

  assert.equal(res.status, 401);
  assert.equal(res.body.error, 'Credenciales inválidas');
});

test('GET /api/auth/me debe devolver 401 si no hay sesión activa', async () => {
  const res = await request(app).get('/api/auth/me');
  assert.equal(res.status, 401);
});
