/**
 * backend/src/controllers/responseController.js
 * Controlador para la gestión y agregación de respuestas a encuestas formativas
 * Autoría reservada: Martin Alejandro Morfe Carballo <morfecarballoma@uvm.edu.ve>
 */
const Response = require('../models/Response');
const Survey = require('../models/Survey');

// Enviar y persistir respuesta a una encuesta formativa
const submitResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participantId = req.user._id;
    const { answers } = req.body;

    // 1. Validar existencia y estado de la encuesta
    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({
        error: 'Encuesta no encontrada',
        message: 'No existe una encuesta con el identificador solicitado.',
      });
    }

    if (survey.status !== 'published') {
      return res.status(400).json({
        error: 'Encuesta no disponible',
        message: 'Solo es posible responder encuestas que se encuentren publicadas y activas.',
      });
    }

    // 2. Comprobar que no exista respuesta previa para la tupla (surveyId, participantId)
    const existing = await Response.findOne({ surveyId: survey._id, participantId });
    if (existing) {
      return res.status(409).json({
        error: 'Respuesta duplicada',
        message: 'Ya has participado en esta encuesta formativa. Cada participante puede responder una sola vez.',
      });
    }

    // 3. Validar respuestas
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        error: 'Respuestas requeridas',
        message: 'Debe incluir las respuestas a las preguntas del instrumento.',
      });
    }

    // Validar obligatoriedad de preguntas del instrumento
    const answerMap = new Map();
    answers.forEach((a) => {
      if (a && a.questionId) {
        answerMap.set(a.questionId, a.value);
      }
    });

    for (const q of survey.questions) {
      if (q.required) {
        const val = answerMap.get(q.id);
        if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          return res.status(400).json({
            error: 'Pregunta obligatoria incompleta',
            message: `La pregunta "${q.text}" es obligatoria y debe ser respondida.`,
          });
        }
      }
    }

    // 4. Persistir en la colección Response
    const newResponse = await Response.create({
      surveyId: survey._id,
      participantId,
      answers,
      submittedAt: new Date(),
    });

    res.status(201).json({
      message: 'Respuesta registrada y persistida exitosamente en el sistema formativo.',
      responseId: newResponse._id,
      submittedAt: newResponse.submittedAt,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Respuesta duplicada',
        message: 'Ya existe un registro previo de respuesta para este participante.',
      });
    }
    next(err);
  }
};

// Comprobar si el participante autenticado ya respondió la encuesta
const checkUserResponse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res.status(200).json({ hasResponded: false });
    }

    const exists = await Response.exists({
      surveyId: id,
      participantId: req.user._id,
    });

    res.status(200).json({
      hasResponded: Boolean(exists),
    });
  } catch (err) {
    next(err);
  }
};

// Agregación descriptiva de resultados reales (frecuencias y porcentajes)
const getSurveyResults = async (req, res, next) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({
        error: 'Encuesta no encontrada',
        message: 'No existe una encuesta con el identificador solicitado.',
      });
    }

    const responses = await Response.find({ surveyId: id }).lean();
    const totalResponses = responses.length;

    // Estado cero honesto si no hay respuestas
    if (totalResponses === 0) {
      return res.status(200).json({
        surveyId: survey._id,
        title: survey.title,
        totalResponses: 0,
        questions: [],
        message: 'Sin respuestas registradas aún en el sistema. Sea el primer participante en responder este instrumento formativo.',
      });
    }

    // Procesar agregación de frecuencias sobre respuestas reales
    const questionsSummary = survey.questions.map((q) => {
      const qSummary = {
        questionId: q.id,
        text: q.text,
        type: q.type,
        required: q.required,
      };

      if (q.type === 'single_choice') {
        const counts = {};
        (q.options || []).forEach((opt) => {
          counts[opt] = 0;
        });

        // Contar ocurrencias reales
        responses.forEach((r) => {
          const ans = (r.answers || []).find((a) => a.questionId === q.id);
          if (ans && ans.value && counts[ans.value] !== undefined) {
            counts[ans.value] += 1;
          }
        });

        // Calcular porcentajes matemáticos
        const percentages = {};
        Object.keys(counts).forEach((opt) => {
          percentages[opt] = Math.round((counts[opt] / totalResponses) * 100);
        });

        qSummary.options = q.options;
        qSummary.counts = counts;
        qSummary.percentages = percentages;
      } else {
        // Texto corto: total de respuestas aportadas
        let textCount = 0;
        responses.forEach((r) => {
          const ans = (r.answers || []).find((a) => a.questionId === q.id);
          if (ans && ans.value && typeof ans.value === 'string' && ans.value.trim() !== '') {
            textCount += 1;
          }
        });
        qSummary.answeredCount = textCount;
      }

      return qSummary;
    });

    res.status(200).json({
      surveyId: survey._id,
      title: survey.title,
      totalResponses,
      questions: questionsSummary,
    });
  } catch (err) {
    next(err);
  }
};

// Consultar respuestas para el panel de administración
const getSurveyResponsesAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const survey = await Survey.findById(id);
    if (!survey) {
      return res.status(404).json({
        error: 'Encuesta no encontrada',
        message: 'No existe una encuesta con el identificador solicitado.',
      });
    }

    const responses = await Response.find({ surveyId: id })
      .populate('participantId', 'name email')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      count: responses.length,
      surveyTitle: survey.title,
      responses,
    });
  } catch (err) {
    next(err);
  }
};

// Consultar encuestas respondidas por el usuario activo
const getMyResponses = async (req, res, next) => {
  try {
    const responses = await Response.find({ participantId: req.user._id })
      .populate('surveyId', 'title topic status objective')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      count: responses.length,
      responses,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitResponse,
  checkUserResponse,
  getSurveyResults,
  getSurveyResponsesAdmin,
  getMyResponses,
};
