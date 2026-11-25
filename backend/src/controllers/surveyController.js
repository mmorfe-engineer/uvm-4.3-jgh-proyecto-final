/**
 * backend/src/controllers/surveyController.js
 * Controlador para la gestión de encuestas formativas
 */
const Survey = require('../models/Survey');

// Obtener encuestas visibles
const getSurveys = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const { topic, status } = req.query;

    const filter = {};

    if (isAdmin) {
      if (status) {
        filter.status = status;
      }
    } else {
      // Público o participante: Estrictamente encuestas publicadas
      filter.status = 'published';
    }

    if (topic) {
      filter.topic = new RegExp(topic, 'i');
    }

    const surveys = await Survey.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .populate('createdBy', 'name email');

    res.status(200).json({
      count: surveys.length,
      surveys: surveys,
    });
  } catch (err) {
    next(err);
  }
};

// Obtener encuesta por ID
const getSurveyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';

    const survey = await Survey.findById(id).populate('createdBy', 'name email');

    if (!survey) {
      return res.status(404).json({
        error: 'Encuesta no encontrada',
        message: 'No existe una encuesta con el identificador solicitado.',
      });
    }

    if (!isAdmin && survey.status !== 'published') {
      return res.status(403).json({
        error: 'Acceso no autorizado',
        message: 'Esta encuesta no se encuentra disponible públicamente.',
      });
    }

    res.status(200).json({
      survey: survey,
    });
  } catch (err) {
    next(err);
  }
};

// Crear nueva encuesta (Solo Administrador)
const createSurvey = async (req, res, next) => {
  try {
    const { title, description, topic, objective, targetAudience, questions } = req.body;

    if (!title || !topic) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Debe ingresar al menos el título y el área temática de la encuesta.',
      });
    }

    // Formatear preguntas asignando identificador si no viene presente
    const formattedQuestions = Array.isArray(questions)
      ? questions.map((q, idx) => ({
          id: q.id || `q_${Date.now()}_${idx}`,
          text: q.text,
          type: q.type || 'single_choice',
          required: q.required !== undefined ? q.required : true,
          options: Array.isArray(q.options) ? q.options : [],
        }))
      : [];

    const newSurvey = new Survey({
      title: title.trim(),
      description: (description || '').trim(),
      objective: (objective || '').trim(),
      targetAudience: (targetAudience || '').trim(),
      topic: topic.trim(),
      status: 'draft',
      questions: formattedQuestions,
      createdBy: req.user._id,
    });

    await newSurvey.save();

    res.status(201).json({
      message: 'Encuesta creada exitosamente en estado borrador',
      survey: newSurvey,
    });
  } catch (err) {
    next(err);
  }
};

// Modificar o cambiar estado de encuesta (Solo Administrador)
const updateSurvey = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, topic, objective, targetAudience, status, questions } = req.body;

    const survey = await Survey.findById(id);

    if (!survey) {
      return res.status(404).json({
        error: 'Encuesta no encontrada',
        message: 'No se encontró la encuesta para actualizar.',
      });
    }

    if (title) survey.title = title.trim();
    if (description !== undefined) survey.description = description.trim();
    if (objective !== undefined) survey.objective = objective.trim();
    if (targetAudience !== undefined) survey.targetAudience = targetAudience.trim();
    if (topic) survey.topic = topic.trim();

    if (Array.isArray(questions)) {
      survey.questions = questions.map((q, idx) => ({
        id: q.id || `q_${Date.now()}_${idx}`,
        text: q.text,
        type: q.type || 'single_choice',
        required: q.required !== undefined ? q.required : true,
        options: Array.isArray(q.options) ? q.options : [],
      }));
    }

    if (status && ['draft', 'published', 'closed'].includes(status)) {
      if (status === 'published') {
        if (!survey.questions || survey.questions.length === 0) {
          return res.status(400).json({
            error: 'Publicación inválida',
            message: 'Una encuesta debe tener al menos una pregunta para poder publicarse.',
          });
        }
        if (!survey.publishedAt) {
          survey.publishedAt = new Date();
        }
      }
      survey.status = status;
    }

    await survey.save();

    res.status(200).json({
      message: 'Encuesta actualizada exitosamente',
      survey: survey,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSurveys,
  getSurveyById,
  createSurvey,
  updateSurvey,
};
