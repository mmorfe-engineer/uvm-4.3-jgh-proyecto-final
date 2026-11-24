/**
 * backend/src/middleware/auth.js
 * Middlewares de verificación de sesión y autorización por roles (RBAC)
 */
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'No autenticado',
      message: 'Debe iniciar sesión para acceder a este recurso',
    });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.status(401).json({
        error: 'Sesión inválida',
        message: 'El usuario ya no existe en el sistema',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        error: 'No autenticado',
        message: 'Sesión no verificada',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acceso prohibido',
        message: `El rol '${req.user.role}' no tiene autorización para realizar esta acción. Requerido: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  isAuthenticated,
  requireRole,
};
