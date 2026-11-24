/**
 * backend/src/controllers/contactController.js
 * Controlador para la recepción, validación y consulta administrativa de contactos formativos
 */
const ContactSubmission = require('../models/ContactSubmission');
const path = require('path');
const fs = require('fs');

// Enviar formulario de contacto
const submitContact = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      proposedDate,
      estimatedParticipants,
      requestType,
      message,
    } = req.body;

    // Validación rigurosa de campos requeridos
    if (
      !name ||
      !email ||
      !phone ||
      !proposedDate ||
      !estimatedParticipants ||
      !requestType ||
      !message
    ) {
      // Si se subió un archivo pero la validación falló, limpiar archivo huérfano
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Debe completar todos los campos del formulario de contacto.',
      });
    }

    const participantsNum = parseInt(estimatedParticipants, 10);
    if (isNaN(participantsNum) || participantsNum <= 0) {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        error: 'Cantidad de participantes inválida',
        message: 'La cantidad de participantes debe ser un número entero mayor que 0.',
      });
    }

    let attachmentMetadata = null;
    if (req.file) {
      attachmentMetadata = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        storagePath: req.file.path,
      };
    }

    const submission = new ContactSubmission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      proposedDate: new Date(proposedDate),
      estimatedParticipants: participantsNum,
      requestType: requestType,
      message: message.trim(),
      attachmentMetadata: attachmentMetadata,
    });

    await submission.save();

    res.status(201).json({
      message: 'Solicitud de contacto registrada exitosamente',
      submissionId: submission._id,
      name: submission.name,
      email: submission.email,
      hasAttachment: !!attachmentMetadata,
      createdAt: submission.createdAt,
    });
  } catch (err) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(err);
  }
};

// Listar contactos recibidos (Solo Administrador)
const getContacts = async (req, res, next) => {
  try {
    const contacts = await ContactSubmission.find()
      .sort({ createdAt: -1 })
      .select('-attachmentMetadata.storagePath'); // No exponer rutas de disco en listados

    res.status(200).json({
      count: contacts.length,
      contacts: contacts,
    });
  } catch (err) {
    next(err);
  }
};

// Descargar archivo adjunto de forma segura (Solo Administrador)
const downloadAttachment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const submission = await ContactSubmission.findById(id);

    if (!submission || !submission.attachmentMetadata) {
      return res.status(404).json({
        error: 'Archivo no encontrado',
        message: 'No existe un archivo adjunto asociado a esta solicitud.',
      });
    }

    const { storagePath, originalName } = submission.attachmentMetadata;
    const resolvedPath = path.resolve(storagePath);
    const uploadDir = path.resolve(__dirname, '../../uploads');

    // Prevención estricta de Path Traversal
    if (!resolvedPath.startsWith(uploadDir)) {
      return res.status(403).json({
        error: 'Acceso no permitido',
        message: 'Intento de acceso a una ruta no autorizada.',
      });
    }

    if (!fs.existsSync(resolvedPath)) {
      return res.status(404).json({
        error: 'Archivo no encontrado en almacenamiento',
        message: 'El archivo físico no se encuentra disponible.',
      });
    }

    res.download(resolvedPath, originalName);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitContact,
  getContacts,
  downloadAttachment,
};
