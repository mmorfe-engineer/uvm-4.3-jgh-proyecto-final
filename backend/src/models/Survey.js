/**
 * backend/src/models/Survey.js
 * Modelo de Encuesta Formativa
 */
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, 'El texto de la pregunta es obligatorio'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['single_choice', 'short_text'],
      default: 'single_choice',
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
    options: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const surveySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título de la encuesta es obligatorio'],
      trim: true,
      maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    objective: {
      type: String,
      trim: true,
      default: '',
    },
    targetAudience: {
      type: String,
      trim: true,
      default: '',
    },
    topic: {
      type: String,
      required: [true, 'El área temática es obligatoria'],
      trim: true,
      maxlength: [100, 'El área temática no puede exceder 100 caracteres'],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'closed'],
      default: 'draft',
      index: true,
    },
    questions: {
      type: [questionSchema],
      validate: {
        validator: function (v) {
          // Una encuesta publicada debe tener al menos una pregunta válida
          if (this.status === 'published') {
            return Array.isArray(v) && v.length > 0;
          }
          return true;
        },
        message: 'Una encuesta publicada debe contener al menos una pregunta.',
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto para consultas públicas eficientes
surveySchema.index({ status: 1, createdAt: -1 });
// Índice de texto para búsqueda por título, tema y descripción
surveySchema.index({ title: 'text', topic: 'text', description: 'text' });

module.exports = mongoose.model('Survey', surveySchema);
