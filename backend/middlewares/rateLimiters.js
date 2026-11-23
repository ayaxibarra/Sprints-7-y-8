const rateLimit = require('express-rate-limit');

// Limitar intentos de inicio de sesión
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Demasiados intentos de inicio de sesión. Intentá nuevamente en 15 minutos.'
  }
});

// Limitar registros
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Se alcanzó el límite de registros. Intentá nuevamente más tarde.'
  }
});

module.exports = {
  loginLimiter,
  registerLimiter
};