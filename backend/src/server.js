/**
 * backend/src/server.js
 * Entrada principal del servidor backend Node.js / Express
 */
const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`[JGH Backend] Servidor Express activo`);
      console.log(`[JGH Backend] Puerto: ${PORT}`);
      console.log(`[JGH Backend] URL: http://localhost:${PORT}`);
      console.log(`[JGH Backend] Salud: http://localhost:${PORT}/api/health`);
      console.log(`[JGH Backend] OpenAPI: http://localhost:${PORT}/api/openapi.json`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('[JGH Backend] Error fatal al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
