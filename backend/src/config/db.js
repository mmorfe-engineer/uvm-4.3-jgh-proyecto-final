/**
 * backend/src/config/db.js
 * Configuración y conexión a MongoDB mediante Mongoose
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jgh_encuestas_dev';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Conectado exitosamente: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error crítico de conexión: ${error.message}`);
    // No salimos con process.exit en modo test para permitir manejo en tests
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[MongoDB] Verifique que MongoDB esté iniciado ejecutando: npm run dev:db');
    }
    throw error;
  }
};

module.exports = connectDB;
