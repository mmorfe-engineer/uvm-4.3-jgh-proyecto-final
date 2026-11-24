/**
 * backend/src/controllers/authController.js
 * Controlador de autenticación y gestión de sesiones
 */
const User = require('../models/User');

// Registro de participante
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Debe ingresar nombre, correo electrónico y contraseña.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Contraseña débil',
        message: 'La contraseña debe contener al menos 6 caracteres.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        error: 'Usuario existente',
        message: 'Ya existe una cuenta registrada con este correo electrónico.',
      });
    }

    // Regla de seguridad obligatoria: El registro público siempre asigna rol participant
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password,
      role: 'participant',
    });

    await user.save();

    // Iniciar sesión automáticamente tras registro
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;
    req.session.email = user.email;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// Inicio de sesión
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Campos requeridos faltantes',
        message: 'Debe suministrar correo electrónico y contraseña.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo electrónico o contraseña incorrectos.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        message: 'Correo electrónico o contraseña incorrectos.',
      });
    }

    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.name = user.name;
    req.session.email = user.email;

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// Cierre de sesión
const logout = (req, res, next) => {
  if (!req.session) {
    return res.status(200).json({ message: 'Sesión finalizada' });
  }

  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid', { path: '/' });
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
  });
};

// Consultar sesión activa
const getMe = async (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'No autenticado',
      message: 'No existe sesión activa',
    });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Usuario no encontrado',
        message: 'La sesión actual no corresponde a un usuario activo',
      });
    }

    res.status(200).json({
      user: user.toJSON(),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
