/**
 * backend/src/routes/surveyRoutes.js
 * Rutas para encuestas formativas
 */
const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');
const responseController = require('../controllers/responseController');
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

// Rutas de consulta de encuestas
router.get('/', attachUserIfSession, surveyController.getSurveys);
router.get('/:id', attachUserIfSession, surveyController.getSurveyById);

// Rutas de participación y respuestas (Reserva morfemartin)
router.post('/:id/responses', isAuthenticated, responseController.submitResponse);
router.get('/:id/responses/check', attachUserIfSession, responseController.checkUserResponse);
router.get('/:id/results', responseController.getSurveyResults);
router.get('/:id/responses', isAuthenticated, requireRole('admin'), responseController.getSurveyResponsesAdmin);
router.get('/my/responses', isAuthenticated, responseController.getMyResponses);

// Rutas protegidas para administración de encuestas
router.post('/', isAuthenticated, requireRole('admin'), surveyController.createSurvey);
router.patch('/:id', isAuthenticated, requireRole('admin'), surveyController.updateSurvey);

module.exports = router;
