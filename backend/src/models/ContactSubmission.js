/**
 * backend/src/models/ContactSubmission.js
 * Modelo para almacenamiento de solicitudes y contactos formativos
 * Incluye los 5 tipos de campos requeridos: email, number, date, radio/phone, file.
 */
const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    storagePath: { type: String, required: true },
  },
  { _id: false }
);

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo electrónico no válido'],
    },
    phone: {
      type: String,
      required: [true, 'El número de teléfono es obligatorio'],
      trim: true,
      maxlength: [20, 'El teléfono no puede exceder 20 caracteres'],
    },
    proposedDate: {
      type: Date,
      required: [true, 'La fecha propuesta es obligatoria'],
    },
    estimatedParticipants: {
      type: Number,
      required: [true, 'La cantidad estimada de participantes es obligatoria'],
      min: [1, 'La cantidad de participantes debe ser al menos 1'],
      max: [5000, 'La cantidad no puede exceder 5,000 participantes'],
    },
    requestType: {
      type: String,
      required: [true, 'El tipo de solicitud es obligatorio'],
      enum: ['institucional', 'comunitaria', 'academica'],
    },
    message: {
      type: String,
      required: [true, 'El mensaje explicativo es obligatorio'],
      trim: true,
      maxlength: [2000, 'El mensaje no puede exceder 2000 caracteres'],
    },
    attachmentMetadata: {
      type: attachmentSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice temporal para orden descendente por fecha de envío
contactSubmissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
