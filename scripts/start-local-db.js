/**
 * scripts/start-local-db.js
 * Inicia una instancia local y persistente de MongoDB en el puerto 27017
 * utilizando el motor oficial mongod descargado por mongodb-memory-server.
 * No requiere privilegios de root ni Docker.
 */
const path = require('path');
const fs = require('fs');

// Cargar mongodb-memory-server desde las dependencias del backend
const { MongoMemoryServer } = require(path.resolve(__dirname, '../backend/node_modules/mongodb-memory-server'));

async function startLocalDb() {
  const dbPath = path.resolve(__dirname, '../backend/data/db');
  
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
    console.log(`[DB Runner] Creado directorio de datos persistente: ${dbPath}`);
  }

  console.log('[DB Runner] Iniciando motor local de MongoDB...');
  
  try {
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        dbPath: dbPath,
        storageEngine: 'wiredTiger'
      }
    });

    const uri = mongod.getUri();
    console.log(`\n======================================================`);
    console.log(`[DB Runner] MongoDB local activo y persistente`);
    console.log(`[DB Runner] URI: ${uri}`);
    console.log(`[DB Runner] Puerto: 27017`);
    console.log(`[DB Runner] Almacenamiento en disco: ${dbPath}`);
    console.log(`======================================================\n`);

    // Manejo limpio de cierre
    const cleanExit = async () => {
      console.log('\n[DB Runner] Deteniendo motor local de MongoDB...');
      await mongod.stop();
      console.log('[DB Runner] Motor detenido correctamente.');
      process.exit(0);
    };

    process.on('SIGINT', cleanExit);
    process.on('SIGTERM', cleanExit);
  } catch (err) {
    if (err.message && err.message.includes('Port 27017 is already in use')) {
      console.log('[DB Runner] El puerto 27017 ya se encuentra en uso por otra instancia de MongoDB.');
      console.log('[DB Runner] Reutilizando instancia existente.');
      process.exit(0);
    } else {
      console.error('[DB Runner] Error iniciando MongoDB:', err);
      process.exit(1);
    }
  }
}

startLocalDb();
