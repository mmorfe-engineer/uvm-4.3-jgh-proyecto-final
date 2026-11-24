/**
 * backend/src/routes/authRoutes.js
 * Rutas para autenticación y sesiones
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
