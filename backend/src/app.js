/**
 * backend/src/app.js
 * Configuración central de Express con middlewares de seguridad y rutas
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Seguridad de cabeceras HTTP
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Configuración CORS con soporte de credenciales (Cookies de sesión)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.use(
  cors({
    origin: clientOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parsing de cuerpos JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de Sesiones HttpOnly
const sessionSecret = process.env.SESSION_SECRET || 'jgh_default_super_secret_session_key_2026';

const sessionConfig = {
  name: 'connect.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días de validez
  },
};

// Usar MongoStore reutilizando la conexión viva de Mongoose
if (process.env.NODE_ENV !== 'test') {
  sessionConfig.store = MongoStore.create({
    clientPromise: mongoose.connection.asPromise().then((conn) => conn.getClient()),
    collectionName: 'sessions',
    ttl: 60 * 60 * 24 * 7,
    autoRemove: 'native',
  });
}

app.use(session(sessionConfig));

// Registro de Rutas de la API
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/contact', contactRoutes);

// Manejo de ruta no encontrada (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta solicitada ${req.method} ${req.originalUrl} no existe en la API.`,
  });
});

// Manejador centralizado de errores
app.use(errorHandler);

module.exports = app;
