const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const {
  loginLimiter,
  registerLimiter
} = require('../middlewares/rateLimiters');

// Registro
router.post('/register', registerLimiter, register);

// Inicio de sesión
router.post('/login', loginLimiter, login);

// Obtener usuario autenticado
router.get('/me', authMiddleware, getMe);

module.exports = router;