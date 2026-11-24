/**
 * backend/src/routes/surveyRoutes.js
 * Rutas para encuestas formativas
 */
const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const { isAuthenticated, requireRole } = require('../middleware/auth');
const User = require('../models/User');

// Middleware opcional para poblar req.user si existe sesión activa en rutas públicas
const attachUserIfSession = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) req.user = user;
    } catch (e) {}
  }
  next();
};

// Rutas de consulta
router.get('/', attachUserIfSession, surveyController.getSurveys);
router.get('/:id', attachUserIfSession, surveyController.getSurveyById);

// Rutas protegidas para administración de encuestas
router.post('/', isAuthenticated, requireRole('admin'), surveyController.createSurvey);
router.patch('/:id', isAuthenticated, requireRole('admin'), surveyController.updateSurvey);

module.exports = router;
