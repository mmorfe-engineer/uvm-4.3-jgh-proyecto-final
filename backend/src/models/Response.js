const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: [true, 'El identificador de la pregunta es obligatorio'],
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'El valor de la respuesta es obligatorio'],
    },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: [true, 'El ID de la encuesta es obligatorio'],
      index: true,
    },
    participantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID del participante es obligatorio'],
      index: true,
    },
    answers: {
      type: [answerSchema],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'Debe incluir al menos una respuesta válida',
      ],
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Restricción estricta de unicidad: Una sola respuesta por participante por cada encuesta
responseSchema.index({ surveyId: 1, participantId: 1 }, { unique: true });

module.exports = mongoose.model('Response', responseSchema);
