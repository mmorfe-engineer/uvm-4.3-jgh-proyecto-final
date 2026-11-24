/**
 * backend/src/routes/contactRoutes.js
 * Rutas para formulario de contacto y administración de solicitudes
 */
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const upload = require('../middleware/upload');
const { isAuthenticated, requireRole } = require('../middleware/auth');

// Envío público de contacto con soporte para adjunto multipart
router.post('/', upload.single('file'), contactController.submitContact);

// Consulta administrativa protegida
router.get('/admin', isAuthenticated, requireRole('admin'), contactController.getContacts);
router.get('/admin/:id/attachment', isAuthenticated, requireRole('admin'), contactController.downloadAttachment);

module.exports = router;
