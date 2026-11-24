/**
 * backend/src/routes/healthRoutes.js
 * Ruta de salud del servicio y entrega de especificación OpenAPI
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

router.get('/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;

  const healthData = {
    status: isDbConnected ? 'ok' : 'degraded',
    service: 'jgh-encuestas-api',
    database: isDbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  };

  if (!isDbConnected) {
    return res.status(503).json(healthData);
  }

  res.status(200).json(healthData);
});

router.get('/openapi.json', (req, res) => {
  const openApiPath = path.resolve(__dirname, '../../openapi/openapi.json');
  if (fs.existsSync(openApiPath)) {
    res.sendFile(openApiPath);
  } else {
    res.status(404).json({ error: 'Especificación OpenAPI no disponible' });
  }
});

module.exports = router;
