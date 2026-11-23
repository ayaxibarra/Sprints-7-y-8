const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Generar un token JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no está configurado en las variables de entorno');
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );
};

const formatUserResponse = (user) => ({
  id: user._id,
  nombre: user.nombre,
  email: user.email,
  role: user.role
});

// Registrar un nuevo usuario
const register = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        message: 'El cuerpo de la solicitud no es válido'
      });
    }
    
    const { nombre, email, password } = req.body;

    if (
      typeof nombre !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios y deben ser texto válido'
      });
    }

    const trimmedNombre = nombre.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedNombre || !normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    if (trimmedNombre.length < 2 || trimmedNombre.length > 60) {
      return res.status(400).json({
        message: 'El nombre debe tener entre 2 y 60 caracteres'
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'El formato del email no es válido'
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        message: 'La contraseña debe tener entre 8 y 128 caracteres'
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        message: 'El email ya está registrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      nombre: trimmedNombre,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user'
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: formatUserResponse(newUser)
    });
  } catch (error) {
    console.error('Error en register:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'El email ya está registrado'
      });
    }

    return res.status(500).json({
      message: 'Error interno al registrar el usuario'
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({
        message: 'El cuerpo de la solicitud no es válido'
      });
    }
    
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Email y contraseña deben ser texto válido'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: 'Email y contraseña son obligatorios'
      });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'El formato del email no es válido'
      });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Error en login:', error);

    return res.status(500).json({
      message: 'Error interno al iniciar sesión'
    });
  }
};

// Obtener usuario autenticado
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      user: formatUserResponse(user)
    });
  } catch (error) {
    console.error('Error al obtener el usuario:', error);

    return res.status(500).json({
      message: 'Error interno al obtener el usuario'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};