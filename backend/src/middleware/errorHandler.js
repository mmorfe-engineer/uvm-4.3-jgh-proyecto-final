/**
 * backend/src/middleware/errorHandler.js
 * Manejador centralizado de errores estandarizado
 */
const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  // Manejo de errores específicos de Multer
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Archivo demasiado grande',
        message: 'El archivo excede el tamaño máximo autorizado de 3 MB.',
      });
    }
    return res.status(400).json({
      error: 'Error de carga de archivo',
      message: err.message,
    });
  }

  // Error de formato no permitido lanzado por fileFilter
  if (err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      error: 'Formato no permitido',
      message: err.message,
    });
  }

  // Manejo de errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      error: 'Error de validación',
      messages: messages,
    });
  }

  // Manejo de errores de clave duplicada en Mongoose (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Conflicto de unicidad',
      message: `El valor para el campo '${field}' ya se encuentra registrado.`,
    });
  }

  // Manejo de CastError de ObjectId inválido
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: 'Identificador no válido',
      message: 'El identificador suministrado no tiene un formato válido de MongoDB.',
    });
  }

  // Estado explícito o 500 por defecto
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error('[Error Handler]', err);

  res.status(statusCode).json({
    error: err.name || 'Error del servidor',
    message: err.message || 'Ha ocurrido un error inesperado en el servidor',
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
